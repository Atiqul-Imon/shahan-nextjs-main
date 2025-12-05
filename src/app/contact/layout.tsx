import { generateMetadata } from '@/lib/seo';
import { defaultSEO } from '@/lib/seo';

export const metadata = generateMetadata({
  title: 'Contact Shahan Ahmed - Data Scientist & ML Engineer | New York, USA',
  description: 'Get in touch with Shahan Ahmed, Data Scientist and Machine Learning Engineer based in New York, USA. Available for data science consulting, ML projects, and research collaborations.',
  keywords: [
    'Contact Data Scientist',
    'Hire ML Engineer',
    'Data Science Consultant',
    'Machine Learning Expert',
    'New York Data Scientist',
    'USA ML Engineer',
    'Data Science Services',
  ],
  url: `${defaultSEO.baseUrl}/contact`,
  type: 'website',
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

