// SPDX-FileCopyrightText: 2026 Yaoyao(Freax) Qian <limyoonaxi@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

import { extendTheme } from '@chakra-ui/react'

// Single source of truth for the template's colors. Components pick the
// light/dark variant via useColorModeValue(palette.light.x, palette.dark.x).
export const palette = {
  accent: '#2a6f6b',
  accentSoft: '#8fc9c4',
  light: {
    bg: '#f4f1eb',
    card: 'rgba(255, 253, 248, 0.92)',
    softCard: '#f8f5ef',
    border: '#ded8cc',
    text: '#18212b',
    muted: '#65717e',
    terminalBg: '#152a2f',
  },
  dark: {
    bg: '#101418',
    card: 'rgba(23, 28, 34, 0.94)',
    softCard: '#151b21',
    border: '#2b333d',
    text: '#edf2f7',
    muted: '#9aa7b4',
    terminalBg: '#090f12',
  },
  terminal: {
    text: '#dce8e7',
    muted: '#84989c',
    dotClose: '#d27a6a',
    dotMinimize: '#d6b25e',
    dotMaximize: '#72a982',
  },
} as const

export const alpha = (hex: string, opacity: number) => {
  const value = parseInt(hex.slice(1), 16)
  const r = (value >> 16) & 0xff
  const g = (value >> 8) & 0xff
  const b = value & 0xff
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

const academicTheme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: true,
  },
  fonts: {
    body: 'Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
    heading: 'Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
    mono: '"SFMono-Regular", Consolas, "Liberation Mono", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", monospace',
  },
  // Mode-aware color tokens: components use these names directly
  // (e.g. color="accent") and Chakra resolves light/dark automatically.
  semanticTokens: {
    colors: {
      appBg: { default: palette.light.bg, _dark: palette.dark.bg },
      cardBg: { default: palette.light.card, _dark: palette.dark.card },
      softCardBg: { default: palette.light.softCard, _dark: palette.dark.softCard },
      borderSubtle: { default: palette.light.border, _dark: palette.dark.border },
      textPrimary: { default: palette.light.text, _dark: palette.dark.text },
      textMuted: { default: palette.light.muted, _dark: palette.dark.muted },
      terminalBg: { default: palette.light.terminalBg, _dark: palette.dark.terminalBg },
      accent: { default: palette.accent, _dark: palette.accentSoft },
      accentHoverBorder: {
        default: alpha(palette.accent, 0.4),
        _dark: alpha(palette.accentSoft, 0.4),
      },
      accentSubtleBg: {
        default: alpha(palette.accent, 0.09),
        _dark: alpha(palette.accentSoft, 0.1),
      },
      accentSubtleBorder: {
        default: alpha(palette.accent, 0.16),
        _dark: alpha(palette.accentSoft, 0.18),
      },
      // Warm gold companion hue (education / awards markers), derived from
      // the terminal chrome's minimize-dot color family.
      accentGold: { default: '#a8842f', _dark: palette.terminal.dotMinimize },
    },
  },
  layerStyles: {
    card: {
      bg: 'cardBg',
      border: '1px solid',
      borderColor: 'borderSubtle',
      borderRadius: '20px',
    },
  },
  styles: {
    global: {
      body: {
        margin: 0,
      },
      '::selection': {
        color: '#f8fafc',
        background: palette.accent,
      },
    },
  },
})

export default academicTheme
