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

const HomeProjectComponent = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiClient.getProjects() as { data?: Project[] };
        setProjects(response.data?.slice(0, 3) || []); // Show only first 3 projects
      } catch (error) {
        console.error('Error fetching projects:', error);
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

  const getRandomGradient = () => {
    const gradients = [
      'from-blue-400 to-indigo-500',
      'from-green-400 to-teal-500',
      'from-purple-400 to-pink-500',
      'from-orange-400 to-red-500',
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
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
              <div key={i} className="bg-gray-800 rounded-lg p-6 animate-pulse">
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
                className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="relative">
                  {project.images && project.images.length > 0 ? (
                    <Image
                      src={project.images[0].url}
                      alt={project.title}
                      width={400}
                      height={192}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className={`bg-gradient-to-br ${getRandomGradient()} h-48 flex items-center justify-center`}>
                      <div className="text-white text-center">
                        <Code size={48} className="mx-auto mb-2 opacity-80" />
                        <span className="text-sm font-medium">No image available</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-100 mb-2">
                    {project.title}
                  </h3>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies?.slice(0, 3).map((tech, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center text-sm text-gray-400 mb-4">
                    <Calendar size={16} className="mr-2" />
                    <span>{formatDate(project.createdAt)}</span>
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  <Link
                    href={`/project/${project._id}`}
                    className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors duration-200"
                  >
                    View Details
                    <ArrowRight size={16} className="ml-1" />
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