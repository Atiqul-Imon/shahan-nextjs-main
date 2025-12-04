'use client';

import React from "react";
import { Github, Shield, TrendingDown, Target, AlertTriangle } from "lucide-react";

type Metric = {
  label: string;
  value: string;
  sublabel?: string;
};

const metrics: Metric[] = [
  {
    label: "Total BEC emails",
    value: "4,181",
    sublabel: "Synthetic BEC phishing samples",
  },
  {
    label: "Adversarially modified",
    value: "≈ 29%",
    sublabel: "Homoglyphs + zero-width Unicode",
  },
  {
    label: "Keyword detector evasion",
    value: "81.3%",
    sublabel: "Flagged when clean → missed when poisoned",
  },
  {
    label: "Obfuscation detector accuracy",
    value: "95.4%",
    sublabel: "Char n-gram TF-IDF + Logistic Regression",
  },
];

const keywordStats = [
  { keyword: "invoice", drop: "≈ 93%" },
  { keyword: "immediately", drop: "≈ 89%" },
  { keyword: "payment", drop: "≈ 81%" },
  { keyword: "account", drop: "≈ 80%" },
  { keyword: "confirm", drop: "≈ 78%" },
];

const modelRows = [
  {
    name: "Word TF-IDF + LR (clean text)",
    input: "Clean BEC body",
    focus: "Semantics / keywords",
    f1Modified: "≈ 0.29",
    note: "Weak signal – style similar across emails",
  },
  {
    name: "Char TF-IDF + LR (clean text)",
    input: "Clean BEC body",
    focus: "Character style",
    f1Modified: "≈ 0.29",
    note: "Limited ability to predict which emails get obfuscated",
  },
  {
    name: "Char TF-IDF + LR (poisoned text)",
    input: "Poisoned BEC body",
    focus: "Unicode artifacts",
    f1Modified: "≈ 0.92",
    note: "Strong detector for homoglyphs & zero-width tricks",
  },
];

const techStack = [
  "Python",
  "Pandas",
  "Scikit-learn",
  "NLP",
  "Adversarial ML",
  "Unicode / Homoglyphs",
  "Character-level modeling",
];

const BECAdversarialDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-white shadow-md">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
              Research Project · Security · NLP · Adversarial ML
            </div>
            
            <a 
              href="https://github.com/shahan24h/Social-Engineering-Adversarial-Obfuscation-in-BEC-Emails.git" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-colors shadow-sm"
            >
              <Github className="w-5 h-5" />
              <span>View on GitHub</span>
            </a>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Social Engineering & Adversarial Obfuscation
          </h1>
          <p className="text-xl md:text-2xl text-emerald-100 mb-6 font-semibold">
            in Business Email Compromise (BEC) Attacks
          </p>

          <p className="text-lg text-emerald-50 max-w-3xl mb-6">
            I analyzed how Unicode-based adversarial techniques (homoglyphs and zero-width characters)
            break keyword-based phishing detection, and built a character-level model that reliably
            detects these obfuscation patterns in BEC phishing emails.
          </p>

          <div className="flex flex-wrap gap-2">
            <Tag>Cybersecurity</Tag>
            <Tag>Natural Language Processing</Tag>
            <Tag>Adversarial Machine Learning</Tag>
            <Tag>Model Interpretability</Tag>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m, idx) => {
            const colors = [
              'from-emerald-500 to-emerald-600',
              'from-teal-500 to-teal-600',
              'from-orange-500 to-orange-600',
              'from-green-500 to-green-600'
            ];
            return (
              <div
                key={m.label}
                className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:scale-105 border-2 border-transparent bg-gradient-to-br ${colors[idx]}`}
              >
                <p className="text-xs font-semibold text-white/90 uppercase tracking-wide mb-2">
                  {m.label}
                </p>
                <p className="text-3xl font-bold text-white mb-2">{m.value}</p>
                {m.sublabel && (
                  <p className="text-xs text-white/80 leading-snug font-medium">{m.sublabel}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 lg:grid-cols-3 mb-12">
          {/* Left column – pipeline */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-emerald-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Target className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-emerald-900">Project Pipeline</h2>
              </div>
              <p className="text-sm text-slate-700 font-medium mb-6">
                End-to-end workflow from data generation to adversarial detection and explanation.
              </p>

              <ol className="space-y-4">
                <PipelineStep
                  step="01"
                  title="Dataset construction"
                  body="Used paired BEC emails (clean vs poisoned) with Unicode homoglyphs and zero-width characters to simulate realistic obfuscation attacks."
                />
                <PipelineStep
                  step="02"
                  title="Social-engineering analysis"
                  body="Quantified financial/urgency keywords, authority and politeness tone, and obligation language that drive BEC persuasion."
                />
                <PipelineStep
                  step="03"
                  title="Evasion of rule-based detectors"
                  body="Showed that simple keyword/risk-score detectors suffer 70–90% signal loss and 81.3% evasion under adversarial obfuscation."
                />
                <PipelineStep
                  step="04"
                  title="Adversarial obfuscation detector"
                  body="Trained character-level TF-IDF + Logistic Regression on poisoned text to detect Unicode artifacts with ~95% accuracy."
                />
                <PipelineStep
                  step="05"
                  title="Model interpretability"
                  body="Inspected top character n-grams to reveal reliance on homoglyph sequences and zero-width Unicode patterns rather than topic semantics."
                />
              </ol>
            </div>
          </div>

          {/* Right column – keyword impact */}
          <div>
            <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-900 rounded-xl shadow-xl p-6 text-white border-2 border-emerald-600">
              <div className="flex items-center gap-2 mb-4">
                <TrendingDown className="w-5 h-5 text-orange-400" />
                <h2 className="text-xl font-bold flex items-center gap-2">
                  Keyword Signal Loss
                  <span className="inline-flex items-center rounded-full bg-orange-500 px-2.5 py-1 text-xs font-bold text-white shadow-md">
                    Adversarial Impact
                  </span>
                </h2>
              </div>
              <p className="text-xs text-emerald-100 font-medium mb-6">
                How much keyword-based detection breaks under Unicode obfuscation (modified emails only).
              </p>

              <div className="space-y-4">
                {keywordStats.map((k) => (
                  <div key={k.keyword}>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="font-bold text-white">{k.keyword}</span>
                      <span className="text-orange-300 font-bold bg-orange-900/50 px-2 py-0.5 rounded">{k.drop} drop</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-emerald-950 overflow-hidden shadow-inner">
                      <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-400 shadow-lg" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-3 bg-emerald-950/50 rounded-lg">
                <p className="text-xs text-emerald-100 font-medium">
                  In the worst cases, surface-level keyword matches for critical financial terms like{" "}
                  <span className="font-bold text-orange-200 bg-orange-900/50 px-1.5 py-0.5 rounded">&quot;invoice&quot;</span> and{" "}
                  <span className="font-bold text-orange-200 bg-orange-900/50 px-1.5 py-0.5 rounded">&quot;immediately&quot;</span> drop by more than{" "}
                  <span className="font-bold text-orange-200 bg-orange-900/50 px-1.5 py-0.5 rounded">90%</span>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Model comparison */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-teal-200 mb-12">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-100 rounded-lg">
                <Shield className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-teal-900">Model Comparison</h2>
                <p className="mt-1 text-sm text-slate-700 font-medium">
                  Clean-text models struggle to predict which emails will be obfuscated. Models trained
                  directly on poisoned text learn Unicode artifacts and perform strongly.
                </p>
              </div>
            </div>
            <span className="inline-flex items-center rounded-full border-2 border-teal-500 bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-4 py-2 text-xs font-bold shadow-md">
              Character-level modeling · Logistic Regression
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-teal-300 bg-gradient-to-r from-teal-600 to-emerald-600">
                  <Th className="text-white">Model</Th>
                  <Th className="text-white">Input</Th>
                  <Th className="text-white">Primary Signal</Th>
                  <Th className="text-white">F1 (modified class)</Th>
                  <Th className="text-white">Notes</Th>
                </tr>
              </thead>
              <tbody>
                {modelRows.map((row, idx) => (
                  <tr
                    key={row.name}
                    className={idx % 2 === 0 ? "bg-white hover:bg-teal-50" : "bg-teal-50/50 hover:bg-teal-100"}
                  >
                    <Td className="font-bold text-slate-900">{row.name}</Td>
                    <Td className="font-medium text-slate-700">{row.input}</Td>
                    <Td className="font-medium text-slate-700">{row.focus}</Td>
                    <Td className="font-bold text-emerald-700 text-lg">{row.f1Modified}</Td>
                    <Td className="text-slate-700 font-medium">{row.note}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insights + Tech stack */}
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-green-900">Key Insights</h2>
              </div>
              <ul className="space-y-4 text-sm text-slate-800 font-medium">
                <li className="flex gap-3">
                  <Bullet />
                  <span>
                    Unicode obfuscation can remove **70–90%** of surface keyword signal while keeping
                    BEC emails understandable to humans.
                  </span>
                </li>
                <li className="flex gap-3">
                  <Bullet />
                  <span>
                    A simple risk-score detector based on finance/urgency keywords suffers an{" "}
                    <strong>81.3% evasion rate</strong> on modified emails.
                  </span>
                </li>
                <li className="flex gap-3">
                  <Bullet />
                  <span>
                    Character-level models trained on poisoned text achieve **~95% accuracy** and
                    **~0.92 F1** on detecting adversarially modified emails.
                  </span>
                </li>
                <li className="flex gap-3">
                  <Bullet />
                  <span>
                    Top model features reveal reliance on homoglyph sequences and zero-width Unicode,
                    confirming that the model is detecting <em>obfuscation artifacts</em>, not topics.
                  </span>
                </li>
                <li className="flex gap-3">
                  <Bullet />
                  <span>
                    This suggests a layered defense strategy: semantic phishing detection augmented by a
                    dedicated Unicode obfuscation detector.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-cyan-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-cyan-100 rounded-lg">
                  <Shield className="w-5 h-5 text-cyan-600" />
                </div>
                <h2 className="text-xl font-bold text-cyan-900">Tech Stack</h2>
              </div>
              <p className="text-xs text-slate-700 font-medium mb-4">
                Tools and concepts I used to build and analyze this project.
              </p>
              <div className="flex flex-wrap gap-2">
                {techStack.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center rounded-full border-2 border-cyan-400 bg-gradient-to-r from-cyan-500 to-teal-600 text-white px-3 py-1.5 text-xs font-bold shadow-md"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center rounded-full border-2 border-emerald-400 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 text-sm font-bold shadow-md">
    {children}
  </span>
);

const PipelineStep: React.FC<{ step: string; title: string; body: string }> = ({
  step,
  title,
  body,
}) => (
  <li className="flex gap-4">
    <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 text-xs font-bold text-white shadow-md flex-shrink-0">
      {step}
    </div>
    <div>
      <p className="text-sm font-bold text-emerald-900 mb-1">{title}</p>
      <p className="text-sm text-slate-700 font-medium">{body}</p>
    </div>
  </li>
);

const Th: React.FC<React.HTMLAttributes<HTMLTableCellElement>> = ({
  children,
  className,
  ...rest
}) => (
  <th
    className={
      "px-4 py-3 text-left text-xs font-bold uppercase tracking-wide " +
      (className ?? "")
    }
    {...rest}
  >
    {children}
  </th>
);

const Td: React.FC<React.HTMLAttributes<HTMLTableCellElement>> = ({
  children,
  className,
  ...rest
}) => (
  <td className={"px-4 py-3 align-top text-sm " + (className ?? "")} {...rest}>
    {children}
  </td>
);

const Bullet: React.FC = () => (
  <span className="mt-1 inline-block h-2 w-2 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex-shrink-0 shadow-sm" />
);

export default BECAdversarialDashboard;
