// SPDX-FileCopyrightText: 2026 Minimal Academic Terminal Homepage contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  Badge,
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Image,
  Link,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import { CheckIcon, CopyIcon } from '@chakra-ui/icons'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocalizedData } from '@/hooks/useLocalizedData'
import { alpha, palette } from '@/templates/academic/academicTheme'
import { withBase } from '@/utils/asset'
import { safeHref } from '@/utils/safeUrl'
import type { Publication } from '@/types'

const FOOTPRINT_COLUMNS = 3

const formatYearMonth = (value: string) => value.slice(0, 7).replace('-', '.')

const SectionHeading = ({ command, title, id }: { command: string; title: string; id: string }) => (
  <Flex id={id} align="center" gap={3} mb={5} scrollMarginTop="88px">
    <Text fontFamily="mono" fontSize="xs" color="accent" whiteSpace="nowrap">
      $ {command}
    </Text>
    <Heading as="h2" fontSize={['xl', '2xl']} letterSpacing="0">
      {title}
    </Heading>
    <Box h="1px" flex={1} bg="borderSubtle" />
  </Flex>
)

const AcademicHome = () => {
  const { t } = useTranslation()
  const [emailCopied, setEmailCopied] = useState(false)
  const {
    about,
    awards,
    articles,
    cities,
    experience,
    experienceTimeline,
    news,
    projects,
    publications,
    research,
    siteConfig,
    siteOwner,
  } = useLocalizedData()

  const selectedPublications = useMemo(() => {
    const ids = (siteConfig.selectedPublicationIds ?? []) as string[]
    const selected = ids
      .map((id) => publications.find((publication) => publication.id === id))
      .filter((publication): publication is Publication => Boolean(publication))
    return (selected.length > 0 ? selected : publications).slice(0, 3)
  }, [publications, siteConfig.selectedPublicationIds])

  const latestNews = useMemo(
    () => [...news].sort((a, b) => (b.sortDate ?? '').localeCompare(a.sortDate ?? '')).slice(0, 3),
    [news],
  )

  const publicationLinks = (publication: Publication) =>
    Object.entries(publication.links)
      .map(([label, href]) => [label, safeHref(href)] as const)
      .filter((entry): entry is readonly [string, string] => Boolean(entry[1]))

  const copyEmail = async () => {
    let copied = false

    try {
      await navigator.clipboard.writeText(siteOwner.contact.email)
      copied = true
    } catch {
      const input = document.createElement('textarea')
      input.value = siteOwner.contact.email
      input.style.position = 'fixed'
      input.style.opacity = '0'
      document.body.appendChild(input)
      input.select()
      copied = document.execCommand('copy')
      input.remove()
    }

    setEmailCopied(copied)
    if (copied) window.setTimeout(() => setEmailCopied(false), 1800)
  }

  return (
    <Box
      bg="appBg"
      backgroundImage={useColorModeValue(
        `radial-gradient(circle at 10% 0%, ${alpha(palette.accent, 0.1)}, transparent 34rem)`,
        `radial-gradient(circle at 10% 0%, ${alpha(palette.accentSoft, 0.08)}, transparent 34rem)`,
      )}
    >
      <Container maxW="1120px" px={[4, 6]} py={[6, 10]}>
        <Box
          bg="terminalBg"
          color={palette.terminal.text}
          borderRadius="20px 20px 0 0"
          px={[4, 6]}
          py={3}
          fontFamily="mono"
          fontSize="xs"
        >
          <Flex justify="space-between" align="center" gap={4}>
            <HStack spacing={2}>
              <Box w="8px" h="8px" borderRadius="full" bg={palette.terminal.dotClose} />
              <Box w="8px" h="8px" borderRadius="full" bg={palette.terminal.dotMinimize} />
              <Box w="8px" h="8px" borderRadius="full" bg={palette.terminal.dotMaximize} />
              <Text ml={2} color={palette.accentSoft}>$ whoami --academic</Text>
            </HStack>
            <Text display={{ base: 'none', sm: 'block' }} color={palette.terminal.muted}>
              ~/homepage
            </Text>
          </Flex>
        </Box>

        <Grid
          templateColumns={{ base: '1fr', md: 'minmax(0, 1fr) auto' }}
          gap={[7, 9]}
          alignItems="center"
          layerStyle="card"
          borderTop="0"
          borderRadius="0 0 20px 20px"
          px={[6, 9, 12]}
          py={[8, 11]}
          boxShadow={useColorModeValue(
            '0 20px 54px rgba(48, 43, 35, 0.06)',
            '0 20px 54px rgba(0, 0, 0, 0.22)',
          )}
        >
          <GridItem>
            <Badge
              mb={4}
              px={3}
              py={1}
              borderRadius="full"
              color="accent"
              bg="accentSubtleBg"
              border="1px solid"
              borderColor="accentSubtleBorder"
              textTransform="none"
              fontFamily="mono"
              fontWeight="600"
            >
              status: {t('available')}
            </Badge>
            <Heading
              as="h1"
              fontSize={['3xl', '4xl', '5xl']}
              lineHeight="1.04"
              letterSpacing="0"
              fontWeight="700"
              maxW="760px"
            >
              {siteOwner.name.display}
            </Heading>
            <Text mt={4} fontSize={['md', 'lg']} color="textPrimary" fontWeight="600">
              {siteConfig.title}
            </Text>
            <Text mt={3} maxW="720px" color="textMuted" fontSize={['sm', 'md']} lineHeight="1.8">
              {siteConfig.tagline}
            </Text>
            <Flex mt={6} align="center" gap={3} wrap="wrap">
              {siteOwner.contact.email && (
                <HStack spacing={1}>
                  <Link
                    href={`mailto:${siteOwner.contact.email}`}
                    color="textMuted"
                    fontFamily="mono"
                    fontSize="sm"
                    _hover={{ color: 'accent', textDecoration: 'none' }}
                  >
                    {siteOwner.contact.email}
                  </Link>
                  <IconButton
                    aria-label={emailCopied ? t('emailCopied') : t('copyEmail')}
                    title={emailCopied ? t('emailCopied') : t('copyEmail')}
                    icon={emailCopied ? <CheckIcon /> : <CopyIcon />}
                    onClick={copyEmail}
                    size="xs"
                    variant="ghost"
                    color={emailCopied ? 'accent' : 'textMuted'}
                    fontSize="10px"
                  />
                </HStack>
              )}
              <Wrap spacing={2}>
                {[
                  siteOwner.social.github && ['GitHub', siteOwner.social.github],
                  siteOwner.social.googleScholar && ['Scholar', siteOwner.social.googleScholar],
                  siteOwner.social.blog && ['Blog', siteOwner.social.blog],
                ].filter(Boolean).map((item) => {
                  const [label, rawHref] = item as string[]
                  const href = safeHref(rawHref)
                  if (!href) return null
                  return (
                    <WrapItem key={label}>
                      <Link
                        href={href}
                        isExternal
                        px={3}
                        py={1.5}
                        border="1px solid"
                        borderColor="borderSubtle"
                        borderRadius="full"
                        color="textPrimary"
                        fontSize="sm"
                        _hover={{ borderColor: 'accent', color: 'accent', textDecoration: 'none' }}
                      >
                        {label} <Text as="span" color="accent">↗</Text>
                      </Link>
                    </WrapItem>
                  )
                })}
              </Wrap>
            </Flex>
          </GridItem>
          <GridItem justifySelf={{ base: 'center', md: 'end' }}>
            <Box
              p={1.5}
              bg={useColorModeValue('rgba(255, 253, 248, 0.68)', 'rgba(38, 49, 58, 0.62)')}
              border="1px solid"
              borderColor={useColorModeValue('rgba(214, 208, 196, 0.72)', 'rgba(52, 64, 75, 0.72)')}
              borderRadius="full"
            >
              <Image
                src={withBase(`images/${siteConfig.avatar}`)}
                alt={siteOwner.name.display}
                boxSize={['164px', '196px']}
                objectFit="cover"
                borderRadius="full"
              />
            </Box>
          </GridItem>
        </Grid>

        <VStack align="stretch" spacing={[12, 16]} mt={[12, 16]}>
          <Box>
            <SectionHeading id="experience" command="git log --career" title={t('experience')} />
            <Stack spacing={4}>
              <Box layerStyle="card" p={[5, 7]}>
                <Grid templateColumns={{ base: '1fr', md: '1.15fr 0.85fr' }} gap={[8, 10]}>
                  <Box>
                    <Text fontFamily="mono" color="accent" fontSize="xs" mb={4}>career.log</Text>
                    <VStack align="stretch" spacing={5}>
                      {experienceTimeline.slice(0, 5).map((item) => (
                        <Grid key={`${item.title}-${item.start}`} templateColumns="84px 1fr" gap={4}>
                          <Box fontFamily="mono" fontSize="xs" pt="2px">
                            <Text color="accent">{formatYearMonth(item.start)}</Text>
                            <Text color="textMuted" mt={1}>
                              {item.end ? formatYearMonth(item.end) : t('present')}
                            </Text>
                          </Box>
                          <Box borderLeft="1px solid" borderColor="borderSubtle" pl={4}>
                            <Text fontWeight="700">{item.title}</Text>
                            <Text color="textMuted" fontSize="sm">{item.company} · {item.location}</Text>
                            {item.summary && <Text color="textMuted" fontSize="xs" mt={2}>{item.summary}</Text>}
                          </Box>
                        </Grid>
                      ))}
                    </VStack>
                  </Box>
                  <Box>
                    <Text fontFamily="mono" color="accent" fontSize="xs" mb={4}>education.json</Text>
                    <VStack align="stretch" spacing={5}>
                      {experience.education.courses.map((item) => (
                        <Grid key={`${item.course}-${item.institution}`} templateColumns="84px 1fr" gap={4}>
                          <Box fontFamily="mono" fontSize="xs" pt="2px">
                            {item.year.split(' - ').map((part, index) => (
                              <Text key={part} color={index === 0 ? 'accent' : 'textMuted'} mt={index === 0 ? 0 : 1}>
                                {part}
                              </Text>
                            ))}
                          </Box>
                          <Box borderLeft="1px solid" borderColor="borderSubtle" pl={4}>
                            <Text fontWeight="700" fontSize="sm">{item.course}</Text>
                            <Text color="textMuted" fontSize="xs" mt={1}>{item.institution}</Text>
                          </Box>
                        </Grid>
                      ))}
                    </VStack>
                  </Box>
                </Grid>
                <Box borderTop="1px solid" borderColor="borderSubtle" mt={[6, 8]} pt={[5, 6]}>
                  <Box id="cities" scrollMarginTop="88px">
                    <Text fontFamily="mono" color="accent" fontSize="xs" mb={4}>footprints.log</Text>
                    <Grid templateColumns={`repeat(${FOOTPRINT_COLUMNS}, minmax(0, 1fr))`} gap={2} alignItems="start">
                      {cities.map((item, index) => (
                        <Box key={`${item.period}-${item.city}`} position="relative">
                          {index < cities.length - 1 && index % FOOTPRINT_COLUMNS !== FOOTPRINT_COLUMNS - 1 && (
                            <Box
                              position="absolute"
                              top="7px"
                              left="18px"
                              right="-10px"
                              h="1px"
                              bg="borderSubtle"
                            />
                          )}
                          <Box position="relative" zIndex={1}>
                            <Box w="15px" h="15px" borderRadius="full" bg="accent" border="3px solid" borderColor="cardBg" />
                            <Text fontWeight="700" fontSize="sm" mt={3}>{item.city}</Text>
                            <Text color="textMuted" fontFamily="mono" fontSize="2xs" mt={1}>{item.period}</Text>
                          </Box>
                        </Box>
                      ))}
                    </Grid>
                  </Box>
                </Box>
              </Box>
              <Box layerStyle="card" p={5}>
                <Text fontFamily="mono" color="accent" fontSize="xs" mb={4}>awards.json</Text>
                <SimpleGrid columns={{ base: 1, sm: 2, lg: Math.min(Math.max(awards.length, 1), 4) }} spacing={4}>
                  {awards.slice(0, 4).map((award) => (
                    <Box key={`${award.title}-${award.date}`}>
                      <Text fontWeight="600" fontSize="sm">{award.title}</Text>
                      <Text color="textMuted" fontSize="xs">{award.org} · {award.date}</Text>
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>
            </Stack>
          </Box>

          <Box>
            <SectionHeading id="research" command="cat interests.txt" title={t('research')} />
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Box layerStyle="card" p={[5, 7]}>
                <Text color="textMuted" fontSize="sm" lineHeight="1.9">
                  {about.journey || t('empty')}
                </Text>
                <Wrap mt={5} spacing={2}>
                  {siteOwner.skills.map((skill) => (
                    <WrapItem key={skill.name}>
                      <Text
                        px={3}
                        py={1}
                        bg="softCardBg"
                        borderRadius="full"
                        fontFamily="mono"
                        fontSize="xs"
                        color="accent"
                      >
                        {skill.name}
                      </Text>
                    </WrapItem>
                  ))}
                </Wrap>
              </Box>
              <Box layerStyle="card" p={[5, 7]}>
                <VStack align="stretch" spacing={4}>
                  {research.currentResearch.map((item, index) => {
                    const href = safeHref(item.link)
                    return (
                      <Link
                        key={`${item.lab}-${index}`}
                        href={href}
                        isExternal={Boolean(href)}
                        role="group"
                        _hover={{ textDecoration: 'none' }}
                      >
                        <Flex gap={3} align="start">
                          <Text fontFamily="mono" color="accent">0{index + 1}</Text>
                          <Box>
                            <Text fontWeight="700" transition="color 160ms ease" _groupHover={{ color: 'accent' }}>{item.lab}</Text>
                            <Text color="textMuted" fontSize="sm" mt={1}>{item.focus}</Text>
                            {item.advisor && <Text color="textMuted" fontSize="xs" mt={1}>{item.advisor}</Text>}
                          </Box>
                        </Flex>
                      </Link>
                    )
                  })}
                </VStack>
              </Box>
            </SimpleGrid>
          </Box>

          <Box>
            <SectionHeading id="publications" command="ls papers/" title={t('publications')} />
            <VStack align="stretch" spacing={4}>
              {selectedPublications.map((publication, index) => (
                <Grid
                  key={publication.id}
                  templateColumns={{ base: '1fr', md: publication.featuredImage ? '220px 1fr' : '1fr' }}
                  gap={5}
                  layerStyle="card"
                  borderLeftWidth={index === 0 ? '3px' : '1px'}
                  borderLeftColor={index === 0 ? 'accent' : 'borderSubtle'}
                  p={[5, 6]}
                  transition="border-color 160ms ease"
                  _hover={{ borderColor: 'accentHoverBorder', borderLeftColor: 'accent' }}
                >
                  {publication.featuredImage && (
                    <Image
                      src={withBase(publication.featuredImage)}
                      alt=""
                      w="full"
                      h="140px"
                      objectFit="contain"
                      bg="softCardBg"
                      borderRadius="12px"
                      p={2}
                    />
                  )}
                  <Box>
                    <HStack spacing={3} mb={2}>
                      <Text fontFamily="mono" color="accent" fontSize="xs">
                        paper_{String(index + 1).padStart(2, '0')}
                      </Text>
                      <Text color="textMuted" fontSize="xs">{publication.venue} · {publication.year}</Text>
                    </HStack>
                    <Heading as="h3" fontSize={['lg', 'xl']} lineHeight="1.35">
                      {publication.title}
                    </Heading>
                    <Text color="textMuted" fontSize="sm" mt={2}>
                      {publication.authors.join(', ')}
                    </Text>
                    {publication.abstract && (
                      <Text color="textMuted" fontSize="sm" mt={3} noOfLines={2} lineHeight="1.7">
                        {publication.abstract}
                      </Text>
                    )}
                    <HStack mt={4} spacing={4} flexWrap="wrap">
                      {publicationLinks(publication).map(([label, href]) => (
                        <Link
                          key={label}
                          href={href}
                          isExternal
                          color="accent"
                          fontFamily="mono"
                          fontSize="xs"
                        >
                          [{label}]
                        </Link>
                      ))}
                    </HStack>
                  </Box>
                </Grid>
              ))}
            </VStack>
          </Box>

          <Box>
            <SectionHeading id="projects" command="find projects -maxdepth 1" title={t('projects')} />
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              {projects.slice(0, 3).map((project, index) => (
                <Box
                  key={project.title}
                  layerStyle="card"
                  p={5}
                  minH="230px"
                  display="flex"
                  flexDirection="column"
                  transition="border-color 160ms ease"
                  _hover={{ borderColor: 'accentHoverBorder' }}
                >
                  <Text fontFamily="mono" fontSize="xs" color="accent">
                    {String(index + 1).padStart(2, '0')}/{project.category}
                  </Text>
                  <Heading as="h3" fontSize="lg" mt={3}>{project.title}</Heading>
                  <Text color="textMuted" fontSize="sm" mt={3} lineHeight="1.7" flex={1}>
                    {project.summary}
                  </Text>
                  <Wrap mt={4} spacing={1.5}>
                    {project.tags.slice(0, 3).map((tag) => (
                      <WrapItem key={tag}>
                        <Text px={2} py={0.5} bg="softCardBg" borderRadius="full" fontSize="2xs" color="textMuted">
                          {tag}
                        </Text>
                      </WrapItem>
                    ))}
                  </Wrap>
                  {project.link && (
                    <Link href={safeHref(project.link)} isExternal color="accent" fontFamily="mono" fontSize="xs" mt={4}>
                      {t('view')} ↗
                    </Link>
                  )}
                </Box>
              ))}
            </SimpleGrid>
          </Box>

          <Box>
            <SectionHeading id="notes" command="tail -n 6 updates.log" title={t('notes')} />
            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
              <Box layerStyle="card" p={[5, 7]}>
                <VStack align="stretch" spacing={4}>
                  {articles.slice(0, 4).map((article) => {
                    const href = safeHref(article.link)
                    return (
                      <Link
                        key={article.title}
                        href={href || '#'}
                        isExternal={Boolean(href)}
                        role="group"
                        _hover={{ textDecoration: 'none' }}
                      >
                        <Flex justify="space-between" gap={4}>
                          <Box>
                            <Text fontWeight="700" fontSize="sm" transition="color 160ms ease" _groupHover={{ color: 'accent' }}>{article.title}</Text>
                            <Text color="textMuted" fontSize="xs" mt={1} noOfLines={2}>{article.summary}</Text>
                          </Box>
                          <Text color="accent">↗</Text>
                        </Flex>
                      </Link>
                    )
                  })}
                </VStack>
              </Box>
              <Box bg="terminalBg" color={palette.terminal.text} borderRadius="20px" p={[5, 7]} fontFamily="mono">
                <Text color={palette.accentSoft} fontSize="xs" mb={4}>$ latest --limit 3</Text>
                <VStack align="stretch" spacing={4}>
                  {latestNews.map((item) => (
                    <Box key={item.title}>
                      <Text fontSize="xs" color={palette.terminal.muted}>{item.date} / {item.type}</Text>
                      <Text fontSize="sm" mt={1}>{item.title}</Text>
                    </Box>
                  ))}
                </VStack>
              </Box>
            </Grid>
          </Box>
        </VStack>

        <Box
          as="footer"
          mt={[14, 20]}
          pt={7}
          pb={4}
          borderTop="1px solid"
          borderColor="borderSubtle"
          color="textMuted"
          fontSize="xs"
        >
          <Flex direction={{ base: 'column', sm: 'row' }} justify="space-between" gap={3}>
            <Text>© {new Date().getFullYear()} {siteOwner.name.display} · {t('built')}</Text>
            <HStack spacing={4}>
              <Link href={`mailto:${siteOwner.contact.email}`} color="textMuted">{t('contact')}</Link>
              <Link href={safeHref(siteConfig.sourceUrl)} isExternal color="textMuted">Source</Link>
              <Link href="https://www.gnu.org/licenses/gpl-3.0.html" isExternal color="textMuted">GPL-3.0</Link>
              <Link href="https://github.com/H-Freax/TermHub" isExternal color="textMuted">TermHub</Link>
              <Link href="https://github.com/Xin-Jiaqi/minimal-academic-homepage" isExternal color="textMuted">
                Minimal Academic
              </Link>
            </HStack>
          </Flex>
        </Box>
      </Container>
    </Box>
  )
}

export default AcademicHome
