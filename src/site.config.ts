// SPDX-FileCopyrightText: 2026 Yaoyao(Freax) Qian <limyoonaxi@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

/**
 * Site configuration — imports from content/site.json
 *
 * Users edit content/site.json (pure JSON, no code needed).
 * This file computes derived values used by components.
 */

import siteJson from '@content/site.json'
import siteJsonZh from '@content/zh/site.json'

// ═══════════════════════════════════════════════════════════════
// The config object — mirrors content/site.json
// ═══════════════════════════════════════════════════════════════

export const siteConfig = siteJson
export const siteConfigZh = siteJsonZh

/** Get site config for a given language. Accepts region-suffixed codes (zh-CN, zh-TW, ...). */
export function getLocalizedSiteConfig(lang: string) {
  return lang?.toLowerCase().startsWith('zh') ? siteConfigZh : siteJson
}

// ═══════════════════════════════════════════════════════════════
// Derived values — computed automatically, do NOT edit
// ═══════════════════════════════════════════════════════════════

/** Build a siteOwner-like object for a given language */
export function getLocalizedSiteOwner(lang: string) {
  const cfg = getLocalizedSiteConfig(lang)
  return {
    name: cfg.name,
    terminalUsername: cfg.terminal.username,
    rotatingSubtitles: cfg.terminal.rotatingSubtitles,
    contact: {
      email: cfg.contact.email,
      academicEmail: cfg.contact.academicEmail,
      hiringEmail: cfg.contact.hiringEmail,
      location: cfg.contact.location,
      linkedin: cfg.social.linkedin,
    },
    social: cfg.social,
    timezone: cfg.terminal.timezone,
    skills: cfg.terminal.skills,
  }
}
