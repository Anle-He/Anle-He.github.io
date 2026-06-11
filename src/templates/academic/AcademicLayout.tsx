// SPDX-FileCopyrightText: 2026 Minimal Academic Terminal Homepage contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  IconButton,
  Link,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { useEffect, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocalizedData } from '@/hooks/useLocalizedData'

const AcademicLayout = ({ children }: { children: ReactNode }) => {
  const { colorMode, toggleColorMode } = useColorMode()
  const { i18n } = useTranslation()
  const { siteOwner } = useLocalizedData()
  const pageBg = useColorModeValue('#f4f1eb', '#101418')
  const navBg = useColorModeValue('rgba(244, 241, 235, 0.9)', 'rgba(16, 20, 24, 0.9)')
  const borderColor = useColorModeValue('#ded8cc', '#2b333d')
  const textColor = useColorModeValue('#18212b', '#edf2f7')
  const mutedColor = useColorModeValue('#65717e', '#9aa7b4')

  const isZh = i18n.language.toLowerCase().startsWith('zh')
  const toggleLanguage = () => i18n.changeLanguage(isZh ? 'en' : 'zh')

  useEffect(() => {
    document.title = `${siteOwner.name.display} | Academic Homepage`
    document.documentElement.lang = isZh ? 'zh-CN' : 'en'
  }, [isZh, siteOwner.name.display])

  const navItems = isZh
    ? [
        ['研究', 'research'],
        ['论文', 'publications'],
        ['项目', 'projects'],
        ['经历', 'experience'],
        ['笔记', 'notes'],
      ]
    : [
        ['Research', 'research'],
        ['Publications', 'publications'],
        ['Projects', 'projects'],
        ['Experience', 'experience'],
        ['Notes', 'notes'],
      ]

  return (
    <Box minH="100vh" bg={pageBg} color={textColor}>
      <Box
        as="header"
        position="sticky"
        top={0}
        zIndex={20}
        bg={navBg}
        borderBottom="1px solid"
        borderColor={borderColor}
        backdropFilter="blur(18px)"
      >
        <Container maxW="1120px" px={[4, 6]} py={3}>
          <Flex align="center" justify="space-between" gap={4}>
            <Link href="#" _hover={{ textDecoration: 'none' }}>
              <HStack spacing={2}>
                <Text fontFamily="mono" color="#2a6f6b" fontWeight="bold">&gt;_</Text>
                <Text fontWeight="700" letterSpacing="-0.02em">
                  {siteOwner.name.display}
                </Text>
              </HStack>
            </Link>

            <HStack spacing={[2, 3, 5]}>
              <HStack spacing={5} display={{ base: 'none', lg: 'flex' }}>
                {navItems.map(([label, id]) => (
                  <Link
                    key={id}
                    href={`#${id}`}
                    color={mutedColor}
                    fontSize="sm"
                    _hover={{ color: textColor, textDecoration: 'none' }}
                  >
                    {label}
                  </Link>
                ))}
              </HStack>
              <Button
                size="sm"
                variant="ghost"
                fontFamily="mono"
                fontSize="xs"
                onClick={toggleLanguage}
              >
                {isZh ? 'EN' : '中文'}
              </Button>
              <IconButton
                aria-label={isZh ? '切换明暗模式' : 'Toggle color mode'}
                icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
                onClick={toggleColorMode}
                size="sm"
                variant="ghost"
              />
            </HStack>
          </Flex>
        </Container>
      </Box>
      {children}
    </Box>
  )
}

export default AcademicLayout
