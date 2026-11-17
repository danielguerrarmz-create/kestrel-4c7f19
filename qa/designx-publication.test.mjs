import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import { isInternalArtifact, publicStorySource } from '../scripts/designx/prepare-public.mjs';

describe('DesignX publication boundary', () => {
  it('excludes the editorial map, nested documentation and authoring scripts while retaining runtime evidence and media', () => {
    for (const path of ['v8/story-map.html', 'README.md', 'v8/assets/canopy-orbit/SOURCES.md', 'v8/scripts/check.mjs', 'v8/set-aside.js']) {
      expect(isInternalArtifact(path)).toBe(true);
    }
    for (const path of ['5/factory/catalog.js', 'v8/story.js', 'v8/assets/canopy-orbit/manifest.json', 'pieces/the-place/index.html', 'v8/assets/canopy-orbit/perspective.mp4']) {
      expect(isInternalArtifact(path)).toBe(false);
    }
  });

  it('keeps the authored sequence and scene settings but omits internal drawing briefs and speaker bridges', async () => {
    const original = await readFile(new URL('../public/designx/v8/story.js', import.meta.url), 'utf8');
    const sourceContext = { window: {} }, publicContext = { window: {} };
    runInNewContext(original, sourceContext);
    runInNewContext(publicStorySource(original), publicContext);
    const expected = sourceContext.window.DESIGNX_V8_STORY;
    const published = publicContext.window.DESIGNX_V8_STORY;
    expect(published).toHaveLength(expected.length);
    published.forEach((scene, index) => {
      for (const key of ['number', 'baseSlide', 'title', 'theme', 'growthMode', 'timeExperiment']) {
        expect(scene[key]).toEqual(expected[index][key]);
      }
      for (const key of ['purpose', 'stays', 'drawing', 'status', 'transition', 'speakerBridge']) {
        expect(scene).not.toHaveProperty(key);
      }
    });
    expect(() => publicStorySource('window.DESIGNX_V8_STORY = [{privateReview: "internal"}];')).toThrow('Review new DesignX story field');
  });
});
