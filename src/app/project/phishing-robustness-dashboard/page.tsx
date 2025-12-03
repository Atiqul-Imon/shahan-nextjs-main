'use client';

import React from "react";

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
    <section className="w-full max-w-6xl mx-auto px-4 py-10 md:py-14">
      {/* Header */}
      <header className="mb-8 md:mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 border border-indigo-100">
          <span className="h-2 w-2 rounded-full bg-indigo-500" />
          Research Project · Phishing Detection · Robustness
        </div>

        <h1 className="mt-4 text-2.5xl md:text-4xl font-semibold tracking-tight text-slate-900">
          Robustness of Phishing Detection
          <br className="hidden md:block" />
          <span className="text-slate-500 text-[0.9em]">
            Under Adversarial Unicode Obfuscation
          </span>
        </h1>

        <p className="mt-3 max-w-2xl text-sm md:text-base text-slate-600">
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
        {metrics.map((m) => (
          <div
            key={m.label}
            className="rounded-2xl border border-slate-100 bg-white/70 backdrop-blur-sm px-4 py-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              {m.label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{m.value}</p>
            {m.sublabel && (
              <p className="mt-1 text-xs text-slate-500 leading-snug">{m.sublabel}</p>
            )}
          </div>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-3 mb-8 md:mb-10">
        {/* Pipeline */}
        <section className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white/70 px-4 py-4 md:px-6 md:py-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Experiment Pipeline</h2>
          <p className="mt-1 text-xs text-slate-500">
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
        <section className="rounded-2xl border border-slate-100 bg-slate-900 px-4 py-4 md:px-5 md:py-5 text-slate-50 shadow-sm">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            Clean vs Poisoned Performance
            <span className="inline-flex items-center rounded-full bg-indigo-500/15 px-2 py-0.5 text-[0.65rem] font-medium text-indigo-200 border border-indigo-500/40">
              Robustness Check
            </span>
          </h2>
          <p className="mt-1 text-xs text-slate-300">
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

          <p className="mt-4 text-xs text-slate-300">
            In this configuration, the ML classifier remains robust to Unicode obfuscation, even
            though keyword-based detectors from Project 1 suffered heavy degradation.
          </p>
        </section>
      </div>

      {/* Model comparison */}
      <section className="rounded-2xl border border-slate-100 bg-white/70 px-4 py-4 md:px-6 md:py-5 shadow-sm mb-8 md:mb-10">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Robustness Summary</h2>
            <p className="mt-1 text-xs text-slate-500">
              Same model, same train split — evaluated under clean vs adversarially obfuscated
              phishing emails to measure robustness.
            </p>
          </div>
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[0.65rem] font-medium text-slate-600">
            TF-IDF (word-level) · Logistic Regression
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-xs md:text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <Th>Scenario</Th>
                <Th>Phishing recall</Th>
                <Th>Benign recall</Th>
                <Th>Accuracy</Th>
                <Th>Notes</Th>
              </tr>
            </thead>
            <tbody>
              {modelRows.map((row, idx) => (
                <tr key={row.scenario} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"}>
                  <Td className="font-medium text-slate-900">{row.scenario}</Td>
                  <Td>{row.phishingRecall}</Td>
                  <Td>{row.benignRecall}</Td>
                  <Td className="font-semibold text-slate-900">{row.accuracy}</Td>
                  <Td className="text-slate-500">{row.notes}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Insights + Tech stack */}
      <section className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 rounded-2xl border border-slate-100 bg-white/70 px-4 py-4 md:px-6 md:py-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Key Insights</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
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

        <div className="rounded-2xl border border-slate-100 bg-white/70 px-4 py-4 md:px-5 md:py-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Tech Stack</h2>
          <p className="mt-1 text-xs text-slate-500">
            Tools and concepts used to evaluate robustness of phishing detection under Unicode attacks.
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {techStack.map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[0.7rem] font-medium text-slate-700"
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
  <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[0.7rem] font-medium text-slate-700">
    {children}
  </span>
);

const PipelineStep: React.FC<{ step: string; title: string; body: string }> = ({
  step,
  title,
  body,
}) => (
  <li className="flex gap-3">
    <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-[0.7rem] font-semibold text-slate-50">
      {step}
    </div>
    <div>
      <p className="text-xs font-semibold text-slate-900">{title}</p>
      <p className="mt-1 text-xs text-slate-600">{body}</p>
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
      "px-3 py-2 text-left text-[0.7rem] font-semibold uppercase tracking-wide text-slate-500 " +
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
  <td className={"px-3 py-2 align-top text-xs text-slate-700 " + (className ?? "")} {...rest}>
    {children}
  </td>
);

const Bullet: React.FC = () => (
  <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-slate-400 flex-shrink-0" />
);

const PerfRow: React.FC<{ label: string; clean: string; poisoned: string }> = ({
  label,
  clean,
  poisoned,
}) => (
  <div>
    <div className="flex justify-between gap-2">
      <span className="text-slate-200">{label}</span>
      <span className="text-[0.7rem] text-slate-300">
        clean: <span className="font-semibold text-indigo-200">{clean}</span> · poisoned:{" "}
        <span className="font-semibold text-emerald-200">{poisoned}</span>
      </span>
    </div>
    <div className="mt-1 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
      <div className="h-full w-full rounded-full bg-gradient-to-r from-indigo-400/80 to-emerald-400/80" />
    </div>
  </div>
);

export default PhishingRobustnessDashboard;

