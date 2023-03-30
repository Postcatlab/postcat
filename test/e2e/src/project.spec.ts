import { test, expect } from '@playwright/test';
test.describe('Project Operate', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });
  test('Basic Operate', async ({ page }) => {
    //Back to Project List
    //Add project
    //Edit project
    //Delete project
  });
});
