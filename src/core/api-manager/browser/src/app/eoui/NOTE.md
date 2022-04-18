## Table

功能复杂的组件，如表格，其接口尽可能设计成数据驱动的，减少业务层的动作。

- [x] 数据驱动
- [x] 自定义插槽
- [x] 支持虚拟滚动
- [x] 控制页脚的隐藏与显示
- [x] 筛选条件控制
- [x] 树状展示
- [x] 复制单元格内容
- [x] 行信息描述
- [x] 通过在 columns 数据结构中添加`isExpand`, 支持在列表指令某列进行树状的展开和收缩
- [x] 内置支持行内编辑
- [ ] 拖动排序
- [ ] 单元格内嵌套下拉框
- [ ] 关于树状展示的功能，Antd 官方提供的例子所使用的算法会合成一个比较臃肿的数据结构，后续可以尝试进行算法和数据结构的优化。

```
{
  filterType: type, // * 子组件支持
  filterFn: () => {}  // * 可选
}
```

## Ace

在 config 中可以配置许多属性，但如果其他属性与 config 同时绑定在模板中，其他属性会覆盖 config
disabled 属性不算在 config 中

```
(blur)
(focus)
(copy)
(paste)
(change)
(changeSession)
(changeCursor)
(changeSelection)
```
