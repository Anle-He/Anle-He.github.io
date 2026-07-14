// SPDX-FileCopyrightText: 2026 Yaoyao(Freax) Qian <limyoonaxi@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          available: 'Open to collaboration',
          research: 'Research',
          publications: 'Selected Publications',
          projects: 'Projects',
          experience: 'Education & Experience',
          notes: 'Posts & Notes',
          view: 'View',
          contact: 'Contact',
          copyEmail: 'Copy email address',
          emailPersonal: 'Email',
          emailWork: 'Work Email',
          emailCopied: 'Email address copied',
          empty: 'Replace this sample in the content/ directory.',
          present: 'Present',
          built: 'Adapted from Minimal Academic Homepage and TermHub',
          nav: {
            research: 'Research',
            publications: 'Publications',
            projects: 'Projects',
            experience: 'Experience',
            notes: 'Notes',
          },
          languageAria: 'Language selection',
          colorModeAria: 'Color mode',
          switchToZh: '切换为中文',
          switchToEn: 'Switch to English',
          switchToLight: 'Switch to light mode',
          switchToDark: 'Switch to dark mode',
        },
      },
      zh: {
        translation: {
          available: '开放交流与合作',
          research: '研究方向',
          publications: '代表性论文',
          projects: '项目',
          experience: '教育与经历',
          notes: '文章与笔记',
          view: '查看',
          contact: '联系我',
          copyEmail: '复制邮箱地址',
          emailPersonal: 'Email',
          emailWork: 'Work Email',
          emailCopied: '邮箱地址已复制',
          empty: '请在 content/ 目录中替换为你的真实内容。',
          present: '至今',
          built: '基于 Minimal Academic Homepage 与 TermHub 改造',
          nav: {
            research: '研究',
            publications: '论文',
            projects: '项目',
            experience: '经历',
            notes: '笔记',
          },
          languageAria: '语言选择',
          colorModeAria: '配色模式',
          switchToZh: '切换为中文',
          switchToEn: 'Switch to English',
          switchToLight: '切换为浅色模式',
          switchToDark: '切换为深色模式',
        },
      },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'zh'],
    load: 'languageOnly',
    nonExplicitSupportedLngs: true,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  })

export default i18n
