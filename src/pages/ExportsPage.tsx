import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  Database, 
  CheckCircle2, 
  Loader2, 
  FileText, 
  ShieldCheck, 
  BarChart,
  Clock,
  ArrowRight
} from 'lucide-react';
import { exportService } from '../services/exportService';
import { SyntheticDataset } from '../types/export';
import { cn } from '../lib/utils';

export const ExportsPage: React.FC = () => {
  const [projectId] = useState('default-project');
  const [datasets, setDatasets] = useState<SyntheticDataset[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentDatasets = exportService.getDatasets(projectId);
      setDatasets([...currentDatasets].reverse());
    }, 1000);

    return () => clearInterval(interval);
  }, [projectId]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 p-8 space-y-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Synthetic Exports</h1>
          <p className="text-zinc-500 mt-2 font-mono text-sm uppercase tracking-widest">Data Generation / Delivery Hub</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {datasets.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-20 border border-dashed border-zinc-800 rounded-3xl text-center space-y-4"
            >
              <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto text-zinc-700">
                <Download size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-medium text-zinc-300">No exports found</h3>
                <p className="text-sm text-zinc-500 max-w-xs mx-auto">
                  Initiate a generation from a trained model to see your synthetic datasets here.
                </p>
              </div>
            </motion.div>
          ) : (
            datasets.map((dataset, index) => (
              <motion.div
                key={dataset.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-colors"
              >
                <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      dataset.status === 'done' ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"
                    )}>
                      {dataset.status === 'done' ? <FileText size={24} /> : <Loader2 size={24} className="animate-spin" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-zinc-100">Dataset_{dataset.id}</h3>
                        <span className="text-[10px] font-mono bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded uppercase">
                          {dataset.format}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-500 flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1">
                          <Database size={12} />
                          {dataset.sampleCount.toLocaleString()} Samples
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(dataset.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 max-w-md">
                    {dataset.status === 'generating' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-mono uppercase text-zinc-500">
                          <span>Synthesizing...</span>
                          <span>{Math.round(dataset.progress)}%</span>
                        </div>
                        <div className="h-1.5 bg-zinc-950 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-blue-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${dataset.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {dataset.status === 'done' && dataset.metrics && (
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <BarChart size={14} className="text-emerald-500" />
                          <div>
                            <div className="text-[10px] text-zinc-500 uppercase font-mono">Utility</div>
                            <div className="text-sm font-bold text-emerald-400">{(dataset.metrics.utilityScore * 100).toFixed(1)}%</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <ShieldCheck size={14} className="text-blue-500" />
                          <div>
                            <div className="text-[10px] text-zinc-500 uppercase font-mono">Privacy</div>
                            <div className="text-sm font-bold text-blue-400">{(dataset.metrics.privacyScore * 100).toFixed(1)}%</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-purple-500" />
                          <div>
                            <div className="text-[10px] text-zinc-500 uppercase font-mono">Temporal</div>
                            <div className="text-sm font-bold text-purple-400">{(dataset.metrics.temporalCoherence! * 100).toFixed(1)}%</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {dataset.status === 'done' ? (
                      <button 
                        onClick={() => exportService.downloadDataset(dataset)}
                        className="bg-zinc-100 text-zinc-950 px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-white transition-colors"
                      >
                        <Download size={16} />
                        Download
                      </button>
                    ) : (
                      <div className="px-6 py-2.5 text-zinc-500 text-sm font-medium italic">
                        Processing...
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
