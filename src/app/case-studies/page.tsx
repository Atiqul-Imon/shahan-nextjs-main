import Link from 'next/link';
import { ArrowLeft, ArrowRight, Briefcase } from 'lucide-react';

export const metadata = {
  title: 'Case Studies — Shahan Ahmed',
  description: 'End-to-end ML case studies covering document intelligence, healthcare analytics, adversarial ML, and public health research.',
};

const caseStudies = [
  {
    title: "Medical Document Classifier",
    problem: "How do you route 50K+ medical documents automatically with near-zero error?",
    result: "99%+ accuracy on 50K+ medical documents",
    tech: ["Longformer", "HuggingFace", "Python", "PyTorch"],
    link: "#",
    description:
      "Built a production document classification system using Longformer transformers to automatically categorize and route high-volume medical documents. The system processes tens of thousands of records with near-zero misclassification, replacing a costly manual triage workflow.",
    category: "NLP / Document Intelligence",
  },
  {
    title: "Cancer Risk Prediction Pipeline",
    problem: "Can CMS Medicare claims data predict which patients are highest risk?",
    result: "93% accuracy, 100% recall on critical cases",
    tech: ["Databricks", "PySpark", "Delta Lake", "MLflow", "scikit-learn"],
    link: "/project/cancer-prediction-pipeline",
    description:
      "Designed and deployed a multi-stage ML pipeline on Databricks using CMS Medicare claims data to predict cancer treatment pathways and flag high-risk patients. The Delta Lake medallion architecture ensures data quality across the pipeline, and MLflow tracks all experiments.",
    category: "Healthcare Analytics",
  },
  {
    title: "Phishing Detection Under Adversarial Attacks",
    problem: "Do ML phishing classifiers survive Unicode homoglyph obfuscation?",
    result: "99.8% accuracy, 100% phishing recall",
    tech: ["Python", "Scikit-learn", "TF-IDF", "Adversarial ML"],
    link: "/project/phishing-robustness-dashboard",
    description:
      "Investigated the robustness of ML-based phishing classifiers when subjected to Unicode homoglyph substitution attacks. Developed augmented training data with adversarial examples to harden the classifier and published findings with a public dashboard.",
    category: "Adversarial ML / Security",
  },
  {
    title: "DHS Vaccination Coverage Analysis",
    problem: "What do DHS surveys reveal about vaccination coverage gaps across countries?",
    result: "Presented at MSU Research Symposium 2024",
    tech: ["Python", "Pandas", "Statistical Analysis", "DHS Data"],
    link: "#",
    description:
      "Analyzed Demographic and Health Surveys (DHS) data across multiple countries to surface disparities in childhood vaccination coverage. Identified socioeconomic and geographic correlates of under-vaccination, informing federated learning research for health equity.",
    category: "Public Health Research",
  },
];

export default function CaseStudiesPage() {
  return (
    <main className="min-h-screen bg-gray-900 pt-28 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-gray-100 transition-colors duration-200 mb-10 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
          <span>Back to Home</span>
        </Link>

        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <Briefcase className="text-blue-400 w-7 h-7" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-100">Case Studies</h1>
            <p className="text-gray-400 mt-2">End-to-end ML systems built and shipped in production.</p>
          </div>
        </div>

        {/* View All Projects link */}
        <div className="mb-12">
          <Link
            href="/project"
            className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors duration-200 group"
          >
            <span>View all projects in portfolio</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        {/* Case Study Cards */}
        <div className="space-y-8">
          {caseStudies.map((study, index) => (
            <div
              key={index}
              className="bg-gray-800 border border-gray-700 rounded-2xl p-7 hover:border-gray-500 transition-all duration-300 hover:shadow-lg"
            >
              {/* Category badge */}
              <span className="inline-block px-3 py-1 rounded-full bg-gray-700 text-gray-400 text-xs font-semibold mb-4">
                {study.category}
              </span>

              <h2 className="text-2xl font-bold text-gray-100 mb-2">{study.title}</h2>
              <p className="text-gray-400 italic mb-4">{study.problem}</p>

              {/* Result Badge */}
              <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 mb-5">
                <span className="text-emerald-400 font-semibold text-sm">{study.result}</span>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed mb-6">{study.description}</p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 mb-6">
                {study.tech.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2.5 py-1 rounded-md bg-blue-900/40 border border-blue-700/40 text-blue-300 text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <Link
                href={study.link}
                className="inline-flex items-center space-x-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors duration-200 group"
              >
                <span>Read Case Study</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
