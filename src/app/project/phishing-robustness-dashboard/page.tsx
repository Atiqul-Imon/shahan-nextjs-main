'use client';

import React from "react";
import { Github } from "lucide-react";

type Metric = {
  label: string;
  value: string;
  sublabel?: string;
};

const metrics: Metric[] = [
  {
    label: "Total emails (view)",
    value: "4,209",
    sublabel: "4,151 phishing BEC + 58 benign",
  },
  {
    label: "Adversarially modified phishing",
    value: "1,187",
    sublabel: "Unicode homoglyph + zero-width attacks",
  },
  {
    label: "Modified phishing in test set",
    value: "230",
    sublabel: "Used for focused robustness analysis",
  },
  {
    label: "Phishing recall (clean vs poisoned)",
    value: "100%",
    sublabel: "No degradation in this setting",
  },
];

const modelRows = [
  {
    scenario: "Baseline: Clean test set",
    phishingRecall: "100%",
    benignRecall: "≈ 83%",
    accuracy: "≈ 99.8%",
    notes:
      "Model trained and evaluated on clean text; strongly separates phishing from benign emails.",
  },
  {
    scenario: "Robustness: Poisoned test set",
    phishingRecall: "100%",
    benignRecall: "≈ 83%",
    accuracy: "≈ 99.8%",
    notes:
      "Same model evaluated on Unicode-obfuscated phishing emails; performance remains unchanged.",
  },
  {
    scenario: "Modified phishing only (clean vs poisoned)",
    phishingRecall: "100% → 100%",
    benignRecall: "N/A",
    accuracy: "100%",
    notes:
      "On the 230 adversarially modified phishing emails, the classifier still flags all correctly.",
  },
];

const techStack = [
  "Python",
  "Pandas",
  "Scikit-learn",
  "TF-IDF (word-level)",
  "Logistic Regression",
  "Hugging Face Datasets",
  "Adversarial ML",
  "Email Security",
];

const PhishingRobustnessDashboard: React.FC = () => {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-10 md:py-14 bg-gray-50">
      {/* Header */}
      <header className="mb-8 md:mb-10 relative">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md">
            <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
            Research Project · Phishing Detection · Robustness
          </div>
          
          <a 
            href="https://github.com/shahan24h/Robustness-of-Phishing-Detection-Under-Adversarial-Unicode-Obfuscation" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#24292e] text-white rounded-lg font-medium hover:bg-[#2d3339] transition-colors shadow-sm border border-[#30363d]"
          >
            <Github className="w-4 h-4" />
            <span className="text-sm">View on GitHub</span>
          </a>
        </div>

        <h1 className="mt-4 text-2.5xl md:text-4xl font-bold tracking-tight text-slate-900">
          Robustness of Phishing Detection
          <br className="hidden md:block" />
          <span className="text-indigo-700 text-[0.9em]">
            Under Adversarial Unicode Obfuscation
          </span>
        </h1>

        <p className="mt-3 max-w-2xl text-sm md:text-base text-slate-700 font-medium">
          I evaluated how a modern ML-based phishing vs benign classifier behaves when phishing emails
          are adversarially obfuscated using Unicode homoglyphs and zero-width characters, and
          compared its robustness with brittle keyword-based methods from Project 1.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Tag>Phishing Detection</Tag>
          <Tag>Unicode Obfuscation</Tag>
          <Tag>Adversarial ML</Tag>
          <Tag>Robustness Evaluation</Tag>
        </div>
      </header>

      {/* Metrics */}
      <section className="grid gap-4 md:gap-5 md:grid-cols-2 xl:grid-cols-4 mb-8 md:mb-10">
        {metrics.map((m, idx) => {
          const colors = [
            'from-indigo-500 to-indigo-600',
            'from-purple-500 to-purple-600',
            'from-blue-500 to-blue-600',
            'from-emerald-500 to-emerald-600'
          ];
          return (
            <div
              key={m.label}
              className={`rounded-2xl border-2 border-transparent bg-gradient-to-br ${colors[idx]} px-5 py-5 shadow-lg hover:shadow-xl transition-all transform hover:scale-105`}
            >
              <p className="text-xs font-semibold text-white/90 uppercase tracking-wide">
                {m.label}
              </p>
              <p className="mt-2 text-3xl font-bold text-white">{m.value}</p>
              {m.sublabel && (
                <p className="mt-2 text-xs text-white/80 leading-snug font-medium">{m.sublabel}</p>
              )}
            </div>
          );
        })}
      </section>

      <div className="grid gap-6 lg:grid-cols-3 mb-8 md:mb-10">
        {/* Pipeline */}
        <section className="lg:col-span-2 rounded-2xl border-2 border-indigo-200 bg-white px-4 py-4 md:px-6 md:py-5 shadow-lg">
          <h2 className="text-base font-bold text-indigo-900">Experiment Pipeline</h2>
          <p className="mt-1 text-xs text-slate-700 font-medium">
            How I constructed the phishing vs benign dataset and tested robustness to Unicode
            obfuscation.
          </p>

          <ol className="mt-4 space-y-3 text-sm text-slate-700">
            <PipelineStep
              step="01"
              title="Dataset construction"
              body="Combined 4,151 synthetic BEC phishing emails (clean + obfuscated) with 58 benign emails from the Hugging Face dataset `UniqueData/email-spam-classification` (using only 'not spam' samples)."
            />
            <PipelineStep
              step="02"
              title="Phishing vs benign setup"
              body="Defined a binary classification task: label 1 for BEC phishing, label 0 for benign emails. Built two parallel views: clean (body_clean) and poisoned (body_poisoned)."
            />
            <PipelineStep
              step="03"
              title="Model training on clean text"
              body="Trained a TF-IDF (unigram + bigram) + Logistic Regression classifier on the CLEAN view only, with class weighting to address phishing/benign imbalance."
            />
            <PipelineStep
              step="04"
              title="Robustness evaluation"
              body="Evaluated the same model on two test views: clean text vs Unicode-obfuscated phishing text, keeping benign emails unchanged."
            />
            <PipelineStep
              step="05"
              title="Modified-only analysis"
              body="Isolated the 230 phishing emails that were actually adversarially modified and compared predictions using their clean vs obfuscated versions."
            />
          </ol>
        </section>

        {/* Clean vs poisoned performance summary */}
        <section className="rounded-2xl border-2 border-indigo-600 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 px-4 py-4 md:px-5 md:py-5 text-white shadow-xl">
          <h2 className="text-base font-bold flex items-center gap-2">
            Clean vs Poisoned Performance
            <span className="inline-flex items-center rounded-full bg-emerald-500 px-2.5 py-1 text-[0.7rem] font-bold text-white shadow-md">
              Robustness Check
            </span>
          </h2>
          <p className="mt-1 text-xs text-indigo-100 font-medium">
            Clean-trained model evaluated on clean vs Unicode-obfuscated phishing emails.
          </p>

          <div className="mt-4 space-y-3 text-xs">
            <PerfRow
              label="Accuracy"
              clean="≈ 99.8%"
              poisoned="≈ 99.8%"
            />
            <PerfRow
              label="Phishing recall"
              clean="100%"
              poisoned="100%"
            />
            <PerfRow
              label="Benign recall"
              clean="≈ 83%"
              poisoned="≈ 83%"
            />
          </div>

          <p className="mt-4 text-xs text-indigo-100 font-medium">
            In this configuration, the ML classifier remains robust to Unicode obfuscation, even
            though keyword-based detectors from Project 1 suffered heavy degradation.
          </p>
        </section>
      </div>

      {/* Model comparison */}
      <section className="rounded-2xl border-2 border-purple-200 bg-white px-4 py-4 md:px-6 md:py-5 shadow-lg mb-8 md:mb-10">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-purple-900">Robustness Summary</h2>
            <p className="mt-1 text-xs text-slate-700 font-medium">
              Same model, same train split — evaluated under clean vs adversarially obfuscated
              phishing emails to measure robustness.
            </p>
          </div>
          <span className="inline-flex items-center rounded-full border-2 border-purple-500 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-3 py-1.5 text-[0.7rem] font-bold shadow-md">
            TF-IDF (word-level) · Logistic Regression
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-xs md:text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-indigo-300 bg-gradient-to-r from-indigo-600 to-purple-600">
                <Th className="text-white">Scenario</Th>
                <Th className="text-white">Phishing recall</Th>
                <Th className="text-white">Benign recall</Th>
                <Th className="text-white">Accuracy</Th>
                <Th className="text-white">Notes</Th>
              </tr>
            </thead>
            <tbody>
              {modelRows.map((row, idx) => (
                <tr key={row.scenario} className={idx % 2 === 0 ? "bg-white hover:bg-indigo-50" : "bg-indigo-50/50 hover:bg-indigo-100"}>
                  <Td className="font-bold text-slate-900">{row.scenario}</Td>
                  <Td className="font-semibold text-emerald-700">{row.phishingRecall}</Td>
                  <Td className="font-semibold text-blue-700">{row.benignRecall}</Td>
                  <Td className="font-bold text-indigo-700 text-base">{row.accuracy}</Td>
                  <Td className="text-slate-700 font-medium">{row.notes}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Insights + Tech stack */}
      <section className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 rounded-2xl border-2 border-emerald-200 bg-white px-4 py-4 md:px-6 md:py-5 shadow-lg">
          <h2 className="text-base font-bold text-emerald-900">Key Insights</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-800 font-medium">
            <li className="flex gap-2">
              <Bullet />
              <span>
                A clean-trained word-level TF-IDF + Logistic Regression classifier achieves{" "}
                <strong>≈ 99.8% accuracy</strong> with effectively perfect recall on phishing emails.
              </span>
            </li>
            <li className="flex gap-2">
              <Bullet />
              <span>
                Replacing phishing emails with their Unicode-obfuscated versions (homoglyph + zero-width)
                does <strong>not measurably change performance</strong> in this setup.
              </span>
            </li>
            <li className="flex gap-2">
              <Bullet />
              <span>
                On the <strong>230 adversarially modified phishing emails</strong> in the test set, the
                classifier still flags <strong>100%</strong> correctly in both clean and obfuscated form.
              </span>
            </li>
            <li className="flex gap-2">
              <Bullet />
              <span>
                This contrasts with Project 1, where keyword-based detectors suffered an{" "}
                <strong>81.3% evasion rate</strong> under the same obfuscation attack.
              </span>
            </li>
            <li className="flex gap-2">
              <Bullet />
              <span>
                The results suggest that richer ML representations can be comparatively robust to Unicode
                obfuscation, but must still be combined with layered defenses and monitoring.
              </span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border-2 border-blue-200 bg-white px-4 py-4 md:px-5 md:py-5 shadow-lg">
          <h2 className="text-base font-bold text-blue-900">Tech Stack</h2>
          <p className="mt-1 text-xs text-slate-700 font-medium">
            Tools and concepts used to evaluate robustness of phishing detection under Unicode attacks.
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {techStack.map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-full border-2 border-blue-400 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1.5 text-[0.7rem] font-bold shadow-md"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
};

const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center rounded-full border-2 border-indigo-400 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1.5 text-[0.75rem] font-bold shadow-md">
    {children}
  </span>
);

const PipelineStep: React.FC<{ step: string; title: string; body: string }> = ({
  step,
  title,
  body,
}) => (
  <li className="flex gap-3">
    <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-[0.7rem] font-bold text-white shadow-md">
      {step}
    </div>
    <div>
      <p className="text-xs font-bold text-indigo-900">{title}</p>
      <p className="mt-1 text-xs text-slate-700 font-medium">{body}</p>
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
      "px-3 py-2 text-left text-[0.7rem] font-bold uppercase tracking-wide " +
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
  <td className={"px-3 py-2 align-top text-xs " + (className ?? "")} {...rest}>
    {children}
  </td>
);

const Bullet: React.FC = () => (
  <span className="mt-1 inline-block h-2 w-2 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex-shrink-0 shadow-sm" />
);

const PerfRow: React.FC<{ label: string; clean: string; poisoned: string }> = ({
  label,
  clean,
  poisoned,
}) => (
  <div>
    <div className="flex justify-between gap-2">
      <span className="text-white font-bold">{label}</span>
      <span className="text-[0.7rem] text-indigo-100 font-semibold">
        clean: <span className="font-bold text-indigo-300 bg-indigo-800/50 px-1.5 py-0.5 rounded">{clean}</span> · poisoned:{" "}
        <span className="font-bold text-emerald-300 bg-emerald-800/50 px-1.5 py-0.5 rounded">{poisoned}</span>
      </span>
    </div>
    <div className="mt-2 h-2 w-full rounded-full bg-indigo-950 overflow-hidden shadow-inner">
      <div className="h-full w-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 shadow-lg" />
    </div>
  </div>
);

export default PhishingRobustnessDashboard;

