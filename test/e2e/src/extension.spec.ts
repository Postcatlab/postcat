import { test, expect } from '@playwright/test';
const installExtension = async () => {
  await page.getByRole('button', { name: 'Extensions' }).click();
  await page
    .locator('eo-extension-list div')
    .filter({ hasText: 'ChatGPT RobotPostcat 320 This extension allows you to chat with ChatGPT in Postc' })
    .nth(3)
    .click();
  await page.getByRole('button', { name: 'Install' }).click();
};
test.describe('Extension Operate', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/');
  });

  test('Basic Operate', async ({ page }) => {
    //Install Extension
    //Close Extension
    //Open Extension
    //Uninstall Extension
    //Switch Extension Type
    //Search Extension
  });
  test('Sync URL From TEST', async ({ page }) => {});
  test('Import Swagger', async ({ page }) => {});
  test('APISpace Extension', async ({ page }) => {});
});
