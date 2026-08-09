import os
import sqlite3
import pandas as pd

WORKSPACE_DIR = os.path.dirname(os.path.abspath(__file__))
cleaned_csv = os.path.join(WORKSPACE_DIR, 'cleaned_sales_data.csv')
db_path = os.path.join(WORKSPACE_DIR, 'sales_database.db')
sql_dump_path = os.path.join(WORKSPACE_DIR, 'salesinsight_db.sql')

# Read cleaned CSV data
df = pd.read_csv(cleaned_csv)

# Create SQLite Database Connection
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Write dataframe to SQLite table 'sales_transactions'
df.to_sql('sales_transactions', conn, if_exists='replace', index=False)

print(f"SQLite database created at {db_path}")

# Run sample SQL query verification
cursor.execute("""
    SELECT Region, COUNT(Order_ID) as Total_Orders, SUM(Total_Sales) as Total_Revenue
    FROM sales_transactions
    GROUP BY Region
    ORDER BY Total_Revenue DESC
""")
results = cursor.fetchall()

print("\n--- SQL Query Verification (Sales by Region) ---")
for row in results:
    print(f"Region: {row[0]:<10} | Orders: {row[1]:<5} | Revenue: ${row[2]:,.2f}")

# Export SQL Dump script (.sql)
with open(sql_dump_path, 'w') as f:
    for line in conn.iterdump():
        f.write(f'{line}\n')

conn.close()
print(f"\nSQL script dump created successfully at {sql_dump_path}")
