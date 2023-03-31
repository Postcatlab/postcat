// remote.setup.ts
import { test as setup } from '@playwright/test';

import { login } from './commom.util';

const authFile = 'playwright/.auth/user.json';

// setup('authenticate', async ({ page }) => {
//   // Perform authentication steps. Replace these actions with your own.
//   await page.goto('/');
//   await login(page);

//   // End of authentication steps.

//   await page.context().storageState({ path: authFile });
// });
