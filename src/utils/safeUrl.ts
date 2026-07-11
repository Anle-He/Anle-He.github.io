// SPDX-FileCopyrightText: 2026 Minimal Academic Terminal Homepage contributors
// SPDX-License-Identifier: GPL-3.0-only

export function safeHref(value?: string): string | undefined {
  const href = value?.trim()
  if (!href) return undefined
  if (href.startsWith('#') || href.startsWith('mailto:')) return href

  try {
    const url = new URL(href)
    return url.protocol === 'https:' || url.protocol === 'http:' ? href : undefined
  } catch {
    if (import.meta.env?.DEV) {
      console.warn(`safeHref: dropping invalid or non-http(s) URL: ${href}`)
    }
    return undefined
  }
}
