'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

interface Snippet {
  _id: string;
  title: string;
  description: string;
  language: string;
  category: string;
  code: string;
  createdAt: string;
}

const SnippetsPage = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const response = await apiClient.getSnippets() as Snippet[] | { data?: Snippet[] };
        if (Array.isArray(response)) {
          setSnippets(response);
        } else if (response.data && Array.isArray(response.data)) {
          setSnippets(response.data);
        }
      } catch (err) {
        console.error("Error fetching snippets:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSnippets();
  }, []);

  const handleDelete = async (snippetId: string) => {
    if (!window.confirm("Are you sure you want to delete this snippet?")) return;
    try {
      const response = await apiClient.deleteSnippet(snippetId) as { success?: boolean; message?: string };
      if (response.success) {
        setSnippets(snippets.filter((snippet) => snippet._id !== snippetId));
      } else {
        alert(response.message || 'Failed to delete snippet');
      }
    } catch (error) {
      console.error('Error deleting snippet:', error);
      alert('Error deleting snippet');
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
          <h1 className="text-2xl font-bold text-white">Manage Snippets</h1>
          <p className="text-gray-400 mt-1">You have {snippets.length} snippets.</p>
        </div>
        <button
          onClick={() => router.push("/dashboard/add-snippet")}
          className="flex items-center space-x-2 mt-4 sm:mt-0 px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
        >
          <Plus size={18} />
          <span>Add New Snippet</span>
        </button>
      </div>
      
      {/* Search and Filters */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-grow">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search snippets..." 
            className="w-full pl-11 p-3 bg-gray-700 border border-gray-600 text-white focus:ring-indigo-500 focus:border-indigo-500" 
          />
        </div>
      </div>

      {/* Snippets Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-white">
          <thead className="bg-gray-700 border-b-2 border-gray-600">
            <tr>
              <th className="p-4 text-sm font-semibold text-gray-300">Title</th>
              <th className="p-4 text-sm font-semibold text-gray-300">Language</th>
              <th className="p-4 text-sm font-semibold text-gray-300">Category</th>
              <th className="p-4 text-sm font-semibold text-gray-300 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {snippets.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-400">
                  No snippets found. Create your first snippet!
                </td>
              </tr>
            ) : (
              snippets.map((snippet) => (
                <tr key={snippet._id} className="hover:bg-gray-700/50">
                  <td className="p-4 align-top">
                    <p className="font-semibold text-white">{snippet.title}</p>
                    <p className="text-sm text-gray-400 mt-1">{snippet.description}</p>
                  </td>
                  <td className="p-4 align-top">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-900 text-blue-300 rounded">
                      {snippet.language || 'N/A'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-400 align-top">
                    {snippet.category || 'Uncategorized'}
                  </td>
                  <td className="p-4 text-center align-top">
                    <div className="flex items-center justify-center space-x-2">
                      <button 
                        onClick={() => router.push(`/dashboard/edit-snippet/${snippet._id}`)} 
                        className="p-2 text-indigo-400 hover:bg-gray-600 rounded"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(snippet._id)} 
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

export default SnippetsPage;
