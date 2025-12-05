import HomePage from '@/components/HomePage';
import { generateMetadata } from '@/lib/seo';
import { defaultSEO } from '@/lib/seo';

export const metadata = generateMetadata({
  title: 'Shahan Ahmed - Data Scientist & Machine Learning Engineer | New York, USA',
  description: 'Shahan Ahmed is a Data Scientist and Machine Learning Engineer specializing in NLP, Healthcare Analytics, and Adversarial ML. Portfolio showcasing ML projects, research, and data science solutions. Based in New York, USA.',
  keywords: [
    'Shahan Ahmed',
    'Shahan Ahmed Data Scientist',
    'Shahan Ahmed ML Engineer',
    'Shahan Ahmed New York',
    'Shahan Ahmed Portfolio',
    'Shahan Ahmed Machine Learning',
    'Shahan Ahmed NLP',
    'Data Scientist',
    'Machine Learning Engineer',
    'ML Engineer',
    'Data Science Portfolio',
    'NLP',
    'Healthcare Analytics',
    'Adversarial ML',
    'New York Data Scientist',
    'USA ML Engineer',
    'Python',
    'Machine Learning',
    'Data Analysis',
    'Research Analyst',
    'BI Analyst',
    'Data Analyst',
  ],
  url: defaultSEO.baseUrl,
  type: 'profile',
});

export default function Home() {
  return (
    <HomePage />
  );
}
