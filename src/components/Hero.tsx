'use client';

import { FaDatabase, FaChartBar, FaGithub, FaLinkedin, FaGoogle, FaBrain } from "react-icons/fa";
import { Download, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  const downloadResume = () => {
    window.open('/api/download-resume', '_blank');
  };

  const socialLinks = [
    {
      name: "GitHub",
      url: "https://github.com/shahan24h",
      icon: FaGithub,
      color: "hover:text-gray-400",
      bgColor: "bg-gray-700 hover:bg-gray-600"
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/shahan24h/",
      icon: FaLinkedin,
      color: "hover:text-blue-400",
      bgColor: "bg-blue-600 hover:bg-blue-700"
    },
    {
      name: "Hugging Face",
      url: "https://huggingface.co/shahan24h/ai-mini-mlm",
      icon: "https://huggingface.co/front/assets/huggingface_logo-noborder.svg",
      isImg: true,
      color: "hover:text-yellow-400",
      bgColor: "bg-yellow-500 hover:bg-yellow-600"
    },
    {
      name: "Google Scholar",
      url: "https://scholar.google.com/citations?hl=en&user=ROqm-4EAAAAJ",
      icon: FaGoogle,
      color: "hover:text-blue-600",
      bgColor: "bg-blue-500 hover:bg-blue-600"
    }
  ];

  const pillars = [
    {
      icon: FaBrain,
      title: "ML Engineering & NLP",
      description: "Designing and deploying end-to-end NLP pipelines — from transformer fine-tuning to production model serving.",
      bullets: [
        "Transformer fine-tuning (DistilBERT, Longformer)",
        "Document classification & OCR pipelines",
        "Production model deployment (Docker, systemd, AWS)",
      ],
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
      link: "/case-studies",
    },
    {
      icon: FaDatabase,
      title: "Healthcare & Public Health Analytics",
      description: "Applying ML to healthcare data to surface patterns that improve patient outcomes and inform public health policy.",
      bullets: [
        "Cancer treatment pathway analysis (CMS Medicare data)",
        "Vaccination coverage research (DHS data)",
        "Federated learning & synthetic data for health equity",
      ],
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      link: "/case-studies",
    },
    {
      icon: FaChartBar,
      title: "Data Engineering & Infrastructure",
      description: "Building reliable data pipelines and infrastructure that power analytics and ML systems at scale.",
      bullets: [
        "PySpark & Databricks pipelines",
        "Delta Lake medallion architecture",
        "AWS cloud services & MLflow experiment tracking",
      ],
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      link: "/case-studies",
    },
  ];

  return (
    <section className="relative overflow-hidden py-24">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="text-center">
          {/* Header Section */}
          <div className="mb-12 animate-fade-in max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-100">
              Shahan Ahmed
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 mb-4 leading-relaxed">
              Data Scientist &amp; ML Engineer specializing in NLP, document intelligence, and healthcare analytics — with published research and production systems processing millions of records.
            </p>

            <p className="text-sm md:text-base text-gray-500 mb-8 leading-relaxed italic">
              Currently: Building production NLP systems at Conduent | Researching federated learning for public health | Creating ML tutorials on YouTube
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={downloadResume}
                className="group flex items-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 font-semibold transition-all duration-300 shadow-soft hover:shadow-medium transform hover:scale-105 rounded-lg"
              >
                <Download size={20} />
                <span>Download Resume</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>

          {/* What I Do — 3 Pillars */}
          <div className="animate-slide-up w-full">
            <h2 className="text-3xl font-bold mb-12 text-gray-100">
              What I Do
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto px-4">
              {pillars.map((pillar, index) => {
                const Icon = pillar.icon;
                return (
                  <Link
                    key={index}
                    href={pillar.link}
                    className={`group p-6 lg:p-8 rounded-2xl border transition-all duration-300 hover:scale-105 hover:shadow-large ${pillar.bgColor} ${pillar.borderColor} backdrop-blur-sm flex flex-col text-left cursor-pointer`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center mb-4">
                      <div className="p-3 lg:p-4 rounded-xl bg-gray-900/50 border border-gray-700">
                        <Icon className={`text-2xl lg:text-3xl ${pillar.color}`} />
                      </div>
                    </div>
                    <h3 className="text-lg lg:text-xl font-semibold text-gray-100 mb-3 group-hover:text-blue-200 transition-colors duration-200">
                      {pillar.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed text-sm lg:text-base mb-4">
                      {pillar.description}
                    </p>
                    <ul className="space-y-2 flex-grow">
                      {pillar.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start space-x-2 text-sm text-gray-400">
                          <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${pillar.color.replace('text-', 'bg-')}`}></span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                    <span className="mt-6 text-xs font-semibold uppercase tracking-widest text-gray-500 group-hover:text-blue-400 transition-colors duration-200">
                      See case studies →
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Social Links */}
          <div className="mt-16 animate-fade-in max-w-4xl mx-auto" style={{ animationDelay: '0.5s' }}>
            <h3 className="text-2xl font-semibold text-gray-100 mb-8">
              Connect with Me
            </h3>

            <div className="flex flex-wrap justify-center items-center gap-6">
              {socialLinks.map((social, index) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const Icon = social.icon as any;
                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className={`group p-4 rounded-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-glow ${social.bgColor} text-gray-100`}
                  >
                    {social.isImg ? (
                      <Image src={social.icon as string} alt={social.name} width={24} height={24} className="transition-transform duration-200 group-hover:rotate-12" />
                    ) : (
                      <Icon size={24} className="transition-transform duration-200 group-hover:rotate-12" />
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
