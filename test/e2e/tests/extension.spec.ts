import { test, expect } from '@playwright/test';
const installExtension = async () => {};
test.beforeEach(async ({ page }) => {
  await page.goto('/');
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
test('Import Swagger', async ({ page }) => {
  await page.getByRole('button', { name: 'Tap or drag files directly to this area Only supports importing a single file' }).click();
  await page
    .getByRole('button', { name: 'Tap or drag files directly to this area Only supports importing a single file' })
    .setInputFiles('Postcat-Export-0403.json');
});
test('APISpace Extension', async ({ page }) => {});
test('Export API', async ({ page }) => {
  await page.goto('/');
  await page.locator('a:has-text("Setting")').click();
  await page.getByRole('button', { name: 'Export' }).click();
  await page.getByRole('button', { name: 'Confirm' }).click();
});
