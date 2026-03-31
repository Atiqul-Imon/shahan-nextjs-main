import Link from 'next/link';
import { BookOpen, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Blog & Writing — Shahan Ahmed',
  description: 'Technical walkthroughs, research digests, and industry perspectives on ML engineering, NLP, and healthcare AI.',
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-gray-900 pt-28 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-gray-100 transition-colors duration-200 mb-10 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
          <span>Back to Home</span>
        </Link>

        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <BookOpen className="text-blue-400 w-7 h-7" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-100">Blog &amp; Writing</h1>
        </div>

        {/* Placeholder */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-6">
            <BookOpen className="text-blue-400 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">Coming Soon</h2>
          <p className="text-gray-400 leading-relaxed max-w-xl mx-auto">
            Technical walkthroughs, research digests, and industry perspectives on ML engineering,
            NLP, and healthcare AI. Check back soon for new posts.
          </p>
        </div>

        {/* Topics Preview */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-gray-300 mb-6">Topics I&apos;ll be covering:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "Transformer fine-tuning in production",
              "PySpark & Databricks best practices",
              "Healthcare ML — ethics & privacy",
              "Federated learning for public health",
              "Adversarial ML & model robustness",
              "MLflow experiment tracking at scale",
            ].map((topic, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-4 rounded-xl bg-gray-800 border border-gray-700"
              >
                <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></span>
                <span className="text-gray-300 text-sm">{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
