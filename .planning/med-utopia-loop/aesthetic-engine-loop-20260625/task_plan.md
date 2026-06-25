# 美学引擎闭环 · Task Plan

## Stage Contract

- 目标：把 `/aesthetic-engine` 做成一个独立的 Coming Soon 预告页，参考 CodePen 的鼠标图片拖尾效果，中间显示“敬请期待”，拖尾图片替换为医学理想国主题图像，并严格适配现有 Light/Dark 两套语义色体系。
- 范围：`/aesthetic-engine` 路由、预告页、主题图片资产、现有申请表单的 `module=aesthetic-engine` 入口、`/work` 美学引擎卡片目的地、测试和验证证据。
- 排除：上传文件、文件列表、真实生成流程、价格/支付、登录、聊天、真实医学文件处理、患者数据、AI 诊断或交付承诺。
- 参考行为：鼠标移动达到距离/时间阈值时生成一张图片卡，卡片使用固定 2:3 竖向画幅，参考桌面尺寸约 `200×300`，内部图片 `object-fit: cover`，只做轻微缩放、旋转、淡出并自动清理；移动端同比缩小，reduced-motion 使用静态或低动效降级。
- 审美门槛：已生成桌面、移动和 Light/Dark 双主题预览图；等待用户明确确认后才进入产品 UI 代码。
- 提交策略：用户已授权“全部通过后提交并推送当前分支”；本阶段采用最终一次性精确暂存、提交和推送。

## Tasks

1. **T01 Stage Contract and Preview Approval**：确认范围、预览和硬门槛。
2. **T02 Medical Theme Image Asset Pack**：生成并保存正式医学主题拖尾图片资产。
3. **T03 Aesthetic Engine Route Contract**：接通 `/aesthetic-engine` 路由和导航当前态。
4. **T04 Reference-Inspired Coming Soon Surface**：实现中心文案和参考式图片拖尾交互。
5. **T05 Application Handoff and Work Entry**：接申请内测意向和 `/work` 入口。
6. **T06 Motion, Accessibility, and Responsive Verification**：完成测试、浏览器、移动、reduced-motion 验证。
7. **T07 Dependency Closure, Exact Commit, and Push**：更新交接、精确提交、干净验证、推送当前分支。

## Preview Gate

预览文件：

- `docs/previews/aesthetic-engine-loop/direction-a-desktop.png`
- `docs/previews/aesthetic-engine-loop/direction-a-mobile.png`
- `docs/previews/aesthetic-engine-loop/direction-a-dual-theme-board.png`
- `docs/previews/aesthetic-engine-loop/direction-b-fixed-card-system.png`

当前状态：等待用户确认此方向，尤其确认 Light/Dark 双主题适配和固定 2:3 拖尾卡片系统。确认后从 T02 继续；如不确认，先重出预览，不写产品 UI 代码。
