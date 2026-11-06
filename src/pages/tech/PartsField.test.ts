import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { PartsField } from './PartsField';
import parts from './parts.generated.json';

// The OS preference is the boundary; render the real index and motion components.
vi.mock('../../ui/useReducedMotion', () => ({ useReducedMotion: () => true }));

describe('parts index with reduced motion', () => {
  it('offers every part and the onward link immediately, without a presentation cue', () => {
    const html = renderToString(createElement(PartsField));
    expect(html.match(/aria-label="Inspect /g)).toHaveLength(parts.length);
    expect(html).not.toContain('disabled=""');
    expect(html).not.toContain('data-revealed="false"');
    expect(html).not.toContain('tech-parts-progress');
    expect(html).toContain('Continue to timber and material');
    expect(html).toContain('Each curve has its own geometry.');
  });
});
