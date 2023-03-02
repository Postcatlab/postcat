import { test, expect } from '@playwright/test';
/**
 * Basic
 */
test('test', async ({ page }) => {
  await page.goto('http://localhost:4200/');
  await page.getByText('COVID-19 national epidemic').click();
  await page.getByRole('link', { name: 'Test' }).click();
  const responsePromise = page.waitForResponse('**/api/unit');
  await page.getByRole('button', { name: 'Send' }).click();
  const request = await responsePromise;
  const res = await request.json();
  await page.screenshot({ path: './images/unit-test-basic.png', fullPage: true });
});
/**
 * XML
 */
/**
 * JSON
 */
/**
 * FORM-DATA
 */
/**
 * BINARY
 */
