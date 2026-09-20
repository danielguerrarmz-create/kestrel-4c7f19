import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ProcessPage } from './ProcessPage';
const html=renderToString(createElement(ProcessPage));
describe('ProcessPage',()=>{
 it('distinguishes the prototype, research footage and design imagery from production evidence',()=>{
  expect(html).toContain('Not an engineered or production-ready design');
  expect(html).toContain('This is not a Bower production line');
  expect(html).toContain('not an issued fabrication detail');
  expect(html).toContain('partnerships for the first permanent works are forming');
 });
 it('lets visitors inspect components and choose to play robotics research',()=>{
  expect(html).toContain('Find the part');
  expect(html).toContain('Robotic fabrication');
  expect(html).toContain('controls=""');
  expect(html).not.toContain('autoPlay');
  expect(html).toContain('kuka-robotics-robot-loop.webm');
  expect(html).toContain('href="/contact"');
 });
});
