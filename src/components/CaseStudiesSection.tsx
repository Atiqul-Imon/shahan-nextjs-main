import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const caseStudies = [
  {
    title: "Medical Document Classifier",
    problem: "How do you route 50K+ medical documents automatically with near-zero error?",
    result: "99%+ accuracy on 50K+ medical documents",
    tech: ["Longformer", "HuggingFace", "Python", "PyTorch"],
    link: "#",
  },
  {
    title: "Cancer Risk Prediction Pipeline",
    problem: "Can CMS Medicare claims data predict which patients are highest risk?",
    result: "93% accuracy, 100% recall on critical cases",
    tech: ["Databricks", "PySpark", "Delta Lake", "MLflow", "scikit-learn"],
    link: "/project/cancer-prediction-pipeline",
  },
  {
    title: "Phishing Detection Under Adversarial Attacks",
    problem: "Do ML phishing classifiers survive Unicode homoglyph obfuscation?",
    result: "99.8% accuracy, 100% phishing recall",
    tech: ["Python", "Scikit-learn", "TF-IDF", "Adversarial ML"],
    link: "/project/phishing-robustness-dashboard",
  },
  {
    title: "DHS Vaccination Coverage Analysis",
    problem: "What do DHS surveys reveal about vaccination coverage gaps across countries?",
    result: "Presented at MSU Research Symposium 2024",
    tech: ["Python", "Pandas", "Statistical Analysis", "DHS Data"],
    link: "#",
  },
];

const CaseStudiesSection = () => {
  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="eyebrow mb-3 block">Featured Work</span>
          <h2 className="text-4xl font-bold text-gray-100 mb-4">Case Studies</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Real-world ML systems built end-to-end — from problem framing to production deployment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {caseStudies.map((study, index) => (
            <div
              key={index}
              className="bg-gray-800 border border-gray-700 rounded-2xl p-6 flex flex-col hover:border-gray-500 transition-all duration-300 hover:shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-100 mb-2">{study.title}</h3>

              <p className="text-gray-400 italic text-sm mb-4">{study.problem}</p>

              {/* Result Badge */}
              <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 mb-4 w-fit">
                <span className="text-emerald-400 font-semibold text-sm">{study.result}</span>
              </div>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 mb-6 flex-grow">
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

        <div className="text-center mt-10">
          <Link
            href="/project"
            className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200 group"
          >
            <span>View All Projects</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CaseStudiesSection;
