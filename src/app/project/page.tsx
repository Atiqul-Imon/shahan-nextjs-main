'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { apiClient } from '@/lib/api';
import { Code, ArrowRight, ExternalLink } from 'lucide-react';
import { PortfolioSchema } from '@/components/StructuredData';

interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  images: { url: string; public_id: string }[];
  liveUrl?: string;
  sourceUrl?: string;
  createdAt: string;
}

const ML_DASHBOARD_PROJECT: Project = {
  _id: 'ml-dashboard',
  title: 'ML Model Comparison Dashboard',
  description: 'Interactive analytics dashboard for comparing OCR text classification models. Features comprehensive performance analysis, real-time visualizations, and AI-powered recommendations for DistilBERT vs Longformer-DeBERTa models across multiple datasets.',
  technologies: ['React', 'TypeScript', 'Recharts', 'Tailwind CSS', 'Next.js', 'Machine Learning', 'Data Visualization', 'OCR', 'NLP'],
  images: [],
  liveUrl: '/project/ml-dashboard',
  sourceUrl: 'https://github.com/shahan24h/ml-dashboard',
  createdAt: new Date().toISOString(),
};

const QSR_ANALYSIS_PROJECT: Project = {
  _id: 'qsr-analysis',
  title: 'QSR POS Sales Analysis Dashboard',
  description: 'Comprehensive data science project analyzing 1,743 POS transactions across 10 restaurant locations. Features interactive dashboard, machine learning models (100% accuracy), revenue opportunity analysis ($4-5K monthly potential), and complete process flowchart.',
  technologies: ['React', 'TypeScript', 'Recharts', 'Python', 'Machine Learning', 'Data Science', 'Random Forest', 'Data Visualization'],
  images: [],
  liveUrl: '/project/qsr-analysis',
  sourceUrl: '#',
  createdAt: new Date().toISOString(),
};

const MUNICIPAL_COURT_ANALYSIS_PROJECT: Project = {
  _id: 'municipal-court-case-analysis-austin',
  title: 'Municipal Court Case Analysis – Austin, TX',
  description: 'Data-backed municipal court assessment covering 19,906 cases in Austin. Delivers operational triage, equity monitoring, fiscal impact sizing ($263K savings), and prioritized policy interventions with full supporting materials.',
  technologies: ['Python', 'Pandas', 'Seaborn', 'Statistical Modeling', 'Policy Analysis', 'Next.js', 'Tailwind CSS'],
  images: [],
  liveUrl: '/project/municipal-court-case-analysis-austin',
  sourceUrl: undefined,
  createdAt: new Date('2025-10-31').toISOString(),
};

const BEC_ADVERSARIAL_DASHBOARD_PROJECT: Project = {
  _id: 'bec-adversarial-dashboard',
  title: 'Social Engineering & Adversarial Obfuscation in BEC Attacks',
  description: 'Analyzed how Unicode-based adversarial techniques (homoglyphs and zero-width characters) break keyword-based phishing detection, and built a character-level model that reliably detects these obfuscation patterns in BEC phishing emails with 95.4% accuracy.',
  technologies: ['Python', 'Pandas', 'Scikit-learn', 'NLP', 'Adversarial ML', 'Unicode / Homoglyphs', 'Character-level modeling'],
  images: [],
  liveUrl: '/project/bec-adversarial-dashboard',
  sourceUrl: undefined,
  createdAt: new Date().toISOString(),
};

const CANCER_PREDICTION_PIPELINE_PROJECT: Project = {
  _id: 'cancer-prediction-pipeline',
  title: 'Cancer Risk Prediction Pipeline',
  description: 'End-to-end machine learning pipeline achieving 93% accuracy in predicting high-risk cancer patients using CMS Medicare claims data on Databricks. Features Delta Lake architecture, MLflow tracking, and 100% recall for critical healthcare applications.',
  technologies: ['Databricks', 'PySpark', 'Delta Lake', 'MLflow', 'scikit-learn', 'Python', 'Healthcare Analytics'],
  images: [],
  liveUrl: '/project/cancer-prediction-pipeline',
  sourceUrl: undefined,
  createdAt: new Date().toISOString(),
};

const PHISHING_ROBUSTNESS_DASHBOARD_PROJECT: Project = {
  _id: 'phishing-robustness-dashboard',
  title: 'Robustness of Phishing Detection Under Adversarial Unicode Obfuscation',
  description: 'Evaluated how a modern ML-based phishing vs benign classifier behaves when phishing emails are adversarially obfuscated using Unicode homoglyphs and zero-width characters. Achieved 99.8% accuracy with 100% phishing recall, demonstrating robustness compared to keyword-based methods.',
  technologies: ['Python', 'Pandas', 'Scikit-learn', 'TF-IDF', 'Logistic Regression', 'Hugging Face Datasets', 'Adversarial ML', 'Email Security'],
  images: [],
  liveUrl: '/project/phishing-robustness-dashboard',
  sourceUrl: undefined,
  createdAt: new Date().toISOString(),
};

// Hardcoded projects - shown immediately
const HARDCODED_PROJECTS = [
  BEC_ADVERSARIAL_DASHBOARD_PROJECT,
  CANCER_PREDICTION_PIPELINE_PROJECT,
  PHISHING_ROBUSTNESS_DASHBOARD_PROJECT,
  MUNICIPAL_COURT_ANALYSIS_PROJECT,
  QSR_ANALYSIS_PROJECT,
  ML_DASHBOARD_PROJECT,
];

const ProjectPage = () => {
  // Show hardcoded projects immediately - no loading state needed
  const [projects, setProjects] = useState<Project[]>(HARDCODED_PROJECTS);
  const [isLoadingDbProjects, setIsLoadingDbProjects] = useState(false);

  useEffect(() => {
    // Fetch database projects in the background (non-blocking)
    const fetchDbProjects = async () => {
      setIsLoadingDbProjects(true);
      try {
        // Add timeout to prevent long waits
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 2000)
        );
        
        const fetchPromise = apiClient.getProjects() as Promise<{ data?: Project[] }>;
        const response = await Promise.race([fetchPromise, timeoutPromise]) as { data?: Project[] };
        
        const dbProjects = response.data || [];
        if (dbProjects.length > 0) {
          // Append database projects to hardcoded ones
          setProjects(prev => [...prev, ...dbProjects]);
        }
      } catch (error) {
        // Silently fail - we already have hardcoded projects showing
        console.error('Error fetching database projects:', error);
      } finally {
        setIsLoadingDbProjects(false);
      }
    };

    // Fetch in background without blocking render
    fetchDbProjects();
  }, []);

  const getProjectUrl = (projectId: string) => {
    if (projectId === 'ml-dashboard') return '/project/ml-dashboard';
    if (projectId === 'qsr-analysis') return '/project/qsr-analysis';
    if (projectId === 'municipal-court-case-analysis-austin') return '/project/municipal-court-case-analysis-austin';
    if (projectId === 'bec-adversarial-dashboard') return '/project/bec-adversarial-dashboard';
    if (projectId === 'cancer-prediction-pipeline') return '/project/cancer-prediction-pipeline';
    if (projectId === 'phishing-robustness-dashboard') return '/project/phishing-robustness-dashboard';
    return `/project/${projectId}`;
  };

  const getRandomGradient = () => {
    const gradients = [
      'from-blue-400 to-indigo-500',
      'from-green-400 to-teal-500',
      'from-purple-400 to-pink-500',
      'from-orange-400 to-red-500',
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  // No loading state - projects show immediately

  return (
    <div className="min-h-screen bg-gray-900 py-16">
      <PortfolioSchema />
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-100">
          My Projects
        </h1>
        
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project._id}
                className="group bg-gray-800 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-gray-700 hover:border-blue-500/50"
              >
                {/* Clickable Image */}
                <Link 
                  href={getProjectUrl(project._id)}
                  className="block relative overflow-hidden"
                >
                  {project.images && project.images.length > 0 ? (
                    <Image
                      src={project.images[0].url}
                      alt={project.title}
                      width={400}
                      height={192}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className={`bg-gradient-to-br ${getRandomGradient()} h-48 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative`}>
                      <div className="text-white text-center z-10">
                        <Code size={48} className="mx-auto mb-2 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="text-sm font-medium opacity-80 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2 px-4">
                          {project.title}
                        </span>
                      </div>
                      {/* Animated background pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-4 left-4 w-8 h-8 border-2 border-white rounded rotate-45 group-hover:rotate-90 transition-transform duration-500"></div>
                        <div className="absolute bottom-4 right-4 w-6 h-6 border-2 border-white rounded-full group-hover:scale-125 transition-transform duration-500"></div>
                        <div className="absolute top-1/2 right-8 w-4 h-4 bg-white rounded group-hover:rotate-45 transition-transform duration-500"></div>
                      </div>
                    </div>
                  )}
                  {/* Enhanced Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                    <div className="bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center space-x-2">
                      <span className="text-gray-800 font-medium text-sm">View Project</span>
                      <ArrowRight size={16} className="text-gray-800" />
                    </div>
                  </div>
                </Link>
                
                <div className="p-6">
                  {/* Clickable Title */}
                  <Link 
                    href={getProjectUrl(project._id)}
                    className="block group/title"
                  >
                    <h3 className="text-xl font-bold text-gray-100 mb-3 group-hover/title:text-blue-400 transition-colors duration-200 line-clamp-2 leading-tight">
                      {project.title}
                    </h3>
                  </Link>
                  
                  {/* Description */}
                  <p className="text-gray-300 text-sm leading-relaxed mb-6 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Action Button */}
                  <Link
                    href={getProjectUrl(project._id)}
                    className="w-full group/btn inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium text-sm rounded-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg"
                  >
                    <ExternalLink size={16} className="mr-2 group-hover/btn:rotate-12 transition-transform duration-200" />
                    <span>View Project</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400">
            <p>No projects available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectPage; 