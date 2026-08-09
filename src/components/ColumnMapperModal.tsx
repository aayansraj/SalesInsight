import React, { useState } from 'react';
import { Sliders, X, CheckCircle2, ArrowRight, Table } from 'lucide-react';
import { ColumnMapping, DatasetInfo } from '../types';

interface ColumnMapperModalProps {
  isOpen: boolean;
  onClose: () => void;
  datasetInfo: DatasetInfo;
  onApplyMapping: (newMapping: ColumnMapping) => void;
}

export const ColumnMapperModal: React.FC<ColumnMapperModalProps> = ({
  isOpen,
  onClose,
  datasetInfo,
  onApplyMapping,
}) => {
  const [mapping, setMapping] = useState<ColumnMapping>(datasetInfo.mapping);

  if (!isOpen) return null;

  const rawCols = ['(Not Available / None)', ...datasetInfo.rawColumns];

  const handleSelectChange = (field: keyof ColumnMapping, val: string) => {
    setMapping((prev) => ({
      ...prev,
      [field]: val === '(Not Available / None)' ? '' : val,
    }));
  };

  const handleSave = () => {
    onApplyMapping(mapping);
    onClose();
  };

  const fields = [
    { key: 'totalSalesCol', label: 'Sales / Revenue Column', desc: 'Total sales amount (e.g. Sales, Revenue, Total_Amount)' },
    { key: 'orderDateCol', label: 'Order Date Column', desc: 'Date of transaction (e.g. Order_Date, InvoiceDate, Date)' },
    { key: 'productNameCol', label: 'Product Name / Title', desc: 'Item name or SKU title (e.g. Product_Name, Description, Item)' },
    { key: 'orderIdCol', label: 'Order / Invoice ID', desc: 'Unique transaction code (e.g. Order_ID, InvoiceNo, ID)' },
    { key: 'regionCol', label: 'Region / Territory / Country', desc: 'Sales location or region (e.g. Region, Country, Territory, State)' },
    { key: 'categoryCol', label: 'Product Category', desc: 'Product classification (e.g. Category, Department, Group)' },
    { key: 'unitPriceCol', label: 'Unit Price Column', desc: 'Item price (e.g. Unit_Price, Price, Rate)' },
    { key: 'quantityCol', label: 'Quantity Column', desc: 'Units purchased (e.g. Quantity, Qty, Volume)' },
    { key: 'orderStatusCol', label: 'Order Status', desc: 'Fulfillment state (e.g. Order_Status, Status, State)' },
    { key: 'customerNameCol', label: 'Customer Name', desc: 'Purchaser name (e.g. Customer_Name, Client, Buyer)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel max-w-2xl w-full rounded-3xl border border-slate-800/90 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Column Mapping Interface
              </h3>
              <p className="text-xs text-slate-400">
                Map spreadsheet headers from <span className="text-blue-400">{datasetInfo.fileName}</span> to analytical fields
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((f) => {
              const currentVal = mapping[f.key as keyof ColumnMapping] || '(Not Available / None)';
              return (
                <div key={f.key} className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
                  <label className="block text-xs font-bold text-white mb-0.5">{f.label}</label>
                  <p className="text-[10px] text-slate-400 mb-2">{f.desc}</p>
                  <select
                    value={currentVal}
                    onChange={(e) => handleSelectChange(f.key as keyof ColumnMapping, e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-blue-300 font-semibold focus:outline-none focus:border-blue-500"
                  >
                    {rawCols.map((col) => (
                      <option key={col} value={col}>
                        {col}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/80 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 flex items-center space-x-1.5"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Apply Mapping & Re-clean</span>
          </button>
        </div>
      </div>
    </div>
  );
};
