import { expect, test } from '@playwright/test';

test('both canopy projections show the full assembly beside the controls', async ({ page }) => {
  await page.goto('/designx/v10/#slide-04');
  const slide = page.locator('#slide-04');
  const film = slide.locator('video');
  const projections = slide.getByRole('navigation', { name: 'Projection' });

  for (const projection of ['Axonometric', 'Perspective']) {
    await projections.getByRole('button', { name: projection }).click();
    await slide.getByRole('button', { name: 'Assembly', exact: true }).click();
    await expect(film).toBeVisible();
    await expect.poll(() => film.evaluate(v => v.readyState >= 2 && v.paused && !v.seeking && v.currentTime < 1)).toBe(true);
    await expect(film).toHaveCSS('object-fit', 'contain');
    await expect(film).toHaveCSS('object-view-box', 'none');
    const media = (await film.boundingBox())!;
    const controls = (await projections.boundingBox())!;
    const frame = (await slide.boundingBox())!;
    expect(controls.x + controls.width).toBeLessThanOrEqual(media.x + 1);
    expect(Math.abs(media.y - frame.y)).toBeLessThan(1);
    expect(media.x + media.width).toBeLessThanOrEqual(frame.x + frame.width + 1);
  }
});
