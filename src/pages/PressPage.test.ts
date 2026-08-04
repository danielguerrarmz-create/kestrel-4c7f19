import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CONTACT } from '../data/config';
import { PressPage } from './PressPage';

const html = renderToString(createElement(PressPage));

describe('PressPage', () => {
  it('is a modest direct enquiry page', () => {
    expect(html).toContain('For press enquiries, please contact us.');
    expect(html).toContain(`mailto:${CONTACT.email}?subject=Press%20enquiry`);
    expect(html).not.toContain('press coverage');
    expect(html).not.toContain('press kit');
  });
});
