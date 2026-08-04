import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ProcessPage } from './ProcessPage';

const html = renderToString(createElement(ProcessPage));

describe('ProcessPage growth sequence', () => {
  it('shows the same Bower at installation, establishing and maturity', () => {
    expect(html).toContain('/assets/process/evolution/installation.webp');
    expect(html).toContain('/assets/process/evolution/establishing.webp');
    expect(html).toContain('/assets/process/evolution/mature.webp');
    expect(html).toContain('Installation');
    expect(html).toContain('Establishing');
    expect(html).toContain('Mature');
    expect(html).not.toContain('Year zero to year three</span>');
  });
});
