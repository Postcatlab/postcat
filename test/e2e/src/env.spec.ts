import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:4200/');

  //Add env
  await page.locator('a').filter({ hasText: 'Environment' }).click();
  await page.getByRole('banner').getByRole('button').click();
  await page.getByLabel('Name').fill('test');
  await page.getByLabel('Host').click({ timeout: 1000 });
  await page.getByLabel('Host').fill('www.baidu.com');
  await page.getByPlaceholder('Name').click({ timeout: 1000 });
  await page.getByPlaceholder('Name').fill('globalName');
  await page.getByPlaceholder('Value').first().dblclick();
  await page.getByPlaceholder('Value').first().fill('globalVariable');
  await page.getByPlaceholder('Description').first().click();
  await page.getByPlaceholder('Description').first().fill('globalDescription');
  await page.getByRole('button', { name: 'Save' }).click();
});
