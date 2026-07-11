// SPDX-FileCopyrightText: 2026 Yaoyao(Freax) Qian <limyoonaxi@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

// ============================================================
// Data loader (bilingual)
//
// Loads content from two sources per language:
//   - Markdown files (content/**/*.md, content/zh/**/*.md)
//   - JSON files (content/*.json, content/zh/*.json)
//
// All user-edited content passes through the normalizers below,
// which supply safe defaults for missing/mistyped fields so a
// content mistake degrades gracefully instead of crashing the app.
// ============================================================

import type {
  Research, Experience, NewsItem, About, Publication,
  ProjectItem, Award, ExperienceEntry, CityResidence,
} from '../types'
import { isZhLang } from '../utils/lang'

// ── Markdown glob imports (each .md → { frontmatter..., body: raw markdown }) ──

type MdModules = Record<string, { default: Record<string, unknown> }>

// English (default)
const projectMdsEn = import.meta.glob('/content/projects/*.md', { eager: true }) as MdModules
const articleMdsEn = import.meta.glob('/content/articles/*.md', { eager: true }) as MdModules
const publicationMdsEn = import.meta.glob('/content/publications/*.md', { eager: true }) as MdModules
const aboutMdEn = import.meta.glob('/content/about.md', { eager: true }) as MdModules

// Chinese
const projectMdsZh = import.meta.glob('/content/zh/projects/*.md', { eager: true }) as MdModules
const articleMdsZh = import.meta.glob('/content/zh/articles/*.md', { eager: true }) as MdModules
const publicationMdsZh = import.meta.glob('/content/zh/publications/*.md', { eager: true }) as MdModules
const aboutMdZh = import.meta.glob('/content/zh/about.md', { eager: true }) as MdModules

// ── Normalization helpers (content is user-edited; trust nothing) ──

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : []
}

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function collectMd(modules: MdModules): Record<string, unknown>[] {
  return Object.values(modules).map(m => {
    const { body, ...frontmatter } = m.default
    return { ...frontmatter, _body: body }
  })
}

function markdownToText(markdown: string) {
  return markdown
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    // strip heading/list/quote markers only at line starts, so hyphens
    // inside prose ('state-of-the-art', '2021-2023') survive
    .replace(/^[\s>]*(?:#+|[-*+]|\d+\.)\s+/gm, '')
    .replace(/[`*_~]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// Convert Markdown body into the fields components expect
function mdToProject(raw: Record<string, unknown>): ProjectItem {
  const { _body, ...rest } = raw
  const bodyStr = (_body as string) || ''

  const highlights: string[] = []
  const lines = bodyStr.split('\n')
  for (const line of lines) {
    const m = line.match(/^[-*]\s+(.+)/)
    if (m) highlights.push(m[1].trim())
  }

  const summary = lines
    .filter(l => l.trim() && !l.match(/^[-*#]/) && !l.match(/^</))
    .map(l => markdownToText(l))
    .join(' ')

  return {
    ...rest,
    summary,
    highlights: highlights.length > 0 ? highlights : undefined,
    tags: asArray<string>(rest.tags),
  } as unknown as ProjectItem
}

function mdToPublication(raw: Record<string, unknown>): Publication {
  const { _body, ...rest } = raw
  const bodyStr = (_body as string) || ''
  const abstract = markdownToText(bodyStr)
  const authors = Array.isArray(rest.authors)
    ? (rest.authors as string[])
    : rest.authors
      ? [String(rest.authors)]
      : []
  return {
    ...rest,
    abstract,
    authors,
    links: asRecord(rest.links),
  } as unknown as Publication
}

function mdToAbout(raw: Record<string, unknown>): About {
  const { _body, body, ...rest } = raw
  const bodyStr = ((_body ?? body) as string) || ''
  const journey = markdownToText(bodyStr)
  return { journey, ...rest } as unknown as About
}

function toExperience(raw: unknown): Experience {
  const r = asRecord(raw)
  const education = asRecord(r.education)
  return {
    education: { courses: asArray(education.courses) },
    reviewing: asArray(r.reviewing),
  } as Experience
}

function toTimeline(raw: unknown): ExperienceEntry[] {
  return asArray<Record<string, unknown>>(raw).map(entry => ({
    ...entry,
    start: typeof entry.start === 'string' ? entry.start : String(entry.start ?? ''),
    highlights: asArray<string>(entry.highlights),
  })) as unknown as ExperienceEntry[]
}

function toResearch(raw: unknown): Research {
  return { currentResearch: asArray(asRecord(raw).currentResearch) } as Research
}

// ── JSON imports (both languages) ──

import experienceJsonEn from '@content/experience.json'
import newsJsonEn from '@content/news.json'
import awardsJsonEn from '@content/awards.json'
import citiesJsonEn from '@content/cities.json'
import researchJsonEn from '@content/research.json'
import siteJsonEn from '@content/site.json'

import experienceJsonZh from '@content/zh/experience.json'
import newsJsonZh from '@content/zh/news.json'
import awardsJsonZh from '@content/zh/awards.json'
import citiesJsonZh from '@content/zh/cities.json'
import researchJsonZh from '@content/zh/research.json'
import siteJsonZh from '@content/zh/site.json'

// ── Build language datasets (shared builder; zh built lazily on first use) ──

interface MdBundle {
  projects: MdModules
  articles: MdModules
  publications: MdModules
  about: MdModules
}

interface JsonBundle {
  experience: unknown
  news: unknown
  awards: unknown
  cities: unknown
  research: unknown
}

function buildDataset<TSite>(mds: MdBundle, json: JsonBundle, site: TSite) {
  return {
    projects: collectMd(mds.projects).map(mdToProject),
    articles: collectMd(mds.articles).map(mdToProject),
    publications: collectMd(mds.publications).map(mdToPublication),
    about: mdToAbout(Object.values(mds.about)[0]?.default ?? {}),
    research: toResearch(json.research),
    experience: toExperience(json.experience),
    experienceTimeline: toTimeline(asRecord(json.experience).timeline),
    news: asArray<NewsItem>(json.news),
    awards: asArray<Award>(json.awards),
    cities: asArray<CityResidence>(json.cities),
    siteConfig: site,
  }
}

const enData = buildDataset(
  { projects: projectMdsEn, articles: articleMdsEn, publications: publicationMdsEn, about: aboutMdEn },
  { experience: experienceJsonEn, news: newsJsonEn, awards: awardsJsonEn, cities: citiesJsonEn, research: researchJsonEn },
  siteJsonEn,
)

type Dataset = typeof enData

let zhDataCache: Dataset | undefined

function getZhData(): Dataset {
  zhDataCache ??= buildDataset(
    { projects: projectMdsZh, articles: articleMdsZh, publications: publicationMdsZh, about: aboutMdZh },
    { experience: experienceJsonZh, news: newsJsonZh, awards: awardsJsonZh, cities: citiesJsonZh, research: researchJsonZh },
    siteJsonZh as typeof siteJsonEn,
  )
  return zhDataCache
}

/** Get content data for a specific language (falls back to English).
 *  Accepts region-suffixed codes like 'zh-CN' / 'zh-TW' from browser detection. */
export function getLocalizedData(lang: string) {
  return isZhLang(lang) ? getZhData() : enData
}
