import { expect, test } from '@playwright/test';

for (const viewport of [{ width: 1440, height: 900 }, { width: 700, height: 900 }]) {
  test(`checks reading line pauses and resumes at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/tech');
    const guide = page.locator('.tech-checks-guide');
    await guide.scrollIntoViewIfNeeded();
    const pause = guide.getByRole('button', { name: 'Pause animation', exact: true });
    await expect(pause).toBeVisible();
    const line = guide.locator('[data-active="true"] .tech-checks-track i');
    await expect.poll(() => line.evaluate(el => getComputedStyle(el).animationName))
      .toBe(viewport.width === 1440 ? 'tech-reading-line' : 'tech-reading-line-vertical');

    await pause.click();
    await expect(guide.getByRole('button', { name: 'Play animation', exact: true })).toBeVisible();
    await expect.poll(() => line.evaluate(el => getComputedStyle(el).animationPlayState)).toBe('paused');

    await guide.getByRole('button', { name: 'Play animation', exact: true }).click();
    await expect.poll(() => line.evaluate(el => getComputedStyle(el).animationPlayState)).toBe('running');
  });
}
