import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PRESS_EMAIL, PressPage } from './PressPage';

const html = renderToString(createElement(PressPage));

describe('PressPage', () => {
  it('is only a direct email door', () => {
    expect(html).toContain(`mailto:${PRESS_EMAIL}`);
    expect(html).toContain(`>${PRESS_EMAIL}</a>`);
    expect(html).not.toContain('For press enquiries');
    expect(html).not.toContain('press coverage');
    expect(html).not.toContain('press kit');
  });
});
