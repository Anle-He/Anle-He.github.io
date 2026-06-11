/**
 * Vite plugin: transforms .md files with YAML frontmatter into JS modules.
 *
 * Input:  content/projects/my-project.md
 * Output: { ...frontmatter, body: 'raw Markdown content' }
 *
 * Usage in code:
 *   import project from '@content/projects/my-project.md'
 *   // project.title, project.tags, project.body (HTML string)
 */

import type { Plugin } from 'vite'
import { parse } from 'yaml'

function splitFrontmatter(code: string) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(code)
  if (!match) return { data: {}, content: code }

  const parsed = parse(match[1])
  if (parsed !== null && (typeof parsed !== 'object' || Array.isArray(parsed))) {
    throw new Error('Markdown frontmatter must be a YAML object')
  }

  return {
    data: parsed ?? {},
    content: code.slice(match[0].length),
  }
}

export default function markdownPlugin(): Plugin {
  return {
    name: 'vite-plugin-markdown',
    transform(code: string, id: string) {
      if (!id.endsWith('.md')) return null

      const { data, content } = splitFrontmatter(code)
      const body = content.trim()

      const result = { ...data, body }
      return {
        code: `export default ${JSON.stringify(result)}`,
        map: null,
      }
    },
  }
}
