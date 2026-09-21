# Website release and rollback, 20 September 2026

## What changed
Home slideshow and narrative, Gallery studies, Process storytelling and placeholders, Practice history vine, portfolio and mobile layouts, supplied transparent branding, and continuous section colour fades. Contact remains the primary action.

## Security review
- Updated vulnerable build/test/image tooling and transitive dependencies. Final npm audit: zero known vulnerabilities.
- Contact accepts bounded strings only, validates the email, rejects control characters, malformed JSON, non-JSON submissions, foreign browser origins, and bodies over 16 KiB. Recipient and sender remain server-controlled. Provider calls time out after ten seconds.
- Added matching browser input limits and a honeypot. Form errors retain the direct email/phone fallback.
- Moved API tests outside api/ so Vercel no longer publishes a test function.
- Disabled PostHog session replay/autocapture, selected memory-only persistence, excluded query/fragment values from reported page URLs, and updated the privacy description. Removed local contact email logging.
- Added anti-framing, no-sniff, referrer and device-permission headers, plus a narrow CSP protecting form targets, document base and embedded objects.
- Scanned the staged release and branch commits for secrets. The tracked PostHog project ingestion key is deliberately public; no server credential is committed.
- Production bundle check confirms hidden engine/studio/lab routes and retracted pricing are absent.

## Validation
988 tests across 76 files; TypeScript; production build; dependency audit; secret scan; production bundle boundary check. Desktop/mobile visual checks completed during implementation. Deployment response/header checks are recorded in the release task.

## Limits
This is a code/dependency/configuration review, not an independent penetration test. Honeypot/origin checks do not stop direct scripted spam; distributed rate limiting or a challenge remains a future operational hardening option. The CSP is deliberately limited and is not a complete script allowlist. No valid enquiry is sent during release verification; live key presence does not prove email delivery. No credentials or mail DNS are changed.

## Previous production, preserved before release
- Git commit: `26d9ac854a636c30866180822a1e434531771e43`
- Pushed annotated tag: `backup/production-before-redesign-2026-09-20`
- Immutable deployment: `dpl_5MzBZ35keQwuk3cinKEKK88wkRsF`
- Previous deployment URL: https://project-eden-odoeazxer-danielguerrarmz-create11.vercel.app
- Separate backup alias: https://bower-pre-redesign-20260920.vercel.app
- Verified full-history Git bundle stored locally outside this public repository in the sibling `release-backups/2026-09-20` directory.

## Immediate rollback
Run from an authenticated Vercel CLI:

```powershell
vercel rollback https://project-eden-odoeazxer-danielguerrarmz-create11.vercel.app --yes --scope danielguerrarmz-create11
```

Verify https://bowerbuild.org and https://www.bowerbuild.org afterwards. Vercel rollback pauses automatic production domain assignment until a later deployment is promoted. The backup alias and Git tag are separate from the main production domain. Do not delete the preserved deployment or move its backup alias.

For a permanent source rollback, create a new branch and revert the release merge through a PR. Do not force-reset main. The tag and local bundle preserve source even if hosting retention settings later change.

Official rollback guidance: https://vercel.com/docs/instant-rollback

## Files touched
See PR #46 for the complete release diff. Security changes are in api/contact.ts, tests/contact.test.ts, src/pages/ContactPage.tsx, src/posthog.ts, src/pages/PrivacyPage.tsx, vercel.json, vite.config.ts, package manifests and test configuration.
