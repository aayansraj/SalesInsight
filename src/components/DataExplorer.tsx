import React, { useState } from 'react';
import { Database, Search, FileText, CheckCircle, AlertCircle, ArrowUpDown, ChevronLeft, ChevronRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { SalesRecord, RawSalesRecord, DataCleaningAudit } from '../types';

interface DataExplorerProps {
  cleanedData: SalesRecord[];
  rawDataSample: RawSalesRecord[];
  audit: DataCleaningAudit;
  onExportCSV: () => void;
}

export const DataExplorer: React.FC<DataExplorerProps> = ({
  cleanedData,
  rawDataSample,
  audit,
  onExportCSV,
}) => {
  const [viewMode, setViewMode] = useState<'clean' | 'raw'>('clean');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof SalesRecord>('Order_Date');
  const [sortAsc, setSortAsc] = useState(false);
  const pageSize = 15;

  const currentData = viewMode === 'clean' ? cleanedData : (rawDataSample as any[]);

  const filteredData = currentData.filter((item) => {
    const q = search.toLowerCase();
    return (
      (item.Order_ID && item.Order_ID.toLowerCase().includes(q)) ||
      (item.Customer_Name && item.Customer_Name.toLowerCase().includes(q)) ||
      (item.Product_Name && item.Product_Name.toLowerCase().includes(q)) ||
      (item.Category && item.Category.toLowerCase().includes(q)) ||
      (item.Region && item.Region.toLowerCase().includes(q))
    );
  });

  const sortedData = [...filteredData].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (valA == null) return 1;
    if (valB == null) return -1;
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  const handleSort = (field: keyof SalesRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Audit Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 bg-gradient-to-r from-slate-900 via-blue-950/30 to-slate-900">
        <div className="flex items-center space-x-3 mb-4">
          <ShieldCheck className="h-6 w-6 text-emerald-400" />
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Data Cleaning & Quality Audit Summary
            </h3>
            <p className="text-xs text-slate-400">
              Automated data validation pipeline report execution results
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] font-semibold text-slate-400 uppercase">Raw Records</span>
            <p className="text-lg font-extrabold text-white">{audit.rawCount.toLocaleString()}</p>
            <span className="text-[10px] text-slate-500">Initial Import</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] font-semibold text-slate-400 uppercase">Duplicates Removed</span>
            <p className="text-lg font-extrabold text-rose-400">{audit.duplicatesRemoved}</p>
            <span className="text-[10px] text-rose-500/80">Exact Duplicates</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] font-semibold text-slate-400 uppercase">Names Handled</span>
            <p className="text-lg font-extrabold text-amber-400">{audit.missingNamesFilled}</p>
            <span className="text-[10px] text-amber-500/80">Guest Fallback</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] font-semibold text-slate-400 uppercase">Prices Imputed</span>
            <p className="text-lg font-extrabold text-indigo-400">{audit.missingPricesImputed}</p>
            <span className="text-[10px] text-indigo-400/80">Median Strategy</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] font-semibold text-slate-400 uppercase">Dates Parsed</span>
            <p className="text-lg font-extrabold text-cyan-400">{audit.datesStandardized}</p>
            <span className="text-[10px] text-cyan-400/80">YYYY-MM-DD</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] font-semibold text-slate-400 uppercase">Clean Rows</span>
            <p className="text-lg font-extrabold text-emerald-400">{audit.cleanCount.toLocaleString()}</p>
            <span className="text-[10px] text-emerald-400/80">100% Valid</span>
          </div>
        </div>
      </div>

      {/* Dataset Explorer Header */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800/80">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center space-x-3">
            <Database className="h-5 w-5 text-blue-400" />
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Live Sales Transaction Explorer
              </h3>
              <p className="text-xs text-slate-400">
                Browse, search, sort, and inspect transactional data
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* View Mode Toggle */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => { setViewMode('clean'); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
                  viewMode === 'clean' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Cleaned Dataset ({cleanedData.length})</span>
              </button>
              <button
                onClick={() => { setViewMode('raw'); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
                  viewMode === 'raw' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <AlertCircle className="h-3.5 w-3.5" />
                <span>Raw Uncleaned Sample ({rawDataSample.length})</span>
              </button>
            </div>

            <button
              onClick={onExportCSV}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all"
            >
              Download Cleaned CSV
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search records by Order ID, Customer, Product, Category..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800/80">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <th className="p-3 cursor-pointer hover:text-white" onClick={() => handleSort('Order_ID')}>
                  <div className="flex items-center space-x-1">
                    <span>Order ID</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="p-3 cursor-pointer hover:text-white" onClick={() => handleSort('Order_Date')}>
                  <div className="flex items-center space-x-1">
                    <span>Date</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="p-3">Customer</th>
                <th className="p-3">Region</th>
                <th className="p-3">Category</th>
                <th className="p-3">Product Name</th>
                <th className="p-3 text-right">Unit Price</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-right">Discount</th>
                <th className="p-3 text-right">Total Sales</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-6 text-center text-slate-500">
                    No matching sales records found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/50 transition-colors text-slate-300">
                    <td className="p-3 font-mono font-bold text-blue-400">{row.Order_ID}</td>
                    <td className="p-3 text-slate-400">{row.Order_Date || 'N/A'}</td>
                    <td className="p-3 font-medium text-slate-200">
                      {row.Customer_Name ? (
                        row.Customer_Name
                      ) : (
                        <span className="text-amber-400 font-semibold italic">NaN (Missing)</span>
                      )}
                    </td>
                    <td className="p-3">
                      {row.Region ? (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                          {row.Region}
                        </span>
                      ) : (
                        <span className="text-amber-400 font-semibold italic">NaN (Missing)</span>
                      )}
                    </td>
                    <td className="p-3 text-slate-400">{row.Category}</td>
                    <td className="p-3 font-semibold text-white">{row.Product_Name}</td>
                    <td className="p-3 text-right">
                      {row.Unit_Price != null ? (
                        `$${Number(row.Unit_Price).toFixed(2)}`
                      ) : (
                        <span className="text-amber-400 font-semibold italic">NaN</span>
                      )}
                    </td>
                    <td className="p-3 text-center font-bold text-slate-200">{row.Quantity}</td>
                    <td className="p-3 text-right text-slate-400">
                      {row.Discount != null ? `${(row.Discount * 100).toFixed(0)}%` : '0%'}
                    </td>
                    <td className="p-3 text-right font-extrabold text-emerald-400">
                      {row.Total_Sales != null
                        ? `$${Number(row.Total_Sales).toFixed(2)}`
                        : '$0.00'}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          row.Order_Status === 'Completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : row.Order_Status === 'Returned'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : row.Order_Status === 'Cancelled'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}
                      >
                        {row.Order_Status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
          <span>
            Showing {startIndex + 1} to {Math.min(startIndex + pageSize, sortedData.length)} of{' '}
            {sortedData.length} entries
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-semibold text-slate-200">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
