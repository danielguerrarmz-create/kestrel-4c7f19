import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CONTACT } from '../data/config';
import { ContactPage, UndeliveredNotice } from './ContactPage';

const html = renderToString(createElement(ContactPage));
const undelivered = renderToString(createElement(UndeliveredNotice));

describe('ContactPage', () => {
  it('requires only the reply address', () => {
    expect(html.match(/required=""/g)).toHaveLength(1);
    expect(html).toContain('name="email"');
    expect(html).toContain('name="email" type="email" required=""');
    expect(html).not.toContain('(optional)');
  });
});

/**
 * The failure branch is the one the reader reaches when the form did not work, so it is the one
 * surface on this page that has to be right about how else to reach a person. It is tested
 * SEPARATELY from the page because it never appears in the page's own render: `outcome` starts at
 * 'idle', so `renderToString(ContactPage)` cannot see it, and a test that swept the page HTML for
 * a `tel:` link would pass or fail on the wrong thing entirely.
 *
 * Both assertions are bound to `CONTACT`, deliberately. The published address has moved five times
 * in a fortnight; a test holding the literal would either go red on a correct change or, worse,
 * stay green against a hand-copied value in the component that had drifted from config.
 */
describe('ContactPage failure route', () => {
  it('hands the reader BOTH the phone and the address, from config', () => {
    expect(undelivered).toContain(`href="tel:${CONTACT.phoneHref}"`);
    expect(undelivered).toContain(CONTACT.phone);
    expect(undelivered).toContain(`href="mailto:${CONTACT.email}"`);
    expect(undelivered).toContain(CONTACT.email);
  });

  it('announces itself, because it replaces a submission the reader believed had gone', () => {
    expect(undelivered).toContain('role="alert"');
  });
});
