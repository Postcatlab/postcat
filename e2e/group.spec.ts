import { test, expect } from '@playwright/test';
test('test', async ({ page }) => {
  page = page as import('playwright').Page;
  await page.goto('http://localhost:4200');
  //Add group
  await page.hover('.ant-btn-primary');
  await page.getByText('New Group').click();
  await page.getByLabel('Group Name').click();
  await page.getByLabel('Group Name').fill('test');
  await page.getByLabel('Group Name').press('Enter');

  //Edit group
  await page.locator('nz-tree-node-title:has-text("test") div').nth(1).hover();
  await page.locator('nz-tree-node-title:has-text("test") svg').hover();
  await page.locator('#cdk-overlay-2').getByText('Edit').click();
  await page.getByLabel('Group Name').fill('parentGroup');
  await page.getByLabel('Group Name').press('Enter');

  //Add subGroup
  await page.locator('nz-tree-node-title:has-text("parentGroup") div').nth(1).hover();
  await page.locator('nz-tree-node-title:has-text("parentGroup") svg').hover();
  await page.getByText('Add Subgroup').click();
  await page.getByLabel('Group Name').click();
  await page.getByLabel('Group Name').fill('subGroup');
  await page.getByLabel('Group Name').press('Enter');

  //Delete group
  await page.locator('nz-tree-node-title:has-text("parentGroup") div').nth(1).hover();
  await page.locator('nz-tree-node-title:has-text("parentGroup") svg').hover();
  await page.locator('a:has-text("Delete")').click();
  await page.getByRole('button', { name: 'Confirm' }).click();
  
  //TODO
  //Sort group
  await page.locator('nz-tree-node:nth-child(2) > .draggable > div > .tree_node').dragTo(page.locator('.absolute'));
});
