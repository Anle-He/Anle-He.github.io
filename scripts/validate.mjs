// SPDX-FileCopyrightText: 2026 Minimal Academic Terminal Homepage contributors
// SPDX-License-Identifier: GPL-3.0-only

import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const errors = []
const warnings = []

function readJson(relativePath) {
  const absolutePath = resolve(root, relativePath)
  try {
    return JSON.parse(readFileSync(absolutePath, 'utf8'))
  } catch (error) {
    errors.push(`${relativePath}: ${error.message}`)
    return null
  }
}

const siteFiles = ['content/site.json', 'content/zh/site.json']
const dataFiles = ['research.json', 'experience.json', 'awards.json', 'news.json']

for (const siteFile of siteFiles) {
  const site = readJson(siteFile)
  if (!site) continue

  const prefix = siteFile.includes('/zh/') ? 'content/zh' : 'content'
  const avatarPath = resolve(root, 'content/images', site.avatar ?? '')
  if (!existsSync(avatarPath)) errors.push(`${siteFile}: avatar file is missing`)

  const serialized = JSON.stringify(site)
  if (/Your Name|your\.email@example\.com|your-username/.test(serialized)) {
    const message = `${siteFile}: still contains placeholder identity values`
    if (process.env.REQUIRE_PERSONALIZED === 'true') errors.push(message)
    else warnings.push(message)
  }

  for (const file of dataFiles) readJson(`${prefix}/${file}`)
}

for (const languagePath of ['content', 'content/zh']) {
  for (const directory of ['articles', 'projects', 'publications']) {
    const path = resolve(root, languagePath, directory)
    const files = existsSync(path) ? readdirSync(path).filter((file) => file.endsWith('.md')) : []
    if (files.length === 0) errors.push(`${languagePath}/${directory}: no Markdown files found`)
  }
}

if (errors.length > 0) {
  console.error('Validation failed:')
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log('Validation passed.')
for (const warning of warnings) console.warn(`Warning: ${warning}`)
