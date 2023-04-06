import { test, expect, chromium } from '@playwright/test';

import { adaTabledRow, addEnv, addTextToEditor, ECHO_API_URL, ifTipsExist } from '../utils/commom.util';
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Got it' }).click();
});
/**
 * Basic Test
 */
test('Websocekt Test', async ({ page }) => {
  await page.locator('eo-tab').getByRole('button').first().hover();
  await page.getByText('Websocket').click();

  //Connect
  await page.getByPlaceholder('Enter URL').click();
  await page
    .getByPlaceholder('Enter URL')
    .fill('wss://demo.piesocket.com/v3/channel_1?api_key=VCXCEuvhGcBDP7XhiJJUDvR1e1D3eiVjgZ9VRiaV&notify_self=');
  await page.getByRole('button', { name: 'Connect' }).click();
  await ifTipsExist(page, 'Connected to');

  //Send Body
  await addTextToEditor(page, 'i am a body');
  await page.getByRole('button', { name: 'Send' }).click();
  await page.getByRole('list').getByText('i am a body').isVisible();

  //Disconnect
  await page.getByRole('button', { name: 'Disconnect' }).click();
  await ifTipsExist(page, 'Disconnect from');
});
