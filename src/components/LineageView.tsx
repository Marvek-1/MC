import React from 'react';
import { 
  History, 
  GitBranch, 
  Database, 
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

export function LineageView() {
  return (
    <div className="space-y-8">
      <div className="relative">
        {/* Simple vertical line for lineage */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-zinc-800" />
        
        <div className="space-y-12">
          {/* Source Node */}
          <div className="relative pl-20">
            <div className="absolute left-6 top-0 w-4 h-4 rounded-full bg-zinc-950 border-2 border-zinc-700 z-10" />
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl max-w-md">
              <div className="flex items-center gap-3 mb-2">
                <Database className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Source</span>
              </div>
              <h4 className="font-semibold text-zinc-200">Postgres: Production_Main</h4>
              <p className="text-xs text-zinc-500 mt-1">Introspected 2 days ago • 12 entities detected</p>
            </div>
          </div>

          {/* Recipe Node */}
          <div className="relative pl-20">
            <div className="absolute left-6 top-0 w-4 h-4 rounded-full bg-zinc-950 border-2 border-emerald-500 z-10" />
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl max-w-md">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Recipe</span>
              </div>
              <h4 className="font-semibold text-zinc-200">Fabricate: Standard_Operational_v1</h4>
              <p className="text-xs text-zinc-500 mt-1">10k records • Differential Privacy: Active</p>
            </div>
          </div>

          {/* Evaluation Node */}
          <div className="relative pl-20">
            <div className="absolute left-6 top-0 w-4 h-4 rounded-full bg-zinc-950 border-2 border-blue-500 z-10" />
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl max-w-md">
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Evaluation</span>
              </div>
              <h4 className="font-semibold text-zinc-200">Realism: 94% • Privacy: 98%</h4>
              <p className="text-xs text-zinc-500 mt-1">Passed all MoStar governance checks</p>
            </div>
          </div>

          {/* Export Node */}
          <div className="relative pl-20">
            <div className="absolute left-6 top-0 w-4 h-4 rounded-full bg-zinc-950 border-2 border-purple-500 z-10" />
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl max-w-md">
              <div className="flex items-center gap-3 mb-2">
                <GitBranch className="w-4 h-4 text-purple-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Delivery</span>
              </div>
              <h4 className="font-semibold text-zinc-200">Exported to Firebase: QA_Sandbox</h4>
              <p className="text-xs text-zinc-500 mt-1">Delivered 1 hour ago • 10,000 documents</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
