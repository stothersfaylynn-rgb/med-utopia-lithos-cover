# 专家策展闭环浏览器 QA

验证日期：2026-06-24（Asia/Shanghai）

## 覆盖矩阵

| 页面 | 视口 | 主题 | 结果 |
|---|---:|---|---|
| `/curators` | 1280×720 | Light / Dark | 通过 |
| `/curators` | 390×844 | Light / Dark | 通过 |
| `/cases?curator=zhou-heng` | 1280×720 | Light / Dark | 通过 |
| `/cases?curator=zhou-heng` | 390×844 | Light / Dark | 通过 |
| `/apply?source=curators&type=curation&expert=zhou-heng` | 1280×720 | Light / Dark | 通过 |
| `/apply?source=curators&type=curation&expert=zhou-heng` | 390×844 | Light / Dark | 通过 |

## 运行时结果

- 策展页：一个 `h1`、三条 `article[data-expert-slug]`；桌面三栏、移动单栏；所有策展操作 44px；两种视口均无横向溢出。
- 策展案例：合法 `curator=zhou-heng` 保留在 URL 中，只显示 `case-001` 并播报 `共 1 条案例`；移动端操作 44px，整行链接在桌面/移动均高于 44px。
- 策展申请：显示 `来自策展：周衡（Mock）`，仅“专家策展”默认选中；桌面/移动提交按钮均为 48px。
- 本地确定性提交进入 `/apply?status=success&source=curators&type=curation&expert=zhou-heng`，显示 `申请已提交`，不保留表单，并提供 `/curators` 返回链接。
- `/work` 仍为五个模块、单一当前模块，并保留纵向/螺旋进度变量；只新增一个专家策展真实链接，美学引擎仍无真实入口。
- 上述页面在 Light、Dark 下均无横向溢出和控制台警告/错误。

## 画面证据

- `curators-desktop-dark.jpg`
- `curators-desktop-light.jpg`
- `curators-mobile-dark.jpg`
- `curators-mobile-light.jpg`
