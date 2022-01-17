const { test, expect } = require('@playwright/test');
const thisSymbol = Date.now().toString().slice(-5);

test('Add env', async ({ page }) => {
  // Go to http://localhost:4200/
  await page.goto('http://localhost:4200/');

  // Go to http://localhost:4200/home/api/test
  await page.goto('http://localhost:4200/home/api/test');

  // Click text=Null
  await page.click('text=Null');

  // Click text=管理环境变量
  await page.click('text=管理环境变量');

  // Click text=新建环境
  await page.click('text=新建环境');

  // Click input[name="name"]
  await page.click('input[name="name"]');

  // Fill input[name="name"]
  await page.fill('input[name="name"]', `测试环境${thisSymbol}`);

  // Click input[name="hostUri"]
  await page.click('input[name="hostUri"]');

  // Fill input[name="hostUri"]
  await page.fill('input[name="hostUri"]', `http://testenv-${thisSymbol}.com`);

  // Click td input[type="text"]
  await page.click('td input[type="text"]');

  // Fill td input[type="text"]
  await page.fill('td input[type="text"]', 'aaa');

  // Click text=环境名称前置URL环境变量：在接口文档或测试的过程中，使用{{变量名}}即可引用该环境变量 变量名 变量值 参数说明 操作 >> :nth-match(input[type="text"], 4)
  await page.click(
    'text=环境名称前置URL环境变量：在接口文档或测试的过程中，使用{{变量名}}即可引用该环境变量 变量名 变量值 参数说明 操作 >> :nth-match(input[type="text"], 4)'
  );

  // Click text=环境名称前置URL环境变量：在接口文档或测试的过程中，使用{{变量名}}即可引用该环境变量 变量名 变量值 参数说明 操作 >> :nth-match(input[type="text"], 4)
  await page.click(
    'text=环境名称前置URL环境变量：在接口文档或测试的过程中，使用{{变量名}}即可引用该环境变量 变量名 变量值 参数说明 操作 >> :nth-match(input[type="text"], 4)'
  );

  // Fill tbody tr >> :nth-match(input[type="text"], 2)
  await page.fill('tbody tr >> :nth-match(input[type="text"], 2)', 'bbb');

  // Click div[role="document"] button:has-text("保存")
  await page.click('div[role="document"] button:has-text("保存")');

  // * 添加第二条数据
  // Click text=新建环境
  await page.click('text=新建环境');

  // Fill input[name="name"]
  await page.fill('input[name="name"]', `测试环境${thisSymbol}2`);

  // Click input[name="hostUri"]
  await page.click('input[name="hostUri"]');

  // Fill input[name="hostUri"]
  await page.fill('input[name="hostUri"]', `http://testenv-${thisSymbol}2.com`);
  await page.click('div[role="document"] button:has-text("保存")');
});
