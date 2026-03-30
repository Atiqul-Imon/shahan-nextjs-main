import Link from 'next/link';
import { BookOpen, ArrowLeft, ExternalLink } from 'lucide-react';

export const metadata = {
  title: 'Research — Shahan Ahmed',
  description: 'Peer-reviewed publications, conference presentations, and working research projects by Shahan Ahmed.',
};

const publications = [
  {
    title: "Modeling and simulation of solar cells",
    journal: "Optics & Laser Technology",
    year: "2022",
    upcoming: false,
  },
  {
    title: "Synthesis and characterization study",
    journal: "Inorganic Chemistry Communications",
    year: "2023",
    upcoming: false,
  },
  {
    title: "Federated learning + synthetic data for vaccination equity research",
    journal: "Upcoming Publication",
    year: null,
    upcoming: true,
  },
];

const presentations = [
  {
    event: "2024 MSU Student Research Symposium",
    title: "DHS Vaccination Coverage Analysis",
    year: "2024",
    description: "Analysis of Demographic and Health Surveys (DHS) data to identify vaccination coverage gaps across countries.",
  },
];

const workingProjects = [
  {
    title: "OpenDataBD",
    description: "Open data initiative for Bangladesh — building infrastructure to make public government data accessible and usable for researchers and citizens.",
    link: "https://opendatabd.org",
    status: "Active",
  },
];

export default function ResearchPage() {
  return (
    <main className="min-h-screen bg-gray-900 pt-28 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-gray-100 transition-colors duration-200 mb-10 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
          <span>Back to Home</span>
        </Link>

        {/* Header */}
        <div className="flex items-center space-x-4 mb-12">
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <BookOpen className="text-blue-400 w-7 h-7" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-100">Research</h1>
            <p className="text-gray-400 mt-2">Publications, presentations, and active research projects.</p>
          </div>
        </div>

        {/* Publications */}
        <section className="mb-14">
          <h2 className="text-xl font-semibold text-gray-200 uppercase tracking-wider text-sm mb-6 flex items-center space-x-2">
            <span className="w-8 h-0.5 bg-blue-500 inline-block"></span>
            <span>Publications</span>
          </h2>
          <div className="space-y-4">
            {publications.map((pub, index) => (
              <div
                key={index}
                className="p-5 rounded-xl bg-gray-800 border border-gray-700 hover:border-gray-600 transition-colors duration-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <h3 className="text-gray-100 font-semibold">{pub.title}</h3>
                      {pub.upcoming && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                          Upcoming
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">{pub.journal}</p>
                  </div>
                  {pub.year && (
                    <span className="px-3 py-1 rounded-lg bg-gray-700 text-gray-400 text-xs font-semibold flex-shrink-0">
                      {pub.year}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Presentations */}
        <section className="mb-14">
          <h2 className="text-xl font-semibold text-gray-200 uppercase tracking-wider text-sm mb-6 flex items-center space-x-2">
            <span className="w-8 h-0.5 bg-blue-500 inline-block"></span>
            <span>Presentations</span>
          </h2>
          <div className="space-y-4">
            {presentations.map((pres, index) => (
              <div
                key={index}
                className="p-5 rounded-xl bg-gray-800 border border-gray-700 hover:border-gray-600 transition-colors duration-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-gray-100 font-semibold mb-1">{pres.title}</h3>
                    <p className="text-blue-400 text-sm font-medium mb-2">{pres.event}</p>
                    <p className="text-gray-400 text-sm">{pres.description}</p>
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-gray-700 text-gray-400 text-xs font-semibold flex-shrink-0">
                    {pres.year}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Working Projects */}
        <section>
          <h2 className="text-xl font-semibold text-gray-200 uppercase tracking-wider text-sm mb-6 flex items-center space-x-2">
            <span className="w-8 h-0.5 bg-blue-500 inline-block"></span>
            <span>Working Projects</span>
          </h2>
          <div className="space-y-4">
            {workingProjects.map((project, index) => (
              <div
                key={index}
                className="p-5 rounded-xl bg-gray-800 border border-gray-700 hover:border-gray-600 transition-colors duration-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-gray-100 font-semibold">{project.title}</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                        {project.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{project.description}</p>
                  </div>
                  <Link
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-semibold hover:bg-blue-600/30 transition-colors duration-200 flex-shrink-0"
                  >
                    <span>Visit</span>
                    <ExternalLink size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
