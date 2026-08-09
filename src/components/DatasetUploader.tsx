import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  RefreshCcw,
  Sliders,
  FileText,
  X,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { parseFileToRows, autoDetectColumnMapping, processAndCleanDataset } from '../utils/datasetEngine';
import { ColumnMapping, DataCleaningAudit, DatasetInfo, SalesRecord } from '../types';

interface DatasetUploaderProps {
  onDatasetLoaded: (
    cleanData: SalesRecord[],
    audit: DataCleaningAudit,
    datasetInfo: DatasetInfo
  ) => void;
  onResetDefault: () => void;
  activeDatasetInfo: DatasetInfo | null;
  onOpenMapper: () => void;
}

export const DatasetUploader: React.FC<DatasetUploaderProps> = ({
  onDatasetLoaded,
  onResetDefault,
  activeDatasetInfo,
  onOpenMapper,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setErrorMessage(null);
    setLoading(true);
    setProgressText(`Reading ${file.name}...`);

    try {
      const { rows, headers, fileName, fileSize } = await parseFileToRows(file);

      setProgressText(`Auto-detecting columns & cleaning ${rows.length} rows...`);

      // Auto-detect column mapping
      const mapping = autoDetectColumnMapping(headers);

      // Clean dataset
      const { cleanData, audit } = processAndCleanDataset(rows, mapping);

      const datasetInfo: DatasetInfo = {
        fileName,
        fileSize,
        fileType: file.name.split('.').pop()?.toUpperCase() || 'CSV',
        totalRows: rows.length,
        totalCols: headers.length,
        rawColumns: headers,
        mapping,
        isUploaded: true,
        rawSample: rows.slice(0, 15),
      };

      onDatasetLoaded(cleanData, audit, datasetInfo);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err.message || 'An error occurred while reading the file. Please check file format.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-800/90 shadow-2xl relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <UploadCloud className="h-6 w-6 text-blue-400" />
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Upload Your Custom Sales Dataset
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Import your own <span className="text-blue-400 font-semibold">.CSV</span>,{' '}
            <span className="text-emerald-400 font-semibold">.XLSX</span>, or{' '}
            <span className="text-indigo-400 font-semibold">.XLS</span> dataset to dynamically analyze sales KPIs, charts, and insights.
          </p>
        </div>

        {/* Dataset Status Badge & Reset Controls */}
        {activeDatasetInfo && activeDatasetInfo.isUploaded && (
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={onOpenMapper}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all"
            >
              <Sliders className="h-3.5 w-3.5 text-amber-400" />
              <span>Column Mapping</span>
            </button>

            <button
              onClick={onResetDefault}
              className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
              <span>Reset to Internship Data</span>
            </button>
          </div>
        )}
      </div>

      {/* Error Message Alert */}
      {errorMessage && (
        <div className="mb-5 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start justify-between">
          <div className="flex items-start space-x-2">
            <ShieldAlert className="h-5 w-5 shrink-0 text-rose-400 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">Dataset Upload Error</span>
              <span>{errorMessage}</span>
            </div>
          </div>
          <button onClick={() => setErrorMessage(null)} className="p-1 hover:bg-rose-500/20 rounded-lg">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Drag & Drop Upload Container */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`p-8 sm:p-10 rounded-2xl border-2 border-dashed text-center transition-all duration-200 ${
          isDragging
            ? 'border-blue-500 bg-blue-600/10 scale-[1.01]'
            : 'border-slate-800 hover:border-slate-700 bg-slate-950/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv, .xlsx, .xls"
          onChange={handleFileSelect}
          className="hidden"
        />

        {loading ? (
          <div className="py-6 flex flex-col items-center justify-center space-y-3">
            <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-bold text-blue-400 animate-pulse">{progressText}</p>
          </div>
        ) : activeDatasetInfo && activeDatasetInfo.isUploaded ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800 text-left">
            <div className="flex items-center space-x-3.5">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <FileSpreadsheet className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-white">{activeDatasetInfo.fileName}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 uppercase">
                    {activeDatasetInfo.fileType}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Size: {activeDatasetInfo.fileSize} • {activeDatasetInfo.totalRows.toLocaleString()} Rows •{' '}
                  {activeDatasetInfo.totalCols} Columns
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-1.5"
              >
                <UploadCloud className="h-4 w-4" />
                <span>Upload Another File</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="py-4 flex flex-col items-center justify-center space-y-3">
            <div className="h-16 w-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-xl">
              <UploadCloud className="h-8 w-8" />
            </div>

            <div>
              <p className="text-sm font-bold text-white mb-1">
                Drag & Drop your sales dataset here, or{' '}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-400 hover:underline font-extrabold"
                >
                  browse file
                </button>
              </p>
              <p className="text-xs text-slate-500">
                Supported formats: <span className="text-slate-400 font-semibold">.CSV</span>,{' '}
                <span className="text-slate-400 font-semibold">.XLSX</span>,{' '}
                <span className="text-slate-400 font-semibold">.XLS</span> (Max file size: 50MB)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
