# 医学理想国 Work 页交接文档

更新时间：2026-06-20

## 下一轮目标

下一轮只处理一件事：让当前模块左右两边浮现的第二层信息，与中间主模块形成更明确的视觉区分。

这是审美调整。按照项目约束，必须先生成预览图并取得确认，再修改代码。

## 不可破坏的边界

- 只改 `/work`，不要改 `/` 首页封面。
- 保留现有 `ProductGallery`、`activeIndex`、`galleryWorks` 和 `work-slab` 阶梯结构。
- 当前模块仍是第一层视觉主体，左右 dossier 只是第二层补充信息。
- 保留同屏的上一个、当前、下一个模块及空间纵深关系。
- 不要改成单卡片页面，不要增加底部模块条。
- 保留现有顶部导航，不重新设计导航。
- 不恢复左下角“你想进入哪个现场？”导航。
- `美学引擎` 与其他模块同层级，不增加上传入口。
- 尽量不要改动 `is-above`、`is-below`、`is-deep` 的位置、透明度和动效。

## 当前页面状态

项目是 React + Vite 前端，包含两个页面：

- `/`：Lithos 首页封面，由 `src/HomePage.tsx` 负责。
- `/work`：沉浸式阶梯模块展厅，由 `src/ProductGallery.tsx` 负责。

Work 页当前有 5 个同层级模块：

1. 避雷案例
2. 专家点评
3. 学术挑战
4. 专家策展
5. 美学引擎

滚动时，中间聚焦模块保持在视口中心；相邻模块在左上和右下露出，形成阶梯和纵深。只有当前模块显示左右 dossier。

## 本轮完成内容

- 为每个 `galleryWork` 增加 `leftDossier` 和 `rightDossier` 数据。
- 删除左下角“你想进入哪个现场？”导航及输入框。
- 桌面端在当前模块左右显示暗色玻璃 dossier。
- 移动端把两份 dossier 放在当前模块下方。
- 为 `美学引擎` 增加：
  - 医学表达重构
  - 报告结构
  - PPT 重排
  - 科研海报
  - 当前内测中
  - 不开放上传
- 没有增加任何上传入口。

## 最近修复的滚动问题

用户曾反馈从上往下滑时模块位置混乱、模块名不在中间、左右内容被覆盖。

根因有两个：

1. 当前模块的 `--spiral-current-x` 和 `--spiral-current-y` 会随索引漂移。
2. 原生滚动和额外的 `wheel` 监听同时修改 `activeIndex`，两套状态互相争抢。

当前修复：

- 所有当前模块统一使用 `--spiral-current-x: 0vw` 和 `--spiral-current-y: 0vh`。
- 删除直接切换模块的 `wheel` 监听，只依据真实 `scrollY` 更新 `activeIndex`。
- 右侧 dossier 向左避开滚动指示轨道。
- dossier 使用固定视口层，避免跟随某块阶梯卡片发生错误位移。

不要重新引入独立的滚轮切换逻辑，也不要让当前模块重新随索引漂移。

## 关键文件

### `src/ProductGallery.tsx`

- 管理 `activeIndex`。
- 根据真实页面滚动位置更新当前模块。
- 渲染 5 个 `work-slab`。
- 只为 `activeWork` 渲染一组 `.left-dossier` 和 `.right-dossier`。
- 写入当前场景 CSS 变量，包括：
  - `--vertical-progress`
  - `--spiral-progress`
  - `--spiral-current-x`
  - `--spiral-current-y`

### `src/galleryContent.ts`

- 保存 5 个 `galleryWorks`。
- 每项都包含 `leftDossier` 和 `rightDossier`。
- 下一轮如只做视觉区分，通常不需要改这里的文案或数据结构。

### `src/index.css`

下一轮优先检查：

- `.spiral-stair-gallery .dossier-layer`
- `.spiral-stair-gallery .work-dossier`
- `.spiral-stair-gallery .left-dossier`
- `.spiral-stair-gallery .right-dossier`
- `.spiral-stair-gallery .gallery-depth .work-slab.is-current`
- 移动端 `@media (max-width: 720px)` 内对应 dossier 规则

当前 dossier 是暗色玻璃、细线、低透明度、按模块 accent 着色的辅助层。下一轮应通过材质、边框、光晕、字号、透明度或空间层级区分它与主模块，但不能让 dossier 比主模块更亮、更大或更实。

### `src/App.test.tsx`

覆盖以下回归：

- 首页保持不变。
- Work 页保留 5 个阶梯模块。
- 旧左下角导航已删除。
- 当前模块显示两份 dossier。
- 滚轮事件本身不会绕过真实滚动位置直接切换模块。
- 滚动到每个索引时当前模块保持在中心。
- `美学引擎` 包含“不开放上传”。

## 下一轮建议流程

1. 先运行现有页面并截取桌面端当前状态。
2. 基于同一构图生成一张忠实预览图，只调整 dossier 与主模块的视觉区分。
3. 让用户确认预览图。
4. 确认后只改 dossier 相关 CSS，除非预览方案确实要求极小的结构调整。
5. 用真实连续滚动验证 5 个模块，不要只靠测试或直接设置状态。
6. 检查桌面端遮挡、主模块居中和移动端抽屉布局。

## 验证命令

```bash
PATH=/Users/eliyah/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH node_modules/.bin/vitest run
PATH=/Users/eliyah/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH node_modules/.bin/tsc --noEmit -p tsconfig.app.json
PATH=/Users/eliyah/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH node_modules/.bin/vite build
```

本地预览：

```bash
PATH=/Users/eliyah/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH node_modules/.bin/vite --host 127.0.0.1
```

打开 Vite 输出的地址并进入 `/work`。

## Git 范围

本轮应提交：

- `src/App.test.tsx`
- `src/ProductGallery.tsx`
- `src/galleryContent.ts`
- `src/index.css`
- `HANDOFF.md`

不要提交：

- `tmp/`
- `backups/pre-product-gallery-20260618-105356/`
- `backups/pre-vertical-scroll-gallery-20260618-113903/`
