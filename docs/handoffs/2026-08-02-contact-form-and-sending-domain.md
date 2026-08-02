# The contact form, the address, and the sending domain

**Date:** 2026-08-02
**Branch state at close:** `origin/main` @ `cb40034`. Three PRs merged today: #16, #17, #18.
**Status:** everything in code and DNS is done and verified. **One manual step remains and it is
Daniel's: create the Resend API key and paste it into Vercel.** Until then every application still
fails honestly to the fallback.

---

## What

Four things landed, in this order.

1. **PR #16 — the home became an application.** The filled hero action is now *"Apply for a Founding
   Feasibility Study"* and opens the form; the form's label and submit follow it; a scarcity line
   (`FOUNDING_COHORT`) sits under the button with the study year as a NUMBER, so `copy.test.ts` goes
   red once it is in the past. Ritual step 3 became *"We manufacture off-site"*. The site's address
   was published as `info@bowerbuild.org`, converging `CONTACT.email` and `FORM_INBOX` onto one
   mailbox and inverting the guard that had pinned them apart.
2. **PR #17 — the address became `contact@bowerbuild.org`.** Daniel corrected it hours later. The
   converged design stayed; only the mailbox changed.
3. **PR #18 — the sender became `noreply@send.bowerbuild.org`.** `FORM_SENDER` now points at a
   subdomain rather than the apex, for the reason in the next section.
4. **The sending domain was set up and verified for real** (outside the repo): a Resend account
   owned by `contact@bowerbuild.org`, the domain `send.bowerbuild.org` in region **Ireland
   (eu-west-1)**, and three DNS records added to the Vercel-hosted zone.

## Why

**Why a subdomain and not the apex.** The apex carries Google's MX and a single SPF record
(`v=spf1 include:_spf.google.com ~all`). Resend wants its own MX for the return path, which collides
with Google's at the apex, and a second `v=spf1` record on one name is a PERMERROR that invalidates
both. A subdomain's records touch nothing Google mail depends on, and DMARC still aligns because the
organizational domain matches. **Bower sends from `send.` and receives at the apex; the asymmetry is
deliberate.**

**Why Ireland.** The buyers are UK venue owners, and applicants' names, emails and messages are
processed in the EU rather than the US. The region is fixed at creation: changing it means deleting
and re-adding the domain.

**Why no durable store.** Daniel's call, accepted as reversible: email only. The consequence is
written down rather than discovered — **a failed send loses that enquiry.** The reader is told
plainly and handed a working route, so recovery is theirs to act on.

**Why the key is not set yet.** It is a live credential. It was deliberately left for Daniel rather
than routed through an agent's context or a screenshot, in a **public** repo.

## Verify

Everything below was executed, not inferred.

- `npm run typecheck` — exit 0. `npx vitest run` — **68 files / 964 tests / 0 failed**. PR #16 was
  run **three independent times** (962 each) because a single green run is not evidence for a suite
  covering procedural output.
- `npm run build && node qa/bundle-leak.mjs` **chained** (the `&&` is the point: a failing build
  leaves the previous `dist/` in place) — 8 markers clean, "no gated surface in the production
  bundle".
- Drift guards ran **without `GEN`** and `git status` was empty afterwards. On PR #17 the guard was
  run **before** the regen as a positive control and went red on the stale mirror, proving it can
  fail.
- **DNS verified by querying `ns1.vercel-dns.com` directly, not by reading the dashboard row** —
  that distinction is what hid the `_dmarc` underscore bug on 2026-08-01. All three resolve
  byte-correct.
- **The apex was checked for collateral damage:** MX is still `smtp.google.com`, and the apex has
  exactly **one** `v=spf1` record.
- Resend reported **Domain verified** at 12:14 PM.
- The live site was verified after each deploy: `contact@bowerbuild.org` in `index.html` and in
  `/agent/questions.md` (which is `renderToString` of the live components, so it is the real
  evidence the rendered page prints it), and `GET /api/contact` reporting the new inbox.
- The Apply CTA was driven in Chrome against the real `api/contact.ts` code path: the button opens
  the form, and a submit against the unconfigured backend returns **502** and renders *"That didn't
  send, and we would rather tell you than lose your application"* with live `tel:` and `mailto:`
  links. **No false success is reachable** — the only 200 path requires the provider to have
  accepted the message.

## Left

**1. The one manual step, in this order.** Both dialogs were left pre-filled in Chrome.
   - Resend → API keys → **Sending access**, scoped to `send.bowerbuild.org`, named
     `project-eden production`. The `re_…` value is shown once.
   - Vercel → project-eden → Environment Variables → `RESEND_API_KEY`, **Sensitive**, **Production
     only**. Paste, save.
   - **Redeploy.** Env vars only take effect on a new deployment.
   - **Order matters:** the domain was verified first deliberately, so the window in which a
     submission 502s and is lost is as small as possible.

**2. `GET /api/contact` will say `configured: true` the moment the key lands, and that is not proof
   the form works.** It reports `Boolean(RESEND_API_KEY)` and cannot see domain verification. The
   real proof is a delivered email. The code called it a "readiness probe" in three places and that
   was corrected to a KEY probe, because that name is what someone quotes when asked "is the form
   working".

**3. How to test without putting a fake application in the client inbox.** Use the sandbox hatch on
   a preview deployment: `RESEND_FROM=onboarding@resend.dev` and `RESEND_TO=<Daniel's own address>`.
   Resend's sandbox only delivers to the account holder's address, which is exactly what makes it
   safe. Production keeps both unset.

**4. Two nits held back deliberately** (committing them would have invalidated the verification
   numbers in an open PR): both were landed in PR #17, so nothing is outstanding here — recorded
   only because the reasoning recurs.

**5. Unchanged and still open, carried from before today:**
   - **"We manufacture off-site"** is present tense with no fabricator appointed (`pending.ts`,
     `practice-entity`). It clears `houseRules.test.ts`, which sweeps *how* claims, not *where*.
   - The building-regulations answer still commits Bower to a structural engineer who does not
     exist. `pending.ts` dates this to August.
   - **The scarcity tripwire fires 2027-01-01, not when autumn 2026 ends**, so the line can be ~4
     months stale before anything goes red. The count ("four available") has no guard and cannot
     have one.
   - Nothing is prerendered, so link unfurlers still get the home's card on all six URLs. This
     blocks the `/houses` card (`pending.ts`, `houses-og-card`).
   - `bower-docs` has one unpushed commit (`786f138`, the email runbook and avatar exports).

## Files

- `api/contact.ts`, `api/contact.test.ts` — `FORM_INBOX`, `FORM_SENDER`, the key probe's real meaning.
- `src/data/config.ts`, `src/data/config.test.ts` — the converged address and its guards.
- `src/pages/splash/copy.ts`, `copy.test.ts`, `SplashPage.tsx`, `SplashPage.test.ts`,
  `RegisterInterest.tsx`, `HeroReveal.tsx` — the application CTA and the cohort line.
- `src/pending.ts`, `src/seo.ts`, `src/seo.test.ts`, `src/agent/mirror.ts`, `index.html`,
  `public/agent/*.md`, `public/llms.txt`.
- `CLAUDE.md` — rewritten twice today, because both later commits found it describing a design the
  repo no longer had.

## The lesson from today, which happened three times

**A test that pins a LITERAL where it means a PROPERTY goes red on a correct change, and reads as
correct while doing it.**

- `expect(html).not.toContain('#/studio')` — after the path migration the page could not emit that
  string under any bug. Green forever, guarding nothing.
- `expect(FORM_INBOX.startsWith('info@')).toBe(true)` — invisible to a grep for the full address
  because it held only the local part.
- `expect(FORM_SENDER).toContain('@bowerbuild.org')` — reads as "on the practice domain", actually
  pins "the mail host IS the apex", because the leading `@` turns containment into an exact-host
  check.

Each was fixed the same way: relax the literal to the sanity check it was meant to be, and give the
real property its own test, proved red before being kept. **After any rename of a URL, an address,
a class name or an attribute, grep for `not.toContain(` and `startsWith(` and re-express each one as
the property it was defending** — a property survives a change of scheme and a literal does not.
