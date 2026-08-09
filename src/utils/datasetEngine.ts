import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import {
  SalesRecord,
  ColumnMapping,
  DataCleaningAudit,
  BusinessInsight,
} from '../types';

// Auto-detect column mapping using regex rules
export const autoDetectColumnMapping = (headers: string[]): ColumnMapping => {
  const findMatch = (pattern: RegExp): string => {
    const match = headers.find((h) => pattern.test(h.trim()));
    return match || '';
  };

  return {
    orderIdCol: findMatch(/(order.*id|transaction.*id|invoice.*num|id|invoice|order_num|ord_id)/i) || headers[0] || '',
    orderDateCol: findMatch(/(date|order_date|transaction_date|time|created_at|invoice_date)/i) || '',
    customerNameCol: findMatch(/(customer|client|buyer|user_name|name|customer_name)/i) || '',
    segmentCol: findMatch(/(segment|customer_type|account_type|channel)/i) || '',
    regionCol: findMatch(/(region|state|country|location|territory|city|zone)/i) || '',
    categoryCol: findMatch(/(category|department|group|type|product_type|cat)/i) || '',
    productNameCol: findMatch(/(product|item|sku|title|description|product_name)/i) || '',
    unitPriceCol: findMatch(/(unit_price|price|rate|cost|unitprice|item_price)/i) || '',
    quantityCol: findMatch(/(qty|quantity|count|units|volume|amount_qty)/i) || '',
    discountCol: findMatch(/(discount|disc|markdown|promo)/i) || '',
    totalSalesCol: findMatch(/(total_sales|sales|revenue|total_amount|total|grand_total|net_amount|line_total)/i) || '',
    orderStatusCol: findMatch(/(status|order_status|fulfillment|state)/i) || '',
    paymentMethodCol: findMatch(/(payment|payment_method|tender|pay_mode|mode)/i) || '',
  };
};

// Safe date parser supporting strings, JS Date, and Excel Serial dates
const parseDateString = (val: any): string => {
  if (!val) return '2024-01-01';

  // Excel serial number (e.g. 45292)
  if (typeof val === 'number') {
    const jsDate = new Date(Math.round((val - 25569) * 86400 * 1000));
    if (!isNaN(jsDate.getTime())) {
      return jsDate.toISOString().split('T')[0];
    }
  }

  const str = String(val).trim();
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0];
  }

  // Fallback regex matching MM/DD/YYYY or YYYY-MM-DD
  const parts = str.match(/(\d{1,4})[\/\-](\d{1,2})[\/\-](\d{1,4})/);
  if (parts) {
    if (parts[1].length === 4) {
      return `${parts[1]}-${parts[2].padStart(2, '0')}-${parts[3].padStart(2, '0')}`;
    } else {
      return `${parts[3]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
    }
  }

  return '2024-01-01';
};

// Parse file (.csv, .xlsx, .xls) into JSON rows
export const parseFileToRows = (
  file: File,
  onProgress?: (pct: number) => void
): Promise<{ rows: any[]; headers: string[]; fileName: string; fileSize: string }> => {
  return new Promise((resolve, reject) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    const fileSizeStr = (file.size / 1024).toFixed(1) + ' KB';

    if (ext === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false,
        complete: (results) => {
          if (!results.data || results.data.length === 0) {
            reject(new Error('The uploaded CSV file is empty or contains no readable data.'));
            return;
          }
          const headers = results.meta.fields || Object.keys(results.data[0] || {});
          resolve({
            rows: results.data,
            headers,
            fileName: file.name,
            fileSize: fileSizeStr,
          });
        },
        error: (err) => {
          reject(new Error(`CSV Parsing Error: ${err.message}`));
        },
      });
    } else if (ext === 'xlsx' || ext === 'xls') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const rows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

          if (rows.length === 0) {
            reject(new Error('The uploaded Excel file contains no rows.'));
            return;
          }

          const headers = Object.keys(rows[0]);
          resolve({
            rows,
            headers,
            fileName: file.name,
            fileSize: fileSizeStr,
          });
        } catch (err: any) {
          reject(new Error(`Excel File Read Error: ${err.message || err}`));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read spreadsheet file.'));
      reader.readAsArrayBuffer(file);
    } else {
      reject(new Error('Unsupported file format! Please upload a .CSV, .XLSX, or .XLS file.'));
    }
  });
};

// Process and clean raw parsed rows using mapping
export const processAndCleanDataset = (
  rawRows: any[],
  mapping: ColumnMapping
): { cleanData: SalesRecord[]; audit: DataCleaningAudit } => {
  const logs: string[] = [];
  const initialCount = rawRows.length;

  let missingNamesFilled = 0;
  let missingPricesImputed = 0;
  let missingRegionsFilled = 0;

  // Track product prices for median imputation
  const productPricesMap: { [key: string]: number[] } = {};

  // First pass: collect clean numeric prices
  rawRows.forEach((row) => {
    const prod = mapping.productNameCol ? String(row[mapping.productNameCol] || '').trim() : 'General Item';
    const priceRaw = mapping.unitPriceCol ? parseFloat(row[mapping.unitPriceCol]) : NaN;
    if (prod && !isNaN(priceRaw) && priceRaw > 0) {
      if (!productPricesMap[prod]) productPricesMap[prod] = [];
      productPricesMap[prod].push(priceRaw);
    }
  });

  const parsedRecords: SalesRecord[] = [];
  const seenKeys = new Set<string>();
  let duplicatesRemoved = 0;

  rawRows.forEach((row, index) => {
    const orderId = mapping.orderIdCol && row[mapping.orderIdCol]
      ? String(row[mapping.orderIdCol]).trim()
      : `ORD-${20240000 + index + 1}`;

    const dateStr = mapping.orderDateCol ? parseDateString(row[mapping.orderDateCol]) : '2024-06-15';

    // Customer Name
    let custName = mapping.customerNameCol && row[mapping.customerNameCol]
      ? String(row[mapping.customerNameCol]).trim()
      : '';
    if (!custName || custName.toLowerCase() === 'nan' || custName.toLowerCase() === 'null') {
      custName = 'Guest Customer';
      missingNamesFilled++;
    }

    // Segment
    const segment = mapping.segmentCol && row[mapping.segmentCol]
      ? String(row[mapping.segmentCol]).trim()
      : 'Consumer';

    // Region
    let region = mapping.regionCol && row[mapping.regionCol]
      ? String(row[mapping.regionCol]).trim().replace(/\s+/g, ' ')
      : '';
    if (!region || region.toLowerCase() === 'nan' || region.toLowerCase() === 'null') {
      region = 'Central';
      missingRegionsFilled++;
    } else {
      region = region.charAt(0).toUpperCase() + region.slice(1);
    }

    // Category
    const category = mapping.categoryCol && row[mapping.categoryCol]
      ? String(row[mapping.categoryCol]).trim()
      : 'General Sales';

    // Product Name
    const productName = mapping.productNameCol && row[mapping.productNameCol]
      ? String(row[mapping.productNameCol]).trim()
      : 'Standard Item';

    // Unit Price
    let unitPrice = mapping.unitPriceCol ? parseFloat(row[mapping.unitPriceCol]) : NaN;
    if (isNaN(unitPrice) || unitPrice <= 0) {
      const prices = productPricesMap[productName] || [49.99];
      const sorted = [...prices].sort((a, b) => a - b);
      unitPrice = sorted[Math.floor(sorted.length / 2)] || 49.99;
      missingPricesImputed++;
    }

    // Quantity
    let qty = mapping.quantityCol ? parseInt(row[mapping.quantityCol], 10) : 1;
    if (isNaN(qty) || qty <= 0) qty = 1;

    // Discount
    let discount = mapping.discountCol ? parseFloat(row[mapping.discountCol]) : 0;
    if (isNaN(discount) || discount < 0) discount = 0;
    if (discount > 1) discount = discount / 100; // Handle 10% entered as 10

    // Total Sales (Explicit or Calculated)
    let totalSales = mapping.totalSalesCol ? parseFloat(row[mapping.totalSalesCol]) : NaN;
    if (isNaN(totalSales) || totalSales <= 0) {
      totalSales = qty * unitPrice * (1 - discount);
    }

    totalSales = Math.round(totalSales * 100) / 100;

    // Order Status
    const status = mapping.orderStatusCol && row[mapping.orderStatusCol]
      ? String(row[mapping.orderStatusCol]).trim()
      : 'Completed';

    // Payment Method
    const payment = mapping.paymentMethodCol && row[mapping.paymentMethodCol]
      ? String(row[mapping.paymentMethodCol]).trim()
      : 'Credit Card';

    // Deduplication Key
    const dupKey = `${orderId}-${dateStr}-${productName}-${totalSales}`;
    if (seenKeys.has(dupKey)) {
      duplicatesRemoved++;
      return; // Skip duplicate
    }
    seenKeys.add(dupKey);

    parsedRecords.push({
      Order_ID: orderId,
      Order_Date: dateStr,
      Customer_Name: custName,
      Segment: segment,
      Region: region,
      Category: category,
      Product_Name: productName,
      Unit_Price: unitPrice,
      Quantity: qty,
      Discount: discount,
      Payment_Method: payment,
      Order_Status: status,
      Total_Sales: totalSales,
    });
  });

  logs.push(`Imported ${initialCount} raw rows from uploaded dataset.`);
  logs.push(`Removed ${duplicatesRemoved} duplicate records.`);
  logs.push(`Handled ${missingNamesFilled} missing customer names.`);
  logs.push(`Imputed ${missingPricesImputed} unit prices using product medians.`);

  const audit: DataCleaningAudit = {
    rawCount: initialCount,
    cleanCount: parsedRecords.length,
    duplicatesRemoved,
    missingNamesFilled,
    missingPricesImputed,
    missingRegionsFilled,
    datesStandardized: parsedRecords.length,
    cleaningLog: logs,
  };

  return { cleanData: parsedRecords, audit };
};

// Generate 6 Dynamic Business Insights directly from the active dataset
export const generateDynamicInsights = (
  data: SalesRecord[],
  audit: DataCleaningAudit,
  datasetName: string = 'Uploaded Dataset'
): BusinessInsight[] => {
  if (!data || data.length === 0) return [];

  const totalSales = data.reduce((acc, curr) => acc + curr.Total_Sales, 0);
  const totalOrders = data.length;
  const aov = totalSales / (totalOrders || 1);

  // Top Product
  const prodMap: { [key: string]: number } = {};
  data.forEach((i) => {
    prodMap[i.Product_Name] = (prodMap[i.Product_Name] || 0) + i.Total_Sales;
  });
  let topProd = { name: 'N/A', sales: 0 };
  Object.entries(prodMap).forEach(([name, sales]) => {
    if (sales > topProd.sales) topProd = { name, sales };
  });

  // Top Region
  const regMap: { [key: string]: number } = {};
  data.forEach((i) => {
    regMap[i.Region] = (regMap[i.Region] || 0) + i.Total_Sales;
  });
  let topReg = { name: 'N/A', sales: 0 };
  Object.entries(regMap).forEach(([name, sales]) => {
    if (sales > topReg.sales) topReg = { name, sales };
  });
  const regShare = totalSales > 0 ? ((topReg.sales / totalSales) * 100).toFixed(1) : '0';

  // Peak Month
  const monthMap: { [key: string]: number } = {};
  data.forEach((i) => {
    const m = i.Order_Date.substring(0, 7);
    monthMap[m] = (monthMap[m] || 0) + i.Total_Sales;
  });
  let topMonth = { name: 'N/A', sales: 0 };
  Object.entries(monthMap).forEach(([name, sales]) => {
    if (sales > topMonth.sales) topMonth = { name, sales };
  });

  // Top Category
  const catMap: { [key: string]: number } = {};
  data.forEach((i) => {
    catMap[i.Category] = (catMap[i.Category] || 0) + i.Total_Sales;
  });
  let topCat = { name: 'N/A', sales: 0 };
  Object.entries(catMap).forEach(([name, sales]) => {
    if (sales > topCat.sales) topCat = { name, sales };
  });
  const catShare = totalSales > 0 ? ((topCat.sales / totalSales) * 100).toFixed(1) : '0';

  return [
    {
      id: 'dyn-insight-1',
      title: `Highest Selling Product: ${topProd.name}`,
      category: 'Product Performance',
      impactLevel: 'Critical',
      summary: `${topProd.name} is the top revenue generator in ${datasetName}, yielding $${topProd.sales.toLocaleString()} across orders.`,
      dataPoint: `Top Product Sales: $${topProd.sales.toLocaleString()}`,
      recommendation: `Ensure inventory priority and feature ${topProd.name} in primary marketing campaigns to maximize margin.`,
      iconName: 'Armchair',
    },
    {
      id: 'dyn-insight-2',
      title: `Top Regional Market: ${topReg.name} (${regShare}% Share)`,
      category: 'Geographic Breakdown',
      impactLevel: 'High',
      summary: `The ${topReg.name} region leads overall geographic performance, generating $${topReg.sales.toLocaleString()} in revenue.`,
      dataPoint: `${topReg.name} Revenue: $${topReg.sales.toLocaleString()} (${regShare}% of total)`,
      recommendation: `Optimize logistics and warehouse distribution in ${topReg.name} to shorten customer delivery windows.`,
      iconName: 'MapPin',
    },
    {
      id: 'dyn-insight-3',
      title: `Peak Monthly Sales Window: ${topMonth.name}`,
      category: 'Sales Trends',
      impactLevel: 'High',
      summary: `Sales surged highest during ${topMonth.name}, reaching $${topMonth.sales.toLocaleString()} in monthly revenue.`,
      dataPoint: `Peak Month Revenue: $${topMonth.sales.toLocaleString()}`,
      recommendation: `Align seasonal promotions and supplier orders 30 to 60 days before ${topMonth.name}.`,
      iconName: 'TrendingUp',
    },
    {
      id: 'dyn-insight-4',
      title: `Category Dominance: ${topCat.name} (${catShare}% Share)`,
      category: 'Category Analysis',
      impactLevel: 'High',
      summary: `The ${topCat.name} category leads all product groups, generating $${topCat.sales.toLocaleString()} in gross revenue.`,
      dataPoint: `${topCat.name} Category Share: ${catShare}%`,
      recommendation: `Expand product depth within ${topCat.name} and offer cross-category checkout bundles.`,
      iconName: 'Briefcase',
    },
    {
      id: 'dyn-insight-5',
      title: `Average Order Value (AOV): $${aov.toFixed(2)}`,
      category: 'Customer Spend',
      impactLevel: 'Medium',
      summary: `The dataset yields an average transaction checkout value of $${aov.toFixed(2)} across ${totalOrders} orders.`,
      dataPoint: `AOV Benchmark: $${aov.toFixed(2)}`,
      recommendation: `Introduce free shipping thresholds at $${(aov * 1.25).toFixed(0)} to encourage higher basket size.`,
      iconName: 'CheckCircle2',
    },
    {
      id: 'dyn-insight-6',
      title: `Data Audit: ${audit.duplicatesRemoved} Duplicates & ${audit.missingPricesImputed} Imputed Values`,
      category: 'Data Governance',
      impactLevel: 'High',
      summary: `Data cleaning pipeline successfully processed ${audit.rawCount} raw rows, removing ${audit.duplicatesRemoved} duplicate entries and imputing missing prices.`,
      dataPoint: `Clean Records Ready: ${audit.cleanCount} / ${audit.rawCount}`,
      recommendation: `Maintain clean data input rules at source checkout to ensure unskewed analytics reporting.`,
      iconName: 'CheckCircle2',
    },
  ];
};
