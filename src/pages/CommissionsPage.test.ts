import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { routes } from '../routing';
import { FOUNDING_SITE_STUDY_FEE } from '../ui/priceCopy';
import { CommissionsPage } from './CommissionsPage';

const html = renderToString(createElement(CommissionsPage)).replace(/<!-- -->/g, '');

describe('CommissionsPage', () => {
  it('connects the commission to a patron\'s landscape and intended life', () => {
    expect(html).toContain('What a Bower makes possible.');
    expect(html).toContain('a room for consequential conversation');
    expect(html).toContain('A living work');
    expect(html).toContain('A place to gather');
    expect(html).toContain('A place to attend to the landscape');
  });

  it('makes the first appointment legible and rational', () => {
    expect(html).toContain('Four weeks to make a serious decision.');
    expect(html).toContain(FOUNDING_SITE_STUDY_FEE);
    expect(html).toContain('Half payable on appointment');
    for (const deliverable of [
      'A serious site decision',
      'One preliminary Bower proposition',
      'Early planning, structural and fabrication thinking',
      'A credible cost range and programme',
      'A defined proceed, pause or stop decision',
      'A reserved route toward one of three founding commissions',
    ]) expect(html).toContain(deliverable);
  });

  it('states the risk controls without claiming unappointed specialists', () => {
    expect(html).toContain('The study may conclude that a Bower does not belong on the property.');
    expect(html).toContain('No construction commitment is made in the study.');
    expect(html).toContain('Concept Design and construction are separate appointments.');
    expect(html).toContain('professional arrangements required for the study are confirmed before appointment');
    expect(html).not.toContain('our structural engineer');
    expect(html).not.toContain('our fabricator');
    expect(html).not.toContain('insurance is in place');
  });

  it('makes founding patronage specific and advances to contact', () => {
    expect(html).toContain('Three landscapes will define the first chapter.');
    expect(html).toContain('work directly with Bower’s founders');
    expect(html).toContain(`href="${routes.contact}"`);
    expect(html).toContain('Discuss a founding commission');
  });
});
