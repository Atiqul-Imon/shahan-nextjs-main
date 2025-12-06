'use client';

import { useEffect, useState } from 'react';
import { Calendar, Eye, CheckCircle, XCircle, X, Clock, User, Mail, FileText, Trash2, Search } from 'lucide-react';
import { format } from 'date-fns';
import { apiClient } from '@/lib/api';

interface Appointment {
  _id: string;
  name: string;
  email: string;
  topic: string;
  details?: string;
  startTime: string;
  endTime: string;
  timezone: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled';
  ipAddress?: string;
  userAgent?: string;
  adminNotes?: string;
  confirmedAt?: string;
  rejectedAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface AppointmentData {
  appointments: Appointment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  counts: {
    pending: number;
    confirmed: number;
    rejected: number;
    cancelled: number;
    total: number;
  };
}

const AppointmentsPage = () => {
  const [data, setData] = useState<AppointmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchAppointments = async (status = '', page = 1) => {
    try {
      setLoading(true);
      const result = await apiClient.getAppointments({
        status: status || undefined,
        page,
        limit: 20
      }) as { success: boolean; data: AppointmentData };

      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments(selectedStatus, currentPage);
  }, [selectedStatus, currentPage]);

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handleViewAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setAdminNotes(appointment.adminNotes || '');
    setShowModal(true);
  };

  const updateAppointmentStatus = async (id: string, status: string, notes?: string) => {
    try {
      setUpdating(true);
      const result = await apiClient.updateAppointment(id, {
        status,
        adminNotes: notes !== undefined ? notes : undefined
      });

      if (result) {
        await fetchAppointments(selectedStatus, currentPage);
        if (showModal && selectedAppointment?._id === id) {
          setSelectedAppointment(prev => prev ? { ...prev, status: status as Appointment['status'], adminNotes: notes } : null);
        }
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
      alert('Failed to update appointment. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this appointment? This action cannot be undone.')) return;

    try {
      await apiClient.deleteAppointment(id);
      await fetchAppointments(selectedStatus, currentPage);
      if (showModal && selectedAppointment?._id === id) {
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert('Failed to delete appointment. Please try again.');
    }
  };

  const handleSaveNotes = async () => {
    if (selectedAppointment) {
      await updateAppointmentStatus(selectedAppointment._id, selectedAppointment.status, adminNotes);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} className="text-yellow-400" />;
      case 'confirmed':
        return <CheckCircle size={16} className="text-green-400" />;
      case 'rejected':
        return <XCircle size={16} className="text-red-400" />;
      case 'cancelled':
        return <X size={16} className="text-gray-400" />;
      default:
        return <Clock size={16} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-900 text-yellow-300';
      case 'confirmed':
        return 'bg-green-900 text-green-300';
      case 'rejected':
        return 'bg-red-900 text-red-300';
      case 'cancelled':
        return 'bg-gray-900 text-gray-300';
      default:
        return 'bg-gray-900 text-gray-300';
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM dd, yyyy 'at' h:mm a");
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "h:mm a");
  };

  if (loading && !data) {
    return (
      <div className="bg-gray-800 border border-gray-700 p-6 md:p-8 rounded-2xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-700 rounded w-1/4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          <div className="h-64 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  const filteredAppointments = data?.appointments.filter(appointment =>
    !searchTerm ||
    appointment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (appointment.details && appointment.details.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  return (
    <div className="bg-gray-800 border border-gray-700 p-6 md:p-8 rounded-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Appointment Management</h1>
          <p className="text-gray-400 mt-1">
            {data?.counts.total || 0} total appointments
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <Calendar size={24} className="text-blue-400" />
            <div>
              <p className="text-2xl font-bold text-white">{data?.counts.total || 0}</p>
              <p className="text-sm text-gray-400">Total</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <Clock size={24} className="text-yellow-400" />
            <div>
              <p className="text-2xl font-bold text-white">{data?.counts.pending || 0}</p>
              <p className="text-sm text-gray-400">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <CheckCircle size={24} className="text-green-400" />
            <div>
              <p className="text-2xl font-bold text-white">{data?.counts.confirmed || 0}</p>
              <p className="text-sm text-gray-400">Confirmed</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <XCircle size={24} className="text-red-400" />
            <div>
              <p className="text-2xl font-bold text-white">{data?.counts.rejected || 0}</p>
              <p className="text-sm text-gray-400">Rejected</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <X size={24} className="text-gray-400" />
            <div>
              <p className="text-2xl font-bold text-white">{data?.counts.cancelled || 0}</p>
              <p className="text-sm text-gray-400">Cancelled</p>
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
            placeholder="Search appointments..."
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
          <option value="">All Appointments</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Appointments Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-4 text-gray-300 font-medium">Status</th>
              <th className="p-4 text-gray-300 font-medium">Name</th>
              <th className="p-4 text-gray-300 font-medium">Topic</th>
              <th className="p-4 text-gray-300 font-medium">Date & Time</th>
              <th className="p-4 text-gray-300 font-medium">Created</th>
              <th className="p-4 text-gray-300 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-400">
                  No appointments found
                </td>
              </tr>
            ) : (
              filteredAppointments.map((appointment) => (
                <tr key={appointment._id} className="border-b border-gray-700 hover:bg-gray-700/30">
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(appointment.status)}
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-semibold text-white">{appointment.name}</p>
                      <p className="text-sm text-gray-400">{appointment.email}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-gray-300 truncate max-w-xs">
                      {appointment.topic}
                    </p>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">
                      <p className="text-white">{formatDateTime(appointment.startTime)}</p>
                      <p className="text-gray-400">
                        {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                      </p>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-400">
                    {format(new Date(appointment.createdAt), "MMM dd, yyyy")}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleViewAppointment(appointment)}
                        className="p-2 text-blue-400 hover:bg-gray-600 rounded"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteAppointment(appointment._id)}
                        className="p-2 text-red-400 hover:bg-gray-600 rounded"
                        title="Delete Appointment"
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

      {/* Appointment Detail Modal */}
      {showModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold text-white">Appointment Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Status Section */}
                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(selectedAppointment.status)}
                    <span className={`px-3 py-1 text-sm font-medium rounded ${getStatusColor(selectedAppointment.status)}`}>
                      {selectedAppointment.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    {selectedAppointment.status !== 'confirmed' && (
                      <button
                        onClick={() => updateAppointmentStatus(selectedAppointment._id, 'confirmed')}
                        disabled={updating}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                      >
                        Confirm
                      </button>
                    )}
                    {selectedAppointment.status !== 'rejected' && (
                      <button
                        onClick={() => updateAppointmentStatus(selectedAppointment._id, 'rejected')}
                        disabled={updating}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                      >
                        Reject
                      </button>
                    )}
                    {selectedAppointment.status !== 'cancelled' && (
                      <button
                        onClick={() => updateAppointmentStatus(selectedAppointment._id, 'cancelled')}
                        disabled={updating}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <User size={18} className="text-blue-400" />
                      <label className="text-sm font-medium text-gray-300">Name</label>
                    </div>
                    <p className="text-white">{selectedAppointment.name}</p>
                  </div>
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Mail size={18} className="text-blue-400" />
                      <label className="text-sm font-medium text-gray-300">Email</label>
                    </div>
                    <p className="text-white">{selectedAppointment.email}</p>
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <FileText size={18} className="text-blue-400" />
                    <label className="text-sm font-medium text-gray-300">Topic</label>
                  </div>
                  <p className="text-white font-semibold">{selectedAppointment.topic}</p>
                </div>

                {selectedAppointment.details && (
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText size={18} className="text-blue-400" />
                      <label className="text-sm font-medium text-gray-300">Additional Details</label>
                    </div>
                    <p className="text-white whitespace-pre-wrap">{selectedAppointment.details}</p>
                  </div>
                )}

                {/* Date & Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar size={18} className="text-blue-400" />
                      <label className="text-sm font-medium text-gray-300">Start Time</label>
                    </div>
                    <p className="text-white">{formatDateTime(selectedAppointment.startTime)}</p>
                    <p className="text-sm text-gray-400 mt-1">Timezone: {selectedAppointment.timezone}</p>
                  </div>
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock size={18} className="text-blue-400" />
                      <label className="text-sm font-medium text-gray-300">End Time</label>
                    </div>
                    <p className="text-white">{formatDateTime(selectedAppointment.endTime)}</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Duration: {Math.round((new Date(selectedAppointment.endTime).getTime() - new Date(selectedAppointment.startTime).getTime()) / 60000)} minutes
                    </p>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="block text-gray-400 mb-1">Created</label>
                    <p className="text-gray-300">{format(new Date(selectedAppointment.createdAt), "MMM dd, yyyy 'at' h:mm a")}</p>
                  </div>
                  {selectedAppointment.confirmedAt && (
                    <div>
                      <label className="block text-gray-400 mb-1">Confirmed At</label>
                      <p className="text-gray-300">{format(new Date(selectedAppointment.confirmedAt), "MMM dd, yyyy 'at' h:mm a")}</p>
                    </div>
                  )}
                  {selectedAppointment.rejectedAt && (
                    <div>
                      <label className="block text-gray-400 mb-1">Rejected At</label>
                      <p className="text-gray-300">{format(new Date(selectedAppointment.rejectedAt), "MMM dd, yyyy 'at' h:mm a")}</p>
                    </div>
                  )}
                  {selectedAppointment.cancelledAt && (
                    <div>
                      <label className="block text-gray-400 mb-1">Cancelled At</label>
                      <p className="text-gray-300">{format(new Date(selectedAppointment.cancelledAt), "MMM dd, yyyy 'at' h:mm a")}</p>
                    </div>
                  )}
                </div>

                {/* Admin Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Admin Notes</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={4}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add notes about this appointment..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleSaveNotes}
                    disabled={updating}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    {updating ? 'Saving...' : 'Save Notes'}
                  </button>
                  <button
                    onClick={() => handleDeleteAppointment(selectedAppointment._id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Delete
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

export default AppointmentsPage;

