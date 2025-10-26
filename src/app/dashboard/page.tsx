'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Briefcase, Code, Users, MessageSquare } from 'lucide-react';

interface DashboardStats {
  projects: number;
  snippets: number;
  messages: number;
}

interface StatCardProps {
  icon: React.ComponentType<{ size: number; className?: string }>;
  label: string;
  value: number;
  color: string;
}

const StatCard = ({ icon, label, value, color }: StatCardProps) => {
  const Icon = icon;
  return (
    <div className="p-6 rounded-2xl bg-gray-800 border border-gray-700 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{label}</p>
          <p className="text-3xl font-bold text-gray-200">{value}</p>
        </div>
        <div className={`w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats>({ projects: 0, snippets: 0, messages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [projectData, snippetData, messagesData] = await Promise.all([
          apiClient.getProjects(),
          apiClient.getSnippets(),
          apiClient.getContactMessages(),
        ]);

        const projects = projectData as { data?: unknown[] };
        const snippets = snippetData as unknown[];
        const messages = messagesData as { data?: { counts?: { total?: number } } };

        setStats({
          projects: projects.data?.length || 0,
          snippets: snippets?.length || 0,
          messages: messages.data?.counts?.total || 0,
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const chartData = [
    { name: 'Projects', count: stats.projects, fill: '#16a34a' },
    { name: 'Snippets', count: stats.snippets, fill: '#f97316' },
    { name: 'Messages', count: stats.messages, fill: '#3b82f6' },
  ];

  const pieChartColors = ['#16a34a', '#f97316', '#3b82f6'];

  if (loading) {
    return (
      <div className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-800 p-6 rounded-2xl animate-pulse">
              <div className="h-8 bg-gray-700 rounded mb-4"></div>
              <div className="h-6 bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-200">Dashboard Overview</h1>
        <p className="text-gray-400 mt-1">Welcome back! Here&apos;s a summary of your content.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Briefcase} label="Total Projects" value={stats.projects} color="from-green-500 to-green-400" />
        <StatCard icon={Code} label="Total Snippets" value={stats.snippets} color="from-orange-500 to-orange-400" />
        <StatCard icon={MessageSquare} label="Total Messages" value={stats.messages} color="from-blue-500 to-blue-400" />
        <StatCard icon={Users} label="Total Users" value={1} color="from-purple-500 to-purple-400" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-soft">
          <h2 className="text-lg font-semibold text-gray-200 mb-4">Content Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9CA3AF' }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  borderRadius: '0.5rem',
                  border: '1px solid #374151',
                  color: '#F9FAFB'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '14px', color: '#9CA3AF' }} />
              <Bar dataKey="count" name="Total Count" barSize={40} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="lg:col-span-2 bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-soft">
          <h2 className="text-lg font-semibold text-gray-200 mb-4">Content Types</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={chartData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieChartColors[index % pieChartColors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  borderRadius: '0.5rem',
                  border: '1px solid #374151',
                  color: '#F9FAFB'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '14px', color: '#9CA3AF' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 