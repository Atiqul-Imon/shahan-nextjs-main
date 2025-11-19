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

const HomeProjectComponent = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiClient.getProjects() as { data?: Project[] };
        const dbProjects = response.data || [];
        
        // Combine hardcoded ML Dashboard with database projects
        const allProjects = [ML_DASHBOARD_PROJECT, ...dbProjects];
        setProjects(allProjects.slice(0, 3)); // Show only first 3 projects
      } catch (error) {
        console.error('Error fetching projects:', error);
        // If API fails, show at least the ML Dashboard
        setProjects([ML_DASHBOARD_PROJECT]);
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
                  href={project._id === 'ml-dashboard' ? '/project/ml-dashboard' : `/project/${project._id}`}
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
                    href={project._id === 'ml-dashboard' ? '/project/ml-dashboard' : `/project/${project._id}`}
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
                    href={project._id === 'ml-dashboard' ? '/project/ml-dashboard' : `/project/${project._id}`}
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