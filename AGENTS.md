# AGENTS.md — Blipola（儿童离线学习玩伴 PWA）

面向所有在这个仓库干活的人与 AI（Hermes、ChatGPT、Meta AI …）。动手前先读这份。

## 这是什么
儿童友好的**离线优先学习伙伴 PWA**：纯静态 vanilla HTML/CSS/JS —— `index.html` + `js/*.js` +
`manifest.json` + `sw.js`。无框架、无依赖、无 build。
线上：https://yanbing2026.github.io/Blipola/

## 构建
**没有构建步骤**。源码即产物；推进 `main` 由 GitHub Pages 自动发布。
**不要引入 bundler / package.json**（现在全是浏览器原生代码，加了只会多一层要维护的东西）。

## 测试
没有自动化测试。手工验证：本地起静态服务打开 `index.html`，跑主流程
（Let's Learn / Hint / Daily Quest / Parent 四个入口），并确认**断网后仍能用**（离线是这个产品的前提）。

## 发布
GitHub Pages：分支 `main` + 目录 `/`。合并进 `main` 即上线 —— 别指望未合并的 PR 改变线上。

## 绝不手改的生成文件
没有生成文件（没有 build）。但 `sw.js` 的缓存清单（`CACHE` / `ASSETS` 列表）是**手工维护**的：
新增或改名 `js/*.js` 时必须同步更新，否则离线缓存会漏文件或吃到旧版本 —— 这是这个仓库最容易出的错。
动了缓存内容就同时 bump 版本号，保证老用户能拿到新资源。

## 流程（main 已保护）
1. 开分支（`feat/…`、`fix/…`）→ 提交 → 开 PR。**不要直接推 `main`**（已禁止直推/强推/删分支，对管理员同样生效）。
2. PR 里写清：改了什么 + 怎么手工验证的（含离线检查）。
3. 仓库里不放任何密钥，也不引入外部 AI API（孩子用的东西，保持零依赖离线）。
