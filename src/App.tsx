import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { KPICards } from './components/KPICards';
import { FilterBar } from './components/FilterBar';
import { MonthlySalesChart } from './components/MonthlySalesChart';
import { RegionalSalesChart } from './components/RegionalSalesChart';
import { TopProductsChart } from './components/TopProductsChart';
import { DataExplorer } from './components/DataExplorer';
import { BusinessInsights } from './components/BusinessInsights';
import { PresentationViewer } from './components/PresentationViewer';
import { LoginPage } from './components/LoginPage';
import { DatasetUploader } from './components/DatasetUploader';
import { ColumnMapperModal } from './components/ColumnMapperModal';

import {
  CLEANED_SALES_DATA,
  RAW_SALES_DATA_SAMPLE,
  DATA_CLEANING_AUDIT,
  BUSINESS_INSIGHTS,
} from './data/salesData';

import {
  FilterState,
  KPIMetrics,
  SalesRecord,
  DataCleaningAudit,
  DatasetInfo,
  ColumnMapping,
  BusinessInsight,
} from './types';

import {
  processAndCleanDataset,
  generateDynamicInsights,
} from './utils/datasetEngine';

interface User {
  name: string;
  email: string;
  role: string;
}

export const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>({
    name: 'Alex Mercer',
    email: 'analyst@salesinsight.com',
    role: 'Data Analyst',
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Dataset State
  const [activeDataset, setActiveDataset] = useState<SalesRecord[]>(CLEANED_SALES_DATA);
  const [activeAudit, setActiveAudit] = useState<DataCleaningAudit>(DATA_CLEANING_AUDIT);
  const [activeDatasetInfo, setActiveDatasetInfo] = useState<DatasetInfo | null>(null);
  const [activeInsights, setActiveInsights] = useState<BusinessInsight[]>(BUSINESS_INSIGHTS);
  const [isMapperOpen, setIsMapperOpen] = useState<boolean>(false);

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    region: 'all',
    category: 'all',
    orderStatus: 'all',
    segment: 'all',
    dateRange: 'all',
  });

  const regions = useMemo(() => {
    return Array.from(new Set(activeDataset.map((item) => item.Region))).sort();
  }, [activeDataset]);

  const categories = useMemo(() => {
    return Array.from(new Set(activeDataset.map((item) => item.Category))).sort();
  }, [activeDataset]);

  const statuses = useMemo(() => {
    return Array.from(new Set(activeDataset.map((item) => item.Order_Status))).sort();
  }, [activeDataset]);

  // Filter active dataset dynamically
  const filteredData = useMemo(() => {
    return activeDataset.filter((item) => {
      // Search
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchSearch =
          (item.Order_ID && item.Order_ID.toLowerCase().includes(q)) ||
          (item.Customer_Name && item.Customer_Name.toLowerCase().includes(q)) ||
          (item.Product_Name && item.Product_Name.toLowerCase().includes(q)) ||
          (item.Category && item.Category.toLowerCase().includes(q)) ||
          (item.Region && item.Region.toLowerCase().includes(q));
        if (!matchSearch) return false;
      }

      // Region
      if (filters.region !== 'all' && item.Region !== filters.region) {
        return false;
      }

      // Category
      if (filters.category !== 'all' && item.Category !== filters.category) {
        return false;
      }

      // Order Status
      if (filters.orderStatus !== 'all' && item.Order_Status !== filters.orderStatus) {
        return false;
      }

      // Date Range (Quarterly)
      if (filters.dateRange !== 'all') {
        const month = parseInt(item.Order_Date.substring(5, 7), 10);
        if (filters.dateRange === 'q1' && (month < 1 || month > 3)) return false;
        if (filters.dateRange === 'q2' && (month < 4 || month > 6)) return false;
        if (filters.dateRange === 'q3' && (month < 7 || month > 9)) return false;
        if (filters.dateRange === 'q4' && (month < 10 || month > 12)) return false;
      }

      return true;
    });
  }, [activeDataset, filters]);

  // Compute live KPI metrics from filtered data
  const metrics: KPIMetrics = useMemo(() => {
    const totalSales = filteredData.reduce((acc, curr) => acc + (curr.Total_Sales || 0), 0);
    const completedSales = filteredData
      .filter((i) => i.Order_Status === 'Completed')
      .reduce((acc, curr) => acc + (curr.Total_Sales || 0), 0);
    const totalOrders = filteredData.length;
    const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
    const totalUnitsSold = filteredData.reduce((acc, curr) => acc + (curr.Quantity || 0), 0);

    // Top region
    const regMap: { [key: string]: number } = {};
    filteredData.forEach((i) => {
      const r = i.Region || 'Unspecified';
      regMap[r] = (regMap[r] || 0) + (i.Total_Sales || 0);
    });
    let topReg = { name: 'N/A', sales: 0 };
    Object.entries(regMap).forEach(([name, sales]) => {
      if (sales > topReg.sales) topReg = { name, sales };
    });

    // Top category
    const catMap: { [key: string]: number } = {};
    filteredData.forEach((i) => {
      const c = i.Category || 'Unspecified';
      catMap[c] = (catMap[c] || 0) + (i.Total_Sales || 0);
    });
    let topCat = { name: 'N/A', sales: 0 };
    Object.entries(catMap).forEach(([name, sales]) => {
      if (sales > topCat.sales) topCat = { name, sales };
    });

    // Top product
    const prodMap: { [key: string]: number } = {};
    filteredData.forEach((i) => {
      const p = i.Product_Name || 'Unspecified';
      prodMap[p] = (prodMap[p] || 0) + (i.Total_Sales || 0);
    });
    let topProd = { name: 'N/A', sales: 0 };
    Object.entries(prodMap).forEach(([name, sales]) => {
      if (sales > topProd.sales) topProd = { name, sales };
    });

    return {
      totalSales,
      completedSales,
      totalOrders,
      avgOrderValue,
      totalUnitsSold,
      topRegion: topReg,
      topCategory: topCat,
      topProduct: topProd,
    };
  }, [filteredData]);

  // Handle Uploaded Dataset
  const handleDatasetLoaded = (
    cleanData: SalesRecord[],
    audit: DataCleaningAudit,
    datasetInfo: DatasetInfo
  ) => {
    setActiveDataset(cleanData);
    setActiveAudit(audit);
    setActiveDatasetInfo(datasetInfo);

    // Generate dynamic insights
    const dynInsights = generateDynamicInsights(cleanData, audit, datasetInfo.fileName);
    setActiveInsights(dynInsights);

    // Reset filters
    handleResetFilters();
    setActiveTab('dashboard');
  };

  // Reset to default internship dataset
  const handleResetDefaultDataset = () => {
    setActiveDataset(CLEANED_SALES_DATA);
    setActiveAudit(DATA_CLEANING_AUDIT);
    setActiveDatasetInfo(null);
    setActiveInsights(BUSINESS_INSIGHTS);
    handleResetFilters();
  };

  // Re-apply custom column mapping
  const handleApplyMapping = (newMapping: ColumnMapping) => {
    if (!activeDatasetInfo || !activeDatasetInfo.rawSample) return;

    const { cleanData, audit } = processAndCleanDataset(activeDatasetInfo.rawSample, newMapping);
    const updatedInfo = { ...activeDatasetInfo, mapping: newMapping };

    setActiveDataset(cleanData);
    setActiveAudit(audit);
    setActiveDatasetInfo(updatedInfo);

    const dynInsights = generateDynamicInsights(cleanData, audit, activeDatasetInfo.fileName);
    setActiveInsights(dynInsights);
  };

  // Export CSV handler
  const handleExportCSV = () => {
    const headers = [
      'Order_ID',
      'Order_Date',
      'Customer_Name',
      'Segment',
      'Region',
      'Category',
      'Product_Name',
      'Unit_Price',
      'Quantity',
      'Discount',
      'Payment_Method',
      'Order_Status',
      'Total_Sales',
    ];

    const rows = filteredData.map((row) => [
      row.Order_ID,
      row.Order_Date,
      `"${row.Customer_Name}"`,
      row.Segment,
      row.Region,
      row.Category,
      `"${row.Product_Name}"`,
      row.Unit_Price,
      row.Quantity,
      row.Discount,
      row.Payment_Method,
      row.Order_Status,
      row.Total_Sales,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', activeDatasetInfo?.isUploaded ? `cleaned_${activeDatasetInfo.fileName}.csv` : 'cleaned_sales_data_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      region: 'all',
      category: 'all',
      orderStatus: 'all',
      segment: 'all',
      dateRange: 'all',
    });
  };

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExportCSV={handleExportCSV}
        recordCount={activeDataset.length}
        user={user}
        onLogout={handleLogout}
        datasetName={activeDatasetInfo?.fileName || 'Internship Sales Dataset'}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Tab 1: Executive Dashboard */}
        {activeTab === 'dashboard' && (
          <>
            {/* Dataset Upload Quick Section */}
            <DatasetUploader
              onDatasetLoaded={handleDatasetLoaded}
              onResetDefault={handleResetDefaultDataset}
              activeDatasetInfo={activeDatasetInfo}
              onOpenMapper={() => setIsMapperOpen(true)}
            />

            {/* KPI Cards */}
            <KPICards metrics={metrics} />

            {/* Filter Bar */}
            <FilterBar
              filters={filters}
              setFilters={setFilters}
              onReset={handleResetFilters}
              regions={regions}
              categories={categories}
              statuses={statuses}
            />

            {/* Monthly Trend Chart */}
            <MonthlySalesChart data={filteredData} />

            {/* Regional Performance & Market Share */}
            <RegionalSalesChart data={filteredData} />

            {/* Top Products & Category Share */}
            <TopProductsChart data={filteredData} />
          </>
        )}

        {/* Tab 2: Upload Data & Process Section */}
        {activeTab === 'upload' && (
          <DatasetUploader
            onDatasetLoaded={handleDatasetLoaded}
            onResetDefault={handleResetDefaultDataset}
            activeDatasetInfo={activeDatasetInfo}
            onOpenMapper={() => setIsMapperOpen(true)}
          />
        )}

        {/* Tab 3: Dynamic Business Insights */}
        {activeTab === 'insights' && <BusinessInsights insights={activeInsights} />}

        {/* Tab 4: Data Explorer & Cleaning Audit */}
        {activeTab === 'explorer' && (
          <DataExplorer
            cleanedData={filteredData}
            rawDataSample={activeDatasetInfo?.rawSample || RAW_SALES_DATA_SAMPLE}
            audit={activeAudit}
            onExportCSV={handleExportCSV}
          />
        )}

        {/* Tab 5: Presentation Deck */}
        {activeTab === 'presentation' && <PresentationViewer />}
      </main>

      {/* Column Mapper Modal */}
      {activeDatasetInfo && (
        <ColumnMapperModal
          isOpen={isMapperOpen}
          onClose={() => setIsMapperOpen(false)}
          datasetInfo={activeDatasetInfo}
          onApplyMapping={handleApplyMapping}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 SalesInsight. Dynamic Sales Data Analysis Platform.</p>
          <div className="flex items-center space-x-4 text-slate-400 font-medium">
            <span>Built with React + Recharts + PapaParse + SheetJS</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
