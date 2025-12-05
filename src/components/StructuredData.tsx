'use client'

import { useEffect } from 'react'

interface StructuredDataProps {
  data: object
}

export function StructuredData({ data }: StructuredDataProps) {
  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(data)
    script.id = 'structured-data'
    
    // Remove existing structured data if present
    const existing = document.getElementById('structured-data')
    if (existing) {
      existing.remove()
    }
    
    document.head.appendChild(script)
    
    return () => {
      const scriptToRemove = document.getElementById('structured-data')
      if (scriptToRemove) {
        scriptToRemove.remove()
      }
    }
  }, [data])

  return null
}

// Person Schema for Home Page - Enhanced for Personal Discovery
export function PersonSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Shahan Ahmed',
    alternateName: ['Shahan Ahmed Data Scientist', 'Shahan Ahmed ML Engineer'],
    jobTitle: 'Data Scientist & Machine Learning Engineer',
    description: 'Shahan Ahmed is a Data Scientist and Machine Learning Engineer specializing in NLP, Healthcare Analytics, and Adversarial ML. Based in New York, USA. Portfolio showcasing ML projects, research, and data science solutions.',
    url: 'https://www.shahanahmed.com',
    image: 'https://www.shahanahmed.com/favicon.png',
    email: 'shahan24h@gmail.com',
    telephone: '+13479083925',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'New York',
      addressRegion: 'NY',
      addressCountry: 'US',
    },
    sameAs: [
      'https://github.com/shahan24h',
      'https://www.linkedin.com/in/shahan24h/',
      'https://huggingface.co/shahan24h/ai-mini-mlm',
      'https://scholar.google.com/citations?hl=en&user=ROqm-4EAAAAJ',
    ],
    knowsAbout: [
      'Data Science',
      'Machine Learning',
      'Natural Language Processing',
      'Healthcare Analytics',
      'Adversarial Machine Learning',
      'Python',
      'PySpark',
      'Databricks',
      'Deep Learning',
      'Statistical Analysis',
      'NLP Research',
      'Cybersecurity ML',
      'Email Security',
      'Cancer Prediction',
      'Phishing Detection',
    ],
    hasOccupation: {
      '@type': 'Occupation',
      name: 'Data Scientist',
      occupationLocation: {
        '@type': 'City',
        name: 'New York',
      },
    },
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'Educational Institution',
    },
    // Additional fields for better discovery
    givenName: 'Shahan',
    familyName: 'Ahmed',
    nationality: {
      '@type': 'Country',
      name: 'United States',
    },
  }

  return <StructuredData data={schema} />
}

// Portfolio Schema
export function PortfolioSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Shahan Ahmed - Portfolio',
    description: 'Portfolio of data science and machine learning projects',
    url: 'https://www.shahanahmed.com/project',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Social Engineering & Adversarial Obfuscation in BEC Attacks',
          url: 'https://www.shahanahmed.com/project/bec-adversarial-dashboard',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Cancer Risk Prediction Pipeline',
          url: 'https://www.shahanahmed.com/project/cancer-prediction-pipeline',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Robustness of Phishing Detection Under Adversarial Unicode Obfuscation',
          url: 'https://www.shahanahmed.com/project/phishing-robustness-dashboard',
        },
      ],
    },
  }

  return <StructuredData data={schema} />
}

// Project Schema
export function ProjectSchema({
  name,
  description,
  url,
  technologies,
  githubUrl,
  image,
}: {
  name: string
  description: string
  url: string
  technologies?: string[]
  githubUrl?: string
  image?: string
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name,
    description,
    url,
    image: image || 'https://www.shahanahmed.com/favicon.png',
    author: {
      '@type': 'Person',
      name: 'Shahan Ahmed',
    },
    keywords: technologies?.join(', ') || '',
    ...(githubUrl && {
      codeRepository: githubUrl,
    }),
    inLanguage: 'en-US',
    datePublished: new Date().toISOString(),
  }

  return <StructuredData data={schema} />
}

// Organization Schema
export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Shahan Ahmed',
    url: 'https://www.shahanahmed.com',
    logo: 'https://www.shahanahmed.com/favicon.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+13479083925',
      contactType: 'Professional',
      email: 'shahan24h@gmail.com',
      areaServed: 'US',
      availableLanguage: 'English',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'New York',
      addressRegion: 'NY',
      addressCountry: 'US',
    },
    sameAs: [
      'https://github.com/shahan24h',
      'https://www.linkedin.com/in/shahan24h/',
    ],
  }

  return <StructuredData data={schema} />
}

// Breadcrumb Schema
export function BreadcrumbSchema({ items }: { items: Array<{ name: string; url: string }> }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return <StructuredData data={schema} />
}

// ProfilePage Schema - For better personal discovery
export function ProfilePageSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: 'Shahan Ahmed',
      alternateName: ['Shahan Ahmed Data Scientist', 'Shahan Ahmed ML Engineer'],
      jobTitle: 'Data Scientist & Machine Learning Engineer',
      description: 'Shahan Ahmed - Data Scientist and Machine Learning Engineer specializing in NLP, Healthcare Analytics, and Adversarial ML. Based in New York, USA.',
      url: 'https://www.shahanahmed.com',
      image: 'https://www.shahanahmed.com/favicon.png',
      email: 'shahan24h@gmail.com',
      telephone: '+13479083925',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'New York',
        addressRegion: 'NY',
        addressCountry: 'US',
      },
      sameAs: [
        'https://github.com/shahan24h',
        'https://www.linkedin.com/in/shahan24h/',
        'https://huggingface.co/shahan24h/ai-mini-mlm',
        'https://scholar.google.com/citations?hl=en&user=ROqm-4EAAAAJ',
      ],
    },
  }

  return <StructuredData data={schema} />
}

// Professional Service Schema - For service discovery
export function ProfessionalServiceSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Shahan Ahmed - Data Science & ML Consulting',
    provider: {
      '@type': 'Person',
      name: 'Shahan Ahmed',
      jobTitle: 'Data Scientist & Machine Learning Engineer',
      email: 'shahan24h@gmail.com',
      telephone: '+13479083925',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'New York',
        addressRegion: 'NY',
        addressCountry: 'US',
      },
    },
    areaServed: {
      '@type': 'Country',
      name: 'United States',
    },
    serviceType: [
      'Data Science Consulting',
      'Machine Learning Engineering',
      'NLP Solutions',
      'Healthcare Analytics',
      'Adversarial ML Research',
      'Data Analysis',
      'ML Model Development',
    ],
    url: 'https://www.shahanahmed.com',
  }

  return <StructuredData data={schema} />
}

