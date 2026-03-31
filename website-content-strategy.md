# Website Content Strategy — shahanahmed.com Transformation

## Context
I am Shahan Ahmed, a Data Scientist & ML Engineer with ~5 years of experience working in IT (currently at Conduent in Endicott, NY). I also have academic research publications. My current site is a dark-themed portfolio with generic role cards, basic project cards, and a resume-style layout. I need to transform it into a strong personal brand platform. Below is the full strategy — please implement these changes to my site.

---

## 1. HERO SECTION — Rewrite the Tagline

**Current (remove this):**
> "Data Scientist & Machine Learning Engineer | Transforming data into insights, building innovative solutions, and creating meaningful digital experiences"

**Replace with:**
> "Data Scientist & ML Engineer specializing in NLP, document intelligence, and healthcare analytics — with published research and production systems processing millions of records."

Also add a "Currently" line below the tagline:
> Currently: Building production NLP systems at Conduent | Researching federated learning for public health | Creating ML tutorials on YouTube

Keep the "Download Resume" button.

---

## 2. REPLACE "Specializing In" SECTION

**Remove** the five generic role cards (Data Scientist, Research Analyst, Data Analyst, BI Analyst, Market Research).

**Replace with** a "What I Do" section containing exactly three focused capability pillars:

### Pillar 1: ML Engineering & NLP
- Transformer fine-tuning (DistilBERT, Longformer)
- Document classification & OCR pipelines
- Production model deployment (Docker, systemd, AWS)

### Pillar 2: Healthcare & Public Health Analytics
- Cancer treatment pathway analysis (CMS Medicare data)
- Vaccination coverage research (DHS data)
- Federated learning & synthetic data for health equity

### Pillar 3: Data Engineering & Infrastructure
- PySpark & Databricks pipelines
- Delta Lake medallion architecture
- AWS cloud services & MLflow experiment tracking

Each pillar should have a short description and optionally link to a relevant case study or project.

---

## 3. ADD A "CASE STUDIES" SECTION (New)

Replace or supplement the current "Featured Projects" cards with deeper case study cards. Each case study card should show:
- Project title
- One-line problem statement
- Key result/metric
- Tech stack tags
- "Read Case Study →" button

Priority case studies:
1. **Medical Document Classifier** — "Built a Longformer-based binary classifier achieving 99%+ accuracy on 50K+ medical documents for automated document routing."
2. **Cancer Risk Prediction Pipeline** — "End-to-end ML pipeline on CMS Medicare claims data using Databricks, Delta Lake, and MLflow to predict high-risk cancer patients."
3. **Phishing Detection Under Adversarial Attacks** — "Evaluated ML-based phishing classifiers against Unicode homoglyph and zero-width character adversarial techniques."
4. **DHS Vaccination Coverage Analysis** — "Analyzed vaccination coverage patterns using Demographic and Health Survey data across multiple countries, presented at MSU Research Symposium."

---

## 4. ADD A "RESEARCH & PUBLICATIONS" SECTION (New)

Create a dedicated section or page listing:

### Publications
- Solar cell modeling paper — Optics & Laser Technology
- Inorganic Chemistry Communications paper
- (Upcoming) Federated learning + synthetic data + vaccination data paper

### Presentations
- 2024 MSU Student Research Symposium — DHS vaccination coverage analysis

### Working Projects
- OpenDataBD — Open data initiative for Bangladesh (link to opendatabd.org or relevant URL)

---

## 5. ADD A "BLOG / WRITING" SECTION (New)

Add a Blog or Writing page to the navigation. Even if empty at launch, create the page with a placeholder like:
> "Coming soon — technical walkthroughs, research digests, and industry perspectives on ML engineering, NLP, and healthcare AI."

This will be populated with posts over time.

---

## 6. RESTRUCTURE THE NAVIGATION

**Current:** Home | Projects | Contact | Talk to Me

**New:** Home | Case Studies | Blog | Research | Contact

Move "Talk to Me" to be a CTA button on the Contact page or keep as a floating button, not a main nav item.

---

## 7. ADD SOCIAL PROOF

Add a small section (can be near the bottom of the homepage) with:
- Publication count: "2 peer-reviewed publications"
- A "Presented at" line: MSU Research Symposium 2024
- Optional: LinkedIn recommendation quotes if available

---

## 8. ADD AN "INITIATIVES" OR "BEYOND WORK" SECTION

Small section showcasing:
- **The Shahan Stack** — YouTube channel for practical data science & ML engineering walkthroughs
- **OpenDataBD** — Open data platform for Bangladesh
- **PixelForge** — Web development & SaaS agency

Each with a one-liner and external link.

---

## 9. CONNECT WITH ME — Keep but Clean Up

Keep the GitHub, LinkedIn, and Google Scholar icons. Make sure all links are correct and active.

---

## Design Notes
- Keep the dark theme — it works well for a technical portfolio
- Use cards with subtle gradients or borders for the three pillars
- Case study cards should feel more premium than the current project cards — add metric badges or result highlights
- Maintain clean typography and spacing
- Make the site feel like a thought leader's platform, not just a resume page

---

## Implementation Priority
1. Hero section rewrite (tagline + "Currently" line)
2. Replace 5 role cards with 3 capability pillars
3. Restructure navigation
4. Add case studies section
5. Add research/publications section
6. Add social proof
7. Add blog placeholder page
8. Add initiatives section
