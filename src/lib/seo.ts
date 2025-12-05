import { Metadata } from 'next'

const baseUrl = 'https://www.shahanahmed.com'
const siteName = 'Shahan Ahmed - Data Scientist & ML Engineer'
const defaultDescription = 'Data Scientist and Machine Learning Engineer specializing in NLP, Healthcare Analytics, and Adversarial ML. Portfolio showcasing ML projects, research, and data science solutions. Based in New York, USA.'

export interface SEOConfig {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'profile'
  author?: string
  publishedTime?: string
  modifiedTime?: string
}

export function generateMetadata(config: SEOConfig = {}): Metadata {
  const {
    title,
    description = defaultDescription,
    keywords = [
      'Shahan Ahmed',
      'Shahan Ahmed Data Scientist',
      'Shahan Ahmed ML Engineer',
      'Shahan Ahmed New York',
      'Shahan Ahmed Portfolio',
      'Data Scientist',
      'Machine Learning Engineer',
      'ML Engineer',
      'Data Science Portfolio',
      'NLP',
      'Healthcare Analytics',
      'Adversarial ML',
      'New York',
      'USA',
      'Python',
      'Machine Learning',
      'Data Analysis',
    ],
    image = `${baseUrl}/favicon.png`,
    url = baseUrl,
    type = 'website',
    author = 'Shahan Ahmed',
  } = config

  const fullTitle = title 
    ? `${title} | ${siteName}`
    : siteName

  return {
    metadataBase: new URL(baseUrl),
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: author }],
    creator: author,
    publisher: author,
    openGraph: {
      type,
      url,
      title: fullTitle,
      description,
      siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: '@shahan24h', // Update if you have Twitter handle
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      // Add your verification codes here when available
      // google: 'your-google-verification-code',
      // yandex: 'your-yandex-verification-code',
      // bing: 'your-bing-verification-code',
    },
  }
}

export const defaultSEO = {
  siteName,
  baseUrl,
  defaultDescription,
  author: 'Shahan Ahmed',
  location: 'New York, USA',
  email: 'shahan24h@gmail.com',
  phone: '347 908 3925',
}

