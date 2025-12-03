'use client';

import React from 'react';
import { 
  Database, 
  Brain, 
  CheckCircle, 
  TrendingUp, 
  Code, 
  Github,
  ExternalLink,
  AlertCircle,
  Layers,
  Activity
} from 'lucide-react';

const CancerPredictionProject = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-6 h-6" />
            <span className="text-blue-200 font-medium">Healthcare Analytics</span>
          </div>
          <h1 className="text-5xl font-bold mb-6">
            Cancer Risk Prediction Pipeline
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl">
            End-to-end machine learning pipeline achieving 93% accuracy in predicting 
            high-risk cancer patients using CMS Medicare claims data on Databricks
          </p>
          
          {/* Tech Stack Pills */}
          <div className="flex flex-wrap gap-3 mb-8">
            {['Databricks', 'PySpark', 'Delta Lake', 'MLflow', 'scikit-learn', 'Python'].map((tech) => (
              <span 
                key={tech}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <a 
              href="https://github.com/yourusername/cancer-prediction-pipeline" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              <Github className="w-5 h-5" />
              View on GitHub
            </a>
            <a 
              href="#demo" 
              className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-lg font-semibold hover:bg-white/20 transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
              View Demo
            </a>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-12 px-6 bg-white border-b">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <MetricCard 
              value="93.15%" 
              label="Accuracy" 
              description="Model accuracy"
              color="blue"
            />
            <MetricCard 
              value="100%" 
              label="Recall" 
              description="No missed cases"
              color="green"
            />
            <MetricCard 
              value="9,851" 
              label="Cancer Cases" 
              description="Identified"
              color="purple"
            />
            <MetricCard 
              value="116K+" 
              label="Patients" 
              description="Processed"
              color="indigo"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Project Overview */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Project Overview</h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="text-lg">
                Built a production-grade machine learning pipeline to identify high-risk cancer 
                patients at admission time, enabling healthcare providers to allocate resources 
                effectively and improve patient outcomes through early intervention.
              </p>
            </div>
          </div>

          {/* Architecture Diagram */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Layers className="w-8 h-8 text-blue-600" />
              Delta Lake Architecture
            </h2>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200">
              <div className="space-y-6">
                <ArchitectureLayer 
                  title="Bronze Layer (Raw Data)"
                  items={[
                    "116,352 patient records",
                    "66,773 inpatient claims",
                    "CMS Medicare Synthetic Data"
                  ]}
                  color="amber"
                />
                <div className="flex justify-center">
                  <div className="h-8 w-0.5 bg-blue-400"></div>
                </div>
                <ArchitectureLayer 
                  title="Silver Layer (Cleaned)"
                  items={[
                    "9,851 cancer cases identified",
                    "ICD-9 code classification",
                    "Patient demographics joined"
                  ]}
                  color="gray"
                />
                <div className="flex justify-center">
                  <div className="h-8 w-0.5 bg-blue-400"></div>
                </div>
                <ArchitectureLayer 
                  title="Gold Layer (Model-Ready)"
                  items={[
                    "21 engineered features",
                    "No data leakage",
                    "Admission-time features only"
                  ]}
                  color="yellow"
                />
              </div>
            </div>
          </div>

          {/* Key Results Table */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
              Model Performance
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Metric</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Value</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Interpretation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <MetricRow 
                    metric="Accuracy" 
                    value="93.15%" 
                    interpretation="Correctly identifies 93% of patients"
                  />
                  <MetricRow 
                    metric="Precision" 
                    value="86.84%" 
                    interpretation="When model predicts high-risk, it's correct 87% of time"
                  />
                  <MetricRow 
                    metric="Recall" 
                    value="100%" 
                    interpretation="Catches ALL high-risk patients (no false negatives)"
                    highlight={true}
                  />
                  <MetricRow 
                    metric="F1 Score" 
                    value="92.96%" 
                    interpretation="Strong balance of precision and recall"
                  />
                  <MetricRow 
                    metric="ROC AUC" 
                    value="88.80%" 
                    interpretation="Excellent discrimination capability"
                  />
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-green-800">
                <strong>Clinical Significance:</strong> 100% recall means no high-risk malignant 
                cancer patients are missed by the model, which is critical for healthcare applications.
              </p>
            </div>
          </div>

          {/* Key Learning - Data Leakage */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-orange-600" />
              Problem Solving: Data Leakage
            </h2>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-orange-900 mb-4">❌ Problem Identified</h3>
                  <ul className="space-y-2 text-orange-800">
                    <li>• Initial models: <strong>100% accuracy</strong></li>
                    <li>• Unrealistic performance</li>
                    <li>• Features included outcome variables:</li>
                    <li className="ml-6">- <code className="bg-orange-100 px-2 py-1 rounded">total_claim_amount</code></li>
                    <li className="ml-6">- <code className="bg-orange-100 px-2 py-1 rounded">length_of_stay_days</code></li>
                    <li>• Only known AFTER treatment</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-green-900 mb-4">✅ Solution Implemented</h3>
                  <ul className="space-y-2 text-green-800">
                    <li>• Removed all outcome variables</li>
                    <li>• Used only admission-time features</li>
                    <li>• Redefined target variable</li>
                    <li>• Achieved realistic <strong>93% accuracy</strong></li>
                    <li>• Production-ready model</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 p-4 bg-white rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Impact:</strong> This demonstrates strong ML fundamentals, production 
                  readiness awareness, and the ability to identify and resolve real-world ML problems.
                </p>
              </div>
            </div>
          </div>

          {/* Technical Implementation */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Code className="w-8 h-8 text-blue-600" />
              Technical Implementation
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <TechCard
                title="Data Engineering"
                items={[
                  "PySpark for big data processing",
                  "Delta Lake medallion architecture",
                  "Incremental data ingestion",
                  "Data quality validation"
                ]}
                icon={<Database className="w-6 h-6" />}
              />
              <TechCard
                title="Machine Learning"
                items={[
                  "scikit-learn models",
                  "MLflow experiment tracking",
                  "Hyperparameter logging",
                  "Model versioning"
                ]}
                icon={<Brain className="w-6 h-6" />}
              />
            </div>
          </div>

          {/* Features Used */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Features (No Data Leakage)</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureCard
                category="Demographics"
                features={["Age", "Gender", "Race"]}
                count={3}
                color="blue"
              />
              <FeatureCard
                category="Clinical"
                features={["Cancer type", "Severity", "Comorbidities"]}
                count={4}
                color="purple"
              />
              <FeatureCard
                category="Temporal"
                features={["Admission year", "Month", "Quarter"]}
                count={3}
                color="green"
              />
              <FeatureCard
                category="Patient History"
                features={["Prior claims", "Complexity"]}
                count={2}
                color="orange"
              />
            </div>
          </div>

          {/* Project Structure */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Project Structure</h2>
            <div className="bg-gray-900 rounded-xl p-6 text-green-400 font-mono text-sm overflow-x-auto">
              <pre>{`oncology-treatment-analysis/
├── 00_project_config/
│   └── project_config.py          # Configuration management
├── 01_data_ingestion/
│   └── ingest_cms_data.py         # Load raw data → Bronze layer
├── 02_data_processing/
│   └── data_cleaning_eda.py       # Clean & identify cancer cases → Silver
├── 03_feature_engineering/
│   └── feature_creation.py        # Engineer features → Gold layer
├── 04_model_training/
│   └── model_experiments.py       # Train & track models with MLflow
├── 05_model_evaluation/
│   └── model_evaluation.py        # Model comparison & selection
└── 06_deployment/
    └── model_deployment.py        # Model deployment`}</pre>
            </div>
          </div>

          {/* Key Takeaways */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Takeaways</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <TakeawayCard
                title="Technical Excellence"
                items={[
                  "Production-grade ML pipeline",
                  "Delta Lake architecture",
                  "MLflow experiment tracking",
                  "Data leakage resolution"
                ]}
                color="blue"
              />
              <TakeawayCard
                title="Healthcare Domain"
                items={[
                  "ICD-9 code processing",
                  "Claims data analysis",
                  "Clinical relevance",
                  "100% recall priority"
                ]}
                color="green"
              />
              <TakeawayCard
                title="ML Best Practices"
                items={[
                  "Identified data leakage",
                  "Recognized overfitting",
                  "Interpretable model",
                  "Realistic validation"
                ]}
                color="purple"
              />
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Interested in the Details?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Explore the complete codebase, notebooks, and documentation on GitHub
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="https://github.com/yourusername/cancer-prediction-pipeline" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                <Github className="w-5 h-5" />
                View Full Project
              </a>
              <a 
                href="mailto:your.email@example.com" 
                className="flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-lg font-semibold hover:bg-white/20 transition-colors"
              >
                Get in Touch
              </a>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

// Helper Components

const MetricCard = ({ value, label, description, color }: {
  value: string;
  label: string;
  description: string;
  color: string;
}) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    indigo: 'from-indigo-500 to-indigo-600'
  };

  return (
    <div className="text-center">
      <div className={`inline-block px-6 py-4 bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} rounded-lg text-white mb-2`}>
        <div className="text-3xl font-bold">{value}</div>
      </div>
      <div className="text-lg font-semibold text-gray-900">{label}</div>
      <div className="text-sm text-gray-600">{description}</div>
    </div>
  );
};

const ArchitectureLayer = ({ title, items, color }: {
  title: string;
  items: string[];
  color: string;
}) => {
  const colorClasses = {
    amber: 'border-amber-400 bg-amber-50',
    gray: 'border-gray-400 bg-gray-50',
    yellow: 'border-yellow-400 bg-yellow-50'
  };

  return (
    <div className={`border-2 ${colorClasses[color as keyof typeof colorClasses]} rounded-lg p-6`}>
      <h3 className="font-bold text-lg text-gray-900 mb-3">{title}</h3>
      <ul className="space-y-1">
        {items.map((item, idx) => (
          <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

const MetricRow = ({ metric, value, interpretation, highlight = false }: {
  metric: string;
  value: string;
  interpretation: string;
  highlight?: boolean;
}) => (
  <tr className={highlight ? 'bg-green-50' : ''}>
    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{metric}</td>
    <td className="px-6 py-4 text-sm">
      <span className={`inline-block px-3 py-1 rounded-full font-semibold ${
        highlight ? 'bg-green-200 text-green-900' : 'bg-blue-100 text-blue-900'
      }`}>
        {value}
      </span>
    </td>
    <td className="px-6 py-4 text-sm text-gray-700">{interpretation}</td>
  </tr>
);

const TechCard = ({ title, items, icon }: {
  title: string;
  items: string[];
  icon: React.ReactNode;
}) => (
  <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
    </div>
    <ul className="space-y-2">
      {items.map((item, idx) => (
        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  </div>
);

const FeatureCard = ({ category, features, count, color }: {
  category: string;
  features: string[];
  count: number;
  color: string;
}) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600'
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className={`inline-block px-3 py-1 bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses]} text-white text-sm font-bold rounded-full mb-3`}>
        {count} features
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">{category}</h3>
      <ul className="space-y-2">
        {features.map((feature, idx) => (
          <li key={idx} className="text-sm text-gray-600">• {feature}</li>
        ))}
      </ul>
    </div>
  );
};

const TakeawayCard = ({ title, items, color }: {
  title: string;
  items: string[];
  color: string;
}) => {
  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50',
    green: 'border-green-200 bg-green-50',
    purple: 'border-purple-200 bg-purple-50'
  };

  return (
    <div className={`border-2 ${colorClasses[color as keyof typeof colorClasses]} rounded-xl p-6`}>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">✅ {title}</h3>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
            <span className="text-green-600 font-bold">•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CancerPredictionProject;

