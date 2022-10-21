import { test, expect } from '@playwright/test';
test('test', async ({ page }) => {
  page = page as import('playwright').Page;
  await page.goto('http://localhost:4200');
  //Add Api
 

  //Edit Api
  await page.locator('nz-tree-node-title:has-text("test") div').nth(1).hover();
  await page.locator('nz-tree-node-title:has-text("test") svg').hover();
  await page.locator('#cdk-overlay-2').getByText('Edit').click();
  await page.getByLabel('Group Name').fill('parentGroup');
  await page.getByLabel('Group Name').press('Enter');

  //Delete Api
});
