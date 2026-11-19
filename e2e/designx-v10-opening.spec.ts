import { expect, test } from '@playwright/test';

test('the default v10 URL includes the seasonal room and living street', async ({ page }) => {
  await page.goto('/designx/v10/');
  await expect(page.locator('#slide-counter')).toContainText('/ 21');
  await expect(page.locator('#slide-02 .mission-room')).toHaveCount(1);
  await expect(page.locator('#slide-03 .mission-street')).toHaveCount(1);

  await page.getByRole('button', { name: 'Next slide', exact: true }).click();
  await expect(page.locator('#slide-02')).toHaveClass(/is-active/);
  await expect(page.locator('#slide-02 .mission-moment.is-current h2')).toHaveText('Opening day.');
  const openingImage = page.locator('#slide-02 .mission-moment.is-current img');
  await expect(openingImage).toBeVisible();
  await expect.poll(() => openingImage.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);

  await page.getByRole('button', { name: 'Next slide', exact: true }).click();
  await expect(page.locator('#slide-03')).toHaveClass(/is-active/);
  await expect(page.locator('#slide-03 h2')).toHaveText('A living street.');
  await expect.poll(() => page.locator('#slide-03 .mission-street').evaluate((img: HTMLImageElement) =>
    img.complete && img.naturalWidth > 0)).toBe(true);

  await page.getByRole('button', { name: 'Open slide index' }).click();
  await expect(page.locator('#index-grid [data-go]')).toHaveCount(21);
});

test('default v10 print includes both opening slides', async ({ page }) => {
  await page.goto('/designx/v10/?print=1');
  await expect(page.locator('.slide.is-active')).toHaveCount(21);
  await expect(page.locator('#slide-02 .mission-moment')).toHaveCount(5);
  await expect(page.locator('#slide-03 .mission-street')).toBeVisible();
});
