import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ProcessPage } from './ProcessPage';
import parts from '../data/process-parts.json';
import { runEngine } from '../engine';
const html=renderToString(createElement(ProcessPage));
describe('ProcessPage',()=>{
 it('keeps studies, research and proposed production distinguishable',()=>{
  expect(html).toContain('Precomputed engine studies');
  expect(html).toContain('Placeholder for a Bower fabrication film');
  expect(html).toContain('Joint detail image placeholder');
  expect(html).toContain('partnerships for the first permanent works are forming');
  expect(html).toContain('not validated CNC toolpath code');
 });
 it('offers deliberate media controls without the rejected wireframe or numbered kickers',()=>{
  expect(html).toContain('aria-expanded="false"');
  expect(html).toContain('Placeholder for a Bower assembly film');
  expect(html).not.toContain('Assembly progress');
  expect(html).not.toContain('Joint system');
  expect(html).not.toContain('autoPlay');
  expect(html).not.toContain('Centreline geometry');
  expect(html).not.toMatch(/0[1-9] \/ /);
  expect(html).not.toContain('kuka-robotics-robot-loop');
  expect(html).not.toContain('/assets/process/joints-composed-v1.webp');
  expect(html).not.toContain('Pause assembly');
  expect(html).not.toContain('assembly-sequence');
  expect(html).toContain('href="/contact"');
 });
 it.each(parts)('shows actual engine quantities for the $footprintM2 m² study',study=>{
  const result=runEngine({footprintM2:study.footprintM2,riseM:2.3,strutSpacingM:.55,apertureDeg:90,jointSystem:'lamella',speciesId:'clematis',year:0});
  expect(study.count).toBe(result.components.totalCount);
  expect(study.lengthM).toBe(Math.round(result.components.totalLengthM*10)/10);
  for(const piece of study.pieces){
   expect(piece.lengthM).toBeGreaterThan(0);
   expect(piece.lengthM).toBe(result.geometry.pieces.find(p=>p.id===piece.id)?.lengthM);
  }
 });
});
