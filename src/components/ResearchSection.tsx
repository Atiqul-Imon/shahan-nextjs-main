import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import Image from 'next/image';

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
  },
];

const workingProjects = [
  {
    title: "OpenDataBD",
    description: "Open data initiative for Bangladesh",
    link: "https://www.opendatabd.com",
  },
];

const ResearchSection = () => {
  return (
    <section className="py-20 bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-12">
          <span className="eyebrow mb-3 block">Academic Work</span>
          <h2 className="text-4xl font-bold text-gray-100">Research & Publications</h2>
        </div>

        {/* Publications */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-gray-200 mb-6 uppercase tracking-wider text-sm">
            Publications
          </h3>
          <div className="space-y-4">
            {publications.map((pub, index) => (
              <div
                key={index}
                className="flex items-start justify-between p-4 rounded-xl bg-gray-800 border border-gray-700 hover:border-gray-600 transition-colors duration-200"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-gray-100 font-medium">{pub.title}</p>
                    {pub.upcoming && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                        Upcoming
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{pub.journal}</p>
                </div>
                {pub.year && (
                  <span className="ml-4 px-3 py-1 rounded-lg bg-gray-700 text-gray-400 text-xs font-semibold flex-shrink-0">
                    {pub.year}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Presentations */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-gray-200 mb-6 uppercase tracking-wider text-sm">
            Presentations
          </h3>
          <div className="space-y-4">
            {presentations.map((pres, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl bg-gray-800 border border-gray-700 hover:border-gray-600 transition-colors duration-200"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src="/logo/msu_logo.png"
                    alt="Montclair State University"
                    width={36}
                    height={44}
                    className="object-contain flex-shrink-0"
                  />
                  <div>
                    <p className="text-gray-100 font-medium">{pres.title}</p>
                    <p className="text-gray-400 text-sm">{pres.event}</p>
                  </div>
                </div>
                <span className="ml-4 px-3 py-1 rounded-lg bg-gray-700 text-gray-400 text-xs font-semibold flex-shrink-0">
                  {pres.year}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Working Projects */}
        <div>
          <h3 className="text-xl font-semibold text-gray-200 mb-6 uppercase tracking-wider text-sm">
            Working Projects
          </h3>
          <div className="space-y-4">
            {workingProjects.map((project, index) => (
              <div
                key={index}
                className="flex items-start justify-between p-4 rounded-xl bg-gray-800 border border-gray-700 hover:border-gray-600 transition-colors duration-200"
              >
                <div>
                  <p className="text-gray-100 font-medium">{project.title}</p>
                  <p className="text-gray-400 text-sm">{project.description}</p>
                </div>
                <Link
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-4 px-3 py-1 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-semibold hover:bg-blue-600/30 transition-colors duration-200 flex-shrink-0"
                >
                  Visit →
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/research"
            className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200"
          >
            View Full Research Page →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ResearchSection;
