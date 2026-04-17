import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Database, 
  Settings2, 
  Zap, 
  ShieldCheck, 
  Share2, 
  History,
  ChevronLeft,
  LayoutGrid,
  BarChart3,
  TrendingUp,
  Target,
  FlaskConical,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as ChartTooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { SourceConnect } from '../components/SourceConnect';
import { SchemaStudio } from '../components/SchemaStudio';
import { GeneratorStudio } from '../components/GeneratorStudio';
import { LineageView } from '../components/LineageView';

type Tab = 'schema' | 'scenario' | 'generate' | 'evaluate' | 'export' | 'lineage' | 'benchmark';

export function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('schema');
  const [isKaggleProject, setIsKaggleProject] = useState(false); // To be determined by ID or actual state

  const tabs: { id: Tab; name: string; icon: any }[] = [
    { id: 'schema', name: 'Schema', icon: Database },
    { id: 'benchmark', name: 'Benchmark', icon: Target },
    { id: 'scenario', name: 'Scenario', icon: Settings2 },
    { id: 'generate', name: 'Generate', icon: Zap },
    { id: 'evaluate', name: 'Evaluate', icon: ShieldCheck },
    { id: 'export', name: 'Export', icon: Share2 },
    { id: 'lineage', name: 'Lineage', icon: History },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/')}
          className="p-2 hover:bg-zinc-900 rounded-lg text-zinc-500 hover:text-zinc-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-zinc-100">
              {id?.startsWith('KAG') ? 'Kaggle: IEEE-CIS Fraud Detection' : 'Phantom POE Simulation'}
            </h1>
            <span className={cn(
              "px-2 py-0.5 text-[10px] font-bold uppercase rounded",
              id?.startsWith('KAG') ? "bg-blue-500/10 text-blue-400" : "bg-emerald-500/10 text-emerald-400"
            )}>
              {id?.startsWith('KAG') ? 'Mirror | Benchmark Mode' : 'Active'}
            </span>
          </div>
          <p className="text-zinc-500 text-sm">Project ID: {id} • Created 2 days ago</p>
        </div>
      </div>

      <div className="border-b border-zinc-800">
        <nav className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 pb-4 text-sm font-medium transition-all relative",
                activeTab === tab.id 
                  ? "text-emerald-400" 
                  : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'schema' && <SchemaStudio />}
        {activeTab === 'generate' && <GeneratorStudio />}
        {activeTab === 'lineage' && <LineageView />}
        {activeTab === 'benchmark' && <BenchmarkView />}
        {['scenario', 'evaluate', 'export'].includes(activeTab) && (
          <div className="flex flex-col items-center justify-center h-64 text-zinc-600 space-y-4">
            <LayoutGrid className="w-12 h-12 opacity-20" />
            <p className="italic">The {activeTab} module is being initialized for this conduit.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function BenchmarkView() {
  const benchmarkData = [
    { name: 'XGBoost', real: 0.942, synthetic: 0.928 },
    { name: 'RandomForest', real: 0.915, synthetic: 0.895 },
    { name: 'LightGBM', real: 0.938, synthetic: 0.921 },
    { name: 'LogReg', real: 0.845, synthetic: 0.841 }
  ];

  const tstrRatio = (benchmarkData.reduce((acc, curr) => acc + (curr.synthetic / curr.real), 0) / benchmarkData.length).toFixed(3);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-semibold">TSTR Benchmark Analysis</h3>
                <p className="text-xs text-zinc-500">Train on Synthetic, Test on Real (Kaggle: IEEE-CIS Fraud)</p>
              </div>
              <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-emerald-500/20">
                <TrendingUp size={12} />
                Fidelity agreement: 98.2%
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={benchmarkData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#71717a" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#71717a" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    domain={[0.8, 1.0]}
                  />
                  <ChartTooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                    itemStyle={{ fontSize: '10px' }}
                  />
                  <Legend verticalAlign="top" height={36}/>
                  <Bar dataKey="real" name="Real Data AUC" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
                  <Bar dataKey="synthetic" name="Synthetic Data AUC" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-2">
              <div className="flex items-center gap-2 text-zinc-500">
                <Target size={14} />
                <span className="text-xs font-bold uppercase tracking-widest">TSTR Ratio</span>
              </div>
              <div className="text-3xl font-bold text-zinc-100">{tstrRatio}</div>
              <p className="text-[10px] text-emerald-400 font-medium tracking-tight">System validation: PASS</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-2">
              <div className="flex items-center gap-2 text-zinc-500">
                <FlaskConical size={14} />
                <span className="text-xs font-bold uppercase tracking-widest">SRA Metric</span>
              </div>
              <div className="text-3xl font-bold text-zinc-100">0.994</div>
              <p className="text-[10px] text-blue-400 font-medium tracking-tight">Ranking consistency: High</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Benchmark Insights</h4>
            <div className="space-y-4">
              {[
                { title: 'Feature Ranking Agreement', desc: 'Top 10 features sorted by gain maintain 100% positional integrity.', score: '10/10' },
                { title: 'Decision Boundary Divergence', desc: 'Minimal entropy shift observed in high-dimensional fraud clusters.', score: '9.4/10' },
                { title: 'Model Transferability', desc: 'Synthetic model weights generalize to unseen real distributions.', score: '97%' }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-zinc-200">{item.title}</span>
                    <span className="text-[10px] font-mono text-emerald-500">{item.score}</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 py-2 rounded-lg text-xs font-medium transition-colors border border-zinc-700 flex items-center justify-center gap-2 group">
              Export Analysis PDF
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-6 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-blue-400">Kaggle Audit Trail</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px]">
                <span className="text-zinc-500">Source Hash</span>
                <span className="text-zinc-300 font-mono">sha256_ieee_fraud</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-zinc-500">Dataset Slug</span>
                <span className="text-zinc-300">ieee-cis-fraud-detection</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-zinc-500">Last Synced</span>
                <span className="text-zinc-300">2026-04-16 20:06 UTC</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
