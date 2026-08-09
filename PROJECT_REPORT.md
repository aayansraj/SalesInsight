# INTERNSHIP MINI PROJECT REPORT – DATA ANALYSIS
## Project Title: Sales Data Analysis & Business Intelligence Dashboard
**Platform Name:** SalesInsight  
**Author / Intern:** Data Analysis Intern  
**Submission Date:** August 2026  
**Mentor / Evaluator:** Internship Project Mentor  

---

## Executive Summary
This report presents the complete end-to-end data analysis workflow for the **Sales Data Analysis Dashboard** mini-project assignment (**SalesInsight**). Over a 2-week internship lifecycle, raw transactional sales data spanning 1,485 orders across 5 geographic regions was collected, audited, cleaned, analyzed, and visualized.

The project produced four core deliverables:
1. **Data Cleaning Pipeline & Datasets** (`raw_sales_data.csv` and `cleaned_sales_data.csv`)
2. **Exploratory Data Analysis Notebook & Script** (`clean_and_analyze.py` and `sales_data_analysis.ipynb`)
3. **Interactive Web Dashboard** (**SalesInsight** web application built with React, Vite, Tailwind CSS, and Recharts)
4. **Strategic Business Intelligence Report** containing 6 actionable business insights and an interactive presentation slide deck.

---

## 1. Project Objectives
- **Data Understanding:** Analyze transactional schema, column data types, and identify data quality anomalies.
- **Data Cleaning:** Detect and eliminate duplicate entries, handle null values, standardize string formatting, and parse dates into ISO 8601 standard (`YYYY-MM-DD`).
- **KPI Analysis:** Measure Total Gross Sales, Total Orders, Average Order Value (AOV), Total Units Sold, and Top Regional/Product performance.
- **Visualization & Dashboarding:** Design an interactive, production-ready web dashboard with dynamic filters for Date, Region, Category, and Order Status.
- **Business Recommendations:** Extract at least 5 meaningful, data-backed insights to drive executive decision-making.

---

## 2. Dataset Structure & Data Quality Audit

### 2.1 Raw Dataset Characteristics
The initial raw dataset (`raw_sales_data.csv`) contained **1,485 transaction records** with 12 attribute fields:
- `Order_ID`: Unique transactional identifier (e.g., `ORD-20240001`)
- `Order_Date`: Date of order placement (mixed formatting: `YYYY-MM-DD` and `MM/DD/YYYY`)
- `Customer_Name`: Purchaser name (contained 35 missing values)
- `Segment`: Customer classification (`Consumer`, `Corporate`, `Home Office`)
- `Region`: Sales region (`North`, `South`, `East`, `West`, `Central`, with leading/trailing whitespaces and lowercasing)
- `Category`: Product category (`Electronics`, `Furniture`, `Clothing`, `Office Supplies`, `Home Appliances`)
- `Product_Name`: SKU name (e.g., `Leather Sofa`, `4K Monitor`)
- `Unit_Price`: Item base price (contained 25 missing values)
- `Quantity`: Number of units purchased (1 to 5 units)
- `Discount`: Applied promotional discount (0.0 to 0.20, contained 30 missing values)
- `Payment_Method`: Checkout tender type (`Credit Card`, `PayPal`, `UPI / Bank Transfer`, `Debit Card`)
- `Order_Status`: Fulfillment status (`Completed`, `Returned`, `Cancelled`, `Pending`)

### 2.2 Data Cleaning Audit Matrix
| Quality Issue | Raw Detection Count | Cleaning Strategy Applied | Post-Cleaning Result |
| :--- | :---: | :--- | :--- |
| **Duplicate Records** | 35 duplicate rows | Applied `drop_duplicates()` in Pandas | 35 exact duplicates removed (1,450 clean rows) |
| **Missing Customer Names** | 35 null fields | Replaced nulls with `'Guest Customer'` | 100% complete text fields |
| **Missing Unit Prices** | 25 null fields | Imputed missing price using product-level median price | Zero null values; pricing integrity preserved |
| **Missing Region Tags** | 20 null fields | Tagged missing values as `'Unknown'` | Explicitly tracked in geographic breakdown |
| **String Inconsistencies** | ~5% text noise | Applied `.str.strip().str.title()` formatting | Standardized region and category casing |
| **Date Formatting** | Mixed `%m/%d/%Y` & `%Y-%m-%d` | Parsed with `pd.to_datetime(..., format='mixed')` | 100% standardized ISO `YYYY-MM-DD` dates |

---

## 3. Exploratory Data Analysis & Key Findings

### 3.1 Key Performance Indicators (KPIs)
- **Total Gross Revenue:** **$529,352.84** (across all order statuses)
- **Completed Order Revenue:** **$299,240.03**
- **Total Valid Orders:** **1,450 transactions**
- **Average Order Value (AOV):** **$365.07** per transaction
- **Total Units Sold:** **3,429 units**

### 3.2 Monthly Sales Trend & Seasonality
- **Q1 – Q3 Baseline:** Monthly sales remained stable between **$31,176** (March) and **$43,547** (June).
- **Q4 Holiday Surge:** November generated **$65,502.99** (+66% over October) and December peaked at **$80,698.31** (+105% over October).
- **Driver:** Year-End holiday campaigns, Black Friday Cyber Monday (BFCM) promotions, and corporate gift buying.

### 3.3 Regional Revenue Distribution
1. **West Region:** **$122,527.26** (23.1% market share) – Highest adoption of premium monitors & ergonomic desks.
2. **Central Region:** **$115,396.98** (21.8% market share) – Heavy corporate bulk purchasing.
3. **East Region:** **$96,132.92** (18.2% market share)
4. **South Region:** **$95,846.63** (18.1% market share)
5. **North Region:** **$92,305.46** (17.4% market share)

### 3.4 Top Products & Category Breakdown
- **Furniture Category:** Leading category generating **$201,487.85** (38.1% of total revenue).
  - *Leather Sofa*: Top single revenue generator (**$141,277.85** across 157 sales).
  - *Standing Desk*: Second highest revenue item (**$60,210.00**).
- **Electronics Category:** Generated **$126,898.50** (24.0% share), led by *Robot Vacuum* ($44.2k) and *Espresso Machine* ($43.3k).
- **Volume Leaders:** Low-ticket office supplies (*Gel Pens Set*, *Paper Reams*) accounted for the highest physical unit movement.

---

## 4. Minimum 6 Business Insights & Strategic Recommendations

### Insight 1: Q4 Holiday Spike Drives 27.6% of Annual Revenue
- **Data Point:** Q4 sales (Nov & Dec) totaled **$146,201.30** out of $529,352.84 annual total.
- **Strategic Action:** Pre-order inventory 60 days prior to Q4 (by September) for high-margin products. Increase promotional ad spend by 40% during October-November.

### Insight 2: Premium Furniture Represents 38.1% Gross Share
- **Data Point:** Furniture category items account for **$201,487** total sales with a high unit price average.
- **Strategic Action:** Introduce bundled "Home Office Packages" (Standing Desk + Ergonomic Chair + Desk Lamp) with a 10% bundle discount to push AOV beyond $450.

### Insight 3: West & Central Command Over 44.9% Geographic Share
- **Data Point:** Combined sales in West ($122.5k) and Central ($115.4k) total **$237,924**.
- **Strategic Action:** Establish secondary distribution fulfillment centers in West Coast and Central hubs to lower shipping costs and accelerate delivery times.

### Insight 4: Revenue Leakage from Returned & Cancelled Orders ($75,100)
- **Data Point:** 206 orders resulted in return or cancellation status, valued at **$75,100** (~14.2% of orders).
- **Strategic Action:** Improve electronics product manuals, add 3D preview models on product detail pages, and refine checkout verification to lower return rates below 5%.

### Insight 5: Corporate Customer Segment Displays 24% Higher AOV
- **Data Point:** Corporate account transactions averaged **$452.10** versus **$365.07** for individual retail consumers.
- **Strategic Action:** Create a dedicated B2B corporate purchasing portal offering net-30 payment terms and volume tier discounts.

### Insight 6: Data Cleaning Imputation Eliminated Reporting Skew
- **Data Point:** Resolving 35 duplicate transactions and imputing 25 missing unit prices using median product pricing prevented a potential **$18,400 distortion** in revenue reporting.
- **Strategic Action:** Mandate frontend form validations and automated API schema checks to prevent incomplete data ingest at source.

---

## 5. SalesInsight Web Dashboard Overview
The **SalesInsight** web dashboard is accessible via browser and provides:
- **KPI Overview Cards:** Real-time metrics with gradient badges and trend indicators.
- **Multi-Dimensional Filters:** Instant filtering across Date Range (Quarterly), Region, Category, and Order Status.
- **Dynamic Charts:** Built using Recharts (Area Trend, Bar Charts, Donut Share, Horizontal SKU Rankings).
- **Interactive Data Explorer:** Searchable live table with sorting, pagination, clean/raw dataset preview toggle, and CSV export button.
- **Built-in Presentation Viewer:** 9 interactive slides directly available for mentor demonstrations.

---

## 6. Conclusion
The **Sales Data Analysis Dashboard** project successfully demonstrates the full analytical lifecycle. By transforming raw, noisy transactional data into structured datasets and an executive web application, **SalesInsight** empowers decision-makers to optimize inventory, focus marketing budgets on high-performing regions, and recover lost revenue from order cancellations.
