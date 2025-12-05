'use client';

import React, { useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, DollarSign, ShoppingCart, Target, 
  Award, Store, Zap, Brain,
  Database, Filter, BarChart3, CheckCircle, ArrowRight, Download
} from 'lucide-react';

// Type definitions
interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  color: string;
  trend?: string;
}

interface OpportunityProps {
  rank: number;
  title: string;
  current: string;
  target: string;
  potential: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  timeline: string;
}

const QSRAnalysisProject = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'models' | 'flowchart'>('overview');

  // ============================================================================
  // DATA
  // ============================================================================

  const keyMetrics = [
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: 'Total Revenue',
      value: '$11,625.91',
      subtitle: '1,743 transactions analyzed',
      color: 'from-green-500 to-green-600',
      trend: '+35-45%'
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'ML Accuracy',
      value: '100%',
      subtitle: 'Combo prediction model',
      color: 'from-blue-500 to-blue-600',
      trend: 'Perfect'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Revenue Opportunity',
      value: '$4-5K',
      subtitle: 'Monthly potential increase',
      color: 'from-purple-500 to-purple-600',
      trend: '+35-45%'
    },
    {
      icon: <Store className="w-8 h-8" />,
      title: 'Stores Analyzed',
      value: '10',
      subtitle: 'Across multiple locations',
      color: 'from-orange-500 to-orange-600',
      trend: 'Complete'
    }
  ];

  const revenueByDaypart = [
    { name: 'Lunch', value: 4362, color: '#2ecc71' },
    { name: 'Dinner', value: 3863, color: '#3498db' },
    { name: 'Breakfast', value: 1285, color: '#e74c3c' },
    { name: 'Afternoon', value: 1058, color: '#f39c12' },
    { name: 'Late Night', value: 556, color: '#9b59b6' }
  ];

  const hourlyTransactions = [
    { hour: '6am', orders: 54 },
    { hour: '7am', orders: 51 },
    { hour: '8am', orders: 55 },
    { hour: '9am', orders: 58 },
    { hour: '10am', orders: 131 },
    { hour: '11am', orders: 201 },
    { hour: '12pm', orders: 132 },
    { hour: '1pm', orders: 102 },
    { hour: '2pm', orders: 138 },
    { hour: '3pm', orders: 66 },
    { hour: '4pm', orders: 76 },
    { hour: '5pm', orders: 91 },
    { hour: '6pm', orders: 101 },
    { hour: '7pm', orders: 110 },
    { hour: '8pm', orders: 113 },
    { hour: '9pm', orders: 106 }
  ];

  const comboComparison = [
    { category: 'Individual Items', avgValue: 5.11, orders: 1330 },
    { category: 'Combo Meals', avgValue: 11.70, orders: 413 }
  ];

  const opportunities: OpportunityProps[] = [
    {
      rank: 1,
      title: 'Combo Meal Upselling',
      current: '23.7% combo rate',
      target: 'Increase to 35%',
      potential: '$1,316-1,898',
      priority: 'HIGH',
      timeline: '3-6 months'
    },
    {
      rank: 2,
      title: 'Store Performance Optimization',
      current: '$315 gap between stores',
      target: 'Align all stores to top 3',
      potential: '$1,200-1,500',
      priority: 'HIGH',
      timeline: '2-4 months'
    },
    {
      rank: 3,
      title: 'Breakfast Daypart Growth',
      current: '11.1% revenue share',
      target: 'Grow to 15-18%',
      potential: '$800-1,200',
      priority: 'MEDIUM',
      timeline: '4-6 months'
    }
  ];

  const mlModels = [
    {
      name: 'Combo Upselling Classifier',
      accuracy: '100%',
      type: 'Random Forest',
      description: 'Predicts customer likelihood to purchase combo meals',
      keyFeature: 'Unit Price (56% importance)',
      useCase: 'Real-time POS recommendations'
    },
    {
      name: 'Order Value Predictor',
      accuracy: 'R² = 0.974',
      type: 'Random Forest Regressor',
      description: 'Estimates final transaction value with high precision',
      keyFeature: 'Unit Price & Quantity (98% importance)',
      useCase: 'Revenue forecasting & dynamic pricing'
    }
  ];

  const flowchartSteps = [
    {
      id: 1,
      title: 'Data Collection',
      icon: <Database className="w-8 h-8" />,
      description: 'Collected POS transaction data',
      details: ['1,743 transactions', '10 stores', '14 columns', 'April-August 2025'],
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 2,
      title: 'Data Cleaning',
      icon: <Filter className="w-8 h-8" />,
      description: 'Preprocessed and cleaned dataset',
      details: ['Handled missing values', 'Datetime parsing', 'Feature engineering', 'Categorical encoding'],
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 3,
      title: 'Exploratory Analysis',
      icon: <BarChart3 className="w-8 h-8" />,
      description: 'Discovered patterns and insights',
      details: ['Revenue by daypart', 'Peak hours identified', 'Top menu items', 'Store performance'],
      color: 'from-pink-500 to-pink-600'
    },
    {
      id: 4,
      title: 'ML Model Training',
      icon: <Brain className="w-8 h-8" />,
      description: 'Built predictive models',
      details: ['Combo classifier (100%)', 'Order value predictor (R²=0.974)', 'Feature importance', 'Model validation'],
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 5,
      title: 'Business Insights',
      icon: <Target className="w-8 h-8" />,
      description: 'Identified revenue opportunities',
      details: ['$4-5K monthly potential', '5 key opportunities', 'Actionable recommendations', '90-day roadmap'],
      color: 'from-green-500 to-green-600'
    },
    {
      id: 6,
      title: 'Deployment',
      icon: <CheckCircle className="w-8 h-8" />,
      description: 'Production-ready deliverables',
      details: ['Saved ML models', 'Kaggle notebook', 'Executive summary', 'Integration guide'],
      color: 'from-teal-500 to-teal-600'
    }
  ];

  // ============================================================================
  // COMPONENTS
  // ============================================================================

  const MetricCard: React.FC<MetricCardProps> = ({ icon, title, value, subtitle, color, trend }) => (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className={`w-16 h-16 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center text-white mb-4`}>
        {icon}
      </div>
      <h3 className="text-gray-600 text-sm font-semibold mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
      <p className="text-gray-500 text-sm">{subtitle}</p>
      {trend && (
        <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
          <TrendingUp className="w-3 h-3 mr-1" />
          {trend}
        </div>
      )}
    </div>
  );

  const OpportunityCard: React.FC<OpportunityProps> = ({ rank, title, current, target, potential, priority, timeline }) => {
    const priorityColors = {
      HIGH: 'bg-red-100 text-red-700 border-red-300',
      MEDIUM: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      LOW: 'bg-green-100 text-green-700 border-green-300'
    };

    return (
      <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg mr-4">
              {rank}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500 mt-1">{current}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${priorityColors[priority]}`}>
            {priority}
          </span>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500 font-semibold mb-1">Target</p>
            <p className="text-sm font-semibold text-gray-700">{target}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold mb-1">Potential</p>
            <p className="text-sm font-semibold text-green-600">{potential}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold mb-1">Timeline</p>
            <p className="text-sm font-semibold text-gray-700">{timeline}</p>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              🍔 QSR POS Sales Analysis
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-white/90">
              Unlocking $4-5K Monthly Revenue Through Machine Learning
            </p>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              Complete data analysis of 1,743 transactions across 10 restaurant locations, 
              identifying actionable insights and building production-ready ML models
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-xl shadow-lg p-2 flex flex-wrap gap-2">
          {[
            { id: 'overview', label: 'Overview', icon: <Target className="w-4 h-4" /> },
            { id: 'analysis', label: 'Analysis', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'models', label: 'ML Models', icon: <Brain className="w-4 h-4" /> },
            { id: 'flowchart', label: 'Process Flow', icon: <Zap className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'analysis' | 'models' | 'flowchart')}
              className={`flex-1 min-w-[120px] px-4 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-12">
            {/* Key Metrics */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <Award className="w-8 h-8 mr-3 text-blue-600" />
                Key Metrics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {keyMetrics.map((metric, index) => (
                  <MetricCard key={index} {...metric} />
                ))}
              </div>
            </section>

            {/* Top Opportunities */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <TrendingUp className="w-8 h-8 mr-3 text-purple-600" />
                Top Revenue Opportunities
              </h2>
              <div className="space-y-4">
                {opportunities.map((opp) => (
                  <OpportunityCard key={opp.rank} {...opp} />
                ))}
              </div>
              
              <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Total Potential Impact</h3>
                    <p className="text-gray-600">Conservative estimate with 70% achievement rate</p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-green-600">$4,000-5,000</p>
                    <p className="text-sm text-gray-600">per month (+35-45%)</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Stats Grid */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <ShoppingCart className="w-8 h-8 mr-3 text-orange-600" />
                Business Insights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { label: 'Combo Orders', value: '23.7%', subtitle: 'Current rate (Target: 35%)', color: 'blue' },
                  { label: 'Avg Combo Value', value: '$11.70', subtitle: '129% higher than individual', color: 'green' },
                  { label: 'Peak Hour', value: '11 AM', subtitle: '201 orders (17% of daily)', color: 'purple' },
                  { label: 'Top Item', value: 'Chicken Sandwich Combo', subtitle: '129 orders analyzed', color: 'orange' },
                  { label: 'Modifier Usage', value: '37.7%', subtitle: '62% untapped potential', color: 'pink' },
                  { label: 'Best Store', value: 'Store #101', subtitle: '$1,299 revenue', color: 'indigo' }
                ].map((stat, index) => (
                  <div key={index} className={`bg-white p-6 rounded-xl shadow-md border-l-4 border-${stat.color}-500`}>
                    <p className="text-sm text-gray-600 font-semibold mb-2">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.subtitle}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Analysis Tab */}
        {activeTab === 'analysis' && (
          <div className="space-y-12">
            {/* Revenue by Daypart */}
            <section className="bg-white p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Revenue Distribution by Daypart</h2>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={revenueByDaypart}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: { name: string; percent?: number }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {revenueByDaypart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                {revenueByDaypart.map((item) => (
                  <div key={item.name} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-4 h-4 rounded-full mx-auto mb-2" style={{ backgroundColor: item.color }}></div>
                    <p className="text-sm font-semibold text-gray-700">{item.name}</p>
                    <p className="text-lg font-bold text-gray-900">${item.value.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Hourly Transactions */}
            <section className="bg-white p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Hourly Transaction Pattern</h2>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={hourlyTransactions}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="hour" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: 'white' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                  <strong>Insight:</strong> Peak hours are 10 AM - 2 PM, accounting for 43% of daily revenue. 
                  Staffing optimization during these hours could increase throughput by 15-20%.
                </p>
              </div>
            </section>

            {/* Combo vs Individual */}
            <section className="bg-white p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Combo Meals vs Individual Items</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={comboComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="category" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: 'white' }}
                  />
                  <Legend />
                  <Bar dataKey="avgValue" fill="#8b5cf6" name="Average Order Value ($)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                  <h3 className="font-bold text-gray-900 mb-2">Individual Items</h3>
                  <p className="text-3xl font-bold text-purple-600 mb-1">$5.11</p>
                  <p className="text-sm text-gray-600">1,330 orders (76.3%)</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <h3 className="font-bold text-gray-900 mb-2">Combo Meals</h3>
                  <p className="text-3xl font-bold text-green-600 mb-1">$11.70</p>
                  <p className="text-sm text-gray-600">413 orders (23.7%)</p>
                  <div className="mt-3 inline-flex items-center px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs font-bold">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    129% Higher Value
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ML Models Tab */}
        {activeTab === 'models' && (
          <div className="space-y-8">
            <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl shadow-xl">
              <div className="flex items-center mb-4">
                <Brain className="w-12 h-12 mr-4" />
                <div>
                  <h2 className="text-3xl font-bold">Machine Learning Models</h2>
                  <p className="text-blue-100 mt-2">Production-ready predictive models for revenue optimization</p>
                </div>
              </div>
            </section>

            {mlModels.map((model, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-purple-500">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{model.name}</h3>
                    <p className="text-gray-600 mb-4">{model.description}</p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full font-bold">
                      <Award className="w-5 h-5 mr-2" />
                      {model.accuracy}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 font-semibold mb-1">Model Type</p>
                    <p className="text-lg font-bold text-gray-900">{model.type}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 font-semibold mb-1">Key Feature</p>
                    <p className="text-lg font-bold text-gray-900">{model.keyFeature}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 font-semibold mb-1">Use Case</p>
                    <p className="text-lg font-bold text-gray-900">{model.useCase}</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-900">
                    <strong>Deployment:</strong> This model is ready for integration into POS systems. 
                    Download the pickle file and use the provided API for real-time predictions.
                  </p>
                </div>
              </div>
            ))}

            {/* Model Performance Comparison */}
            <section className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Model Performance Comparison</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-bold text-gray-700">Model</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-700">Accuracy Metric</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-700">Training Samples</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-4 px-4 font-semibold">Combo Upselling Classifier</td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                          100% Accuracy
                        </span>
                      </td>
                      <td className="py-4 px-4">1,307 samples</td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                          PRODUCTION
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-4 px-4 font-semibold">Order Value Predictor</td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                          R² = 0.974
                        </span>
                      </td>
                      <td className="py-4 px-4">1,386 samples</td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                          PRODUCTION
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* Flowchart Tab */}
        {activeTab === 'flowchart' && (
          <div className="space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl shadow-xl">
              <h2 className="text-3xl font-bold mb-3">Analysis Process Flow</h2>
              <p className="text-blue-100 text-lg">
                Step-by-step methodology used to transform raw POS data into actionable business insights
              </p>
            </div>

            {/* Flowchart */}
            <div className="relative">
              {/* Connecting Lines */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-300 via-purple-300 to-green-300 transform -translate-x-1/2"></div>

              {/* Steps */}
              <div className="space-y-12">
                {flowchartSteps.map((step, index) => (
                  <div key={step.id} className="relative">
                    {/* Step Number Circle */}
                    <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-16 h-16 bg-white rounded-full items-center justify-center shadow-lg border-4 border-blue-200 z-10">
                      <span className="text-2xl font-bold text-blue-600">{step.id}</span>
                    </div>

                    {/* Step Content */}
                    <div className={`md:w-5/12 ${index % 2 === 0 ? 'md:mr-auto md:pr-24' : 'md:ml-auto md:pl-24'}`}>
                      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        {/* Header */}
                        <div className={`bg-gradient-to-r ${step.color} text-white p-6`}>
                          <div className="flex items-center mb-2">
                            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                              {step.icon}
                            </div>
                            <div>
                              <div className="text-sm font-semibold opacity-90">Step {step.id}</div>
                              <h3 className="text-2xl font-bold">{step.title}</h3>
                            </div>
                          </div>
                          <p className="text-white/90 mt-2">{step.description}</p>
                        </div>

                        {/* Details */}
                        <div className="p-6">
                          <ul className="space-y-3">
                            {step.details.map((detail, idx) => (
                              <li key={idx} className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700">{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Arrow for mobile */}
                    {index < flowchartSteps.length - 1 && (
                      <div className="md:hidden flex justify-center my-4">
                        <ArrowRight className="w-8 h-8 text-blue-400 transform rotate-90" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Stack */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Technical Stack Used</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Python', icon: '🐍', color: 'blue' },
                  { name: 'Pandas', icon: '🐼', color: 'purple' },
                  { name: 'Scikit-learn', icon: '🤖', color: 'orange' },
                  { name: 'Matplotlib', icon: '📊', color: 'green' },
                  { name: 'Seaborn', icon: '🎨', color: 'pink' },
                  { name: 'NumPy', icon: '🔢', color: 'indigo' },
                  { name: 'Random Forest', icon: '🌳', color: 'teal' },
                  { name: 'Jupyter', icon: '📓', color: 'red' }
                ].map((tech) => (
                  <div key={tech.name} className={`p-4 bg-${tech.color}-50 rounded-lg border-2 border-${tech.color}-200`}>
                    <div className="text-3xl mb-2">{tech.icon}</div>
                    <p className="font-semibold text-gray-900">{tech.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Methodology */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-bold mb-6">Methodology Highlights</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="text-4xl mb-3">📊</div>
                  <h4 className="font-bold text-lg mb-2">Data-Driven</h4>
                  <p className="text-gray-300 text-sm">
                    Every recommendation backed by statistical analysis and machine learning predictions
                  </p>
                </div>
                <div>
                  <div className="text-4xl mb-3">⚡</div>
                  <h4 className="font-bold text-lg mb-2">Action-Oriented</h4>
                  <p className="text-gray-300 text-sm">
                    Focused on deliverable insights with clear implementation timelines and expected ROI
                  </p>
                </div>
                <div>
                  <div className="text-4xl mb-3">🎯</div>
                  <h4 className="font-bold text-lg mb-2">Business-Focused</h4>
                  <p className="text-gray-300 text-sm">
                    Prioritized opportunities by revenue impact, feasibility, and implementation complexity
                  </p>
                </div>
              </div>
            </div>

            {/* Download Section */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-blue-200">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Download Full Documentation</h3>
                  <p className="text-gray-600">
                    Get the complete analysis report, code, and models
                  </p>
                </div>
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold flex items-center">
                  <Download className="w-5 h-5 mr-2" />
                  Download Package
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Interested in Similar Analysis?</h2>
          <p className="text-xl text-white/90 mb-8">
            I can help you unlock hidden revenue opportunities in your business data
          </p>
        </div>
      </section>
    </div>
  );
};

export default QSRAnalysisProject;

