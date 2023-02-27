## 使用步骤

### 环境配置

1. 全局安装 ark 工具包：`yarn add ark-pkg --global`
2. 在 /e2e 目录下安装playwright的相关依赖：`yarn`

另：为了让测试用例有语法高亮，请将其命名为 .t 后缀。

### 运行

运行已有的所有测试用例，在 /e2e 目录下执行：
```bash
$ ark mikasa ./ # 编译用例
$ yarn test     # 运行用例

```
即可运行并打印出测试报告

另一种情况是，需要单独运行某一个用例，在这种模式下，编译后的代码可以使用 NodeJS 直接运行，多数用在排查问题或写用例时单独看运行效果。

```
$ ark mikasa ./ -d # debug 模式编译
$ node xxx.test.js
```
