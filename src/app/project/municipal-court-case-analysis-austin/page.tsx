'use client';

import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Github,
  FileText
} from 'lucide-react';

interface ProjectMetric {
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

interface Finding {
  title: string;
  description: string;
  impact: string;
  priority: 'high' | 'medium' | 'low';
}

interface Recommendation {
  title: string;
  problem: string;
  solution: string;
  timeline: string;
  impact: string;
  priority: 'high' | 'medium' | 'low';
}

const MunicipalCourtAnalysis: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [expandedFindings, setExpandedFindings] = useState<Set<number>>(new Set());

  const metrics: ProjectMetric[] = [
    { label: 'Total Cases Analyzed', value: '19,906', change: '+12%', trend: 'up' },
    { label: 'Active Cases', value: '13,586', change: '68.3%', trend: 'neutral' },
    { label: 'Potential Savings', value: '$263K', change: 'Annual', trend: 'up' },
    { label: 'Data Quality Gap', value: '89.5%', change: 'Missing Demographics', trend: 'down' },
  ];

  const keyFindings: Finding[] = [
    {
      title: 'Case Composition Crisis',
      description: '88.1% of cases (17,547) are parking violations, overwhelming court resources',
      impact: 'Strains judicial system with low-complexity cases',
      priority: 'high'
    },
    {
      title: 'Critical Data Gap',
      description: '89.5% of cases missing demographic data prevents equity analysis',
      impact: 'Cannot assess racial disparities or identify bias patterns',
      priority: 'high'
    },
    {
      title: 'Processing Backlog',
      description: '68.3% active case rate indicates efficiency concerns',
      impact: '13,586 pending cases creating citizen dissatisfaction',
      priority: 'high'
    },
    {
      title: 'Geographic Concentration',
      description: 'South Congress Avenue corridor accounts for 7.1% of all enforcement',
      impact: 'Uneven enforcement distribution across city',
      priority: 'medium'
    },
    {
      title: 'Temporal Patterns',
      description: 'Only 17.5% of enforcement occurs on weekends',
      impact: 'Resource allocation misalignment',
      priority: 'low'
    }
  ];

  const recommendations: Recommendation[] = [
    {
      title: 'Mandate Demographic Data Collection',
      problem: 'Cannot assess enforcement equity with 89.5% missing data',
      solution: 'Require demographic collection for all citations',
      timeline: '30 days',
      impact: 'Enable bias detection and ensure equitable enforcement',
      priority: 'high'
    },
    {
      title: 'Review Case Processing Efficiency',
      problem: '68.3% of cases (13,586) remain active',
      solution: 'Review staffing, procedures, and technology needs',
      timeline: '60 days',
      impact: 'Resolve pending cases 30% faster',
      priority: 'high'
    },
    {
      title: 'Implement Parking Diversion Programs',
      problem: '88.1% of cases are parking violations straining court resources',
      solution: 'Expand online payment, implement warning programs',
      timeline: '90 days',
      impact: 'Save $263K annually, reduce court burden by 30%',
      priority: 'medium'
    },
    {
      title: 'Enhance School Zone Safety',
      problem: '143 school zone violations including 99 speeding incidents',
      solution: 'Increase enforcement, install speed cameras, public education',
      timeline: '30 days',
      impact: 'Improved child safety near schools',
      priority: 'medium'
    },
    {
      title: 'Optimize Weekend Enforcement',
      problem: 'Only 17.5% of enforcement occurs on weekends',
      solution: 'Analyze weekend violation patterns, adjust staffing',
      timeline: '120 days',
      impact: 'Better resource allocation across all days',
      priority: 'low'
    }
  ];

  const toggleFinding = (index: number) => {
    const newExpanded = new Set(expandedFindings);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedFindings(newExpanded);
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getPriorityBadge = (priority: 'high' | 'medium' | 'low') => {
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getPriorityColor(priority)}`}>
        {priority}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">
              Municipal Court Case Analysis
            </h1>
            <p className="text-xl text-blue-100 mb-2">
              Data-Driven Policy Solutions for Court Operations
            </p>
            <p className="text-lg text-blue-200 mb-8">
              October 2025 Analysis • 19,906 Cases • Austin, TX
            </p>
            
            <div className="flex justify-center gap-4 flex-wrap">
              <a 
                href="#overview" 
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition flex items-center gap-2"
              >
                <FileText size={20} />
                View Analysis
              </a>
              <a 
                href="https://github.com/shahan24h/Municipal_Court_Case_Analysis_Austin" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition flex items-center gap-2"
              >
                <Github size={20} />
                GitHub Repository
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                  {metric.change && (
                    <p className={`text-sm mt-2 flex items-center gap-1 ${
                      metric.trend === 'up' ? 'text-green-600' : 
                      metric.trend === 'down' ? 'text-red-600' : 
                      'text-gray-600'
                    }`}>
                      {metric.trend === 'up' && <TrendingUp size={16} />}
                      {metric.trend === 'down' && <AlertTriangle size={16} />}
                      {metric.change}
                    </p>
                  )}
                </div>
                <div className={`p-3 rounded-lg ${
                  metric.trend === 'up' ? 'bg-green-100' : 
                  metric.trend === 'down' ? 'bg-red-100' : 
                  'bg-blue-100'
                }`}>
                  {index === 0 && <BarChart3 className="text-blue-600" size={24} />}
                  {index === 1 && <Calendar className="text-blue-600" size={24} />}
                  {index === 2 && <DollarSign className="text-green-600" size={24} />}
                  {index === 3 && <AlertTriangle className="text-red-600" size={24} />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-white rounded-xl shadow-md p-2 flex gap-2 overflow-x-auto">
          {['overview', 'findings', 'recommendations', 'methodology', 'impact'].map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition ${
                activeSection === section
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Project Overview</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                This comprehensive analysis examined one month (October 2025) of municipal court case data 
                containing 19,906 cases across multiple violation types. The project was designed to support 
                evidence-based policy decisions and identify opportunities for operational improvement in 
                municipal court operations.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <h3 className="text-xl font-bold text-blue-900 mb-3">Objective</h3>
                  <p className="text-gray-700">
                    Analyze municipal court cases to identify operational inefficiencies, equity concerns, 
                    and policy improvement opportunities while quantifying financial impact.
                  </p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                  <h3 className="text-xl font-bold text-green-900 mb-3">Key Achievement</h3>
                  <p className="text-gray-700">
                    Generated actionable recommendations with potential savings of $263,000+ annually 
                    and identified critical data quality gaps affecting 89.5% of cases.
                  </p>
                </div>
              </div>
            </div>

            {/* Case Distribution */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Case Type Distribution</h3>
              <div className="space-y-4">
                {[
                  { type: 'Parking (PK)', count: 17547, percent: 88.1, color: 'bg-blue-500' },
                  { type: 'Traffic (TR)', count: 1645, percent: 8.3, color: 'bg-purple-500' },
                  { type: 'Ordinance (OR)', count: 366, percent: 1.8, color: 'bg-orange-500' },
                  { type: 'Disabled Parking (CP)', count: 238, percent: 1.2, color: 'bg-red-500' },
                  { type: 'Non-Traffic (NT)', count: 110, percent: 0.6, color: 'bg-green-500' },
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-gray-700">{item.type}</span>
                      <span className="text-gray-600">{item.count.toLocaleString()} ({item.percent}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`${item.color} h-3 rounded-full transition-all duration-500`}
                        style={{ width: `${item.percent}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Technology Stack */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Technology Stack</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Data Processing</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Python 3.x</li>
                    <li>• Pandas & NumPy</li>
                    <li>• JSON parsing</li>
                    <li>• Feature engineering</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Visualization</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Matplotlib</li>
                    <li>• Seaborn</li>
                    <li>• Statistical plots</li>
                    <li>• Interactive dashboards</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Analysis</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Descriptive statistics</li>
                    <li>• Temporal analysis</li>
                    <li>• Geographic patterns</li>
                    <li>• Policy modeling</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Key Findings Section */}
        {activeSection === 'findings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Findings</h2>
              <p className="text-gray-700 mb-8">
                Analysis revealed five critical areas requiring immediate attention. Click each finding 
                for detailed information.
              </p>
              
              {keyFindings.map((finding, index) => (
                <div key={index} className="mb-4">
                  <div 
                    className="bg-gray-50 rounded-lg p-6 cursor-pointer hover:bg-gray-100 transition border-l-4 border-blue-600"
                    onClick={() => toggleFinding(index)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{finding.title}</h3>
                          {getPriorityBadge(finding.priority)}
                        </div>
                        <p className="text-gray-700">{finding.description}</p>
                        
                        {expandedFindings.has(index) && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-gray-900 font-semibold mb-2">Impact:</p>
                            <p className="text-gray-700">{finding.impact}</p>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        {expandedFindings.has(index) ? (
                          <ChevronUp className="text-gray-400" />
                        ) : (
                          <ChevronDown className="text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Top Violations */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Top Violation Types</h3>
              <div className="space-y-3">
                {[
                  { violation: 'Parking - No Payment For Use of Metered Space', count: 11007, percent: 55.3 },
                  { violation: 'Parking - Tow Away Zone', count: 2077, percent: 10.4 },
                  { violation: 'Parking - Resident Only Zone', count: 1024, percent: 5.1 },
                  { violation: 'Parking - Left Wheel To Curb', count: 813, percent: 4.1 },
                  { violation: 'Failed To Maintain Financial Responsibility', count: 389, percent: 2.0 },
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <span className="text-gray-700 font-medium">{index + 1}. {item.violation}</span>
                    <span className="text-gray-900 font-bold">{item.count.toLocaleString()} ({item.percent}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recommendations Section */}
        {activeSection === 'recommendations' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Policy Recommendations</h2>
              <p className="text-gray-700 mb-8">
                Five prioritized recommendations with implementation timelines and expected impact.
              </p>

              {recommendations.map((rec, index) => (
                <div key={index} className="mb-6 bg-gray-50 rounded-lg p-6 border-l-4 border-blue-600">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{rec.title}</h3>
                    {getPriorityBadge(rec.priority)}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="text-red-500 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <p className="font-semibold text-gray-900">Problem:</p>
                        <p className="text-gray-700">{rec.problem}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <p className="font-semibold text-gray-900">Solution:</p>
                        <p className="text-gray-700">{rec.solution}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Calendar className="text-blue-500 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <p className="font-semibold text-gray-900">Timeline:</p>
                        <p className="text-gray-700">{rec.timeline}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <TrendingUp className="text-purple-500 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <p className="font-semibold text-gray-900">Expected Impact:</p>
                        <p className="text-gray-700">{rec.impact}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Implementation Timeline */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Implementation Timeline</h3>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-200"></div>
                
                {[
                  { day: 'Day 1-30', action: 'Demographics Collection + School Zone Enhancement', color: 'bg-red-500' },
                  { day: 'Day 31-60', action: 'Case Processing Efficiency Assessment', color: 'bg-orange-500' },
                  { day: 'Day 61-90', action: 'Parking Diversion Pilot Launch', color: 'bg-yellow-500' },
                  { day: 'Day 91-120', action: 'Weekend Enforcement Analysis Complete', color: 'bg-green-500' },
                ].map((milestone, index) => (
                  <div key={index} className="relative pl-12 pb-8">
                    <div className={`absolute left-2 w-4 h-4 rounded-full ${milestone.color} border-4 border-white`}></div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="font-bold text-gray-900">{milestone.day}</p>
                      <p className="text-gray-700">{milestone.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Methodology Section */}
        {activeSection === 'methodology' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Methodology</h2>
              
              <div className="space-y-8">
                {/* Data Pipeline */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Data Processing Pipeline</h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    {[
                      { step: '1. Extract', desc: 'Parse nested JSON structure', icon: '📥' },
                      { step: '2. Clean', desc: 'Handle missing values, normalize data', icon: '🧹' },
                      { step: '3. Analyze', desc: 'Statistical processing, patterns', icon: '📊' },
                      { step: '4. Report', desc: 'Generate visualizations, insights', icon: '📄' },
                    ].map((item, index) => (
                      <div key={index} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="text-3xl mb-2">{item.icon}</div>
                        <p className="font-bold text-gray-900 mb-1">{item.step}</p>
                        <p className="text-sm text-gray-700">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Analysis Types */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Analysis Components</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-bold text-gray-900 mb-3 flex items=center gap-2">
                        <Calendar size={20} className="text-blue-600" />
                        Temporal Analysis
                      </h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Day-of-week patterns</li>
                        <li>• Hourly enforcement trends</li>
                        <li>• Monthly distribution</li>
                        <li>• Seasonal variations</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <MapPin size={20} className="text-green-600" />
                        Geographic Analysis
                      </h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Location hotspots</li>
                        <li>• Corridor concentration</li>
                        <li>• District patterns</li>
                        <li>• Heat mapping</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Users size={20} className="text-purple-600" />
                        Demographic Analysis
                      </h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Race distribution (limited)</li>
                        <li>• Gender patterns</li>
                        <li>• Data quality assessment</li>
                        <li>• Equity gap identification</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <BarChart3 size={20} className="text-orange-600" />
                        Statistical Analysis
                      </h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Frequency distributions</li>
                        <li>• Cross-tabulation</li>
                        <li>• Correlation analysis</li>
                        <li>• Trend identification</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Code Structure */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Project Structure</h3>
                  <div className="bg-gray-900 text-green-400 rounded-lg p-6 font-mono text-sm overflow-x-auto">
                    <pre>{`Case_load_Project/
├── data/
│   └── case_loads.json              # 19,906 cases
├── scripts/
│   ├── load_and_explore.py          # Data loading
│   ├── policy_analysis.py           # Initial analysis
│   ├── comprehensive_analysis.py    # Full analysis
│   ├── geographic_analysis.py       # Location analysis
│   └── executive_materials.py       # Reports
├── output/
│   ├── location_hotspots.csv
│   ├── charge_analysis.csv
│   └── policy_recommendations.csv
├── visualizations/
│   ├── executive_dashboard.png
│   └── temporal_analysis.png
└── reports/
    └── Executive_Summary_Report.txt`}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Impact Section */}
        {activeSection === 'impact' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Business Impact</h2>
              
              {/* Financial Impact */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Financial Analysis</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h4 className="font-bold text-green-900 mb-3">Potential Annual Savings</h4>
                    <p className="text-4xl font-bold text-green-600 mb-2">$263,205</p>
                    <p className="text-gray-700">Through parking diversion programs (30% reduction in court processing)</p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="font-bold text-blue-900 mb-3">Parking Revenue Maintained</h4>
                    <p className="text-4xl font-bold text-blue-600 mb-2">$614,145</p>
                    <p className="text-gray-700">Annual parking fine revenue at $35 average per case</p>
                  </div>
                </div>
              </div>

              {/* Operational Improvements */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Expected Operational Improvements</h3>
                <div className="space-y-4">
                  {[
                    { metric: 'Active Case Rate', current: '68.3%', target: '50%', improvement: '20-30% reduction' },
                    { metric: 'Case Resolution Time', current: 'Baseline', target: '30% faster', improvement: 'Improved efficiency' },
                    { metric: 'Demographic Data Coverage', current: '10.5%', target: '100%', improvement: 'Enable equity analysis' },
                    { metric: 'Court Resource Utilization', current: '100%', target: '70%', improvement: '30% capacity freed' },
                  ].map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-gray-900">{item.metric}</p>
                        <p className="text-sm text-gray-600">{item.improvement}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Current: {item.current}</p>
                        <p className="text-sm font-bold text-green-600">Target: {item.target}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Demonstrated */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Skills Demonstrated</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { category: 'Technical', skills: ['Python/Pandas', 'Data Visualization', 'Statistical Analysis', 'ETL Pipeline'] },
                    { category: 'Analytical', skills: ['Pattern Recognition', 'Root Cause Analysis', 'Predictive Insights', 'Data Quality'] },
                    { category: 'Business', skills: ['Policy Analysis', 'Financial Modeling', 'Stakeholder Communication', 'ROI Calculation'] },
                  ].map((group, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-bold text-gray-900 mb-3">{group.category}</h4>
                      <ul className="space-y-1">
                        {group.skills.map((skill, idx) => (
                          <li key={idx} className="text-gray-700 flex items-center gap-2">
                            <CheckCircle size={16} className="text-green-500" />
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Deliverables */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Project Deliverables</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { name: 'Executive Summary Report', desc: '5-page comprehensive analysis', icon: '📄' },
                  { name: 'Policy Brief', desc: 'One-page stakeholder summary', icon: '📋' },
                  { name: 'Executive Dashboard', desc: 'Visual KPI summary', icon: '📊' },
                  { name: 'Geographic Analysis', desc: 'Location heatmaps & corridors', icon: '🗺️' },
                  { name: 'Temporal Patterns', desc: 'Time-based trends', icon: '📈' },
                  { name: 'Charge Analysis', desc: 'Violation breakdown', icon: '⚖️' },
                  { name: 'Agency Performance', desc: 'Enforcement metrics', icon: '🏛️' },
                  { name: 'Source Code', desc: 'Complete Python pipeline', icon: '💻' },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="font-bold text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Interested in Similar Analysis?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Available for data science and policy analysis consulting
          </p>
          <div className="flex justify-center gap-4">
            <a 
              href="https://www.linkedin.com/in/shahan24h/" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition flex items-center gap-2"
            >
              <ExternalLink size={20} />
              LinkedIn Profile
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MunicipalCourtAnalysis;

