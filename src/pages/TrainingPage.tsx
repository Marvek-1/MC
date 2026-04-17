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
  BarChart3,
  Download,
  Zap,
  FileText,
  ShieldCheck
} from 'lucide-react';
import { trainingService } from '../services/trainingService';
import { exportService } from '../services/exportService';
import { privacyLedger } from '../services/privacyLedger';
import { vault } from '../lib/vault';
import { TrainingJob, TrainingParameters } from '../types/training';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  Legend,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';

export const TrainingPage: React.FC = () => {
  const navigate = useNavigate();
  const [projectId] = useState('default-project'); 
  const [jobs, setJobs] = useState<TrainingJob[]>([]);
  const [datasets, setDatasets] = useState<any[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [privacyBudget, setPrivacyBudget] = useState(privacyLedger.getBudget());
  const [vaultStatus, setVaultStatus] = useState<any>(null);
  const [activeTabs, setActiveTabs] = useState<Record<string, 'overview' | 'validation'>>({});
  const [params, setParams] = useState<TrainingParameters>({
    model: 'MOSTLY_AI/Medium',
    maxSampleSize: 100000,
    batchSize: 32,
    maxTrainingTime: 240,
    maxEpochs: 100,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const currentJobs = trainingService.getJobs(projectId);
      setJobs([...currentJobs].reverse());
      
      const currentDatasets = exportService.getDatasets(projectId);
      setDatasets(currentDatasets);
      
      const activeJob = currentJobs.find(j => j.status === 'training' || j.status === 'queued');
      setIsTraining(!!activeJob);
      setPrivacyBudget(privacyLedger.getBudget());
    }, 1000);

    return () => clearInterval(interval);
  }, [projectId]);

  const handleStartTraining = async () => {
    await trainingService.startTraining(projectId, params);
  };

  const handleGenerateData = async (jobId: string) => {
    await exportService.startGeneration(projectId, jobId, {
      sampleCount: 10000,
      format: 'csv'
    });
    navigate('/exports');
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
                  value={params.model}
                  onChange={(e) => setParams({...params, model: e.target.value as any})}
                >
                  <option value="MOSTLY_AI/Small">MOSTLY_AI/Small (Fast)</option>
                  <option value="MOSTLY_AI/Medium">MOSTLY_AI/Medium (Balanced)</option>
                  <option value="MOSTLY_AI/Large">MOSTLY_AI/Large (Accurate)</option>
                  <option value="MOSTLY_AI/LSTMFromScratch-3m">LSTM From Scratch</option>
                  <option value="microsoft/phi-1_5">Microsoft Phi-1.5 (LLM)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-zinc-500 uppercase">Max Epochs</label>
                  <input 
                    type="number" 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    value={params.maxEpochs}
                    onChange={(e) => setParams({...params, maxEpochs: parseInt(e.target.value)})}
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
                <label className="text-xs font-mono text-zinc-500 uppercase">Max Sample Size</label>
                <input 
                  type="number" 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  value={params.maxSampleSize}
                  onChange={(e) => setParams({...params, maxSampleSize: parseInt(e.target.value)})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-500 uppercase">Max Training Time: {params.maxTrainingTime} min</label>
                <input 
                  type="range" 
                  min="30" 
                  max="1440" 
                  step="30"
                  className="w-full accent-emerald-500"
                  value={params.maxTrainingTime}
                  onChange={(e) => setParams({...params, maxTrainingTime: parseInt(e.target.value)})}
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

              <div className="pt-4 border-t border-zinc-800/50 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span className="text-xs">Privacy Budget (ε)</span>
                  </div>
                  <span className="text-xs font-mono text-emerald-500">{privacyBudget.totalEpsilon.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Zap size={14} className="text-blue-500" />
                    <span className="text-xs">TSTR Holdout Vault</span>
                  </div>
                  <span className="text-[10px] font-mono bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded uppercase">
                    Locked
                  </span>
                </div>
              </div>
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
                          job.status === 'done' ? "bg-emerald-500/10 text-emerald-500" :
                          job.status === 'training' ? "bg-blue-500/10 text-blue-500" :
                          job.status === 'failed' ? "bg-red-500/10 text-red-500" :
                          "bg-zinc-800 text-zinc-500"
                        )}>
                          {job.status === 'done' ? <CheckCircle2 size={18} /> :
                           job.status === 'training' ? <Loader2 size={18} className="animate-spin" /> :
                           job.status === 'failed' ? <XCircle size={18} /> :
                           <Activity size={18} />}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-zinc-200">Job #{job.id}</div>
                          <div className="text-[10px] font-mono text-zinc-500 uppercase">{job.parameters.model}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-mono text-zinc-500 uppercase">Started</div>
                        <div className="text-xs text-zinc-300">{new Date(job.startTime).toLocaleTimeString()}</div>
                      </div>
                    </div>

                    <div className="p-4 space-y-4">
                      {/* Tabs for Completed Jobs */}
                      {job.status === 'done' && (
                        <div className="flex gap-4 border-b border-zinc-800/50 mb-4">
                          <button 
                            onClick={() => setActiveTabs({ ...activeTabs, [job.id]: 'overview' })}
                            className={cn(
                              "pb-2 text-[10px] font-bold uppercase tracking-wider transition-all border-b-2",
                              (activeTabs[job.id] || 'overview') === 'overview' 
                                ? "text-emerald-500 border-emerald-500" 
                                : "text-zinc-500 border-transparent hover:text-zinc-300"
                            )}
                          >
                            Overview
                          </button>
                          <button 
                            onClick={() => setActiveTabs({ ...activeTabs, [job.id]: 'validation' })}
                            className={cn(
                              "pb-2 text-[10px] font-bold uppercase tracking-wider transition-all border-b-2",
                              activeTabs[job.id] === 'validation' 
                                ? "text-blue-500 border-blue-500" 
                                : "text-zinc-500 border-transparent hover:text-zinc-300"
                            )}
                          >
                            ML Validation (TSTR)
                          </button>
                        </div>
                      )}

                      {/* Progress Bar (Only show if not done) */}
                      {job.status !== 'done' && (
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[10px] font-mono uppercase">
                            <span className="text-zinc-500">Progress</span>
                            <span className="text-zinc-300">{job.progress}%</span>
                          </div>
                          <div className="h-1.5 bg-zinc-950 rounded-full overflow-hidden">
                            <motion.div 
                              className={cn(
                                "h-full rounded-full",
                                job.status === 'done' ? "bg-emerald-500" : "bg-blue-500"
                              )}
                              initial={{ width: 0 }}
                              animate={{ width: `${job.progress}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Metrics - Overview Tab */}
                      {job.metrics && (activeTabs[job.id] || 'overview') === 'overview' && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-4 pt-2">
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
                            <div className="bg-zinc-950 border border-zinc-800/50 rounded-lg p-3 space-y-1">
                              <div className="flex items-center gap-1.5 text-zinc-500">
                                <Cpu size={12} />
                                <span className="text-[10px] font-mono uppercase">Speed</span>
                              </div>
                              <div className="text-lg font-bold text-blue-400">
                                {Math.round(job.metrics.trainingSpeed!)} <span className="text-[10px] text-zinc-600 font-normal">s/s</span>
                              </div>
                            </div>
                          </div>

                          {job.status === 'done' && (
                            <button 
                              onClick={() => {
                                const existing = datasets.find(d => d.jobId === job.id);
                                if (existing) {
                                  navigate('/exports');
                                } else {
                                  handleGenerateData(job.id);
                                }
                              }}
                              className={cn(
                                "w-full py-3 border rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all group",
                                datasets.find(d => d.jobId === job.id)
                                  ? "bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20"
                                  : "bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400"
                              )}
                            >
                              {datasets.find(d => d.jobId === job.id) ? (
                                <>
                                  <FileText size={14} />
                                  View Synthetic Export
                                </>
                              ) : (
                                <>
                                  <Zap size={14} className="group-hover:scale-110 transition-transform" />
                                  Generate Synthetic Data
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      )}

                      {/* ML Validation Tab */}
                      {job.status === 'done' && activeTabs[job.id] === 'validation' && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-6 animate-in fade-in duration-500"
                        >
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl space-y-2">
                              <div className="text-[10px] text-zinc-500 uppercase font-mono flex items-center gap-2">
                                <Zap size={10} className="text-blue-400" />
                                ML Utility Score (TSTR)
                              </div>
                              <div className="text-3xl font-bold text-blue-400">
                                {(job.metrics?.tstrRatio! * 100).toFixed(1)}%
                              </div>
                              <p className="text-[10px] text-zinc-600 leading-tight">
                                This captures how much model performance is retained when switching from real to synthetic training data.
                              </p>
                            </div>
                            <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl space-y-2">
                              <div className="text-[10px] text-zinc-500 uppercase font-mono flex items-center gap-2">
                                <ShieldCheck size={10} className="text-emerald-500" />
                                Fidelity Retention
                              </div>
                              <div className="text-3xl font-bold text-emerald-500">
                                {(job.metrics?.fidelityScore! * 100).toFixed(1)}%
                              </div>
                              <p className="text-[10px] text-zinc-600 leading-tight">
                                High fidelity indicates that multivariate distributions are preserved across the entire schema.
                              </p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 border-b border-zinc-800 pb-2">
                              Feature Importance Alignment
                            </h4>
                            <div className="h-[200px] w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                  data={job.metrics?.featureImportance}
                                  layout="vertical"
                                  margin={{ left: -20, right: 20 }}
                                >
                                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                                  <XAxis type="number" hide />
                                  <YAxis 
                                    dataKey="name" 
                                    type="category" 
                                    stroke="#71717a" 
                                    fontSize={10} 
                                    width={80}
                                  />
                                  <RechartsTooltip 
                                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a' }}
                                    itemStyle={{ fontSize: '10px' }}
                                  />
                                  <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                                  <Bar name="Real Data" dataKey="realImpact" fill="#3f3f46" radius={[0, 4, 4, 0]} />
                                  <Bar name="Synthetic Data" dataKey="syntheticImpact" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        </motion.div>
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
