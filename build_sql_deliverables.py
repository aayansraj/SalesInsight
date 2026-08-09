import os
import sqlite3
import pandas as pd

WORKSPACE_DIR = os.path.dirname(os.path.abspath(__file__))
cleaned_csv = os.path.join(WORKSPACE_DIR, 'cleaned_sales_data.csv')
db_path = os.path.join(WORKSPACE_DIR, 'sales_database.db')
sql_script_path = os.path.join(WORKSPACE_DIR, 'salesinsight_db.sql')

clean_df = pd.read_csv(cleaned_csv)

# 1. Create SQLite Database file
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Create main table
cursor.execute("""
CREATE TABLE IF NOT EXISTS sales_transactions (
    Order_ID VARCHAR(20) PRIMARY KEY,
    Order_Date DATE NOT NULL,
    Customer_Name VARCHAR(100),
    Segment VARCHAR(50),
    Region VARCHAR(50),
    Category VARCHAR(50),
    Product_Name VARCHAR(100),
    Unit_Price DECIMAL(10,2),
    Quantity INTEGER,
    Discount DECIMAL(4,2),
    Payment_Method VARCHAR(50),
    Order_Status VARCHAR(50),
    Total_Sales DECIMAL(10,2)
);
""")

# Load dataframe into SQLite
clean_df.to_sql('sales_transactions', conn, if_exists='replace', index=False)

# 2. Create Analytical SQL Views
cursor.execute("DROP VIEW IF EXISTS v_monthly_sales;")
cursor.execute("""
CREATE VIEW v_monthly_sales AS
SELECT 
    strftime('%Y-%m', Order_Date) AS Month,
    COUNT(Order_ID) AS Total_Orders,
    ROUND(SUM(Total_Sales), 2) AS Monthly_Revenue,
    ROUND(AVG(Total_Sales), 2) AS Avg_Order_Value
FROM sales_transactions
GROUP BY Month
ORDER BY Month ASC;
""")

cursor.execute("DROP VIEW IF EXISTS v_regional_performance;")
cursor.execute("""
CREATE VIEW v_regional_performance AS
SELECT 
    Region,
    COUNT(Order_ID) AS Total_Orders,
    ROUND(SUM(Total_Sales), 2) AS Regional_Revenue,
    ROUND(SUM(Total_Sales) * 100.0 / (SELECT SUM(Total_Sales) FROM sales_transactions), 2) AS Market_Share_Pct
FROM sales_transactions
GROUP BY Region
ORDER BY Regional_Revenue DESC;
""")

cursor.execute("DROP VIEW IF EXISTS v_top_products;")
cursor.execute("""
CREATE VIEW v_top_products AS
SELECT 
    Product_Name,
    Category,
    SUM(Quantity) AS Total_Units_Sold,
    ROUND(SUM(Total_Sales), 2) AS Total_Revenue
FROM sales_transactions
GROUP BY Product_Name, Category
ORDER BY Total_Revenue DESC;
""")

conn.commit()

# 3. Export SQL Script File with Data and Schema
with open(sql_script_path, 'w') as f:
    f.write("-- ========================================================\n")
    f.write("-- SalesInsight Database Dump & Analytical Views\n")
    f.write("-- Database: SQLite / MySQL / PostgreSQL compatible\n")
    f.write("-- ========================================================\n\n")
    
    for line in conn.iterdump():
        f.write(f"{line}\n")

conn.close()
print("SQL database and dump generated successfully!")
