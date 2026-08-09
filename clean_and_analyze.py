import os
import random
from datetime import datetime, timedelta
import pandas as pd
import numpy as np
import os
import random
from datetime import datetime, timedelta
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Set seed for reproducibility
np.random.seed(42)
random.seed(42)

# Ensure script directory is workspace root
WORKSPACE_DIR = os.path.dirname(os.path.abspath(__file__))

print("Step 1: Generating Raw Sales Dataset with Realistic Data Quality Issues...")

# Data options
regions = ['North', 'South', 'East', 'West', 'Central']
categories = {
    'Electronics': [('Wireless Headphones', 89.99), ('Smart Watch', 199.99), ('Bluetooth Speaker', 49.99), ('4K Monitor', 320.00), ('USB-C Dock', 75.50)],
    'Clothing': [('Denim Jacket', 65.00), ('Running Shoes', 110.00), ('Cotton T-Shirt', 25.00), ('Winter Parka', 150.00), ('Formal Blazer', 180.00)],
    'Furniture': [('Ergonomic Chair', 249.99), ('Standing Desk', 450.00), ('Bookshelf', 120.00), ('Desk Lamp', 35.00), ('Leather Sofa', 899.00)],
    'Office Supplies': [('Paper Reams (5-pack)', 22.50), ('Gel Pens Set', 12.99), ('Binder Clips Set', 8.50), ('Planner Notebook', 18.00), ('Stapler Heavy Duty', 24.00)],
    'Home Appliances': [('Air Fryer', 99.99), ('Espresso Machine', 299.99), ('Robot Vacuum', 349.99), ('Blender Pro', 79.99), ('Electric Kettle', 39.99)]
}
customer_segments = ['Consumer', 'Corporate', 'Home Office']
payment_methods = ['Credit Card', 'PayPal', 'UPI / Bank Transfer', 'Debit Card']
order_statuses = ['Completed', 'Completed', 'Completed', 'Completed', 'Returned', 'Cancelled', 'Pending']

start_date = datetime(2024, 1, 1)
end_date = datetime(2024, 12, 31)
date_range_days = (end_date - start_date).days

records = []
num_rows = 1450

names_list = [
    'Aarav Sharma', 'Priya Patel', 'Rohan Gupta', 'Ananya Verma', 'Vikram Singh',
    'Neha Reddy', 'Rahul Joshi', 'Sneha Iyer', 'Karan Malhotra', 'Pooja Nair',
    'Amit Choudhury', 'Meera Rao', 'Siddharth Kaplan', 'Sophia Miller', 'Ethan Brown',
    'Olivia Taylor', 'Liam Wilson', 'Emma Davis', 'Noah Martinez', 'Ava Anderson'
]

for i in range(1, num_rows + 1):
    order_id = f"ORD-{20240000 + i}"
    
    # Pick date
    random_days = random.randint(0, date_range_days)
    curr_date = start_date + timedelta(days=random_days)
    
    # Seasonality boost for Nov/Dec (BFCM & Holidays)
    if curr_date.month in [11, 12]:
        qty_weight = [0.1, 0.2, 0.3, 0.25, 0.15]
    else:
        qty_weight = [0.35, 0.35, 0.15, 0.1, 0.05]
    
    qty = random.choices([1, 2, 3, 4, 5], weights=qty_weight)[0]
    
    cat = random.choice(list(categories.keys()))
    prod_name, base_price = random.choice(categories[cat])
    
    # Region
    reg = random.choice(regions)
    
    # Inject dirty formatting in ~5% of text fields
    if random.random() < 0.05:
        reg_str = f"  {reg.lower()} "
    else:
        reg_str = reg
        
    cust_name = random.choice(names_list)
    segment = random.choice(customer_segments)
    payment = random.choice(payment_methods)
    status = random.choice(order_statuses)
    discount = round(random.choice([0.0, 0.05, 0.10, 0.15, 0.20]), 2)
    
    # Date formatting variations
    if random.random() < 0.04:
        date_str = curr_date.strftime("%m/%d/%Y")
    else:
        date_str = curr_date.strftime("%Y-%m-%d")
        
    records.append({
        'Order_ID': order_id,
        'Order_Date': date_str,
        'Customer_Name': cust_name,
        'Segment': segment,
        'Region': reg_str,
        'Category': cat,
        'Product_Name': prod_name,
        'Unit_Price': base_price,
        'Quantity': qty,
        'Discount': discount,
        'Payment_Method': payment,
        'Order_Status': status
    })

raw_df = pd.DataFrame(records)

# Inject null values
null_indices_cust = random.sample(range(len(raw_df)), 35)
raw_df.loc[null_indices_cust, 'Customer_Name'] = np.nan

null_indices_price = random.sample(range(len(raw_df)), 25)
raw_df.loc[null_indices_price, 'Unit_Price'] = np.nan

null_indices_reg = random.sample(range(len(raw_df)), 20)
raw_df.loc[null_indices_reg, 'Region'] = np.nan

null_indices_disc = random.sample(range(len(raw_df)), 30)
raw_df.loc[null_indices_disc, 'Discount'] = np.nan

# Inject duplicate rows
duplicate_rows = raw_df.sample(n=35, random_state=42)
raw_df = pd.concat([raw_df, duplicate_rows], ignore_index=True)

# Save Raw Dataset
raw_csv_path = os.path.join(WORKSPACE_DIR, 'raw_sales_data.csv')
raw_df.to_csv(raw_csv_path, index=False)
print(f"Raw Dataset saved successfully to {raw_csv_path} with {len(raw_df)} records.")

# Step 2: Data Cleaning & Preprocessing
print("\nStep 2: Cleaning Dataset...")
clean_df = raw_df.copy()

initial_count = len(clean_df)
duplicate_count = clean_df.duplicated().sum()

# Remove duplicate records
clean_df.drop_duplicates(inplace=True)
count_after_dedup = len(clean_df)

# Handle Missing Values
clean_df['Customer_Name'] = clean_df['Customer_Name'].fillna('Guest Customer')
clean_df['Region'] = clean_df['Region'].fillna('Unknown')
clean_df['Discount'] = clean_df['Discount'].fillna(0.0)

# Fill Unit_Price with median price for each product
product_medians = clean_df.groupby('Product_Name')['Unit_Price'].transform('median')
clean_df['Unit_Price'] = clean_df['Unit_Price'].fillna(product_medians)

# Standardize Strings
clean_df['Region'] = clean_df['Region'].astype(str).str.strip().str.title()
clean_df['Category'] = clean_df['Category'].astype(str).str.strip().str.title()
clean_df['Product_Name'] = clean_df['Product_Name'].astype(str).str.strip()

# Standardize Dates
clean_df['Order_Date'] = pd.to_datetime(clean_df['Order_Date'], format='mixed').dt.strftime('%Y-%m-%d')

# Calculate Total Sales KPI per line item
clean_df['Total_Sales'] = round(clean_df['Quantity'] * clean_df['Unit_Price'] * (1 - clean_df['Discount']), 2)

# Save Cleaned Dataset
clean_csv_path = os.path.join(WORKSPACE_DIR, 'cleaned_sales_data.csv')
clean_df.to_csv(clean_csv_path, index=False)
print(f"Cleaned Dataset saved to {clean_csv_path} with {len(clean_df)} valid records.")
print(f"  - Initial Records: {initial_count}")
print(f"  - Duplicates Removed: {duplicate_count}")
print(f"  - Missing Customer Names Handled: {len(null_indices_cust)}")
print(f"  - Missing Unit Prices Imputed: {len(null_indices_price)}")

# Step 3: Analysis & Summary KPIs
print("\nStep 3: Calculating Analytical KPIs...")

# Filter for completed sales for revenue stats
completed_df = clean_df[clean_df['Order_Status'] == 'Completed']

total_sales = clean_df['Total_Sales'].sum()
completed_sales = completed_df['Total_Sales'].sum()
total_orders = len(clean_df)
avg_order_value = total_sales / total_orders
total_units = clean_df['Quantity'].sum()

print(f"Total Sales (All Statuses): ${total_sales:,.2f}")
print(f"Completed Sales Revenue: ${completed_sales:,.2f}")
print(f"Total Orders: {total_orders:,}")
print(f"Average Order Value (AOV): ${avg_order_value:.2f}")
print(f"Total Units Sold: {total_units:,}")

# Top Products
top_products = clean_df.groupby('Product_Name')['Total_Sales'].sum().sort_values(ascending=False).head(5)
print("\nTop 5 Selling Products by Revenue:")
for prod, val in top_products.items():
    print(f"  - {prod}: ${val:,.2f}")

# Regional Analysis
regional_sales = clean_df.groupby('Region')['Total_Sales'].sum().sort_values(ascending=False)
print("\nRegional Sales Breakdown:")
for reg, val in regional_sales.items():
    print(f"  - {reg}: ${val:,.2f}")

# Monthly Trend Analysis
clean_df['YearMonth'] = pd.to_datetime(clean_df['Order_Date']).dt.to_period('M').astype(str)
monthly_sales = clean_df.groupby('YearMonth')['Total_Sales'].sum()
print("\nMonthly Sales Trend:")
for month, val in monthly_sales.items():
    print(f"  - {month}: ${val:,.2f}")

# Step 4: Generate Visualization Images for Documentation
charts_dir = os.path.join(WORKSPACE_DIR, 'charts')
os.makedirs(charts_dir, exist_ok=True)

plt.style.use('seaborn-v0_8-whitegrid') if 'seaborn-v0_8-whitegrid' in plt.style.available else plt.style.use('fast')

# Chart 1: Monthly Sales Trend
plt.figure(figsize=(10, 5))
plt.plot(monthly_sales.index, monthly_sales.values, marker='o', color='#2563eb', linewidth=2.5, markersize=7)
plt.title('Monthly Sales Trend (2024)', fontsize=14, fontweight='bold', pad=15)
plt.xlabel('Month', fontsize=11)
plt.ylabel('Total Sales ($)', fontsize=11)
plt.xticks(rotation=45)
plt.grid(True, linestyle='--', alpha=0.5)
plt.tight_layout()
plt.savefig(os.path.join(charts_dir, 'monthly_sales_trend.png'), dpi=300)
plt.close()

# Chart 2: Regional Sales Performance
plt.figure(figsize=(8, 5))
bars = plt.bar(regional_sales.index, regional_sales.values, color=['#1e40af', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'])
plt.title('Regional Performance Breakdown', fontsize=14, fontweight='bold', pad=15)
plt.xlabel('Region', fontsize=11)
plt.ylabel('Total Sales ($)', fontsize=11)
plt.grid(axis='y', linestyle='--', alpha=0.5)
for bar in bars:
    height = bar.get_height()
    plt.annotate(f'${height:,.0f}', (bar.get_x() + bar.get_width() / 2., height),
                 ha='center', va='bottom', xytext=(0, 3), textcoords='offset points', fontweight='bold')
plt.tight_layout()
plt.savefig(os.path.join(charts_dir, 'regional_performance.png'), dpi=300)
plt.close()

# Chart 3: Top 10 Products
plt.figure(figsize=(10, 6))
top_10 = clean_df.groupby('Product_Name')['Total_Sales'].sum().sort_values(ascending=True).tail(10)
plt.barh(top_10.index, top_10.values, color='#0d9488')
plt.title('Top 10 Selling Products by Revenue', fontsize=14, fontweight='bold', pad=15)
plt.xlabel('Total Revenue ($)', fontsize=11)
plt.tight_layout()
plt.savefig(os.path.join(charts_dir, 'top_products.png'), dpi=300)
plt.close()

# Chart 4: Category Distribution
plt.figure(figsize=(7, 7))
cat_sales = clean_df.groupby('Category')['Total_Sales'].sum()
plt.pie(cat_sales.values, labels=cat_sales.index, autopct='%1.1f%%', startangle=140, colors=['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'])
plt.title('Sales Revenue Share by Product Category', fontsize=14, fontweight='bold', pad=15)
plt.tight_layout()
plt.savefig(os.path.join(charts_dir, 'category_distribution.png'), dpi=300)
plt.close()

print(f"\nAll static visualization charts successfully exported to {charts_dir}/!")
