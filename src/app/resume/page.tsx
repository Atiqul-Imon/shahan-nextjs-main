import Link from 'next/link';
import { ArrowLeft, Download } from 'lucide-react';

export const metadata = {
  title: 'Resume — Shahan Ahmed',
  description: 'Resume of Shahan Ahmed, Data Scientist & ML Engineer.',
};

export default function ResumePage() {
  const pdfUrl = '/resume/shahan_data_scientist_resume.pdf';

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 pt-24 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-200" />
            <span>Back to Home</span>
          </Link>

          <a
            href="/api/download-resume"
            download
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors duration-200"
          >
            <Download size={16} />
            <span>Download PDF</span>
          </a>
        </div>

        {/* PDF Viewer */}
        <div className="w-full rounded-xl overflow-hidden border border-gray-700 bg-gray-800 shadow-large">
          <iframe
            src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
            className="w-full"
            style={{ height: '85vh', minHeight: '600px' }}
            title="Shahan Ahmed Resume"
          />
        </div>

        {/* Mobile fallback */}
        <p className="text-center text-xs text-gray-500 mt-4">
          Can&apos;t see the PDF?{' '}
          <a
            href="/api/download-resume"
            download
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Download it instead
          </a>
        </p>
      </div>
    </main>
  );
}
