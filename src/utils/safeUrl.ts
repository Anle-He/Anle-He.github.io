// SPDX-FileCopyrightText: 2026 Minimal Academic Terminal Homepage contributors
// SPDX-License-Identifier: GPL-3.0-only

export function safeHref(value?: string): string | undefined {
  const href = value?.trim()
  if (!href) return undefined
  if (href.startsWith('#') || href.startsWith('mailto:')) return href

  try {
    const url = new URL(href)
    return url.protocol === 'https:' ? href : undefined
  } catch {
    return undefined
  }
}
