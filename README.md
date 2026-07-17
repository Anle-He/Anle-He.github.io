# Anle He · Personal Academic Homepage

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-2ea44f?logo=github)](https://anle-he.github.io/)
[![License: GPL-3.0](https://img.shields.io/badge/License-GPL--3.0-blue.svg)](LICENSE)

一个部署于 GitHub Pages 的中英双语个人学术主页，采用单页布局展示个人简介、教育与经历、研究方向、论文、项目、奖项及文章笔记。

**在线访问：** [https://anle-he.github.io/](https://anle-he.github.io/)

## 功能特点

- 中英双语内容与语言切换
- 响应式单页布局，支持浅色与深色模式
- 通过 JSON 和 Markdown 维护内容，无需修改页面组件
- 集中管理主题配色与中英文字体
- 使用 GitHub Actions 自动构建并部署至 GitHub Pages
- 发布前自动执行内容校验、代码检查与生产构建

## 技术栈

- React 18 + TypeScript
- Vite 7
- Chakra UI + Emotion
- i18next
- Markdown 内容与自定义 Vite 插件

## 快速开始

### 环境要求

- Node.js 22 或更高版本
- npm（随 Node.js 安装）

### 本地运行

```bash
git clone https://github.com/Anle-He/Anle-He.github.io.git
cd Anle-He.github.io
npm ci
npm run validate
npm run dev
```

开发服务器默认运行于 `http://localhost:5173/`。

### 提交前检查

```bash
npm run validate
npm run lint
npm run audit
npm run build
```

## 可用脚本

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动本地开发服务器 |
| `npm run build` | 执行 TypeScript 检查并生成生产构建 |
| `npm run preview` | 本地预览生产构建 |
| `npm run validate` | 校验站点内容与配置 |
| `npm run lint` | 检查 TypeScript、React、插件及 Vite 配置 |
| `npm run audit` | 检查生产依赖中的高危及以上漏洞 |

## 项目结构

```text
.
├── content/                 # 英文内容、图片与各类条目
│   ├── zh/                  # 中文内容
│   ├── articles/            # 文章笔记
│   ├── projects/            # 项目
│   └── publications/        # 论文
├── plugins/                 # Markdown 与内容图片插件
├── public/                  # 原样复制的静态资源
├── scripts/                 # 内容校验脚本
├── src/                     # 页面组件、模板、样式与国际化配置
├── .github/workflows/       # GitHub Pages 部署工作流
└── vite.config.ts           # Vite 配置
```

## 内容维护

日常更新通常只需修改 `content/` 中的 JSON 或 Markdown 文件。英文内容位于 `content/`，中文对应内容位于 `content/zh/`。

| 内容 | 英文 | 中文 |
| --- | --- | --- |
| 姓名、简介、联系方式与链接 | `content/site.json` | `content/zh/site.json` |
| 个人介绍 | `content/about.md` | `content/zh/about.md` |
| 研究方向 | `content/research.json` | `content/zh/research.json` |
| 教育与经历 | `content/experience.json` | `content/zh/experience.json` |
| 奖项与动态 | `content/awards.json`、`content/news.json` | `content/zh/` 下的对应文件 |
| 论文、项目与文章 | `content/publications/`、`content/projects/`、`content/articles/` | `content/zh/` 下的对应目录 |

图片统一放在 `content/images/`。头像会以圆形显示，建议使用正方形透明背景 PNG，以兼顾浅色和深色模式。

## 主题配置

全站颜色与字体集中定义在 `src/templates/academic/academicTheme.ts`：

- `palette.accent`：浅色模式强调色
- `palette.accentSoft`：深色模式强调色
- 其余字段：页面背景、卡片、边框及文字颜色

文字选中高亮色同样取自 `palette.accent`，修改强调色后会自动同步。

## 部署

推送至 `main` 后，GitHub Actions 工作流 `Build and Deploy to GitHub Pages` 会自动：

1. 安装锁定版本的依赖；
2. 校验内容并阻止占位信息发布；
3. 执行代码检查与生产构建；
4. 将 `dist/` 部署至 GitHub Pages。

工作流会自动适配用户主页仓库与普通项目仓库的 URL 前缀。部署状态可在仓库的 **Actions** 页面查看。

## 来源与许可

本项目基于并参考以下开源项目：

- [H-Freax/TermHub](https://github.com/H-Freax/TermHub)：代码基础、内容组织、中英双语支持与终端风格交互
- [Xin-Jiaqi/minimal-academic-homepage](https://github.com/Xin-Jiaqi/minimal-academic-homepage)：学术主页的信息结构与简洁视觉设计

项目采用 [GNU General Public License v3.0](LICENSE)。完整的上游来源、版权与修改说明见 [NOTICE.md](NOTICE.md)。参与贡献前请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)，安全问题请参考 [SECURITY.md](SECURITY.md)。

> [!IMPORTANT]
> 请勿提交密码、令牌、私钥、未公开数据或其他不希望公开的信息。发布头像、论文插图、机构 Logo 和文字内容前，请确认拥有相应的公开使用权。
