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
  LayoutGrid
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { SourceConnect } from '../components/SourceConnect';
import { SchemaStudio } from '../components/SchemaStudio';
import { GeneratorStudio } from '../components/GeneratorStudio';
import { LineageView } from '../components/LineageView';

type Tab = 'schema' | 'scenario' | 'generate' | 'evaluate' | 'export' | 'lineage';

export function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('schema');

  const tabs: { id: Tab; name: string; icon: any }[] = [
    { id: 'schema', name: 'Schema', icon: Database },
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
            <h1 className="text-2xl font-bold text-zinc-100">Phantom POE Simulation</h1>
            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase rounded">Active</span>
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
