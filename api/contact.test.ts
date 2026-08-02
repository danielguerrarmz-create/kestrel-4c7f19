import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { FORM_INBOX, FORM_SENDER, buildMessage, deliver, normalizeEmail } from './contact';
import { FORM_INBOX as APP_FORM_INBOX, CONTACT } from '../src/data/config';

/**
 * THE CONTACT ENDPOINT'S DECISION TABLE.
 *
 * The bug being guarded is not a crash. It is a form that APPEARS to work: a "thank you" over a
 * message that went nowhere is indistinguishable, to the buyer who sent it, from one that arrived,
 * and they walk away believing they have contacted the practice. This site has already shipped that
 * exact bug once — "Noted. We will be in touch." over a `console.log`.
 *
 * So every test here is really one assertion: **success is returned only when the mail provider
 * accepted the message.**
 */
const NOW = '2026-07-31T12:00:00.000Z';
const KEY = { RESEND_API_KEY: 're_test_key' };

/** A fetch that never runs; passing it proves a path short-circuits before any network call. */
const forbiddenFetch = (() => {
  throw new Error('the network must not be touched on this path');
}) as unknown as typeof fetch;

const okFetch = (async () => new Response('{}', { status: 200 })) as unknown as typeof fetch;
const failFetch = (async () => new Response('nope', { status: 422 })) as unknown as typeof fetch;
const throwFetch = (async () => {
  throw new TypeError('network down');
}) as unknown as typeof fetch;

describe('normalizeEmail', () => {
  it('accepts ordinary addresses and trims them', () => {
    expect(normalizeEmail('  owner@northcourt.co.uk ')).toBe('owner@northcourt.co.uk');
    expect(normalizeEmail('a.b+tag@sub.domain.org')).toBe('a.b+tag@sub.domain.org');
  });

  it('rejects what is not worth sending', () => {
    for (const bad of ['', '   ', 'nope', 'no@domain', 'two@@at.com', 'has space@x.com', null, 42]) {
      expect(normalizeEmail(bad), `accepted ${JSON.stringify(bad)}`).toBeNull();
    }
    // RFC 5321 ceiling: past this it is not a typo, it is junk.
    expect(normalizeEmail('a'.repeat(250) + '@x.com')).toBeNull();
  });
});

describe('deliver — success is only ever the provider accepting', () => {
  it('reports NOT-CONFIGURED when there is no API key, without calling the network', async () => {
    // The state this ships in. It must be an honest, specific answer rather than a crash or a
    // silent success, because the form reads it and tells the visitor the truth.
    const r = await deliver({ email: 'a@b.com' }, {}, NOW, forbiddenFetch);
    expect(r).toEqual({ ok: false, status: 503, reason: 'not-configured' });
  });

  it('rejects a bad address before it reaches the provider', async () => {
    const r = await deliver({ email: 'not-an-email' }, KEY, NOW, forbiddenFetch);
    expect(r).toEqual({ ok: false, status: 400, reason: 'invalid-email' });
  });

  it('succeeds only on a 2xx from the provider', async () => {
    expect(await deliver({ email: 'a@b.com' }, KEY, NOW, okFetch)).toEqual({ ok: true });
  });

  it('does NOT succeed when the provider refuses the message', async () => {
    // The dangerous case: the POST completed, so a naive implementation calls this a win.
    const r = await deliver({ email: 'a@b.com' }, KEY, NOW, failFetch);
    expect(r).toEqual({ ok: false, status: 502, reason: 'send-failed' });
  });

  it('does NOT succeed when the network throws', async () => {
    const r = await deliver({ email: 'a@b.com' }, KEY, NOW, throwFetch);
    expect(r).toEqual({ ok: false, status: 502, reason: 'send-failed' });
  });

  it('never returns ok without a key, whatever the provider would have said', async () => {
    // Belt and braces on the ordering: an unconfigured deployment cannot succeed by accident even
    // if a fetch would have resolved 200.
    expect(await deliver({ email: 'a@b.com' }, {}, NOW, okFetch)).toEqual({
      ok: false,
      status: 503,
      reason: 'not-configured',
    });
  });
});

describe('the message itself', () => {
  const msg = buildMessage({ email: 'owner@northcourt.co.uk', source: 'splash' }, NOW);

  it('goes to the form inbox, from a domain address', () => {
    expect(msg.to).toEqual([FORM_INBOX]);
    // `bowerbuild.org`, NOT `@bowerbuild.org`. This asserted the latter and WENT RED on 2026-08-02
    // when the sender moved to `send.bowerbuild.org`, because `@bowerbuild.org` is not a substring
    // of `noreply@send.bowerbuild.org`. It read as "on the practice domain" and was really pinning
    // the mail host to the APEX. The domain question is now owned by the test below, which asks it
    // as a property; this line is left only as the cheap sanity check it was meant to be.
    expect(FORM_SENDER).toContain('bowerbuild.org');
  });

  /**
   * THE SENDER MUST BE A SUBDOMAIN, NEVER THE APEX.
   *
   * WHY (the long version is on `FORM_SENDER`): the apex carries Google's MX for the practice's
   * real mail, Resend's verification wants its OWN MX for the bounce return path, and SPF is
   * single-record by spec, so a second `v=spf1` on the apex would PERMERROR and invalidate BOTH.
   * Moving the sender to the apex would break inbound mail to the address this site publishes.
   * **That is a worse failure than the form not sending, and it would be silent** — the form would
   * keep working while client replies stopped arriving.
   *
   * That risk had NO test. The assertion above looked like the guard and was not: it pinned the
   * apex, so it failed the moment the ruling was implemented. A test that goes red on a correct
   * change teaches the next person to edit it rather than believe it, which is precisely how this
   * repo lost `config.test.ts`'s `startsWith('info@')` two days ago.
   *
   * SO THIS ASSERTS THE PROPERTY: a subdomain OF the organizational domain. Renaming `send.` to
   * `mail.` is a free edit; a revert to the apex fails. The `.bowerbuild.org` half is what keeps
   * DMARC aligned, since alignment is evaluated against the organizational domain.
   */
  it('sends from a SUBDOMAIN, never the apex, or Google MX and SPF collide', () => {
    const host = FORM_SENDER.match(/<[^@]+@([^>]+)>/)?.[1];
    expect(host, `FORM_SENDER is not an addr-spec in angle brackets: ${FORM_SENDER}`).toBeTruthy();
    // DMARC alignment: same organizational domain, so the subdomain still passes.
    expect(host!.endsWith('.bowerbuild.org')).toBe(true);
    // The part the guard above misses.
    expect(host, 'the sending domain must not be the apex').not.toBe('bowerbuild.org');
  });

  /**
   * THE SANDBOX ESCAPE HATCH, which exists because domain verification needs DNS access and the
   * person wiring up the form is not always the person holding the DNS.
   *
   * The risk it introduces is precisely that it is forgotten: mail quietly going to a personal
   * address from `onboarding@resend.dev` forever, while everyone believes the practice inbox is
   * live. So the defaults are asserted as the REAL ones — an unset environment can only ever
   * produce the production sender and the production inbox.
   */
  it('defaults to the real sender and the real inbox when nothing is overridden', () => {
    const m = buildMessage({ email: 'a@b.com' }, NOW, {});
    expect(m.from).toBe(FORM_SENDER);
    expect(m.to).toEqual([FORM_INBOX]);
  });

  it('honours the sandbox overrides, so the pipeline is testable before DNS lands', () => {
    const m = buildMessage({ email: 'a@b.com' }, NOW, {
      RESEND_FROM: 'onboarding@resend.dev',
      RESEND_TO: 'clay@example.com',
    });
    expect(m.from).toBe('onboarding@resend.dev');
    expect(m.to).toEqual(['clay@example.com']);
    // Reply-to still points at the enquirer, which is the field that must never be overridable.
    expect(m.reply_to).toBe('a@b.com');
  });

  it('sets reply-to to the ENQUIRER, which is where a lead gets dropped', () => {
    // Without this, answering means copying an address out of a notification by hand.
    expect(msg.reply_to).toBe('owner@northcourt.co.uk');
  });

  it('carries the address and the source in a body a person can act on', () => {
    expect(msg.subject).toContain('owner@northcourt.co.uk');
    expect(msg.text).toContain('owner@northcourt.co.uk');
    expect(msg.text).toContain('splash');
    expect(msg.text).toContain(NOW);
  });
});

describe('the endpoint agrees with the app it serves', () => {
  it('posts to the same inbox the app names', () => {
    // `api/` is built separately from the Vite app, so the constant is duplicated rather than
    // imported. The coupling is paid here instead of at runtime — the same trade seo.ts makes for
    // FOUNDER_NAMES.
    expect(FORM_INBOX).toBe(APP_FORM_INBOX);
  });

  it('mails the address the site publishes, which is the same box', () => {
    /**
     * INVERTED 2026-08-01. This asserted the opposite — that form mail must NOT land in the mailbox
     * a client's own reply arrives in — which held while the site published `clay@` and the form
     * posted to `info@`. Clay then published the form's own inbox, so the two became one.
     *
     * The old rule was inbox hygiene, not safety, and at a two-person practice the failure that
     * costs a commission is a message nobody reads, not a message in the wrong folder. Kept as an
     * assertion rather than deleted so that a future split is a deliberate edit here, and so this
     * file records that they were once separate and why.
     *
     * NOTE WHAT THIS ASSERTION IS AND IS NOT. It pins the two constants EQUAL; it says nothing
     * about their value, which is why the address moving to `contact@` on 2026-08-02 did not touch
     * this line. A sibling assertion in `src/data/config.test.ts` did pin the local part as a
     * literal (`startsWith('info@')`) and had to be deleted that day — it went red on a correct
     * change, which is the signature of a test measuring the wrong thing.
     */
    expect(FORM_INBOX).toBe(CONTACT.email);
  });

  it('is reachable: vercel.json does not rewrite /api into the SPA shell', () => {
    /**
     * THE ONE THAT WOULD HAVE BITTEN SILENTLY. Every app path is rewritten to `index.html`, and if
     * `/api/` is not excluded the form POSTs to the HTML shell, gets a cheerful 200 back, and shows
     * "we will be in touch" forever while no mail is ever sent. This is precisely the `_vercel/`
     * bug caught before shipping the analytics change, in the same file, for the same reason.
     */
    const cfg = JSON.parse(
      readFileSync(fileURLToPath(new URL('../vercel.json', import.meta.url)), 'utf8'),
    );
    const rewrite = cfg.rewrites.find((r: { destination: string }) => r.destination === '/index.html');
    expect(rewrite, 'no SPA rewrite found').toBeTruthy();
    expect(rewrite.source, '/api is not excluded from the SPA rewrite').toContain('api/');
    // And prove the pattern actually declines /api/contact rather than merely mentioning it.
    const re = new RegExp('^' + rewrite.source + '$');
    expect(re.test('/api/contact'), '/api/contact would be served the SPA shell').toBe(false);
    expect(re.test('/houses'), '/houses must still reach the SPA').toBe(true);
  });
});
