'use client';

import React from "react";

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
    <section className="w-full max-w-6xl mx-auto px-4 py-10 md:py-14">
      {/* Header */}
      <header className="mb-8 md:mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-100">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Research Project · Security · NLP · Adversarial ML
        </div>

        <h1 className="mt-4 text-2.5xl md:text-4xl font-semibold tracking-tight text-slate-900">
          Social Engineering & Adversarial Obfuscation <br className="hidden md:block" />
          <span className="text-slate-500 text-[0.9em]">
            in Business Email Compromise (BEC) Attacks
          </span>
        </h1>

        <p className="mt-3 max-w-2xl text-sm md:text-base text-slate-600">
          I analyzed how Unicode-based adversarial techniques (homoglyphs and zero-width characters)
          break keyword-based phishing detection, and built a character-level model that reliably
          detects these obfuscation patterns in BEC phishing emails.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Tag>Cybersecurity</Tag>
          <Tag>Natural Language Processing</Tag>
          <Tag>Adversarial Machine Learning</Tag>
          <Tag>Model Interpretability</Tag>
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
        {/* Left column – pipeline */}
        <section className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white/70 px-4 py-4 md:px-6 md:py-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Project Pipeline</h2>
          <p className="mt-1 text-xs text-slate-500">
            End-to-end workflow from data generation to adversarial detection and explanation.
          </p>

          <ol className="mt-4 space-y-3 text-sm text-slate-700">
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
        </section>

        {/* Right column – keyword impact */}
        <section className="rounded-2xl border border-slate-100 bg-slate-900 px-4 py-4 md:px-5 md:py-5 text-slate-50 shadow-sm">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            Keyword Signal Loss
            <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2 py-0.5 text-[0.65rem] font-medium text-emerald-300 border border-emerald-500/40">
              Adversarial Impact
            </span>
          </h2>
          <p className="mt-1 text-xs text-slate-300">
            How much keyword-based detection breaks under Unicode obfuscation (modified emails only).
          </p>

          <div className="mt-4 space-y-3">
            {keywordStats.map((k) => (
              <div key={k.keyword}>
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-100">{k.keyword}</span>
                  <span className="text-emerald-300">{k.drop} drop</span>
                </div>
                <div className="mt-1 h-1.5 w-full rounded-full bg-slate-700 overflow-hidden">
                  <div className="h-full w-4/5 rounded-full bg-emerald-400/90" />
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-slate-300">
            In the worst cases, surface-level keyword matches for critical financial terms like{" "}
            <span className="font-semibold text-emerald-200">&quot;invoice&quot;</span> and{" "}
            <span className="font-semibold text-emerald-200">&quot;immediately&quot;</span> drop by more than{" "}
            <span className="font-semibold text-emerald-200">90%</span>.
          </p>
        </section>
      </div>

      {/* Model comparison */}
      <section className="rounded-2xl border border-slate-100 bg-white/70 px-4 py-4 md:px-6 md:py-5 shadow-sm mb-8 md:mb-10">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Model Comparison</h2>
            <p className="mt-1 text-xs text-slate-500">
              Clean-text models struggle to predict which emails will be obfuscated. Models trained
              directly on poisoned text learn Unicode artifacts and perform strongly.
            </p>
          </div>
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[0.65rem] font-medium text-slate-600">
            Character-level modeling · Logistic Regression
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-xs md:text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <Th>Model</Th>
                <Th>Input</Th>
                <Th>Primary Signal</Th>
                <Th>F1 (modified class)</Th>
                <Th>Notes</Th>
              </tr>
            </thead>
            <tbody>
              {modelRows.map((row, idx) => (
                <tr
                  key={row.name}
                  className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"}
                >
                  <Td className="font-medium text-slate-900">{row.name}</Td>
                  <Td>{row.input}</Td>
                  <Td>{row.focus}</Td>
                  <Td className="font-semibold text-slate-900">{row.f1Modified}</Td>
                  <Td className="text-slate-500">{row.note}</Td>
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
                Unicode obfuscation can remove **70–90%** of surface keyword signal while keeping
                BEC emails understandable to humans.
              </span>
            </li>
            <li className="flex gap-2">
              <Bullet />
              <span>
                A simple risk-score detector based on finance/urgency keywords suffers an{" "}
                <strong>81.3% evasion rate</strong> on modified emails.
              </span>
            </li>
            <li className="flex gap-2">
              <Bullet />
              <span>
                Character-level models trained on poisoned text achieve **~95% accuracy** and
                **~0.92 F1** on detecting adversarially modified emails.
              </span>
            </li>
            <li className="flex gap-2">
              <Bullet />
              <span>
                Top model features reveal reliance on homoglyph sequences and zero-width Unicode,
                confirming that the model is detecting <em>obfuscation artifacts</em>, not topics.
              </span>
            </li>
            <li className="flex gap-2">
              <Bullet />
              <span>
                This suggests a layered defense strategy: semantic phishing detection augmented by a
                dedicated Unicode obfuscation detector.
              </span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white/70 px-4 py-4 md:px-5 md:py-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Tech Stack</h2>
          <p className="mt-1 text-xs text-slate-500">
            Tools and concepts I used to build and analyze this project.
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

export default BECAdversarialDashboard;

