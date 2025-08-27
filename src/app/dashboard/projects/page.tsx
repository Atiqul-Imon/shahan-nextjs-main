'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { format } from 'date-fns';

interface Project {
  _id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiClient.getProjects();
        if (response.success && response.data) {
          const sortedProjects = response.data.sort((a: Project, b: Project) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setProjects(sortedProjects);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleDelete = async (projectId: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      const response = await apiClient.deleteProject(projectId);
      if (response.success) {
        setProjects(projects.filter((project) => project._id !== projectId));
      } else {
        alert(response.message || 'Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project');
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800 border border-gray-700 p-6 md:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-700 rounded w-1/4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          <div className="h-64 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 border border-gray-700 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Projects</h1>
          <p className="text-gray-400 mt-1">You have {projects.length} projects.</p>
        </div>
        <button
          onClick={() => router.push("/dashboard/add-project")}
          className="flex items-center space-x-2 mt-4 sm:mt-0 px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
        >
          <Plus size={18} />
          <span>Add New Project</span>
        </button>
      </div>
      
      {/* Search and Filters */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-grow">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search projects..." 
            className="w-full pl-11 p-3 bg-gray-700 border border-gray-600 text-white focus:ring-indigo-500 focus:border-indigo-500" 
          />
        </div>
      </div>

      {/* Projects Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-white">
          <thead className="bg-gray-700 border-b-2 border-gray-600">
            <tr>
              <th className="p-4 text-sm font-semibold text-gray-300">Title</th>
              <th className="p-4 text-sm font-semibold text-gray-300">Status</th>
              <th className="p-4 text-sm font-semibold text-gray-300">Created At</th>
              <th className="p-4 text-sm font-semibold text-gray-300 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {projects.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-400">
                  No projects found. Create your first project!
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project._id} className="hover:bg-gray-700/50">
                  <td className="p-4 align-top">
                    <p className="font-semibold text-white">{project.title}</p>
                    <p className="text-sm text-gray-400 mt-1">{project.description}</p>
                  </td>
                  <td className="p-4 align-top">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      project.status === 'completed' 
                        ? 'bg-green-900 text-green-300' 
                        : 'bg-yellow-900 text-yellow-300'
                    }`}>
                      {project.status || 'draft'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-400 align-top">
                    {format(new Date(project.createdAt), "MM/dd/yyyy")}
                  </td>
                  <td className="p-4 text-center align-top">
                    <div className="flex items-center justify-center space-x-2">
                      <button 
                        onClick={() => router.push(`/dashboard/edit-project/${project._id}`)} 
                        className="p-2 text-indigo-400 hover:bg-gray-600 rounded"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(project._id)} 
                        className="p-2 text-red-400 hover:bg-gray-600 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectsPage;
