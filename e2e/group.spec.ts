import { test, expect } from '@playwright/test';
test('test', async ({ page }) => {
  page = page as import('playwright').Page;
  await page.goto('http://www.postcat.com');
  await page.locator('body').click();
  //Add group
  await page.locator('eo-api-group-tree:has-text("GET获取城市今日天气GET新冠全国疫情") path').nth(1).hover();
  await page.getByText('新建分组').click();
  await page.getByLabel('分组名称').click();
  await page.getByLabel('分组名称').fill('test');
  await page.getByRole('button', { name: '确认' }).click();
  await page.waitForTimeout(1000);
  await page.locator('body').click();
  // await page.locator('nz-tree-node-title:has-text("test") svg').hover();
  await page.locator('nz-tree-node-title:has-text("test") circle').nth(1).hover();
  await page.getByText('添加子分组').click();
  await page.getByLabel('分组名称').click();
  await page.getByLabel('分组名称').fill('test1');
  await page.getByRole('button', { name: '确认' }).click();
  await page.waitForTimeout(1000);
  await page.locator('nz-tree-node-title:has-text("test1") svg').hover();
  //Delete group
  await page.locator('a:has-text("删除")').click();
  await page.getByRole('button', { name: '确认' }).click();
});
