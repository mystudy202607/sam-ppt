# Sam's Home 🏠

个人学习与生活管理主页：单文件 HTML，零依赖，所有数据保存在浏览器 localStorage（刷新不丢失）。

## 功能（底部 10 个标签）
- 📚 资源库：收藏课程 / PDF / 思维导图 / 工具网站 / 刷题题库，支持搜索
- 💰 开支助手：记账 + 本周每日支出柱状图
- 📝 待办事项：艾森豪威尔四象限（重要/紧急）
- 🎯 学习区：作业管理（待做/已完成）+ 番茄钟（25/5）
- 📅 每日规划：时间轴 + 高/中/低待办 + 完成进度 + 历史查看（另见 daily-planner.html，数据互通）
- 🎵 歌单：本地音乐播放器，支持缩小为可拖拽悬浮小窗
- 🎡 休闲娱乐：幸运转盘（可自定义区块）
- 📖 背单词：艾宾浩斯分组循环复习（每组 20 个，每词每轮 12 遍，难度/错题加权，支持 Enter 快捷键与位置记忆）
- 🏆 计划榜：短期/长期计划自动分类 + 点击卡片弹出任务清单（毛玻璃模态框）
- 👤 关于我：静态信息 + 自动生成的自我认知报告

顶栏提供：一键保存、导出/导入备份（JSON）、导出报告（打印为 PDF）。

## 使用
直接双击 `index.html` 用浏览器打开，或把 `file:///.../index.html` 粘贴到地址栏。
- 首次打开会自动导入 `words-manifest.js` 里的单词（236 个）与本地歌单清单。
- 歌曲文件未随仓库上传：`music-manifest.js` 指向本地 `../music/mp3/` 文件夹。
- `daily-planner.html` 是独立的每日规划页，与主页共用 `planner_*` 数据。

## 文件说明
| 文件 | 说明 |
| --- | --- |
| index.html | 主页（全部 CSS/JS 内嵌） |
| daily-planner.html | 每日规划独立页 |
| music-manifest.js | 本地歌单清单（自动生成） |
| words-manifest.js / words-import.txt | 单词清单（自动生成） |
| samhome-playlist-backup.json | 歌单备份（可经「导入备份」恢复） |
| start-server.ps1 | 可选：本地 HTTP 服务启动脚本（http://127.0.0.1:8000/） |

## ☁️ Neural Pulse 云同步（Evorozen Apex Buildathon）

主页已按赛事要求把核心数据层接入 [Neural Pulse Virtual DB](https://pulse.evorozen.com/docs)：

- 9 类数据（资源库 / 开支 / 待办 / 作业 / 单词 / 计划榜 / 歌单 / 转盘 / 每日规划）映射为云端表；
- localStorage 仅作离线缓存；每次增删改自动排队同步，断网恢复后自动补传；
- 同步采用官方标准流程：`drop_table` → 确定性 `create_schema` → `bulk_insert`（2026-09-06 实测可用）；
- API 密钥仅存本机浏览器（不写入源码）；顶栏「☁️ 云同步」上传、「⤵ 下载」拉取，双击「☁️ 云同步」可配置 API 地址与密钥。

### 在线部署（推荐 Vercel，附同源代理）

官方 `/api/neural` 目前未返回 CORS 头，浏览器直接调用会被拦截。仓库内置同源代理解决：

- `api/neural.js`：Vercel Serverless 函数，转发请求并补上 `Access-Control-Allow-Origin: *`；
- `vercel.json`：Vercel 配置。

部署步骤：
1. 用 GitHub 账号登录 [vercel.com](https://vercel.com)，点击 **Add New → Project**；
2. Import 本仓库 `mystudy202607/sam-ppt`，框架选 **Other**，直接 Deploy；
3. 部署完成后打开网站，双击「☁️ 云同步」→ API 地址填 `/api/neural` → 填入密钥 → 点「☁️ 云同步」。

注意：线上环境不含本地歌曲文件（`music-manifest.js` 指向本地 `../music/mp3/`），歌单会显示但本地歌曲无法播放；可自行在歌单中添加在线 MP3 链接。
