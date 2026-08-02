/**
 * api/contact.ts — the endpoint the register-interest form posts to, and the first backend this
 * site has ever had.
 *
 * WHY IT EXISTS (2026-07-31). The splash's one conversion point ran `console.log` and nothing else.
 * Until 2026-07-28 it also told every visitor "Noted. We will be in touch." over that handler, which
 * is the worst bug this site has had: a promise it had no mechanism to keep. The copy was made
 * honest that day and the mechanism was left for "a provider choice, not a copy fix". This is the
 * provider choice.
 *
 * IT IS INERT UNTIL CONFIGURED, ON PURPOSE, AND THAT IS NOT A HALF-MEASURE. **This repo is PUBLIC.**
 * An API key cannot live in it, so the handler reads one from the environment and returns a
 * `503 not-configured` when it is absent. That makes the unconfigured state a real, testable,
 * honest response rather than a crash or a silent success — and the form reads it and keeps showing
 * the direct contact route. The site therefore never claims to have taken a message it has not.
 *
 * THE FAILURE MODE THIS IS BUILT AGAINST: a form that appears to work. A submit button that returns
 * "thank you" while the message goes nowhere is indistinguishable, to the person who sent it, from
 * one that works — and they are a buyer who now believes they have contacted you. So there is
 * exactly one success path, it requires a 2xx from the mail provider, and everything else falls
 * back to printing the phone number and the address.
 *
 * TO TURN IT ON (~10 minutes):
 *   1. Create a Resend account and verify **`send.bowerbuild.org`** — the SUBDOMAIN, never the apex
 *      (Daniel's ruling, 2026-08-02; the reason is on `FORM_SENDER` below and it is not a
 *      preference, the apex would collide with Google's MX and SPF). It will give you three DNS
 *      records: DKIM, SPF, and a return-path CNAME, all on `send.`. Verification is what stops the
 *      mail landing in spam, so do not skip it.
 *   2. Vercel project -> Settings -> Environment Variables, add `RESEND_API_KEY` for Production.
 *      That is the ONLY variable production needs. Leave `RESEND_FROM` and `RESEND_TO` UNSET: they
 *      are the sandbox escape hatch below, and a sender that lives in a dashboard variable is a
 *      fact with no test and no reviewer.
 *      Do NOT put the key in `.env` — that file is TRACKED in this repo (see the PostHog note in
 *      CLAUDE.md; the key there is a write-only public token, which this is not).
 *   3. Redeploy.
 *
 * `GET /api/contact` REPORTS THE KEY, NOT READINESS, and the difference matters. This line used to
 * say "reports readiness", which overstates it: `configured` is `Boolean(RESEND_API_KEY)` and
 * nothing more. **It will report `configured: true` while every submission still fails**, because
 * domain verification lives at Resend and this function cannot see it. So it answers "did the
 * variable land" — genuinely useful, and it costs no fake enquiry in the client inbox — but a green
 * probe is NOT evidence that mail sends. Steps 1 and 2 have to be confirmed separately: the domain
 * in Resend's own dashboard, and the end-to-end path via the sandbox hatch below.
 *
 * Resend rather than SendGrid or Postmark: it is the one with a first-class Vercel integration and
 * a free tier that covers this volume, and the whole provider surface used here is one POST to one
 * URL — swapping it is this file and nothing else.
 */

/** Where the form's mail goes. Mirrors `FORM_INBOX` in `src/data/config.ts`.
 *
 *  DUPLICATED DELIBERATELY, and it is the one duplication in this change. Vercel builds `api/`
 *  separately from the Vite app, so importing across that boundary drags the client bundle's module
 *  graph into a serverless function. The constant is pinned against its twin in `api.test.ts`, which
 *  is the same trade this repo already makes for `FOUNDER_NAMES` in seo.ts: pay the coupling at test
 *  time, not at runtime. */
export const FORM_INBOX = 'contact@bowerbuild.org';

/**
 * The From: address. **A SUBDOMAIN, `send.bowerbuild.org`, AND THAT IS NOT A PLACEHOLDER.**
 *
 * Daniel's ruling, 2026-08-02: verify `send.bowerbuild.org` with Resend, never the apex. This
 * comment used to read "once `bowerbuild.org` is verified with the provider", which is exactly the
 * shape of an unfinished TODO and would invite the next person to "finish" it by moving the sender
 * to the apex. Doing that breaks the practice's real mail. The reason, so it does not get reopened:
 *
 *   - **MX COLLISION.** The apex already carries Google's MX records, because Workspace delivers
 *     the practice's actual mail there. Resend's verification wants its OWN MX for the bounce
 *     return path. Two sets of MX on one name is not a merge, it is a fight, and the side that
 *     loses is inbound mail to the address this site publishes.
 *   - **SPF IS SINGLE-RECORD BY SPEC.** The apex has exactly one `v=spf1 include:_spf.google.com
 *     ~all`. A second `v=spf1` TXT record on the same name does not add to it: a checker that finds
 *     two returns PERMERROR, which invalidates BOTH. So there is no additive way to put a second
 *     sender on the apex without editing Google's own record.
 *   - **A SUBDOMAIN COSTS NOTHING AND ALIGNS ANYWAY.** Records on `send.bowerbuild.org` touch
 *     nothing Google depends on, and DMARC still passes, because alignment is evaluated against the
 *     ORGANIZATIONAL domain and `send.bowerbuild.org` and `bowerbuild.org` share one.
 *
 * Full write-up: `bower-docs/ops/2026-08-01-email-authentication.md` (private repo; this one is
 * PUBLIC).
 *
 * NOTE THE ASYMMETRY, because it looks like an inconsistency and is not: mail is SENT from
 * `send.bowerbuild.org` and RECEIVED at `contact@bowerbuild.org` (`FORM_INBOX` above). Sending is a
 * provider concern with its own DNS; receiving is Google's. They are different jobs on different
 * names, and the reader only ever sees the apex.
 *
 * A provider will not send from a domain you have not proved you control, so until those DNS
 * records are in place this address is REJECTED and every submission returns `send-failed` — which
 * the form shows honestly as "that didn't send", with the phone number and the address.
 */
export const FORM_SENDER = 'Bower site <noreply@send.bowerbuild.org>';

/**
 * Resend's shared sandbox sender, which needs no DNS at all.
 *
 * WHY IT IS HERE: domain verification needs DNS access, and DNS access is not always the same
 * person as the one wiring up the form — on 2026-07-31 it was Clay wiring it and his cofounder
 * holding the DNS, asleep. Without an escape hatch the whole pipeline stays untested until those
 * two people are awake at the same time, which is how a thing that "just needs ten minutes" takes
 * a week.
 *
 * Set `RESEND_FROM=onboarding@resend.dev` and a real send works immediately, with one restriction
 * the provider enforces: **it will only deliver to the email address the Resend account was opened
 * with.** So it proves the endpoint, the key, the payload, the reply-to and the form's success path
 * are all correct, and proves nothing about `contact@bowerbuild.org` receiving mail. Unset the
 * variable once the domain is verified.
 */
export const SANDBOX_SENDER = 'onboarding@resend.dev';

/** Where the mail is delivered. Overridable for the same reason as the sender: the sandbox sender
 *  can only reach the account holder's own address, so `contact@` is unreachable until DNS lands. */
export const resolveRecipient = (env: { RESEND_TO?: string }): string => env.RESEND_TO || FORM_INBOX;

/** The From: header to use, given the environment. Falls back to the verified domain address. */
export const resolveSender = (env: { RESEND_FROM?: string }): string => env.RESEND_FROM || FORM_SENDER;

/** Longest email address we will accept, per RFC 5321. Anything longer is not a typo, it is junk. */
const MAX_EMAIL = 254;

/** Deliberately permissive: one `@`, something either side, a dot in the domain, no whitespace.
 *  A stricter regex rejects real addresses, and the real validation is that the mail either
 *  arrives or bounces. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ContactPayload {
  email: string;
  /** Which surface it came from, so a reply can be written knowing what they had just read. */
  source?: string;
}

/** What the handler decided, separated from the HTTP plumbing so it is testable without a server. */
export type ContactResult =
  | { ok: true }
  | { ok: false; status: 400; reason: 'invalid-email' }
  | { ok: false; status: 503; reason: 'not-configured' }
  | { ok: false; status: 502; reason: 'send-failed' };

/** Trim and validate a submitted address. Returns null when it is not worth sending. */
export function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const email = raw.trim();
  if (!email || email.length > MAX_EMAIL || !EMAIL_RE.test(email)) return null;
  return email;
}

/**
 * The message itself. Plain text, because this is a notification to two people and not a campaign.
 *
 * `replyTo` is the load-bearing field: it means hitting reply in the `contact@` mailbox writes
 * straight back to the person who filled the form, with no copying and pasting an address out of a
 * notification, which is exactly where a lead gets dropped.
 */
export function buildMessage(
  p: ContactPayload,
  now: string,
  env: { RESEND_FROM?: string; RESEND_TO?: string } = {},
) {
  return {
    from: resolveSender(env),
    to: [resolveRecipient(env)],
    reply_to: p.email,
    subject: `Interest registered: ${p.email}`,
    text: [
      `${p.email} registered interest on bowerbuild.org.`,
      ``,
      `Source: ${p.source ?? 'unknown'}`,
      `Received: ${now}`,
      ``,
      `Reply directly to this message to answer them.`,
    ].join('\n'),
  };
}

/**
 * Send, or explain why not. Pure of HTTP so the decision table is unit-testable; `fetchImpl` is
 * injectable for the same reason.
 */
export async function deliver(
  payload: ContactPayload,
  env: { RESEND_API_KEY?: string; RESEND_FROM?: string; RESEND_TO?: string },
  now: string,
  fetchImpl: typeof fetch = fetch,
): Promise<ContactResult> {
  const email = normalizeEmail(payload.email);
  if (!email) return { ok: false, status: 400, reason: 'invalid-email' };

  const key = env.RESEND_API_KEY;
  // The honest unconfigured state. NOT a thrown error and NOT a fake success: the form is going to
  // read this and tell the visitor the truth.
  if (!key) return { ok: false, status: 503, reason: 'not-configured' };

  try {
    const res = await fetchImpl('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(buildMessage({ ...payload, email }, now, env)),
    });
    if (!res.ok) return { ok: false, status: 502, reason: 'send-failed' };
    return { ok: true };
  } catch {
    return { ok: false, status: 502, reason: 'send-failed' };
  }
}

/** Minimal shapes for the Vercel Node runtime, so this file needs no `@vercel/node` dependency. */
interface Req {
  method?: string;
  body?: unknown;
}
interface Res {
  status(code: number): Res;
  json(body: unknown): void;
}

export default async function handler(req: Req, res: Res): Promise<void> {
  // A KEY probe, not a readiness probe, and the name matters. It answers "did `RESEND_API_KEY`
  // land in this deployment", which is worth a lot because it costs no fake enquiry in the inbox a
  // real client writes to. It does NOT answer "will a message send": domain verification lives at
  // Resend and nothing here can see it, so this reports `configured: true` on a deployment where
  // every submission still returns 502 send-failed. Do not quote it as proof the form works.
  if (req.method === 'GET') {
    res.status(200).json({ configured: Boolean(process.env.RESEND_API_KEY), inbox: FORM_INBOX });
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, reason: 'method-not-allowed' });
    return;
  }

  // Vercel parses JSON bodies, but a string body arrives from `sendBeacon` and from some clients.
  let body: ContactPayload;
  try {
    body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) as ContactPayload;
  } catch {
    res.status(400).json({ ok: false, reason: 'invalid-email' });
    return;
  }

  const result = await deliver(body ?? { email: '' }, process.env, new Date().toISOString());
  res.status(result.ok ? 200 : result.status).json(result);
}
