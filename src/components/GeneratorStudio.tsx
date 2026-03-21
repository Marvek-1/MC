import React, { useState } from 'react';
import { 
  Play, 
  Settings2, 
  Download, 
  Share2, 
  Eye, 
  RefreshCw,
  FileJson,
  Table as TableIcon,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

export function GeneratorStudio() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  const startGeneration = () => {
    setIsGenerating(true);
    setCompleted(false);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setCompleted(true);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Generator Studio</h2>
          <p className="text-zinc-500">Configure generation parameters and produce high-fidelity synthetic datasets.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors">
            <Settings2 className="w-5 h-5" />
          </button>
          <button 
            onClick={startGeneration}
            disabled={isGenerating}
            className={cn(
              "px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all",
              isGenerating 
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" 
                : "bg-emerald-500 hover:bg-emerald-400 text-zinc-950"
            )}
          >
            {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {isGenerating ? 'Generating...' : 'Start Generation'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
            <h3 className="font-semibold text-zinc-100 border-b border-zinc-800 pb-4">Configuration</h3>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Generation Mode</label>
                <select className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-emerald-500/50">
                  <option>Fabricate (Fast)</option>
                  <option>Simulate (Scenario-driven)</option>
                  <option>Train (Source-trained)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Record Count</label>
                <input type="number" defaultValue={1000} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-sm" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Privacy Level</label>
                <input type="range" className="w-full accent-emerald-500" />
                <div className="flex justify-between text-[10px] text-zinc-500 font-bold uppercase">
                  <span>Utility</span>
                  <span>Privacy</span>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-zinc-800 bg-zinc-950 text-emerald-500 focus:ring-emerald-500" />
                  <span className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors">Maintain Graph Integrity</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-zinc-800 bg-zinc-950 text-emerald-500 focus:ring-emerald-500" />
                  <span className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors">Preserve Spatial Clusters</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-zinc-800 bg-zinc-950 text-emerald-500 focus:ring-emerald-500" />
                  <span className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors">Inject Anomalies</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {(isGenerating || completed) && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {completed ? (
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    </div>
                  ) : (
                    <div className="p-2 bg-zinc-800 rounded-lg">
                      <RefreshCw className="w-5 h-5 text-zinc-400 animate-spin" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold">{completed ? 'Generation Complete' : 'Generating Dataset...'}</h3>
                    <p className="text-xs text-zinc-500">{completed ? '10,000 records ready for delivery' : 'Synthesizing operational world patterns'}</p>
                  </div>
                </div>
                {completed && (
                  <div className="flex items-center gap-2">
                    <button className="p-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-100 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-100 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {!completed && (
                <div className="space-y-2">
                  <div className="h-2 bg-zinc-950 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-emerald-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    <span>Processing Batch {Math.floor(progress / 10)}/10</span>
                    <span>{progress}%</span>
                  </div>
                </div>
              )}

              {completed && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Realism Score</div>
                    <div className="text-xl font-bold text-emerald-400">94.2%</div>
                  </div>
                  <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Privacy Score</div>
                    <div className="text-xl font-bold text-blue-400">98.1%</div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="p-4 bg-zinc-800/50 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="font-semibold text-sm">Preview Data</h3>
                <div className="flex bg-zinc-950 rounded-lg p-1">
                  <button className="p-1.5 bg-zinc-800 rounded text-zinc-100">
                    <TableIcon className="w-3 h-3" />
                  </button>
                  <button className="p-1.5 text-zinc-500 hover:text-zinc-300">
                    <FileJson className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <button className="text-xs text-emerald-400 hover:text-emerald-300 font-medium">
                Refresh Preview
              </button>
            </div>
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-zinc-950/50 border-b border-zinc-800">
                    <th className="px-4 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">ID</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Timestamp</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="px-4 py-3 text-xs font-mono text-zinc-400">#TX-{1000 + i}</td>
                      <td className="px-4 py-3 text-xs text-zinc-300">2026-03-21 14:56:44</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 uppercase">Success</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-500">37.7749, -122.4194</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
