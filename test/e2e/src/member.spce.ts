import { test, expect } from '@playwright/test';

import { login } from './commom.util';
test.describe('Member Operate', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });
  test('Workspace Member', async ({ page }) => {
    //Login
    await login(page);
    //Switch to cloud workspace
    //Add member to workspace
    //Change role,default
    //Remove member
    //Add Member
    //Login with new member
    //Quit workspace
  });
  test('Project Member', async ({ page }) => {
    //Add member to workspace
    //Add member to project
  });
});
