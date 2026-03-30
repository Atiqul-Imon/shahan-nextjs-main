import { BookOpen, Award, Cpu } from 'lucide-react';

const stats = [
  {
    icon: BookOpen,
    value: "2",
    label: "Peer-Reviewed Publications",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  {
    icon: Award,
    value: "MSU 2024",
    label: "Presented at MSU Research Symposium",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
  {
    icon: Cpu,
    value: "5+",
    label: "Years in Production ML Systems",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
  },
];

const SocialProofSection = () => {
  return (
    <section className="py-16 bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="eyebrow">By the numbers</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`flex flex-col items-center text-center p-6 rounded-2xl border ${stat.bgColor} ${stat.borderColor}`}
              >
                <div className={`p-3 rounded-xl bg-gray-900/50 border border-gray-700 mb-4`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className={`text-3xl font-bold mb-1 ${stat.color}`}>{stat.value}</span>
                <span className="text-gray-400 text-sm leading-snug">{stat.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
