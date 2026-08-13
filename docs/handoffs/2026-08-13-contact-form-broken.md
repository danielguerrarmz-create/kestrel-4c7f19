# 2026-08-13 — the contact form is broken, and only half of it is a code bug

## What

Reported: "our contact form is broken." It is. Two separate faults, and they compound.

**Fault 1 — the form cannot send at all. NOT a code bug, and it is the one that matters.**
`RESEND_API_KEY` has never been set in Vercel Production. Verified against the live site today:

```
GET  https://www.bowerbuild.org/api/contact  -> 200 {"configured":false,"inbox":"contact@bowerbuild.org"}
POST https://www.bowerbuild.org/api/contact  -> 503 (not-configured)
POST .../api/contact  {"email":"not-an-email"}  -> 400 (invalid-email)
```

The endpoint is deployed, routed, and behaving **exactly as designed**: `vercel.json` keeps `api/`
out of the SPA rewrite, validation runs, and the unconfigured state returns an honest `503` rather
than a fake success. Nothing in `api/contact.ts` is wrong. It has simply never been switched on.

This is the open item recorded on 2026-08-02 as "Daniel's manual step" and never closed. **The form
has therefore been dead on a live site for eleven days, and there is no durable store, so every
enquiry submitted in that window was lost.** Nothing in this repo can recover them.

**Fault 2 — the recovery route was half-missing. This is the code bug, and it is fixed here.**
The site's contract is: the outcome is decided by the SERVER, and every non-2xx path "prints the
phone number and the address." `splash/RegisterInterest.tsx` has done that since 2026-07-31. The
2026-08-08 site rework replaced that form with `pages/ContactPage.tsx` and carried over the honesty
of the control flow **but not the recovery route** — the failure branch printed the email alone.

The phone was not deleted site-wide (it is still on `/questions` and in the Organization JSON-LD).
It went missing from the one surface that renders only when the form has already failed.

## Why it matters more than it looks

Because of *when* that branch is read. It renders precisely when the form did not work, so the
person reading it has just had one route drop their message — and it then offered them a second
address on the same domain, i.e. the channel that just failed them. The phone is the only route on
that screen that does not share a failure mode with the form.

And with `RESEND_API_KEY` unset, **this is the branch every single submission takes.** The two
faults are not independent: fault 1 makes fault 2 the entire user experience of the contact page.

## Verify

- `npx vitest run src/pages/ContactPage.test.ts` — 3 pass.
- Full suite: **965 pass, 1 fail**. The single failure is `agentMirror.generated.test.ts` and it is
  **pre-existing on `main`, unrelated to this change** — see "Left" below.
- `npx tsc --noEmit` clean.
- The new test was proven falsifiable: restoring the old email-only markup turns it red
  (`expected ... to contain 'href="tel:+442071395142"'`), and the fix turns it green. It was not
  accepted on a green run alone.

## Left — and the first one is the actual fix

1. ~~**Set `RESEND_API_KEY` in Vercel, then redeploy.**~~ **DONE, same day. THE FORM SENDS.**
   Daniel set it (Production, Sensitive) and redeployed; verified end to end — `GET` →
   `{"configured":true}`, `POST` → `200 {"ok":true}`, and the mail was confirmed received. First
   real send this site has ever made.
   - **The redeploy is the step that looks like the variable not saving.** `configured` stayed
     `false` after the key was added, because Vercel binds env vars at BUILD time and a deployment
     that already exists never sees a new one. Diagnosed without dashboard access by reading the
     response headers: `age: 0` + `x-vercel-cache: MISS` proved the function really executed (so
     the code was current and `process.env` genuinely empty), while a large `age` on `/` proved
     nothing had redeployed. That pair separates the two causes in one call. ~2 min to flip after.
   - Vercel's sidebar showed **Environments**, not "Environment Variables" — the docs' own path was
     stale. Direct URL: `https://vercel.com/<team>/<project>/settings/environment-variables`.
   - Standing caveat, unchanged: **`GET` reporting `configured: true` is not proof mail sends.** It
     reads `Boolean(RESEND_API_KEY)` and cannot see domain verification. Only a `POST` returning
     200 is evidence, and even that proves ACCEPTANCE by Resend, not DELIVERY to a human.
2. ~~**`clay@bowerbuild.org` is unconfirmed.**~~ **CLOSED (Daniel, 2026-08-13): it is a real
   mailbox, and it plus `contact@bowerbuild.org` are the practice's only two addresses.** The
   caveat has been deleted from `config.ts` rather than left to be re-raised by the next reader.
   What survives it: **no test can see a mailbox**, so a published address that stops receiving
   fails nothing, silently, forever. Re-confirm with a person on every change of `CONTACT.email`.
3. ~~**`agentMirror.generated.test.ts` is RED on `main`**~~ — **DONE, and the reason given here for
   deferring it was wrong.** Regenerated the same day (Daniel's call); suite is now **966/966 green**.

   The line above called it "a whole-site copy regeneration" and used that to justify not bundling
   it. Measured, the drift was **two lines in two files** — not a copy change at all:
   - `home.md` was missing `[Discover](#meaning)`. That is a real link (`SplashPage.tsx`, pinned in
     `SplashPage.test.ts`), so the mirror had been hiding one of the home page's two actions from
     every agent reading the site.
   - `practice.md` pointed at `synergy-cosmos-growth-loop-poster.webp` where the component serves
     `synergy-cosmos-growth-loop.gif` — the still, not the animation the page actually shows.

   **The estimate came from the size of the commit that caused the drift, not from running the
   generator**, and it was off by two orders of magnitude in the direction that justified skipping
   the work. The generator is one command and prints the diff; it costs less to run it than to
   reason about how big it might be.
4. `splash/RegisterInterest.tsx` is now mounted nowhere — orphaned by the rework. Left in place; it
   is the component the recovery-route contract was originally written in.

## Files

- `src/pages/ContactPage.tsx` — extracted `UndeliveredNotice`, restored phone + address, both bound
  to `CONTACT` rather than to literals.
- `src/pages/ContactPage.test.ts` — regression test on the failure branch. Tested separately from
  the page because `outcome` starts at `'idle'`, so the branch never appears in the page's own
  render and a sweep of the page HTML would have been checking nothing.
- `docs/handoffs/2026-08-13-contact-form-broken.md` — this file.
