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
import { CheckIcon, CopyIcon, EmailIcon } from '@chakra-ui/icons'
import { Fragment, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocalizedData } from '@/hooks/useLocalizedData'
import { alpha, palette } from '@/templates/academic/academicTheme'
import { withBase } from '@/utils/asset'
import { safeHref } from '@/utils/safeUrl'
import type { Publication } from '@/types'

const formatYearMonth = (value: string) => value.slice(0, 7).replace('-', '.')

// Mono "filename" label with a fading rule, used to separate card subsections
// without a hard full-width border.
const FileLabel = ({ children }: { children: string }) => (
  <Flex align="center" gap={3} mb={5}>
    <Text fontFamily="mono" color="accent" fontSize="xs" whiteSpace="nowrap">
      {children}
    </Text>
    <Box flex={1} h="1px" bgGradient="linear(to-r, borderSubtle, transparent)" />
  </Flex>
)

const SectionHeading = ({ command, title, id }: { command: string; title: string; id: string }) => (
  <Grid
    id={id}
    templateColumns={{ base: 'auto 1fr', sm: 'auto auto 1fr' }}
    alignItems="center"
    columnGap={3}
    rowGap={1}
    mb={5}
    scrollMarginTop={{ base: '124px', lg: '88px' }}
  >
    <Text
      gridColumn={{ base: '1 / -1', sm: 'auto' }}
      fontFamily="mono"
      fontSize="xs"
      color="accent"
      opacity={0.82}
      whiteSpace="nowrap"
    >
      $ {command}
    </Text>
    <Heading as="h2" fontSize={['xl', '2xl']} letterSpacing="0">
      {title}
    </Heading>
    <Box h="1px" flex={1} bg="borderSubtle" />
  </Grid>
)

const AcademicHome = () => {
  const { t } = useTranslation()
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null)
  const featuredPublicationShadow = useColorModeValue(
    '0 12px 32px rgba(48, 43, 35, 0.05)',
    '0 12px 32px rgba(0, 0, 0, 0.16)',
  )
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

  // Work timeline and education merged into one git-log style track,
  // newest first. Education years look like "2023.09 - 2026.06".
  const careerEntries = useMemo(() => {
    const work = experienceTimeline.map((item) => ({
      key: `${item.title}-${item.start}`,
      sortKey: item.start.slice(0, 7),
      range: `${formatYearMonth(item.start)} - ${item.end ? formatYearMonth(item.end) : t('present')}`,
      title: item.title,
      subtitle: [item.company, item.location].filter(Boolean).join(' · '),
      kind: 'work' as const,
      current: Boolean(item.isCurrent) || !item.end,
    }))
    const education = experience.education.courses.map((course) => ({
      key: `${course.course}-${course.institution}`,
      sortKey: course.year.slice(0, 7).replace('.', '-'),
      range: course.year,
      title: course.course,
      subtitle: [course.institution, course.location].filter(Boolean).join(' · '),
      kind: 'edu' as const,
      current: false,
    }))
    return [...work, ...education].sort((a, b) => b.sortKey.localeCompare(a.sortKey))
  }, [experienceTimeline, experience.education.courses, t])


  const publicationLinks = (publication: Publication) =>
    Object.entries(publication.links)
      .map(([label, href]) => [label, safeHref(href)] as const)
      .filter((entry): entry is readonly [string, string] => Boolean(entry[1]))

  const copyEmail = async (address: string) => {
    let copied = false

    try {
      await navigator.clipboard.writeText(address)
      copied = true
    } catch {
      const input = document.createElement('textarea')
      input.value = address
      input.style.position = 'fixed'
      input.style.opacity = '0'
      document.body.appendChild(input)
      input.select()
      copied = document.execCommand('copy')
      input.remove()
    }

    setCopiedEmail(copied ? address : null)
    if (copied) window.setTimeout(() => setCopiedEmail(null), 1800)
  }

  const contactEmails = [
    { address: siteOwner.contact.email, label: t('emailPersonal'), isWork: false },
    { address: siteOwner.contact.workEmail, label: t('emailWork'), isWork: true },
  ].filter((item) => item.address)

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
          gap={[5, 9]}
          alignItems="center"
          layerStyle="card"
          borderTop="0"
          borderRadius="0 0 20px 20px"
          px={[5, 9, 12]}
          py={[6, 11]}
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
            <Flex mt={[5, 6]} columnGap={4} rowGap={2} align="flex-start" wrap="wrap">
              <VStack spacing={2} align="stretch" w={{ base: 'full', sm: 'auto' }} maxW="full">
                {contactEmails.map((item) => (
                  <Flex
                    key={item.address}
                    align="center"
                    gap={2}
                    pl={3}
                    pr={1}
                    py={1}
                    border="1px solid"
                    borderColor="borderSubtle"
                    borderRadius="full"
                    transition="border-color 0.2s"
                    _hover={{ borderColor: 'accentHoverBorder' }}
                    maxW="full"
                  >
                    <EmailIcon boxSize="13px" color={item.isWork ? 'accentGold' : 'accent'} />
                    <Text
                      display={{ base: 'none', sm: 'block' }}
                      fontFamily="mono"
                      fontSize="xs"
                      color="textMuted"
                      whiteSpace="nowrap"
                    >
                      {item.label}
                    </Text>
                    <Link
                      href={`mailto:${item.address}`}
                      fontFamily="mono"
                      fontSize={{ base: 'xs', sm: 'sm' }}
                      color="textPrimary"
                      minW={0}
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                      _hover={{ color: 'accent', textDecoration: 'none' }}
                    >
                      {item.address}
                    </Link>
                    <IconButton
                      aria-label={copiedEmail === item.address ? t('emailCopied') : t('copyEmail')}
                      title={copiedEmail === item.address ? t('emailCopied') : t('copyEmail')}
                      icon={copiedEmail === item.address ? <CheckIcon /> : <CopyIcon />}
                      onClick={() => copyEmail(item.address)}
                      size="xs"
                      variant="ghost"
                      borderRadius="full"
                      color={copiedEmail === item.address ? 'accent' : 'textMuted'}
                      fontSize="10px"
                      ml="auto"
                    />
                  </Flex>
                ))}
              </VStack>
              <Flex gap={2} direction={{ base: 'row', md: 'column' }} wrap="wrap">
                {[
                  siteOwner.social.github && ['GitHub', siteOwner.social.github],
                  siteOwner.social.googleScholar && ['Scholar', siteOwner.social.googleScholar],
                  siteOwner.social.blog && ['Blog', siteOwner.social.blog],
                ].filter(Boolean).map((item) => {
                  const [label, rawHref] = item as string[]
                  const href = safeHref(rawHref)
                  if (!href) return null
                  return (
                    <Link
                      key={label}
                      href={href}
                      isExternal
                      display="inline-flex"
                      alignItems="center"
                      gap={3}
                      px={3}
                      py={1.5}
                      border="1px solid"
                      borderColor="borderSubtle"
                      borderRadius="full"
                      color="textPrimary"
                      fontFamily="mono"
                      fontSize="sm"
                      transition="border-color 0.2s, color 0.2s"
                      _hover={{ borderColor: 'accentHoverBorder', color: 'accent', textDecoration: 'none' }}
                    >
                      {label} <Text as="span" color="accent" ml="auto">↗</Text>
                    </Link>
                  )
                })}
              </Flex>
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
                boxSize={['132px', '164px', '196px']}
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
                <FileLabel>career.log</FileLabel>
                <VStack align="stretch" spacing={0}>
                  {careerEntries.map((entry, index) => (
                    <Grid
                      key={entry.key}
                      templateColumns={{ base: '17px 1fr', md: '17px 158px 1fr' }}
                      columnGap={4}
                    >
                      <Flex direction="column" align="center">
                        {/* Node shape encodes the entry type: teal diamond = work,
                            gold circle = education; the current role gets a halo.
                            Both sit centered in an equal-height slot so they share
                            the same vertical rhythm. */}
                        <Flex h="20px" align="center" justify="center" flexShrink={0}>
                          {entry.kind === 'work' ? (
                            <Box
                              w="10px"
                              h="10px"
                              transform="rotate(45deg)"
                              borderRadius="2px"
                              bg="accent"
                              boxShadow={entry.current ? '0 0 0 4px var(--chakra-colors-accentSubtleBg)' : undefined}
                            />
                          ) : (
                            <Box
                              w="13px"
                              h="13px"
                              borderRadius="full"
                              bg="cardBg"
                              border="3px solid"
                              borderColor="accentGold"
                            />
                          )}
                        </Flex>
                        {index < careerEntries.length - 1 && (
                          <Box
                            w="1px"
                            flex={1}
                            mt="2px"
                            bgGradient={
                              entry.current
                                ? 'linear(to-b, accentSubtleBorder, borderSubtle)'
                                : undefined
                            }
                            bg={entry.current ? undefined : 'borderSubtle'}
                          />
                        )}
                      </Flex>
                      <Box display={{ base: 'none', md: 'block' }}>
                        <Text
                          as="span"
                          fontFamily="mono"
                          fontSize="xs"
                          whiteSpace="nowrap"
                          {...(entry.current
                            ? {
                                color: 'accent',
                                bg: 'accentSubtleBg',
                                border: '1px solid',
                                borderColor: 'accentSubtleBorder',
                                borderRadius: 'md',
                                px: 2,
                                py: '2px',
                              }
                            : { color: 'textMuted' })}
                        >
                          {entry.range}
                        </Text>
                      </Box>
                      <Box pb={index < careerEntries.length - 1 ? 6 : 0}>
                        <Text fontWeight="700" color={entry.current ? 'accent' : undefined}>
                          {entry.title}
                        </Text>
                        <Box display={{ base: 'block', md: 'none' }} mt={1}>
                          <Text
                            as="span"
                            fontFamily="mono"
                            fontSize="xs"
                            whiteSpace="nowrap"
                            {...(entry.current
                              ? {
                                  color: 'accent',
                                  bg: 'accentSubtleBg',
                                  border: '1px solid',
                                  borderColor: 'accentSubtleBorder',
                                  borderRadius: 'md',
                                  px: 2,
                                  py: '2px',
                                }
                              : { color: 'textMuted' })}
                          >
                            {entry.range}
                          </Text>
                        </Box>
                        <Text color="textMuted" fontSize="sm" mt={1}>{entry.subtitle}</Text>
                      </Box>
                    </Grid>
                  ))}
                </VStack>
                <Box id="cities" scrollMarginTop="88px" mt={[7, 9]}>
                  <FileLabel>footprints.log</FileLabel>
                  {/* Terminal-style route: stops joined by mono `»`, the
                      current city highlighted in accent. */}
                  <Flex align="center" wrap="wrap" columnGap={[4, 6]} rowGap={4}>
                    {cities.map((item, index) => {
                      const isCurrentCity = index === cities.length - 1
                      return (
                        <Fragment key={`${item.period}-${item.city}`}>
                          {index > 0 && (
                            <Text fontFamily="mono" fontSize="md" color="accent" opacity={0.6} aria-hidden="true">
                              »
                            </Text>
                          )}
                          <Box>
                            <Text fontWeight="700" fontSize="sm" color={isCurrentCity ? 'accent' : undefined}>
                              {item.city}
                            </Text>
                            <Box mt={1}>
                              <Text
                                as="span"
                                fontFamily="mono"
                                fontSize="xs"
                                whiteSpace="nowrap"
                                {...(isCurrentCity
                                  ? {
                                      color: 'accent',
                                      bg: 'accentSubtleBg',
                                      border: '1px solid',
                                      borderColor: 'accentSubtleBorder',
                                      borderRadius: 'md',
                                      px: 2,
                                      py: '1px',
                                    }
                                  : { color: 'textMuted' })}
                              >
                                {item.period}
                              </Text>
                            </Box>
                          </Box>
                        </Fragment>
                      )
                    })}
                  </Flex>
                </Box>
              </Box>
              <Box
                py={[5, 6]}
                px={[1, 2]}
                borderTop="1px solid"
                borderBottom="1px solid"
                borderColor="borderSubtle"
              >
                <FileLabel>awards.json</FileLabel>
                <SimpleGrid columns={{ base: 1, sm: 2, lg: Math.min(Math.max(awards.length, 1), 4) }} spacing={4}>
                  {awards.slice(0, 4).map((award) => (
                    <Flex key={`${award.title}-${award.date}`} gap={3} align="flex-start">
                      <Box
                        w="8px"
                        h="8px"
                        transform="rotate(45deg)"
                        borderRadius="1px"
                        bg="accentGold"
                        flexShrink={0}
                        mt="6px"
                      />
                      <Box>
                        <Text fontWeight="600" fontSize="sm">{award.title}</Text>
                        <Text color="textMuted" fontSize="xs">{award.org} · {award.date}</Text>
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
              </Box>
            </Stack>
          </Box>

          <Box>
            <SectionHeading id="research" command="cat interests.txt" title={t('research')} />
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Box
                p={[5, 7]}
                bg="accentSubtleBg"
                border="1px solid"
                borderColor="accentSubtleBorder"
                borderRadius="16px"
              >
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
                  bg={index === 0 ? 'cardBg' : 'transparent'}
                  borderRadius={index === 0 ? '20px' : '14px'}
                  borderLeftWidth={index === 0 ? '3px' : '1px'}
                  borderLeftColor={index === 0 ? 'accent' : 'borderSubtle'}
                  p={index === 0 ? [5, 6] : [4, 5]}
                  boxShadow={index === 0 ? featuredPublicationShadow : undefined}
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
                  minH={{ base: 'auto', md: '230px' }}
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
                        <Text px={2} py={0.5} bg="softCardBg" borderRadius="full" fontSize="xs" color="textMuted">
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
            <Wrap spacingX={4} spacingY={2}>
              <Link href={`mailto:${siteOwner.contact.email}`} color="textMuted">{t('contact')}</Link>
              <Link href={safeHref(siteConfig.sourceUrl)} isExternal color="textMuted">Source</Link>
              <Link href="https://www.gnu.org/licenses/gpl-3.0.html" isExternal color="textMuted">GPL-3.0</Link>
              <Link href="https://github.com/H-Freax/TermHub" isExternal color="textMuted">TermHub</Link>
              <Link href="https://github.com/Xin-Jiaqi/minimal-academic-homepage" isExternal color="textMuted">
                Minimal Academic
              </Link>
            </Wrap>
          </Flex>
        </Box>
      </Container>
    </Box>
  )
}

export default AcademicHome
