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
import { withBase } from '@/utils/asset'
import { safeHref } from '@/utils/safeUrl'
import type { Publication } from '@/types'

const SectionHeading = ({ command, title, id }: { command: string; title: string; id: string }) => {
  const line = useColorModeValue('#ded8cc', '#2b333d')
  const muted = useColorModeValue('#65717e', '#9aa7b4')

  return (
    <Flex id={id} align="center" gap={3} mb={5} scrollMarginTop="88px">
      <Text fontFamily="mono" fontSize="xs" color="#2a6f6b" whiteSpace="nowrap">
        $ {command}
      </Text>
      <Heading as="h2" fontSize={['xl', '2xl']} letterSpacing="-0.03em">
        {title}
      </Heading>
      <Box h="1px" flex={1} bg={line} />
      <Text color={muted} fontFamily="mono" fontSize="xs">./</Text>
    </Flex>
  )
}

const AcademicHome = () => {
  const { i18n } = useTranslation()
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

  const isZh = i18n.language.toLowerCase().startsWith('zh')
  const copy = isZh
    ? {
        available: '开放交流与合作',
        research: '研究方向',
        publications: '代表性论文',
        projects: '项目',
        experience: '教育与经历',
        notes: '文章与笔记',
        view: '查看',
        contact: '联系我',
        copyEmail: '复制邮箱地址',
        emailCopied: '邮箱地址已复制',
        empty: '请在 content/ 目录中替换为你的真实内容。',
        built: '基于 Minimal Academic Homepage 与 TermHub 改造',
      }
    : {
        available: 'Open to collaboration',
        research: 'Research',
        publications: 'Selected Publications',
        projects: 'Projects',
        experience: 'Education & Experience',
        notes: 'Posts & Notes',
        view: 'View',
        contact: 'Contact',
        copyEmail: 'Copy email address',
        emailCopied: 'Email address copied',
        empty: 'Replace this sample in the content/ directory.',
        built: 'Adapted from Minimal Academic Homepage and TermHub',
      }

  const bg = useColorModeValue('#f4f1eb', '#101418')
  const card = useColorModeValue('rgba(255, 253, 248, 0.92)', 'rgba(23, 28, 34, 0.94)')
  const softCard = useColorModeValue('#f8f5ef', '#151b21')
  const border = useColorModeValue('#ded8cc', '#2b333d')
  const text = useColorModeValue('#18212b', '#edf2f7')
  const muted = useColorModeValue('#65717e', '#9aa7b4')
  const terminalBg = useColorModeValue('#152a2f', '#090f12')

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
    Object.entries(publication.links).filter((entry): entry is [string, string] => Boolean(entry[1]))

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
      bg={bg}
      backgroundImage={useColorModeValue(
        'radial-gradient(circle at 10% 0%, rgba(42, 111, 107, 0.10), transparent 34rem)',
        'radial-gradient(circle at 10% 0%, rgba(134, 200, 195, 0.08), transparent 34rem)',
      )}
    >
      <Container maxW="1120px" px={[4, 6]} py={[6, 10]}>
        <Box
          bg={terminalBg}
          color="#dce8e7"
          borderRadius="18px 18px 0 0"
          px={[4, 6]}
          py={3}
          fontFamily="mono"
          fontSize="xs"
        >
          <Flex justify="space-between" align="center" gap={4}>
            <HStack spacing={2}>
              <Box w="8px" h="8px" borderRadius="full" bg="#d27a6a" />
              <Box w="8px" h="8px" borderRadius="full" bg="#d6b25e" />
              <Box w="8px" h="8px" borderRadius="full" bg="#72a982" />
              <Text ml={2} color="#8fc9c4">$ whoami --academic</Text>
            </HStack>
            <Text display={{ base: 'none', sm: 'block' }} color="#84989c">
              ~/homepage
            </Text>
          </Flex>
        </Box>

        <Grid
          templateColumns={{ base: '1fr', md: 'minmax(0, 1fr) auto' }}
          gap={[7, 10]}
          alignItems="center"
          bg={card}
          border="1px solid"
          borderColor={border}
          borderTop="0"
          borderRadius="0 0 24px 24px"
          px={[6, 9, 12]}
          py={[8, 11]}
          boxShadow={useColorModeValue(
            '0 24px 70px rgba(48, 43, 35, 0.08)',
            '0 24px 70px rgba(0, 0, 0, 0.28)',
          )}
        >
          <GridItem>
            <Badge
              mb={4}
              px={3}
              py={1}
              borderRadius="full"
              color="#2a6f6b"
              bg={useColorModeValue('#e1efec', '#173b3a')}
              textTransform="none"
              fontFamily="mono"
            >
              status: {copy.available}
            </Badge>
            <Heading
              as="h1"
              fontSize={['4xl', '5xl', '6xl']}
              lineHeight="0.98"
              letterSpacing="-0.055em"
              maxW="760px"
            >
              {siteOwner.name.display}
            </Heading>
            <Text mt={4} fontSize={['lg', 'xl']} color={text} fontWeight="600">
              {siteConfig.title}
            </Text>
            <Text mt={3} maxW="720px" color={muted} fontSize={['sm', 'md']} lineHeight="1.8">
              {siteConfig.tagline}
            </Text>
            <Flex mt={6} align="center" gap={3} wrap="wrap">
              {siteOwner.contact.email && (
                <HStack spacing={1}>
                  <Link
                    href={`mailto:${siteOwner.contact.email}`}
                    color={muted}
                    fontFamily="mono"
                    fontSize="sm"
                    _hover={{ color: '#2a6f6b', textDecoration: 'none' }}
                  >
                    {siteOwner.contact.email}
                  </Link>
                  <IconButton
                    aria-label={emailCopied ? copy.emailCopied : copy.copyEmail}
                    title={emailCopied ? copy.emailCopied : copy.copyEmail}
                    icon={emailCopied ? <CheckIcon /> : <CopyIcon />}
                    onClick={copyEmail}
                    size="xs"
                    variant="ghost"
                    color={emailCopied ? '#2a6f6b' : muted}
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
                        borderColor={border}
                        borderRadius="full"
                        color={text}
                        fontSize="sm"
                        _hover={{ borderColor: '#2a6f6b', color: '#2a6f6b', textDecoration: 'none' }}
                      >
                        {label} <Text as="span" color="#2a6f6b">↗</Text>
                      </Link>
                    </WrapItem>
                  )
                })}
              </Wrap>
            </Flex>
          </GridItem>
          <GridItem justifySelf={{ base: 'center', md: 'end' }}>
            <Box
              p={2}
              bg={softCard}
              border="1px solid"
              borderColor={border}
              borderRadius="22px"
            >
              <Image
                src={withBase(`images/${siteConfig.avatar}`)}
                alt={siteOwner.name.display}
                boxSize={['170px', '205px']}
                objectFit="cover"
                borderRadius="16px"
              />
            </Box>
          </GridItem>
        </Grid>

        <VStack align="stretch" spacing={[12, 16]} mt={[12, 16]}>
          <Box>
            <SectionHeading id="experience" command="git log --career" title={copy.experience} />
            <Grid templateColumns={{ base: '1fr', lg: '1.35fr 0.65fr' }} gap={4}>
              <Box bg={card} border="1px solid" borderColor={border} borderRadius="20px" p={[5, 7]}>
                <VStack align="stretch" spacing={5}>
                  {experienceTimeline.slice(0, 5).map((item) => (
                    <Grid key={`${item.title}-${item.start}`} templateColumns="74px 1fr" gap={4}>
                      <Text fontFamily="mono" fontSize="xs" color="#2a6f6b">
                        {item.start.slice(0, 4)}
                      </Text>
                      <Box borderLeft="1px solid" borderColor={border} pl={4}>
                        <Text fontWeight="700">{item.title}</Text>
                        <Text color={muted} fontSize="sm">{item.company} · {item.location}</Text>
                        {item.summary && <Text color={muted} fontSize="xs" mt={2}>{item.summary}</Text>}
                      </Box>
                    </Grid>
                  ))}
                </VStack>
              </Box>
              <Stack spacing={4}>
                <Box bg={card} border="1px solid" borderColor={border} borderRadius="20px" p={5}>
                  <Text fontFamily="mono" color="#2a6f6b" fontSize="xs" mb={4}>education.json</Text>
                  <VStack align="stretch" spacing={4}>
                    {experience.education.courses.map((item) => (
                      <Box key={`${item.course}-${item.institution}`}>
                        <Text fontWeight="700" fontSize="sm">{item.course}</Text>
                        <Text color={muted} fontSize="xs" mt={1}>{item.institution} · {item.year}</Text>
                      </Box>
                    ))}
                  </VStack>
                </Box>
                <Box
                  id="cities"
                  bg={card}
                  border="1px solid"
                  borderColor={border}
                  borderRadius="20px"
                  p={5}
                  scrollMarginTop="88px"
                >
                  <Text fontFamily="mono" color="#2a6f6b" fontSize="xs" mb={4}>footprints.log</Text>
                  <Grid templateColumns="repeat(3, minmax(0, 1fr))" gap={2} alignItems="start">
                    {cities.map((item, index) => (
                      <Box key={`${item.period}-${item.city}`} position="relative">
                        {index < cities.length - 1 && (
                          <Box
                            position="absolute"
                            top="7px"
                            left="18px"
                            right="-10px"
                            h="1px"
                            bg={border}
                          />
                        )}
                        <Box position="relative" zIndex={1}>
                          <Box w="15px" h="15px" borderRadius="full" bg="#2a6f6b" border="3px solid" borderColor={card} />
                          <Text fontWeight="700" fontSize="sm" mt={3}>{item.city}</Text>
                          <Text color={muted} fontFamily="mono" fontSize="2xs" mt={1}>{item.period}</Text>
                        </Box>
                      </Box>
                    ))}
                  </Grid>
                </Box>
                <Box bg={card} border="1px solid" borderColor={border} borderRadius="20px" p={5}>
                  <Text fontFamily="mono" color="#2a6f6b" fontSize="xs" mb={4}>awards.json</Text>
                  <VStack align="stretch" spacing={3}>
                    {awards.slice(0, 4).map((award) => (
                      <Box key={`${award.title}-${award.date}`}>
                        <Text fontWeight="600" fontSize="sm">{award.title}</Text>
                        <Text color={muted} fontSize="xs">{award.org} · {award.date}</Text>
                      </Box>
                    ))}
                  </VStack>
                </Box>
              </Stack>
            </Grid>
          </Box>

          <Box>
            <SectionHeading id="research" command="cat interests.txt" title={copy.research} />
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Box bg={card} border="1px solid" borderColor={border} borderRadius="20px" p={[5, 7]}>
                <Text color={muted} fontSize="sm" lineHeight="1.9">
                  {about.journey || copy.empty}
                </Text>
                <Wrap mt={5} spacing={2}>
                  {siteOwner.skills.map((skill) => (
                    <WrapItem key={skill.name}>
                      <Text
                        px={3}
                        py={1}
                        bg={softCard}
                        borderRadius="full"
                        fontFamily="mono"
                        fontSize="xs"
                        color="#2a6f6b"
                      >
                        {skill.name}
                      </Text>
                    </WrapItem>
                  ))}
                </Wrap>
              </Box>
              <Box bg={card} border="1px solid" borderColor={border} borderRadius="20px" p={[5, 7]}>
                <VStack align="stretch" spacing={4}>
                  {research.currentResearch.map((item, index) => (
                    <Link key={item.lab} href={safeHref(item.link)} isExternal _hover={{ textDecoration: 'none' }}>
                      <Flex gap={3} align="start">
                        <Text fontFamily="mono" color="#2a6f6b">0{index + 1}</Text>
                        <Box>
                          <Text fontWeight="700">{item.lab}</Text>
                          <Text color={muted} fontSize="sm" mt={1}>{item.focus}</Text>
                          {item.advisor && <Text color={muted} fontSize="xs" mt={1}>{item.advisor}</Text>}
                        </Box>
                      </Flex>
                    </Link>
                  ))}
                </VStack>
              </Box>
            </SimpleGrid>
          </Box>

          <Box>
            <SectionHeading id="publications" command="ls papers/" title={copy.publications} />
            <VStack align="stretch" spacing={4}>
              {selectedPublications.map((publication, index) => (
                <Grid
                  key={publication.id}
                  templateColumns={{ base: '1fr', md: publication.featuredImage ? '220px 1fr' : '1fr' }}
                  gap={5}
                  bg={card}
                  border="1px solid"
                  borderColor={border}
                  borderRadius="20px"
                  p={[5, 6]}
                >
                  {publication.featuredImage && (
                    <Image
                      src={withBase(publication.featuredImage)}
                      alt=""
                      w="full"
                      h="140px"
                      objectFit="contain"
                      bg={softCard}
                      borderRadius="14px"
                      p={2}
                    />
                  )}
                  <Box>
                    <HStack spacing={3} mb={2}>
                      <Text fontFamily="mono" color="#2a6f6b" fontSize="xs">
                        paper_{String(index + 1).padStart(2, '0')}
                      </Text>
                      <Text color={muted} fontSize="xs">{publication.venue} · {publication.year}</Text>
                    </HStack>
                    <Heading as="h3" fontSize={['lg', 'xl']} lineHeight="1.35">
                      {publication.title}
                    </Heading>
                    <Text color={muted} fontSize="sm" mt={2}>
                      {publication.authors.join(', ')}
                    </Text>
                    {publication.abstract && (
                      <Text color={muted} fontSize="sm" mt={3} noOfLines={2} lineHeight="1.7">
                        {publication.abstract}
                      </Text>
                    )}
                    <HStack mt={4} spacing={4} flexWrap="wrap">
                      {publicationLinks(publication).map(([label, href]) => (
                        <Link
                          key={label}
                          href={safeHref(href)}
                          isExternal
                          color="#2a6f6b"
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
            <SectionHeading id="projects" command="find projects -maxdepth 1" title={copy.projects} />
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              {projects.slice(0, 3).map((project, index) => (
                <Box
                  key={project.title}
                  bg={card}
                  border="1px solid"
                  borderColor={border}
                  borderRadius="18px"
                  p={5}
                  minH="230px"
                  display="flex"
                  flexDirection="column"
                >
                  <Text fontFamily="mono" fontSize="xs" color="#2a6f6b">
                    {String(index + 1).padStart(2, '0')}/{project.category}
                  </Text>
                  <Heading as="h3" fontSize="lg" mt={3}>{project.title}</Heading>
                  <Text color={muted} fontSize="sm" mt={3} lineHeight="1.7" flex={1}>
                    {project.summary}
                  </Text>
                  <Wrap mt={4} spacing={1.5}>
                    {project.tags.slice(0, 3).map((tag) => (
                      <WrapItem key={tag}>
                        <Text px={2} py={0.5} bg={softCard} borderRadius="full" fontSize="2xs" color={muted}>
                          {tag}
                        </Text>
                      </WrapItem>
                    ))}
                  </Wrap>
                  {project.link && (
                    <Link href={safeHref(project.link)} isExternal color="#2a6f6b" fontFamily="mono" fontSize="xs" mt={4}>
                      {copy.view} ↗
                    </Link>
                  )}
                </Box>
              ))}
            </SimpleGrid>
          </Box>

          <Box>
            <SectionHeading id="notes" command="tail -n 6 updates.log" title={copy.notes} />
            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
              <Box bg={card} border="1px solid" borderColor={border} borderRadius="20px" p={[5, 7]}>
                <VStack align="stretch" spacing={4}>
                  {articles.slice(0, 4).map((article) => (
                    <Link
                      key={article.title}
                      href={safeHref(article.link) || '#'}
                      isExternal={Boolean(article.link)}
                      _hover={{ textDecoration: 'none' }}
                    >
                      <Flex justify="space-between" gap={4}>
                        <Box>
                          <Text fontWeight="700" fontSize="sm">{article.title}</Text>
                          <Text color={muted} fontSize="xs" mt={1} noOfLines={2}>{article.summary}</Text>
                        </Box>
                        <Text color="#2a6f6b">↗</Text>
                      </Flex>
                    </Link>
                  ))}
                </VStack>
              </Box>
              <Box bg={terminalBg} color="#dce8e7" borderRadius="20px" p={[5, 7]} fontFamily="mono">
                <Text color="#8fc9c4" fontSize="xs" mb={4}>$ latest --limit 3</Text>
                <VStack align="stretch" spacing={4}>
                  {latestNews.map((item) => (
                    <Box key={item.title}>
                      <Text fontSize="xs" color="#84989c">{item.date} / {item.type}</Text>
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
          borderColor={border}
          color={muted}
          fontSize="xs"
        >
          <Flex direction={{ base: 'column', sm: 'row' }} justify="space-between" gap={3}>
            <Text>© {new Date().getFullYear()} {siteOwner.name.display}. {copy.built}.</Text>
            <HStack spacing={4}>
              <Link href={`mailto:${siteOwner.contact.email}`} color={muted}>{copy.contact}</Link>
              <Link href={safeHref(siteConfig.sourceUrl)} isExternal color={muted}>Source</Link>
              <Link href="https://www.gnu.org/licenses/gpl-3.0.html" isExternal color={muted}>GPL-3.0</Link>
              <Link href="https://github.com/H-Freax/TermHub" isExternal color={muted}>TermHub</Link>
              <Link href="https://github.com/Xin-Jiaqi/minimal-academic-homepage" isExternal color={muted}>
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
