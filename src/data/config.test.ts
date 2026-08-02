import { describe, it, expect } from 'vitest';
import {
  ENGINE_NAME,
  CTA_PRIMARY_EVALUATOR,
  CTA_PRIMARY_BUYER,
  WORDMARK,
  PRODUCT,
  CONTACT,
  CONTACT_TARGET,
  FORM_INBOX,
  FOUNDERS,
} from './config';
import { TEAM } from '../pages/about/projects';

const DASHES = /[—–]/; // em dash, en dash: never allowed in on-screen copy

describe('brand naming constants (chrome reads these, so a rename is one line)', () => {
  it('ENGINE_NAME is the lowercase generic until the naming call lands', () => {
    expect(ENGINE_NAME).toBe('the engine');
  });

  it('both primary CTA labels exist so the post-deadline swap is one line', () => {
    expect(CTA_PRIMARY_EVALUATOR).toBe('See how the engine works');
    expect(CTA_PRIMARY_BUYER).toBe('Shape your Bower');
  });

  it('the company and the object share ONE name (2026-07-23)', () => {
    // Was WORDMARK 'Bower' + PRODUCT 'Eden', the two-noun system confirmed 2026-07-05. Clay
    // retired it because a first-time reader meets one word in the nav and another in the
    // headline with nothing joining them. Pinned as an equality rather than two literals, so
    // the invariant under test is the thing that matters: there is only one name.
    expect(WORDMARK).toBe('Bower');
    expect(PRODUCT).toBe(WORDMARK);
  });

  it('no naming or CTA constant carries an em/en dash', () => {
    for (const s of [ENGINE_NAME, CTA_PRIMARY_EVALUATOR, CTA_PRIMARY_BUYER, WORDMARK, PRODUCT]) {
      expect(s).not.toMatch(DASHES);
    }
  });
});

/**
 * THE CONTACT DETAILS, AND THE ONE TEST HERE THAT IS SUPPOSED TO GO GREEN LATER.
 *
 * A US mobile and a personal Gmail address sit on the page that names £350,000. The venue rewrite
 * ranks fixing them third of nine — above building an entire new page — because they are what a
 * commercial buyer's solicitor notices first, and because it is an hour of work.
 *
 * Neither can be invented in this repo, so the debt is recorded the only way that survives: as
 * assertions about what the values must BECOME. The two `skip`ped tests below are the acceptance
 * criteria, written now, failing to run now, and ready to be un-skipped the moment the real details
 * exist. That is deliberate — a skipped test with a name is a line item in the suite output on
 * every single run, which a comment in a config file is not. The comment saying the number was
 * "the first thing to revisit" had been sitting there for three days.
 */
describe('contact details (see pending.ts: contact-uk-phone, contact-domain-email)', () => {
  it('are well-formed and reachable, whatever country they are in', () => {
    // True today and must stay true: the page's only job is to reach a person.
    expect(CONTACT.email).toContain('@');
    expect(CONTACT.phoneHref).toMatch(/^\+\d{7,}$/);
    expect(CONTACT.name.length).toBeGreaterThan(0);
    // The printed form and the dialled form must be the same number. Nothing checked this, and a
    // tel: link that dials a different number than the page prints fails silently on desktop.
    expect(CONTACT.phoneHref.replace(/\D/g, '')).toBe(CONTACT.phone.replace(/\D/g, ''));
  });

  /** CLEARED 2026-07-31. Was `it.skip('UNBLOCK ME: ...')`; the site sells to UK houses. */
  it('the studio telephone number is a UK one', () => {
    expect(CONTACT.phoneHref.startsWith(CONTACT_TARGET.phoneCountryPrefix)).toBe(true);
    // Pinned as an absence too: a `+1` on the page that names £350,000 is the specific thing that
    // was fixed, and "some other non-UK number" would satisfy the rule above on its own.
    expect(CONTACT.phoneHref).not.toMatch(/^\+1/);
  });

  /** CLEARED 2026-07-31. Was `it.skip('UNBLOCK ME: ...')` for three days. */
  it('the studio mailbox is on the practice domain', () => {
    expect(CONTACT.email.endsWith(`@${CONTACT_TARGET.emailDomain}`)).toBe(true);
    // Pinned as an absence too: a free-provider address on a six-figure page is the specific
    // thing being fixed, and "some other gmail account" would satisfy the rule above alone.
    expect(CONTACT.email).not.toMatch(/@(gmail|outlook|hotmail|yahoo|icloud)\./i);
  });

  it('every practice address is on the practice domain', () => {
    const all = [['form inbox', FORM_INBOX] as const, ...FOUNDERS.map((f) => [f.id, f.email] as const)];
    expect(all.length).toBeGreaterThan(2);
    for (const [who, addr] of all) {
      expect(addr, `${who} is not on the practice domain`).toMatch(
        new RegExp(`@${CONTACT_TARGET.emailDomain}$`),
      );
    }
  });

  /**
   * THE FOOTER'S NAMES ARE THE LEDGER'S NAMES.
   *
   * `FOUNDERS` deliberately does not import `TEAM` — the footer is on every page and `TEAM` lives in
   * the 985-line About ledger, so importing it would drag that module into every bundle to print two
   * names. The cost of that decision is a second copy of a fact, which is this repo's oldest and most
   * repeated bug (a project was re-attributed in the ledger and sat wrong in a bio for five rounds,
   * silently). So the copy is pinned here, in a test file, where importing the ledger is free.
   */
  it('the footer founders are exactly the About ledger founders, in the same order', () => {
    expect(FOUNDERS.map((f) => f.name)).toEqual(TEAM.map((t) => t.name));
    expect(FOUNDERS.map((f) => f.id)).toEqual(TEAM.map((t) => t.id));
  });

  /**
   * THIS TEST HAS NOW ASSERTED FOUR DIFFERENT THINGS IN FIVE DAYS, AND THAT IS THE POINT OF
   * WRITING IT DOWN.
   *
   *   1. The published address IS a founder's (`clay@`), because the `/questions` close prints a
   *      name and then the address underneath, and a department address there puts a front desk
   *      between the reader and the person.
   *   2. Dropped when main published `contact@`: a verified mailbox beats an argument about tone.
   *   3. The published address and the form's destination never CONVERGE, so automated mail stays
   *      out of the mailbox a client's reply arrives in.
   *   4. The converged address begins `info@` — a literal, asserted the day Clay published it.
   *
   * All four are gone. The first three were preferences about tone and inbox hygiene dressed as
   * invariants, and a preference asserted as an invariant just makes the next decision look like a
   * regression. THE FOURTH IS THE MORE INSTRUCTIVE ONE, because it was not a preference at all —
   * it was a LITERAL standing in for a property, and it went red on 2026-08-02 when Daniel moved
   * the address to `contact@`. It had to be edited to let a correct change through, which is the
   * definition of a test that is measuring the wrong thing.
   *
   * So it is deleted rather than updated to `contact@`, and nothing is lost: whatever real property
   * it might have been defending is already asserted elsewhere and survives a rename.
   *   - on the practice domain, not a free provider -> the two tests above;
   *   - a shared address, not a person's -> the founders sweep below.
   *
   * WHAT SURVIVES IS THE PART THAT IS ACTUALLY UNSAFE TO GET WRONG: the app and the serverless
   * handler agree about where form mail goes. That is a real failure mode, because `api/` is built
   * separately by Vercel and carries its own copy of the constant.
   */
  it('the app and the form endpoint agree on one inbox', () => {
    expect(FORM_INBOX).toBe(CONTACT.email);
    // The founders' direct addresses stay distinct from the shared one, so `/about/practice` can
    // still offer a named person. If these ever collapse, that page stops meaning anything.
    // The emptiness assert is the repo's standing law: a for-loop over zero founders would pass
    // while checking nothing, in the file written to catch exactly that class of bug.
    expect(FOUNDERS.length).toBeGreaterThan(0);
    for (const f of FOUNDERS) expect(f.email).not.toBe(FORM_INBOX);
  });
});
