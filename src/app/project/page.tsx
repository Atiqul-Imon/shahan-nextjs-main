'use client';

import { Code, Clock } from 'lucide-react';

const ProjectPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* Icon */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-full shadow-2xl">
              <Code size={64} className="text-white" />
            </div>
            <div className="absolute -top-2 -right-2 bg-yellow-400 p-2 rounded-full">
              <Clock size={20} className="text-gray-800" />
            </div>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Projects
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Coming Soon
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
          I'm working on adding my projects here soon.
          <br />
          <span className="text-blue-400 font-medium">Stay tuned for updates!</span>
        </p>
      </div>
    </div>
  );
};

export default ProjectPage; 