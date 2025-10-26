'use client';

import { useEffect, useState } from 'react';
import { Mail, Eye, Reply, Trash2, Search, CheckCircle, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  ipAddress?: string;
  userAgent?: string;
  adminNotes?: string;
  createdAt: string;
  readAt?: string;
  repliedAt?: string;
}

interface ContactData {
  messages: ContactMessage[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  counts: {
    unread: number;
    read: number;
    replied: number;
    total: number;
  };
}

const MessagesPage = () => {
  const [data, setData] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMessages = async (status = '', page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      params.append('page', page.toString());
      params.append('limit', '10');

      const response = await fetch(`/api/contact?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(selectedStatus, currentPage);
  }, [selectedStatus, currentPage]);

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handleViewMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    setAdminNotes(message.adminNotes || '');
    setShowModal(true);

    // Mark as read if unread
    if (message.status === 'unread') {
      await updateMessageStatus(message._id, 'read');
    }
  };

  const updateMessageStatus = async (id: string, status: string, notes?: string) => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ 
          status, 
          adminNotes: notes !== undefined ? notes : undefined 
        })
      });

      if (response.ok) {
        // Refresh messages
        fetchMessages(selectedStatus, currentPage);
        if (showModal && selectedMessage?._id === id) {
          setSelectedMessage(prev => prev ? { ...prev, status: status as ContactMessage['status'], adminNotes: notes } : null);
        }
      }
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (response.ok) {
        fetchMessages(selectedStatus, currentPage);
        if (showModal && selectedMessage?._id === id) {
          setShowModal(false);
        }
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleSaveNotes = async () => {
    if (selectedMessage) {
      await updateMessageStatus(selectedMessage._id, selectedMessage.status, adminNotes);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'unread':
        return <Mail size={16} className="text-blue-400" />;
      case 'read':
        return <Eye size={16} className="text-yellow-400" />;
      case 'replied':
        return <Reply size={16} className="text-green-400" />;
      default:
        return <Mail size={16} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread':
        return 'bg-blue-900 text-blue-300';
      case 'read':
        return 'bg-yellow-900 text-yellow-300';
      case 'replied':
        return 'bg-green-900 text-green-300';
      default:
        return 'bg-gray-900 text-gray-300';
    }
  };

  if (loading && !data) {
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
          <h1 className="text-2xl font-bold text-white">Contact Messages</h1>
          <p className="text-gray-400 mt-1">
            {data?.counts.total || 0} total messages
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <MessageCircle size={24} className="text-blue-400" />
            <div>
              <p className="text-2xl font-bold text-white">{data?.counts.total || 0}</p>
              <p className="text-sm text-gray-400">Total Messages</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <Mail size={24} className="text-blue-400" />
            <div>
              <p className="text-2xl font-bold text-white">{data?.counts.unread || 0}</p>
              <p className="text-sm text-gray-400">Unread</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <Eye size={24} className="text-yellow-400" />
            <div>
              <p className="text-2xl font-bold text-white">{data?.counts.read || 0}</p>
              <p className="text-sm text-gray-400">Read</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <CheckCircle size={24} className="text-green-400" />
            <div>
              <p className="text-2xl font-bold text-white">{data?.counts.replied || 0}</p>
              <p className="text-sm text-gray-400">Replied</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        <div className="relative flex-grow">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Messages</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
        </select>
      </div>

      {/* Messages Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-4 text-gray-300 font-medium">Status</th>
              <th className="p-4 text-gray-300 font-medium">From</th>
              <th className="p-4 text-gray-300 font-medium">Message</th>
              <th className="p-4 text-gray-300 font-medium">Date</th>
              <th className="p-4 text-gray-300 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.messages.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-400">
                  No messages found
                </td>
              </tr>
            ) : (
              data?.messages
                .filter(message => 
                  !searchTerm || 
                  message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  message.message.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((message) => (
                  <tr key={message._id} className="border-b border-gray-700 hover:bg-gray-700/30">
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(message.status)}
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(message.status)}`}>
                          {message.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-semibold text-white">{message.name}</p>
                        <p className="text-sm text-gray-400">{message.email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-gray-300 truncate max-w-xs">
                        {message.message}
                      </p>
                    </td>
                    <td className="p-4 text-sm text-gray-400">
                      {format(new Date(message.createdAt), "MMM dd, yyyy HH:mm")}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleViewMessage(message)}
                          className="p-2 text-blue-400 hover:bg-gray-600 rounded"
                          title="View Message"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => updateMessageStatus(message._id, 'replied')}
                          className="p-2 text-green-400 hover:bg-gray-600 rounded"
                          title="Mark as Replied"
                          disabled={message.status === 'replied'}
                        >
                          <Reply size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(message._id)}
                          className="p-2 text-red-400 hover:bg-gray-600 rounded"
                          title="Delete Message"
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

      {/* Pagination */}
      {data && data.pagination.pages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            {Array.from({ length: data.pagination.pages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded ${
                  page === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message Detail Modal */}
      {showModal && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold text-white">Message Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                    <p className="text-white">{selectedMessage.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                    <p className="text-white">{selectedMessage.email}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-white whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(selectedMessage.status)}
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(selectedMessage.status)}`}>
                        {selectedMessage.status}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Received</label>
                    <p className="text-white text-sm">
                      {format(new Date(selectedMessage.createdAt), "MMM dd, yyyy HH:mm")}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Admin Notes</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={3}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add notes about this message..."
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleSaveNotes}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Save Notes
                  </button>
                  <button
                    onClick={() => updateMessageStatus(selectedMessage._id, 'replied')}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    disabled={selectedMessage.status === 'replied'}
                  >
                    Mark as Replied
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
