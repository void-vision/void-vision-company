# Void Island 互动演示

本组件复用正式产品官网的桌面、AI 会话、Git、保持唤醒和窗口拖动实现，独立嵌入公司官网。仅操作网页中的虚构示例，不连接终端、Git 仓库或系统电源设置。

- 双语文案与示例会话集中在 `src/content/site.ts`，服务端按当前语言传入；客户端只接收当前语言。
- `demo.css` 来自同一套产品演示样式，仅保留演示使用的规则，并限制在 `.island-demo` 区域内。
- 所有品牌图标和原生符号均自行托管，第三方图标授权见对应素材目录中的 LICENSE。
- 窗口标题栏支持鼠标／触控拖动、方向键调整、Shift 加速和 Escape 取消；重置示例会恢复窗口位置。

产品官网：[voidisland.app](https://voidisland.app/)；公开展示仓库：[void-vision/void-island](https://github.com/void-vision/void-island)。
