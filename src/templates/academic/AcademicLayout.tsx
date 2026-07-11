// SPDX-FileCopyrightText: 2026 Minimal Academic Terminal Homepage contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  Box,
  Container,
  Flex,
  HStack,
  Link,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { useEffect, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocalizedData } from '@/hooks/useLocalizedData'
import { alpha, palette } from '@/templates/academic/academicTheme'
import { isZhLang } from '@/utils/lang'

interface ToggleOption<T extends string> {
  value: T
  label: ReactNode
  ariaLabel: string
}

interface SegmentedToggleProps<T extends string> {
  value: T
  options: [ToggleOption<T>, ToggleOption<T>]
  ariaLabel: string
  width: string
  onChange: (value: T) => void
}

const SegmentedToggle = <T extends string>({
  value,
  options,
  ariaLabel,
  width,
  onChange,
}: SegmentedToggleProps<T>) => {
  const borderColor = useColorModeValue('#d6d0c4', '#34404b')
  const trackBg = useColorModeValue('rgba(230, 225, 215, 0.72)', 'rgba(8, 12, 15, 0.72)')
  const sliderBg = useColorModeValue('#fffdf8', '#26313a')
  const activeColor = useColorModeValue('#18212b', '#f7fafc')
  const inactiveColor = useColorModeValue('#7a858f', '#7f8c98')
  const selectedIndex = options.findIndex((option) => option.value === value)

  return (
    <Box
      role="group"
      aria-label={ariaLabel}
      position="relative"
      display="grid"
      gridTemplateColumns="repeat(2, 1fr)"
      w={width}
      h="32px"
      p="3px"
      bg={trackBg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="full"
      flexShrink={0}
    >
      <Box
        aria-hidden="true"
        position="absolute"
        top="3px"
        bottom="3px"
        left="3px"
        w="calc(50% - 3px)"
        bg={sliderBg}
        borderRadius="full"
        boxShadow={useColorModeValue(
          '0 2px 7px rgba(34, 42, 48, 0.13)',
          '0 2px 8px rgba(0, 0, 0, 0.34)',
        )}
        transform={`translateX(${selectedIndex === 1 ? '100%' : '0'})`}
        transition="transform 180ms ease, background-color 180ms ease"
        pointerEvents="none"
      />

      {options.map((option) => {
        const isActive = option.value === value
        return (
          <Box
            as="button"
            type="button"
            key={option.value}
            aria-label={option.ariaLabel}
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            position="relative"
            zIndex={1}
            display="flex"
            alignItems="center"
            justifyContent="center"
            minW={0}
            h="24px"
            px={1}
            borderRadius="full"
            color={isActive ? activeColor : inactiveColor}
            fontFamily="mono"
            fontSize="11px"
            fontWeight={isActive ? '700' : '500'}
            lineHeight={1}
            transition="color 180ms ease"
            _hover={{ color: activeColor }}
            _focusVisible={{ outline: '2px solid', outlineColor: 'accent', outlineOffset: '2px' }}
          >
            {option.label}
          </Box>
        )
      })}
    </Box>
  )
}

const AcademicLayout = ({ children }: { children: ReactNode }) => {
  const { colorMode, setColorMode } = useColorMode()
  const { t, i18n } = useTranslation()
  const { siteOwner } = useLocalizedData()
  const navBg = useColorModeValue(alpha(palette.light.bg, 0.9), alpha(palette.dark.bg, 0.9))

  const language = isZhLang(i18n.language) ? 'zh' : 'en'

  useEffect(() => {
    document.title = `${siteOwner.name.display} | Academic Homepage`
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en'
  }, [language, siteOwner.name.display])

  const navItems = [
    [t('nav.research'), 'research'],
    [t('nav.publications'), 'publications'],
    [t('nav.projects'), 'projects'],
    [t('nav.experience'), 'experience'],
    [t('nav.notes'), 'notes'],
  ]

  return (
    <Box minH="100vh" bg="appBg" color="textPrimary">
      <Box
        as="header"
        position="sticky"
        top={0}
        zIndex={20}
        bg={navBg}
        borderBottom="1px solid"
        borderColor="borderSubtle"
        backdropFilter="blur(18px)"
      >
        <Container maxW="1120px" px={[4, 6]} py={3}>
          <Flex align="center" justify="space-between" gap={[2, 4]}>
            <Link href="#" minW={0} _hover={{ textDecoration: 'none' }}>
              <HStack spacing={2}>
                <Text fontFamily="mono" color="accent" fontWeight="bold">&gt;_</Text>
                <Text fontWeight="700" letterSpacing="0" whiteSpace="nowrap">
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
                    color="textMuted"
                    fontSize="sm"
                    _hover={{ color: 'textPrimary', textDecoration: 'none' }}
                  >
                    {label}
                  </Link>
                ))}
              </HStack>

              <HStack spacing={2}>
                <SegmentedToggle
                  value={language}
                  width="76px"
                  ariaLabel={t('languageAria')}
                  onChange={(nextLanguage) => i18n.changeLanguage(nextLanguage)}
                  options={[
                    { value: 'zh', label: '中', ariaLabel: t('switchToZh') },
                    { value: 'en', label: 'EN', ariaLabel: t('switchToEn') },
                  ]}
                />
                <SegmentedToggle
                  value={colorMode}
                  width="68px"
                  ariaLabel={t('colorModeAria')}
                  onChange={setColorMode}
                  options={[
                    {
                      value: 'light',
                      label: <SunIcon boxSize="12px" />,
                      ariaLabel: t('switchToLight'),
                    },
                    {
                      value: 'dark',
                      label: <MoonIcon boxSize="11px" />,
                      ariaLabel: t('switchToDark'),
                    },
                  ]}
                />
              </HStack>
            </HStack>
          </Flex>
        </Container>
      </Box>
      {children}
    </Box>
  )
}

export default AcademicLayout
