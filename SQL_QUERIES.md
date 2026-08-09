# 🛢️ SalesInsight - SQL Analytics & Database Documentation

This document contains the **SQL Database Schema**, **Analytical Views**, and **Key Business Queries** used in the **SalesInsight** Sales Data Analysis project.

---

## 📁 SQL Files Included
1. **`sales_database.db`**: SQLite database file containing the dataset table and pre-built analytical views.
2. **`salesinsight_db.sql`**: Complete SQL script dump (Schema + INSERT data statements) compatible with MySQL, PostgreSQL, SQLite, and DBeaver.

---

## 1. Table Schema (`sales_transactions`)
```sql
CREATE TABLE sales_transactions (
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
```

---

## 2. Pre-Built SQL Analytical Views

### View 1: Monthly Sales Trend (`v_monthly_sales`)
```sql
CREATE VIEW v_monthly_sales AS
SELECT 
    strftime('%Y-%m', Order_Date) AS Month,
    COUNT(Order_ID) AS Total_Orders,
    ROUND(SUM(Total_Sales), 2) AS Monthly_Revenue,
    ROUND(AVG(Total_Sales), 2) AS Avg_Order_Value
FROM sales_transactions
GROUP BY Month
ORDER BY Month ASC;
```

### View 2: Regional Performance & Market Share (`v_regional_performance`)
```sql
CREATE VIEW v_regional_performance AS
SELECT 
    Region,
    COUNT(Order_ID) AS Total_Orders,
    ROUND(SUM(Total_Sales), 2) AS Regional_Revenue,
    ROUND(SUM(Total_Sales) * 100.0 / (SELECT SUM(Total_Sales) FROM sales_transactions), 2) AS Market_Share_Pct
FROM sales_transactions
GROUP BY Region
ORDER BY Regional_Revenue DESC;
```

### View 3: Top Revenue Generating Products (`v_top_products`)
```sql
CREATE VIEW v_top_products AS
SELECT 
    Product_Name,
    Category,
    SUM(Quantity) AS Total_Units_Sold,
    ROUND(SUM(Total_Sales), 2) AS Total_Revenue
FROM sales_transactions
GROUP BY Product_Name, Category
ORDER BY Total_Revenue DESC;
```

---

## 3. Key SQL Business Queries for Mentor Evaluation

### Query 1: Total Revenue & Order Metrics
```sql
SELECT 
    COUNT(Order_ID) AS Total_Orders,
    ROUND(SUM(Total_Sales), 2) AS Gross_Revenue,
    ROUND(AVG(Total_Sales), 2) AS Average_Order_Value,
    SUM(Quantity) AS Total_Units_Sold
FROM sales_transactions;
```

### Query 2: Q4 Holiday Surge Revenue Analysis
```sql
SELECT 
    CASE 
        WHEN strftime('%m', Order_Date) IN ('11', '12') THEN 'Q4 Peak (Nov-Dec)'
        ELSE 'Rest of Year (Jan-Oct)'
    END AS Period,
    COUNT(Order_ID) AS Total_Orders,
    ROUND(SUM(Total_Sales), 2) AS Total_Revenue
FROM sales_transactions
GROUP BY Period;
```

### Query 3: Return & Cancellation Revenue Leakage
```sql
SELECT 
    Order_Status,
    COUNT(Order_ID) AS Order_Count,
    ROUND(SUM(Total_Sales), 2) AS Lost_Revenue
FROM sales_transactions
WHERE Order_Status IN ('Returned', 'Cancelled')
GROUP BY Order_Status;
```

### Query 4: Customer Segment AOV Comparison
```sql
SELECT 
    Segment,
    COUNT(Order_ID) AS Order_Count,
    ROUND(SUM(Total_Sales), 2) AS Segment_Revenue,
    ROUND(AVG(Total_Sales), 2) AS Average_Order_Value
FROM sales_transactions
GROUP BY Segment
ORDER BY Average_Order_Value DESC;
```

---

## 🚀 How to Run the SQL Database
- **Option 1 (SQLite CLI)**:
  ```bash
  sqlite3 sales_database.db
  # Run any SQL query, e.g.:
  SELECT * FROM v_monthly_sales;
  ```
- **Option 2 (DBeaver / DataGrip / VS Code SQLite Extension)**:
  Open `sales_database.db` or run `salesinsight_db.sql` in any database client.
