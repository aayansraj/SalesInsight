# 📊 SalesInsight - Sales Data Analysis Dashboard

![SalesInsight Banner](https://img.shields.io/badge/SalesInsight-v1.0-blue?style=for-the-badge&logo=analytics)
![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Pandas](https://img.shields.io/badge/Pandas-2.3-150458?style=for-the-badge&logo=pandas&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

An end-to-end **Sales Data Analysis & Executive Business Intelligence Dashboard** built for the Internship Mini-Project assignment. **SalesInsight** covers the entire data analysis lifecycle: raw data generation, data quality auditing, Pandas deduplication and imputation, KPI calculation, exploratory data analysis (EDA), interactive Web Dashboard development, and business strategy formulation.

---

## 📁 Submission Deliverables Checklist
- [x] **Original Dataset**: `raw_sales_data.csv` (1,485 records with intentional missing values, duplicates & string quirks)
- [x] **Cleaned Dataset**: `cleaned_sales_data.csv` (1,450 deduplicated, imputed, standardized records)
- [x] **SQL Database Dump**: `salesinsight_db.sql` & `sales_database.db` (Schema, Views, SQL script dump)
- [x] **SQL Queries Documentation**: `SQL_QUERIES.md` (Pre-built analytical SQL views & queries)
- [x] **Python Analysis Pipeline**: `clean_and_analyze.py` (Pandas & NumPy automated cleaning script)
- [x] **Jupyter Analysis Notebook**: `sales_data_analysis.ipynb` (Step-by-step EDA notebook with charts)
- [x] **Final Web Dashboard**: `SalesInsight` (Modern Vite + React + Recharts interactive dashboard)
- [x] **Minimum 5 Business Insights**: 6 structured executive business recommendations (`PROJECT_REPORT.md`)
- [x] **Project Report**: `PROJECT_REPORT.md` (Detailed 2-week internship report)
- [x] **Final Presentation Deck**: `PRESENTATION.md` & built-in interactive presentation viewer in Web UI

---

## 🎯 Key Performance Indicators (KPI Summary)
- 💰 **Total Gross Sales:** `$529,352.84`
- 🛍️ **Total Orders Processed:** `1,450`
- 📈 **Average Order Value (AOV):** `$365.07`
- 📦 **Total Units Sold:** `3,429`
- 📍 **Top Performing Region:** `West Region ($122,527.26)`
- 🛋️ **Top Category:** `Furniture ($201,487.85 - 38.1% Share)`

---

## 🚀 How to Run the Project Locally

### 1. Run Python Data Pipeline & Analysis Notebook
Ensure Python 3.9+ is installed.

```bash
# Run automated data generation, cleaning, and static chart export
python3 clean_and_analyze.py

# Generate Jupyter Notebook
python3 create_notebook.py
```

### 2. Launch the Web Dashboard (SalesInsight)
Make sure Node.js (v18+) is installed.

```bash
# Install dependencies
npm install

# Launch local development server
npm run dev
```

Open your browser at `http://localhost:3000` to interact with **SalesInsight**.

---

## 🛠️ Project Structure
```
Shubham Internship Project/
├── raw_sales_data.csv          # Uncleaned raw transactional dataset
├── cleaned_sales_data.csv      # Processed clean dataset
├── clean_and_analyze.py        # Python Pandas cleaning & EDA script
├── create_notebook.py          # Jupyter notebook builder script
├── sales_data_analysis.ipynb   # Interactive analysis notebook
├── PROJECT_REPORT.md           # 2-Week Internship Project Report
├── PRESENTATION.md             # Slide deck presentation outline
├── charts/                     # Generated Matplotlib chart images
│   ├── monthly_sales_trend.png
│   ├── regional_performance.png
│   ├── top_products.png
│   └── category_distribution.png
├── src/                        # SalesInsight Web Application source code
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── KPICards.tsx
│   │   ├── FilterBar.tsx
│   │   ├── MonthlySalesChart.tsx
│   │   ├── RegionalSalesChart.tsx
│   │   ├── TopProductsChart.tsx
│   │   ├── DataExplorer.tsx
│   │   ├── BusinessInsights.tsx
│   │   └── PresentationViewer.tsx
│   ├── data/
│   │   └── salesData.ts        # Embedded analytical dataset & slides
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.ts
```

---

## 💡 Executive Business Takeaways Summary
1. **Q4 Revenue Peak:** Q4 sales (Nov & Dec) generate **27.6% of annual revenue** ($146.2k). Pre-stock inventory in September.
2. **High-Margin Furniture:** Premium furniture products (*Leather Sofa*, *Standing Desk*) drive **38.1% of gross revenue**.
3. **Geographic Distribution:** West and Central regions command **44.9% market share**.
4. **Return Rate Mitigation:** Address $75.1k in return/cancellation leakage through improved product documentation.
5. **Corporate B2B Opportunity:** Target Corporate customers ($452 AOV) with enterprise account packages.

---

## 👨‍💻 Project Submission Metadata
- **Project Name:** Sales Data Analysis Dashboard
- **Web App Title:** SalesInsight
- **Internship Assignment:** Beginner Level Mini-Project (2 Weeks)
