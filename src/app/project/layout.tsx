import { generateMetadata } from '@/lib/seo';
import { defaultSEO } from '@/lib/seo';

export const metadata = generateMetadata({
  title: 'Projects - Data Science & ML Portfolio | Shahan Ahmed',
  description: 'Explore data science and machine learning projects by Shahan Ahmed. Including NLP research, healthcare analytics, adversarial ML, and data visualization projects.',
  keywords: [
    'Data Science Projects',
    'ML Projects',
    'Machine Learning Portfolio',
    'NLP Projects',
    'Healthcare Analytics',
    'Adversarial ML',
    'Data Visualization',
  ],
  url: `${defaultSEO.baseUrl}/project`,
  type: 'website',
});

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

