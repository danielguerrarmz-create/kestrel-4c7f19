import React from 'react';
import ReactDOM from 'react-dom/client';
import { Root } from './Root';
import { ErrorBoundary } from './ui/ErrorBoundary';
import { installRouter } from './routing';
import { SiteAnalytics } from './analytics';

// Self-hosted fonts for the documentation layer (the studio keeps its
// Google-served Fraunces + Inter). Source Serif 4 = free Freight Big Pro
// stand-in (upright + italic variable), Bodoni Moda = pull-quote serif, IBM
// Plex Mono = technical annotation face.
import '@fontsource-variable/source-serif-4';
import '@fontsource-variable/source-serif-4/wght-italic.css';
import '@fontsource/bodoni-moda/400.css';
import '@fontsource/bodoni-moda/500.css';
import '@fontsource/bodoni-moda/600.css';
import '@fontsource/bodoni-moda/500-italic.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './index.css';

// BEFORE the first render, not in an effect. `installRouter` rewrites an inbound legacy
// `/#/gallery` to `/gallery` in place; doing that after mount would paint the home for a frame
// first, and every link shared while the site was hash-routed would flash the wrong page.
installRouter();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Root />
    </ErrorBoundary>
    {/* OUTSIDE the ErrorBoundary, and a sibling of Root rather than a child.
        Outside: analytics must never be able to take the page down, and equally a page crash
        should still be measurable rather than silently unreported.
        Sibling: Root returns a different page per target, so putting this inside would mean
        wrapping every one of those returns in a fragment. It reads the route itself. */}
    <SiteAnalytics />
  </React.StrictMode>,
);
