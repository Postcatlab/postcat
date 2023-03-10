import { test, expect } from '@playwright/test';

import { ifTipsExist, login } from './commom.util';
test('User Opeate', async ({ page }) => {
  await page.goto('/');

  //Login
  await login(page);

  //Change Pasword
  await page.locator('eo-iconpark-icon[name="setting"]').click();
  await page.getByText('New password', { exact: true }).click();
  await page.getByText('New password', { exact: true }).fill('123456');
  await page.getByText('New password', { exact: true }).press('Tab');
  await page.locator('nz-form-item').filter({ hasText: 'Confirm new password' }).getByRole('textbox').fill('123456');
  await page.getByRole('button', { name: 'Change' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await ifTipsExist(page, 'Password reset success !');

  //Logout
  await page.locator('pc-btn-user').getByRole('button').click();
  await page.getByText('Sign Out').click();
  await ifTipsExist(page, 'Successfully logged out !');

  //Error Login
  await page.getByRole('button', { name: 'Sign in/Up' }).click();
  await page.getByPlaceholder('Enter Email').click();
  await page.getByPlaceholder('Enter Email').fill('i am error msg');
  await page.getByPlaceholder('Enter Email').press('Tab');
  await page.getByPlaceholder('Enter password').fill('123456');
  await page.getByPlaceholder('Enter password').press('Enter');
  await ifTipsExist(page, 'Username must a email');
});
