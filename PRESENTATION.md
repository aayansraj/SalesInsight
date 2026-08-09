# INTERNSHIP MINI PROJECT PRESENTATION DECK
## Sales Data Analysis Dashboard - SalesInsight

---

### Slide 1: Title Slide
- **Title:** SalesInsight: Sales Data Analysis & Business Intelligence Dashboard
- **Subtitle:** Internship Mini Project Assignment Submission
- **Author:** Data Analysis Intern
- **Tools:** Python (Pandas, NumPy, Matplotlib), React, Vite, Recharts, Tailwind CSS

---

### Slide 2: Project Objectives & Scope
- **Primary Goal:** Analyze a multi-region sales dataset and build an interactive executive dashboard.
- **Workflow Phases:** Data Generation & Audit -> Data Cleaning -> KPI Analytics -> Web Dashboard -> Strategic Insights.
- **Deliverables:** Raw CSV, Cleaned CSV, Python Script, Jupyter Notebook, Web Application, Report, & Slide Deck.

---

### Slide 3: Data Understanding & Cleaning Pipeline
- **Raw Transaction Volume:** 1,485 sales transactions across 5 geographic regions.
- **Quality Auditing:** Identified 35 duplicate records, missing names/prices/regions, and mixed date formats.
- **Data Cleaning Executed:**
  - `drop_duplicates()`: Removed 35 exact duplicates.
  - Imputation: Replaced missing unit prices with product-level median values.
  - Text Normalization: Whitespace stripping & title casing for region names.
  - Date Parsing: Converted all dates to standardized `YYYY-MM-DD` ISO format.

---

### Slide 4: Key Performance Indicators (KPIs)
- **Total Gross Sales:** **$529,352.84**
- **Total Completed Orders:** **1,450 clean transactions**
- **Average Order Value (AOV):** **$365.07**
- **Total Units Sold:** **3,429 items**
- **Top Sales Region:** **West Region ($122,527.26)**

---

### Slide 5: Monthly Sales Trend & Seasonality
- **Baseline Period:** Q1-Q3 sales held steady at ~$35k - $43k monthly.
- **Q4 Surge:** Massive surge in Nov ($65.5k) and Dec ($80.7k).
- **Revenue Impact:** Q4 generated **27.6% of total annual gross sales**.
- **Action:** Pre-stock inventory by September to capture holiday demand.

---

### Slide 6: Regional Performance Analysis
- **West Region ($122.5k):** 23.1% market share; highest purchase rate of high-end electronics.
- **Central Region ($115.4k):** 21.8% market share; strong corporate B2B volume.
- **East & South Regions ($96.1k & $95.8k):** Consistent retail consumer growth.
- **North Region ($92.3k):** Opportunity zone for market penetration.

---

### Slide 7: Product & Category Breakdown
- **Furniture Category:** Dominates revenue with **$201,487.85 (38.1% share)**.
- **Top Product by Revenue:** *Leather Sofa* ($141,277.85) & *Standing Desk* ($60,210.00).
- **Volume Leaders:** *Gel Pens Set*, *Paper Reams*, and *Cotton T-Shirts* lead physical unit sales.

---

### Slide 8: 6 Executive Business Insights
1. **Q4 Inventory:** Boost stock of top 5 SKUs by 35% in September.
2. **Product Bundling:** Create Work-From-Home bundles to increase AOV above $400.
3. **Logistics Expansion:** Build West and Central distribution hubs to cut freight costs.
4. **Return Reduction:** Address $75.1k in return leakage with improved tech guides.
5. **Corporate B2B:** Target Corporate buyers ($452 AOV) with enterprise pricing.
6. **Data Governance:** Enforce strict validation rules on order entry.

---

### Slide 9: Project Conclusion & Learning Outcomes
- Delivered a complete end-to-end data analysis pipeline and web platform (**SalesInsight**).
- Mastered data cleaning techniques in Pandas & NumPy.
- Built interactive visualizations and executive summary dashboards.
