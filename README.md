# Minimal Academic Terminal Homepage

一个可部署到 GitHub Pages 的中英双语个人学术主页。页面采用单页结构，
以简洁的学术信息展示为主，并保留少量终端风格细节。

## 本地运行

需要 Node.js 22 或更高版本。

```bash
npm install
npm run validate
npm run dev
```

开发地址通常为 `http://127.0.0.1:5173/`。提交前运行：

```bash
npm run lint
npm run audit
npm run build
```

## 修改个人资料

| 内容 | 英文 | 中文 |
| --- | --- | --- |
| 姓名、简介、邮箱、链接 | `content/site.json` | `content/zh/site.json` |
| 个人介绍 | `content/about.md` | `content/zh/about.md` |
| 研究方向 | `content/research.json` | `content/zh/research.json` |
| 教育与经历 | `content/experience.json` | `content/zh/experience.json` |
| 奖项、动态 | `content/awards.json`、`content/news.json` | 对应的 `content/zh/` 文件 |
| 论文、项目、文章 | `content/publications/` 等目录 | 对应的 `content/zh/` 目录 |

头像放在 `content/images/`。发布前必须替换 `Your Name`、
`your.email@example.com` 和全部示例内容。

## 部署到 GitHub Pages

1. 在 GitHub 新建 Public 仓库。根域主页建议命名为
   `你的用户名.github.io`；其他仓库名会部署到子路径。
2. 在本地执行 `git add .`、`git commit`，添加 GitHub remote 后推送到 `main`。
3. 打开仓库 `Settings -> Pages`。
4. 在 `Build and deployment` 中把 Source 设为 `GitHub Actions`。
5. 打开 `Actions`，等待 `Build and Deploy to GitHub Pages` 成功。
6. 回到 `Settings -> Pages` 查看最终网址。

工作流会自动适配根域仓库和普通项目仓库的 URL 前缀。
如果姓名或邮箱仍是占位值，工作流会主动停止，避免误发布模板信息。

## 安全与许可

- 不要向仓库提交密码、令牌、私钥、未公开数据或不希望公开的个人信息。
- 依赖由 Dependabot 每周检查；本地可运行 `npm run audit`。
- 项目整体采用 `GPL-3.0-only`，发布修改版时应保留许可证、版权声明、
  修改说明，并公开对应源代码。
- 上游来源和修改说明见 [NOTICE.md](NOTICE.md)。

本项目不提供法律保证；正式发布前仍应由仓库所有者确认自己拥有头像、
论文插图、机构 Logo 和文字内容的公开使用权。
