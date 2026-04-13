import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Settings2, 
  Activity, 
  History, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  ChevronRight,
  Database,
  Cpu,
  BarChart3
} from 'lucide-react';
import { trainingService } from '../services/trainingService';
import { TrainingJob, TrainingParameters } from '../types/training';
import { cn } from '../lib/utils';

export const TrainingPage: React.FC = () => {
  const [projectId] = useState('default-project'); // In a real app, this would come from context or URL
  const [jobs, setJobs] = useState<TrainingJob[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [params, setParams] = useState<TrainingParameters>({
    modelType: 'classification',
    epochs: 10,
    learningRate: 0.001,
    batchSize: 32,
    validationSplit: 0.2,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const currentJobs = trainingService.getJobs(projectId);
      setJobs([...currentJobs].reverse());
      
      const activeJob = currentJobs.find(j => j.status === 'running' || j.status === 'queued');
      setIsTraining(!!activeJob);
    }, 1000);

    return () => clearInterval(interval);
  }, [projectId]);

  const handleStartTraining = async () => {
    await trainingService.startTraining(projectId, params);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 p-8 space-y-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Model Training</h1>
          <p className="text-zinc-500 mt-2 font-mono text-sm uppercase tracking-widest">Mission Control / Neural Engine</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full">
            <div className={cn("w-2 h-2 rounded-full animate-pulse", isTraining ? "bg-emerald-500" : "bg-zinc-700")} />
            <span className="text-xs font-mono text-zinc-400 uppercase">{isTraining ? 'Engine Active' : 'Engine Idle'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-2 text-zinc-400 mb-2">
              <Settings2 size={18} />
              <h2 className="text-sm font-bold uppercase tracking-wider">Configuration</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-500 uppercase">Model Architecture</label>
                <select 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                  value={params.modelType}
                  onChange={(e) => setParams({...params, modelType: e.target.value as any})}
                >
                  <option value="classification">Deep Classification</option>
                  <option value="regression">Linear Regression</option>
                  <option value="clustering">K-Means Clustering</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-zinc-500 uppercase">Epochs</label>
                  <input 
                    type="number" 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    value={params.epochs}
                    onChange={(e) => setParams({...params, epochs: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-zinc-500 uppercase">Batch Size</label>
                  <input 
                    type="number" 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    value={params.batchSize}
                    onChange={(e) => setParams({...params, batchSize: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-500 uppercase">Learning Rate: {params.learningRate}</label>
                <input 
                  type="range" 
                  min="0.0001" 
                  max="0.01" 
                  step="0.0001"
                  className="w-full accent-emerald-500"
                  value={params.learningRate}
                  onChange={(e) => setParams({...params, learningRate: parseFloat(e.target.value)})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-500 uppercase">Validation Split: {Math.round(params.validationSplit * 100)}%</label>
                <input 
                  type="range" 
                  min="0.1" 
                  max="0.5" 
                  step="0.05"
                  className="w-full accent-emerald-500"
                  value={params.validationSplit}
                  onChange={(e) => setParams({...params, validationSplit: parseFloat(e.target.value)})}
                />
              </div>
            </div>

            <button 
              onClick={handleStartTraining}
              disabled={isTraining}
              className={cn(
                "w-full py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all",
                isTraining 
                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" 
                  : "bg-emerald-500 text-emerald-950 hover:bg-emerald-400 active:scale-[0.98]"
              )}
            >
              {isTraining ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Training in Progress
                </>
              ) : (
                <>
                  <Play size={20} fill="currentColor" />
                  Initiate Training
                </>
              )}
            </button>
          </div>

          {/* System Stats */}
          <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-zinc-500">
              <Activity size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">System Resources</span>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Compute Unit', value: 'GPU-A100', icon: Cpu },
                { label: 'Data Source', value: 'PostgreSQL_Main', icon: Database },
                { label: 'Latency', value: '12ms', icon: Activity },
              ].map((stat) => (
                <div key={stat.label} className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <stat.icon size={14} />
                    <span className="text-xs">{stat.label}</span>
                  </div>
                  <span className="text-xs font-mono text-zinc-200">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-400">
              <History size={18} />
              <h2 className="text-sm font-bold uppercase tracking-wider">Job History</h2>
            </div>
            <span className="text-xs font-mono text-zinc-500">{jobs.length} Jobs Total</span>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {jobs.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-12 border border-dashed border-zinc-800 rounded-2xl text-center text-zinc-600 italic"
                >
                  No training jobs initiated yet.
                </motion.div>
              ) : (
                jobs.map((job) => (
                  <motion.div
                    key={job.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
                  >
                    <div className="p-4 flex items-center justify-between border-b border-zinc-800/50">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          job.status === 'completed' ? "bg-emerald-500/10 text-emerald-500" :
                          job.status === 'running' ? "bg-blue-500/10 text-blue-500" :
                          job.status === 'failed' ? "bg-red-500/10 text-red-500" :
                          "bg-zinc-800 text-zinc-500"
                        )}>
                          {job.status === 'completed' ? <CheckCircle2 size={18} /> :
                           job.status === 'running' ? <Loader2 size={18} className="animate-spin" /> :
                           job.status === 'failed' ? <XCircle size={18} /> :
                           <Activity size={18} />}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-zinc-200">Job #{job.id}</div>
                          <div className="text-[10px] font-mono text-zinc-500 uppercase">{job.parameters.modelType}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-mono text-zinc-500 uppercase">Started</div>
                        <div className="text-xs text-zinc-300">{new Date(job.startTime).toLocaleTimeString()}</div>
                      </div>
                    </div>

                    <div className="p-4 space-y-4">
                      {/* Progress Bar */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-mono uppercase">
                          <span className="text-zinc-500">Progress</span>
                          <span className="text-zinc-300">{job.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-zinc-950 rounded-full overflow-hidden">
                          <motion.div 
                            className={cn(
                              "h-full rounded-full",
                              job.status === 'completed' ? "bg-emerald-500" : "bg-blue-500"
                            )}
                            initial={{ width: 0 }}
                            animate={{ width: `${job.progress}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>

                      {/* Metrics */}
                      {job.metrics && (
                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <div className="bg-zinc-950 border border-zinc-800/50 rounded-lg p-3 space-y-1">
                            <div className="flex items-center gap-1.5 text-zinc-500">
                              <BarChart3 size={12} />
                              <span className="text-[10px] font-mono uppercase">Accuracy</span>
                            </div>
                            <div className="text-lg font-bold text-emerald-500">
                              {(job.metrics.accuracy! * 100).toFixed(2)}%
                            </div>
                          </div>
                          <div className="bg-zinc-950 border border-zinc-800/50 rounded-lg p-3 space-y-1">
                            <div className="flex items-center gap-1.5 text-zinc-500">
                              <Activity size={12} />
                              <span className="text-[10px] font-mono uppercase">Loss</span>
                            </div>
                            <div className="text-lg font-bold text-zinc-300">
                              {job.metrics.loss!.toFixed(4)}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
