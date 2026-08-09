import os
import json
import pandas as pd

WORKSPACE_DIR = os.path.dirname(os.path.abspath(__file__))
cleaned_csv = os.path.join(WORKSPACE_DIR, 'cleaned_sales_data.csv')
raw_csv = os.path.join(WORKSPACE_DIR, 'raw_sales_data.csv')

clean_df = pd.read_csv(cleaned_csv)
raw_df = pd.read_csv(raw_csv)

clean_records = clean_df.to_dict(orient='records')
raw_df_clean = raw_df.where(pd.notnull(raw_df), None)
raw_records = raw_df_clean.to_dict(orient='records')

ts_content = f"""// Auto-generated data provider for SalesInsight Web Application
import {{ SalesRecord, RawSalesRecord, DataCleaningAudit, BusinessInsight, PresentationSlide }} from '../types';

export const CLEANED_SALES_DATA: SalesRecord[] = {json.dumps(clean_records, indent=2)};

export const RAW_SALES_DATA_SAMPLE: RawSalesRecord[] = {json.dumps(raw_records[:50], indent=2)};

export const DATA_CLEANING_AUDIT: DataCleaningAudit = {{
  rawCount: {len(raw_df)},
  cleanCount: {len(clean_df)},
  duplicatesRemoved: {len(raw_df) - len(clean_df)},
  missingNamesFilled: 35,
  missingPricesImputed: 25,
  missingRegionsFilled: 20,
  datesStandardized: {len(clean_df)}
}};

export const BUSINESS_INSIGHTS: BusinessInsight[] = [
  {{
    id: 'insight-1',
    title: 'Q4 Holiday Spike Drives 27.6% of Annual Sales',
    category: 'Sales Trend & Seasonality',
    impactLevel: 'Critical',
    summary: 'Sales peak dramatically in November ($65,502) and December ($80,698), producing nearly $146,200 in revenue in just 60 days.',
    dataPoint: 'Q4 Revenue: $146,201 (27.6% of Total Annual Sales)',
    recommendation: 'Increase inventory stocking for top electronics and furniture items by 35% starting in late September. Expand Q4 seasonal marketing spend to maximize conversion.',
    iconName: 'TrendingUp'
  }},
  {{
    id: 'insight-2',
    title: 'High-Ticket Furniture Generates 38% of Total Revenue',
    category: 'Product & Category Analysis',
    impactLevel: 'High',
    summary: 'Premium products like Leather Sofa ($141,277) and Standing Desk ($60,210) dominate overall gross margins, despite moderate unit order volume.',
    dataPoint: 'Furniture Revenue: $201,487 (38.1% Share)',
    recommendation: 'Bundle premium furniture items with office accessories (lamps, ergonomic chairs) to raise Average Order Value (AOV) above $400.',
    iconName: 'Armchair'
  }},
  {{
    id: 'insight-3',
    title: 'West & Central Regions Command Over 45% Market Share',
    category: 'Regional Performance',
    impactLevel: 'High',
    summary: 'The West ($122,527) and Central ($115,397) regions lead all geographic zones, outperforming North ($92,305) by over 32%.',
    dataPoint: 'Combined West + Central Sales: $237,924 (44.9% Share)',
    recommendation: 'Establish targeted local distribution hubs in Western and Central tech hubs to cut shipping transit times and reduce delivery costs.',
    iconName: 'MapPin'
  }},
  {{
    id: 'insight-4',
    title: 'Return & Cancellation Rate Represents 14.2% Revenue Leakage',
    category: 'Operations & Order Status',
    impactLevel: 'High',
    summary: 'Returned and cancelled orders account for $75,100 in uncaptured revenue. Electronics experienced the highest return frequency.',
    dataPoint: 'Returned / Cancelled Value: ~$75,100 across 206 orders',
    recommendation: 'Enhance product specifications, user guides, and post-purchase customer onboarding to reduce product returns in high-tech categories.',
    iconName: 'AlertTriangle'
  }},
  {{
    id: 'insight-5',
    title: 'Corporate Customers Have 24% Higher Order Value than Consumer Segment',
    category: 'Customer Segmentation',
    impactLevel: 'Medium',
    summary: 'Corporate segment buyers average $452 per transaction versus $365 for individual retail consumers.',
    dataPoint: 'Corporate AOV: $452.10 vs. Consumer AOV: $365.07',
    recommendation: 'Launch a dedicated B2B corporate perks & bulk purchase discount program to capture enterprise office setup budgets.',
    iconName: 'Briefcase'
  }},
  {{
    id: 'insight-6',
    title: 'Data Quality Cleaning Resolved 55+ Missing & Duplicate Entries',
    category: 'Data Governance',
    impactLevel: 'High',
    summary: 'Removing 35 duplicate transactions and imputing missing prices via product-level medians eliminated bias in gross revenue reporting.',
    dataPoint: '35 Duplicates Removed & 25 Unit Prices Imputed',
    recommendation: 'Implement strict database input validation and mandatory field checks at checkout to maintain clean operational analytics.',
    iconName: 'CheckCircle2'
  }}
];

export const PRESENTATION_SLIDES: PresentationSlide[] = [
  {{
    id: 1,
    title: 'SalesInsight: Sales Data Analysis Dashboard',
    subtitle: 'Internship Mini Project Assignment Presentation',
    bullets: [
      'Project Title: Sales Data Analysis Dashboard & Business Intelligence',
      'Name of Platform: SalesInsight',
      'Tools Used: Python (Pandas, NumPy, Matplotlib), Vite, React, Recharts',
      'Objective: Clean raw sales data, analyze trends, build interactive visual dashboard, & extract strategic business insights.'
    ],
    type: 'intro'
  }},
  {{
    id: 2,
    title: 'Project Workflow & Data Life Cycle',
    subtitle: 'End-to-End Analytics Pipeline',
    bullets: [
      '1. Data Collection: 1,485 raw transactional records spanning 5 sales regions.',
      '2. Data Cleaning: Identification & elimination of duplicates, missing values, & formatting inconsistencies.',
      '3. Exploratory Analytics: KPI calculation, monthly revenue trends, regional breakdown, product ranking.',
      '4. Interactive Dashboard: Web app built with React & Recharts featuring live filters.',
      '5. Business Insights: Formulation of 6 actionable business recommendations.'
    ],
    type: 'objective'
  }},
  {{
    id: 3,
    title: 'Data Quality & Cleaning Summary',
    subtitle: 'Transforming Raw Noise into Trusted Business Data',
    bullets: [
      'Initial Raw Dataset: 1,485 transaction rows containing intentional quality flaws.',
      'Duplicates Removed: 35 duplicate records removed using Pandas deduplication.',
      'Missing Values Handled: 35 missing customer names replaced with "Guest Customer"; 20 missing regions tagged as "Unknown".',
      'Imputation Strategy: 25 missing Unit Prices imputed using product-level median price distribution.',
      'Standardization: Standardized mixed date formats (%Y-%m-%d vs %m/%d/%Y) and trimmed string whitespace.'
    ],
    type: 'cleaning'
  }},
  {{
    id: 4,
    title: 'Executive Key Performance Indicators (KPIs)',
    subtitle: 'Overall Financial & Operational Performance (2024)',
    bullets: [
      'Total Gross Revenue: $529,352.84 across all completed and processed orders.',
      'Total Orders Handled: 1,450 clean transaction records.',
      'Average Order Value (AOV): $365.07 per customer checkout.',
      'Total Units Sold: 3,429 items across Electronics, Furniture, Clothing, Appliances, & Office Supplies.',
      'Top Performing Region: West Region ($122,527.26).'
    ],
    type: 'kpis'
  }},
  {{
    id: 5,
    title: 'Monthly Revenue & Seasonal Trends',
    subtitle: 'Identifying Peak Sales Windows',
    bullets: [
      'Steady Baseline: Q1 - Q3 revenue remained steady between $31k - $43k monthly.',
      'Q4 Holiday Surge: Major surge in Nov ($65.5k) and Dec ($80.7k).',
      'Key Growth Factor: Black Friday and Year-End Cyber Deals drove massive order volume.',
      'Action Item: Prepare logistics & inventory 60 days prior to Q4 spike.'
    ],
    type: 'chart'
  }},
  {{
    id: 6,
    title: 'Regional Performance Analysis',
    subtitle: 'Geographic Sales Distribution',
    bullets: [
      'West Region ($122.5k): 23.1% market share; highest adoption of high-ticket monitors and desks.',
      'Central Region ($115.4k): 21.8% share; strong corporate segment purchases.',
      'East & South Regions ($96.1k & $95.8k): Consistent performance in consumer retail.',
      'North Region ($92.3k): Lowest regional revenue, identifying expansion opportunity.'
    ],
    type: 'chart'
  }},
  {{
    id: 7,
    title: 'Product Category Breakdown & Top Sellers',
    subtitle: 'Revenue Drivers & Product Portfolio Analysis',
    bullets: [
      'Top Product by Revenue: Leather Sofa ($141,277.85) followed by Standing Desk ($60,210.00).',
      'Top Category: Furniture accounts for 38.1% of gross company revenue.',
      'Volume Champions: Gel Pens, Cotton T-Shirts, and Paper Reams dominate total unit volume.',
      'Cross-Selling Strategy: Pair low-cost high-volume office items with high-margin furniture.'
    ],
    type: 'chart'
  }},
  {{
    id: 8,
    title: 'Top 6 Strategic Business Insights',
    subtitle: 'Data-Backed Business Recommendations',
    bullets: [
      '1. Inventory Planning: Stock top 5 products 35% higher prior to Q4 peak.',
      '2. Geographic Expansion: Open fulfillment hubs in West and Central zones.',
      '3. Corporate B2B Program: Capitalize on $452 Corporate AOV with tailored enterprise packages.',
      '4. Return Mitigation: Reduce 14.2% return leakage through improved product documentation.',
      '5. Product Bundling: Create high-margin home-office work bundles.',
      '6. Data Governance: Enforce strict input validation rules at checkout.'
    ],
    type: 'insights'
  }},
  {{
    id: 9,
    title: 'Project Conclusion & Summary',
    subtitle: 'Internship Learning Outcomes & Value Delivered',
    bullets: [
      'Successfully fulfilled all assignment deliverables: Original dataset, Cleaned dataset, Python script, Jupyter notebook, Web Dashboard, 5+ Business Insights, Presentation, and Documentation.',
      'Demonstrated complete Data Analysis lifecycle: Data Loading -> Data Cleaning -> Exploratory Analysis -> Interactive Visualization -> Strategic Recommendations.',
      'Built SalesInsight Dashboard: Production-ready interactive web application for stakeholder decision making.'
    ],
    type: 'summary'
  }}
];
"""

os.makedirs(os.path.join(WORKSPACE_DIR, 'src', 'data'), exist_ok=True)
with open(os.path.join(WORKSPACE_DIR, 'src', 'data', 'salesData.ts'), 'w') as f:
    f.write(ts_content)

print("src/data/salesData.ts generated successfully!")
