
import React, { useState, useMemo } from 'react';
import { Parameters, FeeItem, Currency } from '../types';
// Fixed: Added missing Settings and FileText icons to the import
import { Save, Send, Calculator, Info, AlertCircle, Settings, FileText } from 'lucide-react';

const INITIAL_PARAMS: Parameters = {
  gp20Count: 1,
  gp40Count: 1,
  exchangeRate: 7.1,
};

const INITIAL_FEES: FeeItem[] = [
  { id: '1', type: 'per_container', code: 'OF', name: '海运费 (OF)', unitPrice: 850, currency: 'USD', description: '按箱计费' },
  { id: '2', type: 'per_container', code: 'THC-20', name: '20GP码头操作费', unitPrice: 850, currency: 'RMB' },
  { id: '3', type: 'per_container', code: 'THC-40', name: '40GP/HQ码头操作费', unitPrice: 1250, currency: 'RMB' },
  { id: '4', type: 'per_shipment', code: 'DOC', name: '文件费 (DOC)', unitPrice: 500, currency: 'RMB' },
  { id: '5', type: 'per_shipment', code: 'CUS', name: '报关费 (CUS)', unitPrice: 350, currency: 'RMB', description: '超过50项需加收' },
  { id: '6', type: 'per_container', code: 'PICKUP', name: '提货费 (PICK UP)', unitPrice: 800, currency: 'RMB' },
  { id: '7', type: 'per_shipment', code: 'CLEARANCE', name: '目的港清关派送', unitPrice: 450, currency: 'USD' },
];

const QuoteCalculator: React.FC = () => {
  const [params, setParams] = useState<Parameters>(INITIAL_PARAMS);
  const [fees, setFees] = useState<FeeItem[]>(INITIAL_FEES);
  const [supplierName, setSupplierName] = useState('示例供应商 A');

  const handleParamChange = (key: keyof Parameters, value: string) => {
    const numValue = parseFloat(value) || 0;
    setParams(prev => ({ ...prev, [key]: numValue }));
  };

  const handleFeeChange = (id: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setFees(prev => prev.map(f => f.id === id ? { ...f, unitPrice: numValue } : f));
  };

  const calculations = useMemo(() => {
    const results = fees.map(fee => {
      let originalAmount = 0;
      if (fee.type === 'per_container') {
        // Simple logic: if name contains 20GP, use 20GP count, if 40GP, use 40GP. 
        // Otherwise, assume it's a sum of both (like OF or general pickup)
        if (fee.code.includes('20')) {
          originalAmount = fee.unitPrice * params.gp20Count;
        } else if (fee.code.includes('40')) {
          originalAmount = fee.unitPrice * params.gp40Count;
        } else {
          originalAmount = fee.unitPrice * (params.gp20Count + params.gp40Count);
        }
      } else {
        originalAmount = fee.unitPrice;
      }

      const rmbAmount = fee.currency === 'USD' 
        ? originalAmount * params.exchangeRate 
        : originalAmount;

      return {
        ...fee,
        originalAmount,
        rmbAmount
      };
    });

    const containerSubtotal = results
      .filter(r => r.type === 'per_container')
      .reduce((acc, curr) => acc + curr.rmbAmount, 0);

    const shipmentSubtotal = results
      .filter(r => r.type === 'per_shipment')
      .reduce((acc, curr) => acc + curr.rmbAmount, 0);

    return {
      items: results,
      containerSubtotal,
      shipmentSubtotal,
      total: containerSubtotal + shipmentSubtotal
    };
  }, [params, fees]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <label className="block text-sm font-medium text-slate-500 mb-2">供应商名称</label>
          <input 
            type="text" 
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <label className="block text-sm font-medium text-slate-500 mb-2">USD 兑 RMB 汇率</label>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">1 :</span>
            <input 
              type="number" 
              value={params.exchangeRate}
              onChange={(e) => handleParamChange('exchangeRate', e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>
        <div className="bg-indigo-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-indigo-100 text-sm font-medium">预计人民币总额</span>
            <Calculator className="w-5 h-5 opacity-50" />
          </div>
          <div className="text-3xl font-bold">
            ¥ {calculations.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Basic Parameters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-600" />
          <h2 className="font-semibold text-slate-800">测算参数 (柜量统计)</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">20GP 小柜数量</label>
            <input 
              type="number" 
              min="0"
              value={params.gp20Count}
              onChange={(e) => handleParamChange('gp20Count', e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white transition-all outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">40GP/HQ 大柜数量</label>
            <input 
              type="number" 
              min="0"
              value={params.gp40Count}
              onChange={(e) => handleParamChange('gp40Count', e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white transition-all outline-none"
            />
          </div>
        </div>
      </div>

      {/* Main Fee Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h2 className="font-semibold text-slate-800">费用报价详情</h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
            <AlertCircle size={14} />
            所有价格变动将实时更新至总额
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-3 border-b border-slate-200">费用名称 / 描述</th>
                <th className="px-6 py-3 border-b border-slate-200">计费依据</th>
                <th className="px-6 py-3 border-b border-slate-200">单价</th>
                <th className="px-6 py-3 border-b border-slate-200">货币</th>
                <th className="px-6 py-3 border-b border-slate-200">原币合计</th>
                <th className="px-6 py-3 border-b border-slate-200 text-right">人民币合计</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {calculations.items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{item.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{item.code} {item.description && `• ${item.description}`}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                      item.type === 'per_container' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {item.type === 'per_container' ? '按柜计费' : '按票计费'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <input 
                      type="number" 
                      value={item.unitPrice}
                      onChange={(e) => handleFeeChange(item.id, e.target.value)}
                      className="w-24 px-2 py-1 border border-slate-200 rounded bg-white group-hover:border-indigo-300 transition-all outline-none text-sm"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-mono">
                    {item.currency}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700">
                    {item.originalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">
                    ¥ {item.rmbAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50/50">
                <td colSpan={5} className="px-6 py-3 text-sm font-medium text-slate-500 text-right">按柜计费类小计:</td>
                <td className="px-6 py-3 text-sm font-bold text-slate-900 text-right">
                  ¥ {calculations.containerSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>
              <tr className="bg-slate-50/50">
                <td colSpan={5} className="px-6 py-3 text-sm font-medium text-slate-500 text-right">按票计费类小计:</td>
                <td className="px-6 py-3 text-sm font-bold text-slate-900 text-right">
                  ¥ {calculations.shipmentSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>
              <tr className="bg-indigo-50">
                <td colSpan={5} className="px-6 py-4 text-base font-bold text-indigo-900 text-right uppercase tracking-wider">
                  总费用合计 (Total Amount):
                </td>
                <td className="px-6 py-4 text-xl font-black text-indigo-700 text-right">
                  ¥ {calculations.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-4rem)] max-w-6xl">
        <div className="bg-white/80 backdrop-blur-md border border-slate-200 px-8 py-4 rounded-2xl shadow-2xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
              <Info size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">填写须知</p>
              <p className="text-xs text-slate-500">请确保所有必填项已完成。保存为草稿后可再次编辑。</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors flex items-center gap-2">
              <Save size={18} />
              保存草稿
            </button>
            <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center gap-2">
              <Send size={18} />
              提交正式报价单
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteCalculator;
