// SPDX-FileCopyrightText: 2026 Minimal Academic Terminal Homepage contributors
// SPDX-License-Identifier: GPL-3.0-only

/** True for any Chinese language tag ('zh', 'zh-CN', 'zh-TW', ...). */
export function isZhLang(lang?: string): boolean {
  return Boolean(lang?.toLowerCase().startsWith('zh'))
}
