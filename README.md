# Anle He | Personal Academic Homepage

这是一个部署在 GitHub Pages 上的中英双语个人学术主页：

[https://anle-he.github.io/](https://anle-he.github.io/)

页面采用单页结构，以个人简介、教育与经历、研究方向、论文、项目和文章笔记为主，
并保留少量终端风格细节。项目基于 TermHub 改造，并参考
minimal-academic-homepage 的学术主页信息组织方式。

## 本地维护

需要 Node.js 22 或更高版本。

```bash
npm install
npm run validate
npm run dev
```

开发地址通常为 `http://127.0.0.1:5173/`。

提交或发布前建议运行：

```bash
npm run lint
npm run audit
npm run build
```

## 内容位置

| 内容 | 英文 | 中文 |
| --- | --- | --- |
| 姓名、简介、邮箱、链接 | `content/site.json` | `content/zh/site.json` |
| 个人介绍 | `content/about.md` | `content/zh/about.md` |
| 研究方向 | `content/research.json` | `content/zh/research.json` |
| 教育与经历 | `content/experience.json` | `content/zh/experience.json` |
| 奖项、动态 | `content/awards.json`、`content/news.json` | 对应的 `content/zh/` 文件 |
| 论文、项目、文章 | `content/publications/` 等目录 | 对应的 `content/zh/` 目录 |

头像和页面图片放在 `content/images/`。头像在页面上以圆形展示，
建议使用正方形图片，透明底 PNG 效果最佳（深色模式下不会露出底色）。
多数日常修改只需要更新 `content/` 目录下的 JSON 或 Markdown 文件。

## 主题与配色

全站颜色集中定义在 `src/templates/academic/academicTheme.ts` 的
`palette` 中，包括强调色（`accent` / 深色模式用 `accentSoft`）与
浅色、深色两套底色、边框和文字颜色。想更换主题色时只需修改
`palette`，无需在组件中逐处查找。唯一的例外是 `src/index.css`
中的文字选中高亮色，需与 `palette.accent` 手动保持一致
（文件内有注释标注）。中英文字体栈也在同一文件中配置。

## 部署到 GitHub Pages

本仓库通过 GitHub Actions 自动部署到 GitHub Pages。日常更新流程：

1. 在本地修改内容或代码。
2. 运行 `npm run validate`、`npm run lint` 和 `npm run build`。
3. 提交并推送到 `main`。
4. 打开仓库 `Actions`，等待 `Build and Deploy to GitHub Pages` 成功。
5. 如果线上页面短时间内仍显示旧内容，通常是 GitHub Pages 缓存，强制刷新或稍等几分钟即可。

工作流会自动适配根域仓库和普通项目仓库的 URL 前缀。
如果姓名或邮箱仍是占位值，工作流会主动停止，避免误发布模板信息。

## 参考项目

本项目的实现与设计参考了以下开源项目，感谢原作者的工作：

- [H-Freax/TermHub](https://github.com/H-Freax/TermHub)：代码基础、内容组织、
  中英双语支持与终端风格交互；原项目采用 `GPL-3.0-only`。
- [Xin-Jiaqi/minimal-academic-homepage](https://github.com/Xin-Jiaqi/minimal-academic-homepage)：
  单页学术主页的信息结构与简洁视觉方向。

本仓库已经对页面结构、组件、内容配置和 GitHub Pages 部署流程进行了修改。
完整的来源、许可与修改说明见 [NOTICE.md](NOTICE.md)。

## 安全与许可

- 不要向仓库提交密码、令牌、私钥、未公开数据或不希望公开的个人信息。
- 依赖由 Dependabot 每周检查；本地可运行 `npm run audit`。
- 项目整体采用 `GPL-3.0-only`，发布修改版时应保留许可证、版权声明、
  修改说明，并公开对应源代码。
- 上游来源和修改说明见 [NOTICE.md](NOTICE.md)。

本项目不提供法律保证。公开发布前，应确认头像、论文插图、机构 Logo
和文字内容均具有公开使用权。
