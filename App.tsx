
import React, { useState, useMemo } from 'react';
import { 
  PlusCircle, 
  FileText, 
  Settings, 
  LayoutDashboard, 
  Truck, 
  ShieldCheck,
  ChevronRight,
  Calculator,
  Save,
  Send
} from 'lucide-react';
import { Parameters, FeeItem, Currency } from './types';
import QuoteCalculator from './components/QuoteCalculator';

const App: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'new-quote'>('new-quote');

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
          <span className="font-bold text-xl tracking-tight">LogiSRM</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <SidebarItem 
            icon={<LayoutDashboard size={20} />} 
            label="仪表盘" 
            active={view === 'dashboard'} 
            onClick={() => setView('dashboard')}
          />
          <SidebarItem 
            icon={<FileText size={20} />} 
            label="报价单管理" 
            active={view === 'new-quote'} 
            onClick={() => setView('new-quote')}
          />
          <SidebarItem icon={<ShieldCheck size={20} />} label="供应商准入" />
          <SidebarItem icon={<Settings size={20} />} label="系统参数" />
        </nav>
        
        <div className="p-6 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden">
              <img src="https://picsum.photos/seed/user/100" alt="User" />
            </div>
            <div>
              <p className="text-sm font-medium">物流部管理员</p>
              <p className="text-xs text-slate-400">Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-xl font-semibold text-slate-800">
            {view === 'dashboard' ? '业务概览' : '创建报价单'}
          </h1>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
              帮助文档
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
              <PlusCircle size={18} />
              导出数据
            </button>
          </div>
        </header>

        <div className="p-8">
          {view === 'new-quote' ? (
            <QuoteCalculator />
          ) : (
            <div className="text-center py-20">
              <LayoutDashboard size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-900">仪表盘正在开发中</h3>
              <p className="text-slate-500">请先点击左侧“报价单管理”开始体验供应商报价功能。</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
      active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    {icon}
    {label}
    {active && <ChevronRight size={16} className="ml-auto" />}
  </button>
);

export default App;
