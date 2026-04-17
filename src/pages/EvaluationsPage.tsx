import React from 'react';
import { Target, TrendingUp, BarChart3, Medal, PlayCircle } from 'lucide-react';

const benchmarks = [
  { id: 'trap', name: 'MoStar Deck - Trap', desc: 'Evaluates generator utility handling complex conditional statements and logic hooks.', active: true },
  { id: 'fraud', name: 'MoStar Deck - Fraud', desc: 'Measures TSTR on high-dimensional sparse classification (IEEE-CIS).', active: true },
  { id: 'temporal', name: 'MoStar Deck - Temporal', desc: 'Benchmarks temporal coherence of simulated transaction sequences.', active: true }
];

export function EvaluationsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Evaluations</h1>
        <p className="text-zinc-500 mt-1">Run benchmark suites and score generator fidelity, utility, and privacy.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {benchmarks.map((bench) => (
          <div key={bench.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
            <div className="p-6 flex-1">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg text-emerald-400 flex items-center justify-center mb-4">
                <Medal className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-100 mb-2">{bench.name}</h3>
              <p className="text-sm text-zinc-500">{bench.desc}</p>
            </div>
            <div className="bg-zinc-950 p-4 border-t border-zinc-800 flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-500 tracking-wider uppercase">Baseline loaded</span>
              <button className="flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
                Run Suite <PlayCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mt-8">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-bold text-zinc-100">Competitor Comparison (Avg MoStar Score)</h2>
        </div>
        <div className="h-64 flex items-center justify-center border border-dashed border-zinc-700 rounded-xl relative">
          {/* We will rely on Recharts Radar if needed later, but standard placeholder aligns with the builder context. */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 space-y-4">
            <Target className="w-12 h-12 opacity-20" />
            <p>MoStar Deck radar visualization initialized. Awaiting evaluation run.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
