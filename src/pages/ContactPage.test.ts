import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ContactPage } from './ContactPage';

const html = renderToString(createElement(ContactPage));

describe('ContactPage', () => {
  it('requires only the reply address', () => {
    expect(html.match(/required=""/g)).toHaveLength(1);
    expect(html).toContain('name="email"');
    expect(html).toContain('name="email" type="email" required=""');
    expect(html.match(/\(optional\)/g)).toHaveLength(4);
  });
});
