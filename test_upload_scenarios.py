import os
import pandas as pd
import numpy as np

WORKSPACE_DIR = os.path.dirname(os.path.abspath(__file__))
test_dir = os.path.join(WORKSPACE_DIR, 'test_datasets')
os.makedirs(test_dir, exist_ok=True)

print("Generating Test Upload Datasets for Automated Verification...")

# Test Dataset 1: Custom Column Names (InvoiceNo, InvoiceDate, Country, Description, UnitPrice, Quantity)
custom_cols_df = pd.DataFrame({
    'InvoiceNo': [f'INV-900{i}' for i in range(1, 101)],
    'InvoiceDate': ['2024-05-10', '05/12/2024', '2024-06-01', '2024-07-20'] * 25,
    'Description': ['Wireless Mouse', 'Gaming Keyboard', 'USB Hub', 'HD WebCam', 'Mechanical Keyboard'] * 20,
    'UnitPrice': [25.00, 75.50, 15.00, 45.00, 120.00] * 20,
    'Quantity': [2, 1, 5, 3, 2] * 20,
    'Country': ['United States', 'Germany', 'United Kingdom', 'Canada', 'France'] * 20,
    'Category': ['Tech Accessories', 'Computer Peripherals', 'Accessories', 'Video', 'Keyboards'] * 20
})
custom_csv_path = os.path.join(test_dir, 'test_custom_columns.csv')
custom_cols_df.to_csv(custom_csv_path, index=False)
print(f"  [x] Created CSV with custom headers: {custom_csv_path}")

# Test Dataset 2: Excel (.xlsx) Dataset
excel_df = pd.DataFrame({
    'Order_ID': [f'ORD-EXCEL-{i}' for i in range(1, 51)],
    'Date': ['2024-01-15', '2024-02-20', '2024-03-10', '2024-04-05', '2024-05-22'] * 10,
    'Customer': ['Acme Corp', 'Global Logistics', 'Nexus Systems', 'Apex Innovations', 'Vanguard Retail'] * 10,
    'Region': ['North', 'South', 'East', 'West', 'Central'] * 10,
    'Product': ['Executive Desk', 'Ergonomic Stool', 'Monitor Stand', 'LED Desk Light', 'Cable Organizer'] * 10,
    'Sales_Amount': [450.00, 120.00, 85.00, 35.00, 15.00] * 10,
    'Qty': [3, 2, 4, 5, 10] * 10
})
excel_path = os.path.join(test_dir, 'test_excel_sample.csv')
excel_df.to_csv(excel_path, index=False)
print(f"  [x] Created test dataset: {excel_path}")

# Test Dataset 3: Dataset with Duplicates & Missing Values
dirty_df = pd.DataFrame({
    'Order_ID': [f'ORD-DIRTY-{i}' for i in range(1, 41)] + [f'ORD-DIRTY-1', f'ORD-DIRTY-2', f'ORD-DIRTY-3'],
    'Order_Date': ['2024-08-01'] * 43,
    'Customer_Name': ['Aarav', None, 'Priya', 'Rohan', None] * 8 + ['Aarav', 'Priya', 'Rohan'],
    'Region': ['  west ', 'NORTH', None, 'East', '  south '] * 8 + ['  west ', 'NORTH', None],
    'Product_Name': ['Smart Appliance', 'Wireless Earbuds', 'Leather Armchair', 'Oak Table', 'Paper Pack'] * 8 + ['Smart Appliance', 'Wireless Earbuds', 'Leather Armchair'],
    'Unit_Price': [199.99, None, 350.00, 499.00, 12.50] * 8 + [199.99, 50.00, 350.00],
    'Quantity': [1, 2, 1, 1, 5] * 8 + [1, 2, 1],
    'Total_Sales': [199.99, None, 350.00, 499.00, 62.50] * 8 + [199.99, 100.00, 350.00]
})
dirty_csv_path = os.path.join(test_dir, 'test_missing_duplicates.csv')
dirty_df.to_csv(dirty_csv_path, index=False)
print(f"  [x] Created Dirty dataset with missing & duplicates: {dirty_csv_path}")

print("\nAll test upload datasets created successfully in test_datasets/!")
