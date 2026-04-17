import React from 'react';
import { Play, PlayCircle, Settings2, FileText, Download } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const mockScenarios = [
  { id: '1', name: 'Baseline Stratification', model: 'MoStar Sovereign Generator v1', rows: 10000, lastRun: '1 hour ago', status: '✅' },
  { id: '2', name: 'High Mobile Money Edge Case', model: 'TabDDPM-Trap', rows: 2000, lastRun: '4 hours ago', status: '💤' },
];

export function ScenariosPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Scenarios</h1>
          <p className="text-zinc-500 mt-1">Configure and run synthesis jobs with precise conditioning capabilities.</p>
        </div>
        <button className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors">
          <Settings2 className="w-4 h-4" />
          New Scenario
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockScenarios.map((scen) => (
          <div key={scen.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 relative group hover:border-emerald-500/50 transition-all cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-colors">
                <PlayCircle className="w-5 h-5" />
              </div>
              <div className="text-xl">{scen.status}</div>
            </div>
            <h3 className="font-semibold text-zinc-100">{scen.name}</h3>
            <p className="text-xs text-zinc-500 mt-1 mb-4 flex items-center gap-1">
              Used Model: <span className="font-medium text-emerald-400">{scen.model}</span>
            </p>
            <div className="flex justify-between items-center text-xs text-zinc-500 border-t border-zinc-800 pt-4 mt-6">
              <span>Target: {scen.rows.toLocaleString()} rows</span>
              <span>Ran {scen.lastRun}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
