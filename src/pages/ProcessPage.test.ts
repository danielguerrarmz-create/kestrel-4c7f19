import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ProcessPage } from './ProcessPage';

const html = renderToString(createElement(ProcessPage));

describe('ProcessPage growth sequence', () => {
  it('shows the same Bower as a full-spread scroll progression', () => {
    expect(html).toContain('/assets/process/evolution/installation.webp');
    expect(html).toContain('/assets/process/evolution/establishing.webp');
    expect(html).toContain('/assets/process/evolution/mature.webp');
    expect(html).toContain('Installation');
    expect(html).toContain('Establishing');
    expect(html).toContain('Mature');
    expect(html).toContain('h-[340svh]');
    expect(html).toContain('The garden continues the architecture.');
    expect(html).not.toContain('aria-label="Bower growth stage"');
    expect(html).not.toContain('Complete project budgets');
    expect(html).not.toContain('Established through feasibility and engineering');
  });
});
