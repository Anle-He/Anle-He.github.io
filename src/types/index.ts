// ============================================================
// Type definitions — developers only
//
// If you're just editing your portfolio content, you can
// IGNORE this file entirely. It's used internally by the
// template components for type safety.
//
// Every field here is rendered by the academic template. Adding
// a field to content/*.json without rendering it just adds dead
// weight, so keep this file and the template in step.
// ============================================================

export interface NewsItem {
  type: string
  title: string
  date?: string
  sortDate?: string
}

export interface Research {
  currentResearch: {
    lab: string
    advisor?: string
    focus: string
    link: string
  }[]
}

export interface Experience {
  education: {
    courses: {
      course: string
      institution: string
      year: string
      location?: string
    }[]
  }
}

export interface ExperienceEntry {
  title: string
  company: string
  location?: string
  start: string
  end?: string
  isCurrent?: boolean
}

export interface CityResidence {
  period: string
  city: string
}

export interface About {
  journey: string
}

export interface ProjectItem {
  title: string
  summary: string
  link?: string
  tags: string[]
  date?: string
  category: 'robotics' | 'nlp' | 'web-app' | 'data' | 'tooling' | 'healthcare'
  highlights?: string[]
}

export interface Publication {
  id: string
  title: string
  authors: string[]
  venue: string
  year: number
  abstract?: string
  links: {
    paper?: string
    arxiv?: string
    projectPage?: string
    code?: string
    dataset?: string
    demo?: string
  }
  featuredImage?: string
}

export interface Award {
  title: string
  org?: string
  date: string
}
