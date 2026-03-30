import Link from 'next/link';
import { FaYoutube, FaGlobe, FaCode } from 'react-icons/fa';

const initiatives = [
  {
    icon: FaYoutube,
    title: "The Shahan Stack",
    description: "YouTube channel for practical data science & ML engineering walkthroughs.",
    iconColor: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
    link: "#",
  },
  {
    icon: FaGlobe,
    title: "OpenDataBD",
    description: "Open data platform for Bangladesh — making public data accessible.",
    iconColor: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    link: "https://opendatabd.org",
  },
  {
    icon: FaCode,
    title: "PixelForge",
    description: "Web development & SaaS agency building modern digital products.",
    iconColor: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    link: "#",
  },
];

const InitiativesSection = () => {
  return (
    <section className="py-20 bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-100">Beyond Work</h2>
          <p className="text-gray-400 mt-3 text-lg max-w-xl mx-auto">
            Side projects and initiatives I&apos;m building outside of my day job.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {initiatives.map((initiative, index) => {
            const Icon = initiative.icon;
            return (
              <Link
                key={index}
                href={initiative.link}
                target={initiative.link.startsWith('http') ? '_blank' : undefined}
                rel={initiative.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={`group p-6 rounded-2xl border transition-all duration-300 hover:scale-105 hover:shadow-lg ${initiative.bgColor} ${initiative.borderColor} flex flex-col`}
              >
                <div className="p-3 rounded-xl bg-gray-900/50 border border-gray-700 w-fit mb-4">
                  <Icon className={`text-2xl ${initiative.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-100 mb-2 group-hover:text-blue-200 transition-colors duration-200">
                  {initiative.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed flex-grow">{initiative.description}</p>
                <span className="mt-4 text-xs font-semibold uppercase tracking-widest text-gray-500 group-hover:text-blue-400 transition-colors duration-200">
                  Learn more →
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default InitiativesSection;
