import { Page, expect, test } from '@playwright/test';
// test.describe('Env Operate', () => {
//   const url = new URL(ECHO_API_URL);
//   test.beforeEach(async ({ page }) => {
//     await page.goto('/');
//   });
//   test('Baisc Opeate', async ({ page }) => {});
//   test('Fixed Tab', async ({ page }) => {});
//   test('Unsaved Tab', async ({ page }) => {});
//   test('Unsaved Tab', async ({ page }) => {});
// });

async function addTab(page: Page) {
  await page.waitForTimeout(500);
  const addIcon = await page.waitForSelector('.ant-tabs-nav.ng-star-inserted eo-iconpark-icon[name="add"]');
  const addButton = await addIcon.$('xpath=..');
  await addButton?.click();
}

async function renameTab(page: Page, text: string, notSave?: boolean) {
  await page.waitForTimeout(200);
  const urlInput = await page.waitForSelector('input[name="uri"]');
  await urlInput.fill(text);
  if (!notSave) await saveTabAsApi(page, text);
}

async function saveTabAsApi(page: Page, text: string) {
  await page.getByRole('button', { name: 'Save as API' }).click();
  const urlInput = await page.waitForSelector('input[name="name"]');
  await urlInput.fill(text);
  await page.getByRole('button', { name: 'save' }).click();
}

async function getTabNum(page: Page) {
  const tabs = await page.$$('.tab-text');
  return tabs.length;
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Got it' }).click();
});

test.describe('Tab Test', () => {
  test('tab cache', async ({ page }) => {
    await addTab(page);
    await page.reload();
    expect(await getTabNum(page)).toBe(2);
  });

  test('tab remove, click mouse middle button', async ({ page }) => {
    const testPath = '/test';
    await addTab(page);
    await renameTab(page, testPath, true);
    await page.getByText(testPath).click({ button: 'middle' });
    await page.getByRole('button', { name: "Don't Save" }).click();
    expect(await getTabNum(page)).toBe(1);
  });

  test('tab switch', async ({ page }) => {
    const firstTabName = 'first';
    const secondTabName = 'second';
    await renameTab(page, firstTabName);
    await addTab(page);
    await renameTab(page, secondTabName);
    await page.getByText(firstTabName).click();
    await page.getByText(secondTabName).click();
  });
});
