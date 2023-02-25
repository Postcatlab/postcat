import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:4200/');
  await page.getByRole('banner').getByRole('button').hover();
  await page.locator('a').filter({ hasText: 'New Group' }).click();
  await page.getByLabel('Group Name').fill('test');
  await page.getByRole('button', { name: 'Confirm' }).click();
});
