# DesignX analytics

The presentation is a standalone HTML document. It does not mount the marketing
site's React analytics component. `src/designxAnalytics.ts` is compiled by Vite
to `/designx/analytics.js` and loaded by both public deck entry points.

It uses the existing `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` configuration for
the Bower project. It only runs in a production build on `bowerbuild.org` or
`www.bowerbuild.org`, at `/designx` or `/designx/v8` (including their index and
trailing-slash forms). Local development, preview hosts, offline copies and
`?print=1` are excluded.

| Event | Meaning |
| --- | --- |
| `$pageview` | The public deck page was opened. Both entry points use `$pathname: /designx`; `path` and `$current_url` retain the requested URL. |
| `designx_deck_viewed` | The first slide was rendered while the page was visible. Sent once per document load. |
| `designx_slide_viewed` | A slide became current while the page was visible. Carries `slide_number`, `slide_title`, `slide_count`, `progress_percent`, and `deck_edition`. Revisits count; repeated render events for the same current slide do not. |
| `designx_print_opened` | The reader clicked the print-view link. The print document itself is excluded from view counts. |

All events carry `deck_id: designx`. Use `designx_deck_viewed` to count deck
opens, unique persons for distinct browsers, and `designx_slide_viewed` broken
down by `slide_number` to inspect how far visitors navigate. A direct link to a
later slide records that slide, so reaching a slide does not prove earlier
slides were read. Visitors are anonymous unless identified elsewhere by the
existing site integration.

Session replay inherits the Bower project's remote recording settings, just
like the main website. This entry does not force recording on or change the
project's sampling rules. Filter replay or event views to URLs containing
`/designx`; use the custom events to find the corresponding reading sessions.

Events that occur while the SDK downloads retain their order and occurrence
timestamps. An unavailable SDK or capture failure does not interrupt the deck.
Browser blockers and project recording settings still determine which visits
produce analytics and recordings.

Run `npx vitest run src/designxAnalytics.test.ts src/analytics.test.ts` for the
production gates, event semantics, SDK loading race and failure isolation.
The integrated build should also be checked in a browser with intercepted
PostHog requests so verification does not create reader traffic.
