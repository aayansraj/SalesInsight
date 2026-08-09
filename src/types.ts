export interface SalesRecord {
  Order_ID: string;
  Order_Date: string;
  Customer_Name: string;
  Segment: string;
  Region: string;
  Category: string;
  Product_Name: string;
  Unit_Price: number;
  Quantity: number;
  Discount: number;
  Payment_Method: string;
  Order_Status: 'Completed' | 'Returned' | 'Cancelled' | 'Pending' | string;
  Total_Sales: number;
}

export interface RawSalesRecord {
  Order_ID: string;
  Order_Date: string;
  Customer_Name?: string | null;
  Segment: string;
  Region?: string | null;
  Category: string;
  Product_Name: string;
  Unit_Price?: number | null;
  Quantity: number;
  Discount?: number | null;
  Payment_Method: string;
  Order_Status: string;
}

export interface FilterState {
  searchQuery: string;
  region: string;
  category: string;
  orderStatus: string;
  segment: string;
  dateRange: 'all' | 'q1' | 'q2' | 'q3' | 'q4';
}

export interface KPIMetrics {
  totalSales: number;
  completedSales: number;
  totalOrders: number;
  avgOrderValue: number;
  totalUnitsSold: number;
  topRegion: { name: string; sales: number };
  topCategory: { name: string; sales: number };
  topProduct: { name: string; sales: number };
}

export interface DataCleaningAudit {
  rawCount: number;
  cleanCount: number;
  duplicatesRemoved: number;
  missingNamesFilled: number;
  missingPricesImputed: number;
  missingRegionsFilled: number;
  datesStandardized: number;
  cleaningLog?: string[];
}

export interface BusinessInsight {
  id: string;
  title: string;
  category: string;
  impactLevel: 'High' | 'Medium' | 'Critical';
  summary: string;
  dataPoint: string;
  recommendation: string;
  iconName: string;
}

export interface PresentationSlide {
  id: number;
  title: string;
  subtitle: string;
  bullets: string[];
  type: 'intro' | 'objective' | 'cleaning' | 'kpis' | 'chart' | 'insights' | 'summary';
}

export interface ColumnMapping {
  orderIdCol: string;
  orderDateCol: string;
  customerNameCol: string;
  segmentCol: string;
  regionCol: string;
  categoryCol: string;
  productNameCol: string;
  unitPriceCol: string;
  quantityCol: string;
  discountCol: string;
  totalSalesCol: string;
  orderStatusCol: string;
  paymentMethodCol: string;
}

export interface DatasetInfo {
  fileName: string;
  fileSize: string;
  fileType: string;
  totalRows: number;
  totalCols: number;
  rawColumns: string[];
  mapping: ColumnMapping;
  isUploaded: boolean;
  rawSample: any[];
}
