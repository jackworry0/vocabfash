# VocabFlash / 词汇自查：iPhone PWA（稳定性修复版）

这是一个部署在 GitHub Pages 上的静态网页应用，可以通过 iPhone 的 Safari 添加到主屏幕。
本版本保留了原来的 9 个单词、单词卡、自我测验、掌握/待复习标记、添加/删除词条、JSON 导入导出及基础离线使用功能。

## 这次修复

- 修复删除全部单词或导入空词库时卡片报错的问题；已清空的词库也不再在刷新后自动恢复成初始词库。
- 四选一测验要求至少 4 个不同中文释义，以确保确实出现 4 个选项；修改测验按钮的提示文本。
- 答对测验题不再意外清除手动设置的“已掌握”状态；答错会标记待复习。
- 导入 JSON 时检查词条结构、重复单词，并在覆盖已有词库前询问确认。
- 改进 JSON 备份下载行为，升级 Service Worker 缓存为 `vocabflash-cache-v3`，在线网络优先、离线使用缓存。
- 保留原本的本地存储键名 `vocabflash_pwa_v1`，避免升级后把已有词库当成新用户数据。

## Windows 电脑上的 GitHub Pages 更新（不用终端）

1. **先备份**：在当前网站打开“词库管理”→“导出备份”，保存 `vocabflash-backup.json` 到电脑或其他安全位置。尤其是有个人新增词条时，这一步很重要。
2. 在电脑上解压新 ZIP，进入解压出来的文件所在位置。新版 ZIP 的文件直接放在顶层，没有额外套一层项目文件夹。
3. 登录 GitHub，打开已有的 `vocabflash` 仓库首页，确保停留在仓库最外层（根目录）。
4. 点击 **Add file → Upload files**（添加文件 → 上传文件），把文件夹内部的 `index.html`、`manifest.json`、`sw.js`、`icon-192.png`、`icon-512.png` 和 `README.md` 拖进去。**不要只上传整个 ZIP，也不要把 `vocabflash-iphone` 文件夹多套一层。**
5. 按页面提示提交更改，点击 **Commit changes** 保存。若 GitHub 网页提示与原文件重名且无法上传，请暂时不要删除已有文件，可以截图告诉 AI 助手，再按提示逐个替换；请确保仓库根目录最后只有一套同名文件。
6. 在 **Settings → Pages** 检查是否为 **Deploy from a branch → main → /(root)**；部署完成后打开 Pages 页面提供的 HTTPS 地址。
7. 用 iPhone Safari 打开网站，联网刷新一次，测试三个标签、单词卡、测验、导入/导出等按钮。若主屏幕图标依然是旧版本，可以移除原快捷方式，再从 Safari 的“分享”菜单 → **添加到主屏幕**。

> **注意**：替换网页文件通常不会删除 Safari 中的本地词库，但清理 Safari 网站数据、切换域名或更换浏览器可能导致本地数据无法继续读取。请保留 JSON 备份。

## 部署与使用限制

- `index.html`、`manifest.json`、`sw.js` 和图标文件都放在 GitHub 仓库根目录。
- `manifest.json` 中 `start_url` 为 `./index.html`，`scope` 为 `./`，`display` 为 `standalone`，适合 GitHub Pages 仓库子路径。
- 站点必须通过 HTTPS 访问才能正常使用 Service Worker；直接双击本地 HTML 文件不等于完整 PWA 运行环境。
- 首次访问应联网以缓存文件；本应用没有账号或云端同步，不会跨设备自动同步。
- `sw.js` 使用网络优先的缓存策略。以后更新应用静态文件时，建议升级 `CACHE` 名称，以便及时清理旧缓存；iPhone Safari 对主屏幕图标另有缓存，必要时重新添加图标。
- 这里没有内置真实四级真题出处；例句、真题考义等内容需根据可核验资料逐步补充，不应把未核实的内容标成“真题原句”。

## 本地检查记录（不等于线上部署验证）

- `index.html` 内嵌 JavaScript 与 `sw.js` 均通过 Node.js 语法检查；`manifest.json` 解析正常。
- 两个图标已核实是 PNG，尺寸分别为 192×192 和 512×512；原图案未修改。
- 采用 Chromium 页内模拟环境完成 22 项 UI/数据交互测试，结果全部通过（其中包括 JSON 导出、导入、删除全部单词以及四选一）。
- Service Worker 缓存逻辑通过离线回退的模拟单元测试。由于测试环境的浏览器无法访问本地 HTTP 站点，未完成真实联网/断网的浏览器端 Service Worker 集成测试。
- **尚未**在用户的 GitHub Pages 或 iPhone Safari 上验证。请部署后根据步骤实际测试，并优先备份词库。
