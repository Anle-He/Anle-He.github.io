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
import { isZhLang } from './utils/lang'

// ═══════════════════════════════════════════════════════════════
// The config object — mirrors content/site.json
// ═══════════════════════════════════════════════════════════════

export const siteConfig = siteJson
export const siteConfigZh = siteJsonZh

/** Get site config for a given language. Accepts region-suffixed codes (zh-CN, zh-TW, ...). */
export function getLocalizedSiteConfig(lang: string) {
  return isZhLang(lang) ? siteConfigZh : siteJson
}

// ═══════════════════════════════════════════════════════════════
// Derived values — computed automatically, do NOT edit
// ═══════════════════════════════════════════════════════════════

/** Build a siteOwner-like object for a given language.
 *  Only fields the templates actually render are exposed; everything
 *  is guarded so a trimmed-down site.json cannot crash the app. */
export function getLocalizedSiteOwner(lang: string) {
  const cfg = getLocalizedSiteConfig(lang)
  return {
    name: cfg.name ?? { display: '' },
    contact: {
      email: cfg.contact?.email ?? '',
      workEmail: cfg.contact?.workEmail ?? '',
    },
    social: cfg.social ?? {},
    skills: cfg.skills ?? [],
  }
}
