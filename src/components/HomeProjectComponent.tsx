'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { apiClient } from '@/lib/api';
import { Code, Calendar, ArrowRight } from 'lucide-react';

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
  technologies: ['React', 'TypeScript', 'Recharts', 'Tailwind CSS', 'Next.js', 'Machine Learning', 'Data Visualization'],
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
  description: 'Data-backed municipal court assessment covering 19,906 October 2025 cases in Austin. Delivers operational triage, equity monitoring, fiscal impact sizing ($263K savings), and prioritized policy interventions with full supporting materials.',
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

const HomeProjectComponent = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiClient.getProjects() as { data?: Project[] };
        const dbProjects = response.data || [];
        
        // Combine hardcoded projects with database projects
        const allProjects = [
          BEC_ADVERSARIAL_DASHBOARD_PROJECT,
          CANCER_PREDICTION_PIPELINE_PROJECT,
          PHISHING_ROBUSTNESS_DASHBOARD_PROJECT,
          MUNICIPAL_COURT_ANALYSIS_PROJECT,
          QSR_ANALYSIS_PROJECT,
          ML_DASHBOARD_PROJECT,
          ...dbProjects,
        ];
        setProjects(allProjects); // Show all projects
      } catch (error) {
        console.error('Error fetching projects:', error);
        // If API fails, show at least the ML Dashboard
        setProjects([MUNICIPAL_COURT_ANALYSIS_PROJECT, ML_DASHBOARD_PROJECT]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getProjectUrl = (projectId: string) => {
    if (projectId === 'ml-dashboard') return '/project/ml-dashboard';
    if (projectId === 'qsr-analysis') return '/project/qsr-analysis';
    if (projectId === 'municipal-court-case-analysis-austin') return '/project/municipal-court-case-analysis-austin';
    if (projectId === 'bec-adversarial-dashboard') return '/project/bec-adversarial-dashboard';
    if (projectId === 'cancer-prediction-pipeline') return '/project/cancer-prediction-pipeline';
    if (projectId === 'phishing-robustness-dashboard') return '/project/phishing-robustness-dashboard';
    return `/project/${projectId}`;
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-100">
            Featured Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-6">
                <div className="h-48 bg-gray-700 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-700 rounded mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-100">
          Featured Projects
        </h2>
        
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700"
              >
                {/* Clickable Image */}
                <Link 
                  href={getProjectUrl(project._id)}
                  className="block relative"
                >
                  {project.images && project.images.length > 0 ? (
                    <Image
                      src={project.images[0].url}
                      alt={project.title}
                      width={400}
                      height={192}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="bg-gray-700 h-48 flex items-center justify-center">
                      <div className="text-white text-center">
                        <Code size={48} className="mx-auto mb-2" />
                        <span className="text-sm font-medium">
                          {project.title}
                        </span>
                      </div>
                    </div>
                  )}
                </Link>
                
                <div className="p-6">
                  {/* Clickable Title */}
                  <Link 
                    href={getProjectUrl(project._id)}
                    className="block"
                  >
                    <h3 className="text-xl font-bold text-gray-100 mb-3 line-clamp-2">
                      {project.title}
                    </h3>
                  </Link>
                  
                  {/* Technology Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies?.slice(0, 3).map((tech, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 text-xs font-medium bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies?.length > 3 && (
                      <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-gray-700 text-gray-300 rounded-full border border-gray-600">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Date */}
                  <div className="flex items-center text-sm text-gray-400 mb-4">
                    <Calendar size={16} className="mr-2 text-blue-400" />
                    <span>{formatDate(project.createdAt)}</span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-sm leading-relaxed mb-6 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Action Button */}
                  <Link
                    href={getProjectUrl(project._id)}
                    className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-blue-600 text-white font-medium text-sm rounded-lg"
                  >
                    <span>View Project</span>
                    <ArrowRight size={16} className="ml-2" />
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
        
        {projects.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href="/project"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              View All Projects
              <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeProjectComponent; 