# 学术挑战闭环浏览器 QA

验证日期：2026-06-24（Asia/Shanghai）

## 覆盖矩阵

| 页面 | 视口 | 主题 | 结果 |
|---|---:|---|---|
| `/challenges` | 1280×720 | Light / Dark | 通过 |
| `/challenges/acute-aortic-dissection-triage` | 1280×720 | Light / Dark | 通过 |
| `/challenges` | 390×844 | Light / Dark | 通过 |
| `/challenges/acute-aortic-dissection-triage` | 390×844 | Light / Dark | 通过 |

## 运行时结果

- 桌面列表：`scrollWidth=1280`，`scrollHeight=743`，一个 `h1`，最小主要操作区 44px。
- 桌面详情：`scrollWidth=1280`，`scrollHeight=1287`，一个 `h1`，最小主要操作区 44px。
- 移动列表：`scrollWidth=390`，`scrollHeight=1423`，一个 `h1`，最小主要操作区 44px。
- 移动详情：`scrollWidth=390`，`scrollHeight=2376`，一个 `h1`，最小主要操作区 44px。
- 四种页面/视口组合在 Light、Dark 下均无横向溢出和控制台错误。
- 分类筛选写入稳定 URL；无记录分类显示 0 条空状态；重置恢复 3 条任务卷宗。
- 挑战详情进入申请页后，来源标题、模块预选和成功态返回链接均保留挑战上下文。
- `/work` 仍为五个模块、单一当前模块，并保留原纵向/螺旋进度变量。

证据图片与本文件同目录保存。
