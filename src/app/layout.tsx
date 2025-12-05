import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { generateMetadata as genMeta, defaultSEO } from '@/lib/seo'
import { PersonSchema, OrganizationSchema, ProfilePageSchema, ProfessionalServiceSchema } from '@/components/StructuredData'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = genMeta({
  title: 'Shahan Ahmed - Data Scientist & ML Engineer Portfolio',
  description: 'Data Scientist and Machine Learning Engineer specializing in NLP, Healthcare Analytics, and Adversarial ML. Portfolio showcasing ML projects, research, and data science solutions. Based in New York, USA.',
  keywords: [
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
  ],
  url: defaultSEO.baseUrl,
  type: 'website',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-US">
      <body className={inter.className}>
        <PersonSchema />
        <OrganizationSchema />
        <ProfilePageSchema />
        <ProfessionalServiceSchema />
        <AuthProvider>
          <div className="min-h-screen bg-gray-900 text-gray-200">
            <Header />
            <main className="pt-20">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
