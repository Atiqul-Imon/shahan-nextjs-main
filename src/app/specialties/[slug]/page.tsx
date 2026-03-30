import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FaSearch, FaDatabase, FaChartBar, FaGlobe, FaBrain } from 'react-icons/fa';
import { ArrowLeft } from 'lucide-react';

const specialtyData: Record<string, {
  title: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  tagline: string;
  overview: string;
  skills: string[];
  tools: string[];
  highlights: { heading: string; body: string }[];
}> = {
  'data-scientist': {
    title: 'Data Scientist',
    icon: FaBrain,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    tagline: 'Turning raw data into intelligent systems that learn, predict, and adapt.',
    overview:
      'As a Data Scientist, I design and deploy end-to-end machine learning pipelines — from exploratory data analysis and feature engineering all the way through model training, evaluation, and production deployment. I work across supervised, unsupervised, and deep learning paradigms to solve real-world classification, regression, clustering, and NLP challenges.',
    skills: [
      'Machine Learning (supervised & unsupervised)',
      'Deep Learning & Neural Networks',
      'Natural Language Processing (NLP)',
      'Feature Engineering & Selection',
      'Model Evaluation & Hyperparameter Tuning',
      'Statistical Inference & Hypothesis Testing',
      'Time Series Forecasting',
      'Experiment Design & A/B Testing',
    ],
    tools: ['Python', 'scikit-learn', 'TensorFlow', 'PyTorch', 'Hugging Face Transformers', 'XGBoost', 'LightGBM', 'Pandas', 'NumPy', 'Jupyter'],
    highlights: [
      {
        heading: 'MEDNARR Detector',
        body: 'Built a 10K-sample medical narrative classifier using fine-tuned transformer models, achieving high precision in distinguishing clinical text from non-clinical content.',
      },
      {
        heading: 'BEC Adversarial Detection',
        body: 'Developed adversarial robustness experiments for Business Email Compromise phishing detection, evaluating model resilience against obfuscation attacks.',
      },
      {
        heading: 'Cancer Prediction Model',
        body: 'Created a diagnostic ML pipeline for cancer prediction using ensemble methods, with interpretability via SHAP values for clinical transparency.',
      },
    ],
  },

  'research-analyst': {
    title: 'Research Analyst',
    icon: FaSearch,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    tagline: 'Uncovering the patterns hidden in unstructured data to inform strategy.',
    overview:
      'As a Research Analyst, I combine quantitative methods with domain knowledge to extract actionable insights from complex, often unstructured datasets. I conduct primary and secondary research, synthesize large volumes of information, and translate findings into clear reports and recommendations for stakeholders.',
    skills: [
      'Qualitative & Quantitative Research Design',
      'Text Mining & Content Analysis',
      'Survey Design & Analysis',
      'Literature Review & Synthesis',
      'Statistical Analysis (regression, ANOVA, chi-square)',
      'Data Wrangling & Cleaning',
      'Report Writing & Presentation',
      'Citation & Academic Writing',
    ],
    tools: ['Python', 'R', 'SPSS', 'Excel', 'Pandas', 'NLTK', 'spaCy', 'Google Scholar', 'Zotero', 'Tableau'],
    highlights: [
      {
        heading: 'QSR Industry Analysis',
        body: 'Conducted a comprehensive competitive analysis of the Quick Service Restaurant industry, identifying growth drivers, customer sentiment patterns, and pricing strategy gaps.',
      },
      {
        heading: 'Phishing Robustness Research',
        body: 'Authored research into the robustness of phishing detection systems against adversarial text transformations, with findings published and presented at academic forums.',
      },
      {
        heading: 'Municipal Court Data Study',
        body: 'Analyzed court disposition data to identify systemic patterns in case outcomes, supporting data-driven policy discussions.',
      },
    ],
  },

  'data-analyst': {
    title: 'Data Analyst',
    icon: FaDatabase,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    tagline: 'Transforming large datasets into clear, decision-ready insights.',
    overview:
      'As a Data Analyst, I specialize in querying, cleaning, and analyzing structured datasets to support business decisions. I identify trends, anomalies, and performance drivers across operational data — then communicate findings to both technical and non-technical audiences through clear visualizations and written summaries.',
    skills: [
      'SQL (complex joins, window functions, CTEs)',
      'Data Cleaning & Transformation (ETL)',
      'Exploratory Data Analysis (EDA)',
      'KPI Definition & Tracking',
      'Cohort & Funnel Analysis',
      'Statistical Visualization',
      'Excel / Google Sheets (pivot tables, formulas)',
      'Data Pipeline Automation',
    ],
    tools: ['SQL', 'Python', 'Pandas', 'Excel', 'Power BI', 'Tableau', 'Looker', 'BigQuery', 'dbt', 'Apache Airflow'],
    highlights: [
      {
        heading: 'Operational Metrics Dashboard',
        body: 'Built automated reporting pipelines that reduced manual reporting time by over 60%, pulling from multiple data sources into a single consolidated view.',
      },
      {
        heading: 'Customer Behavior Analysis',
        body: 'Performed cohort and churn analysis on customer transaction data, surfacing retention patterns that informed targeted re-engagement campaigns.',
      },
      {
        heading: 'Data Quality Auditing',
        body: 'Designed data validation frameworks to catch upstream data quality issues early, improving reliability of downstream analytics and reporting.',
      },
    ],
  },

  'bi-analyst': {
    title: 'BI Analyst',
    icon: FaChartBar,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    tagline: 'Visualizing what matters — turning metrics into decisions at a glance.',
    overview:
      'As a Business Intelligence Analyst, I design and maintain dashboards, reports, and data models that give organizations a clear, real-time view of their performance. I bridge the gap between raw data and executive strategy by building self-serve analytics tools that empower teams to answer their own questions without needing a data team every time.',
    skills: [
      'Dashboard Design & UX',
      'Data Modeling (star schema, snowflake)',
      'KPI Framework Development',
      'Executive Reporting',
      'Self-Serve Analytics Enablement',
      'Cross-Functional Stakeholder Communication',
      'Trend & Variance Analysis',
      'Automated Reporting & Alerts',
    ],
    tools: ['Power BI', 'Tableau', 'Looker', 'Metabase', 'SQL', 'DAX', 'Excel', 'Google Data Studio', 'dbt', 'Snowflake'],
    highlights: [
      {
        heading: 'Executive Performance Dashboards',
        body: 'Built C-suite dashboards consolidating sales, operations, and marketing KPIs into a single real-time view, reducing time-to-insight for leadership by hours each week.',
      },
      {
        heading: 'Self-Serve Analytics Platform',
        body: 'Implemented a Looker-based self-serve reporting environment, enabling non-technical teams to slice and explore data independently — cutting ad hoc data requests by 40%.',
      },
      {
        heading: 'Revenue Forecasting Reports',
        body: 'Developed monthly and quarterly revenue forecasting models integrated directly into BI dashboards, with automated variance alerts for finance teams.',
      },
    ],
  },

  'market-research': {
    title: 'Market Research',
    icon: FaGlobe,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    tagline: 'Understanding markets, customers, and competitors to drive smarter strategy.',
    overview:
      'As a Market Researcher, I gather, analyze, and synthesize intelligence on industries, competitors, and customer segments. I turn market signals into strategic insights — helping organizations understand where opportunities lie, what customers actually want, and how to position effectively against the competition.',
    skills: [
      'Competitive Intelligence & Benchmarking',
      'Customer Segmentation & Persona Development',
      'Survey Design & Analysis',
      'Focus Group & Interview Analysis',
      'Market Sizing & TAM/SAM/SOM Estimation',
      'Trend Identification & Forecasting',
      'Brand Perception Analysis',
      'Go-to-Market Strategy Support',
    ],
    tools: ['Excel', 'Python', 'Pandas', 'SurveyMonkey', 'Qualtrics', 'Tableau', 'SEMrush', 'SimilarWeb', 'Statista', 'LinkedIn Sales Navigator'],
    highlights: [
      {
        heading: 'QSR Competitive Landscape',
        body: 'Mapped the competitive landscape of the quick-service restaurant sector, identifying white-space opportunities and consumer sentiment shifts post-pandemic.',
      },
      {
        heading: 'Customer Segmentation Study',
        body: 'Developed data-driven customer personas for a retail client using transactional data and survey responses, directly informing product and messaging strategy.',
      },
      {
        heading: 'Industry Trend Reports',
        body: 'Produced recurring market trend reports covering AI adoption in healthcare and fintech verticals, delivering forward-looking intelligence to strategy teams.',
      },
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(specialtyData).map((slug) => ({ slug }));
}

export default async function SpecialtyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = specialtyData[slug];

  if (!data) notFound();

  const Icon = data.icon;

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 mb-10 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-200" />
          <span>Back to Home</span>
        </Link>

        {/* Hero banner */}
        <div className={`rounded-2xl border p-8 mb-10 ${data.bgColor} ${data.borderColor}`}>
          <div className="flex items-center space-x-5 mb-4">
            <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-700">
              <Icon className={`text-4xl ${data.color}`} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-100">{data.title}</h1>
              <p className={`mt-1 text-lg font-medium ${data.color}`}>{data.tagline}</p>
            </div>
          </div>
          <p className="text-gray-300 leading-relaxed text-base mt-4">{data.overview}</p>
        </div>

        {/* Skills & Tools grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Core Skills</h2>
            <ul className="space-y-2">
              {data.skills.map((skill, i) => (
                <li key={i} className="flex items-start space-x-2 text-gray-300 text-sm">
                  <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${data.color.replace('text-', 'bg-')}`} />
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Tools & Technologies</h2>
            <div className="flex flex-wrap gap-2">
              {data.tools.map((tool, i) => (
                <span
                  key={i}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${data.bgColor} ${data.borderColor} ${data.color}`}
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Project highlights */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-100 mb-6">Project Highlights</h2>
          <div className="space-y-4">
            {data.highlights.map((h, i) => (
              <div key={i} className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
                <h3 className={`text-lg font-semibold mb-2 ${data.color}`}>{h.heading}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{h.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/contact"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
          >
            <span>Work with me on this</span>
            <ArrowLeft size={18} className="rotate-180" />
          </Link>
        </div>
      </div>
    </main>
  );
}
