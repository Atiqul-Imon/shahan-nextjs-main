'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { apiClient } from '@/lib/api';
import { ArrowLeft, Upload, X, Plus } from 'lucide-react';

interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  liveUrl?: string;
  sourceUrl?: string;
  status: string;
  images: Array<{ url: string; public_id: string }>;
}

const EditProjectPage = () => {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    liveUrl: '',
    sourceUrl: '',
    status: 'draft'
  });
  
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [newTech, setNewTech] = useState('');
  const [newImages, setNewImages] = useState<File[]>([]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await apiClient.getProject(projectId) as { success?: boolean; data?: Project };
        if (response.success && response.data) {
          const proj = response.data;
          setProject(proj);
          setFormData({
            title: proj.title,
            description: proj.description,
            liveUrl: proj.liveUrl || '',
            sourceUrl: proj.sourceUrl || '',
            status: proj.status
          });
          setTechnologies(proj.technologies || []);
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError(true);
        setMessage('Failed to load project');
      } finally {
        setFetchLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const addTechnology = () => {
    if (newTech.trim() && !technologies.includes(newTech.trim())) {
      setTechnologies(prev => [...prev, newTech.trim()]);
      setNewTech('');
    }
  };

  const removeTechnology = (tech: string) => {
    setTechnologies(prev => prev.filter(t => t !== tech));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewImages(prev => [...prev, ...files]);
    }
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError(false);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('liveUrl', formData.liveUrl);
      submitData.append('sourceUrl', formData.sourceUrl);
      submitData.append('status', formData.status);
      submitData.append('technologies', JSON.stringify(technologies));
      
      newImages.forEach(image => {
        submitData.append('images', image);
      });

      const response = await apiClient.updateProject(projectId, submitData) as { success?: boolean; message?: string };
      
      if (response.success) {
        setMessage('Project updated successfully!');
        setTimeout(() => {
          router.push('/dashboard/projects');
        }, 1500);
      } else {
        setError(true);
        setMessage(response.message || 'Failed to update project');
      }
    } catch (err: unknown) {
      setError(true);
      setMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
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

  if (!project) {
    return (
      <div className="bg-gray-800 border border-gray-700 p-6 md:p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Project Not Found</h1>
          <button
            onClick={() => router.push('/dashboard/projects')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 border border-gray-700 p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-300" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Project</h1>
          <p className="text-gray-400 mt-1">Update your project information</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Project Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter project title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe your project..."
          />
        </div>

        {/* URLs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Live URL
            </label>
            <input
              type="url"
              name="liveUrl"
              value={formData.liveUrl}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Source Code URL
            </label>
            <input
              type="url"
              name="sourceUrl"
              value={formData.sourceUrl}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://github.com/username/repo"
            />
          </div>
        </div>

        {/* Technologies */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Technologies Used
          </label>
          <div className="flex space-x-2 mb-3">
            <input
              type="text"
              value={newTech}
              onChange={(e) => setNewTech(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
              className="flex-1 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add technology (e.g., React, Node.js)"
            />
            <button
              type="button"
              onClick={addTechnology}
              className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-full"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => removeTechnology(tech)}
                  className="ml-2 hover:text-red-300"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Existing Images */}
        {project.images && project.images.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Current Images
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {project.images.map((image, index) => (
                <div key={index} className="relative">
                  <Image
                    src={image.url}
                    alt={`Project image ${index + 1}`}
                    width={96}
                    height={96}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Images */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Add New Images
          </label>
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
            <Upload size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-400 mb-4">Click to upload or drag and drop new images</p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="inline-block px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg cursor-pointer transition-colors"
            >
              Choose Images
            </label>
          </div>
          
          {newImages.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {newImages.map((image, index) => (
                <div key={index} className="relative">
                  <Image
                    src={URL.createObjectURL(image)}
                    alt={`New preview ${index + 1}`}
                    width={96}
                    height={96}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute -top-2 -right-2 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-lg ${error ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'}`}>
            {message}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !formData.title || !formData.description}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            {loading ? 'Updating...' : 'Update Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProjectPage;
