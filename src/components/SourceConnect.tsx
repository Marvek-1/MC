import React, { useState } from 'react';
import { 
  Database, 
  Cloud, 
  FileText, 
  Globe, 
  Link as LinkIcon, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  Shield,
  Search,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { kaggleService, KaggleDatasetMeta } from '../services/kaggleService';

const connectors = [
  { id: 'kaggle', name: 'Kaggle Dataset', icon: Search, color: 'text-blue-400', description: 'Real-world datasets for benchmarking' },
  { id: 'firebase', name: 'Firebase / Firestore', icon: Cloud, color: 'text-orange-500', description: 'NoSQL document store' },
  { id: 'postgres', name: 'Postgres / Neon', icon: Database, color: 'text-blue-500', description: 'Relational SQL database' },
  { id: 'file', name: 'File Upload', icon: FileText, color: 'text-zinc-400', description: 'CSV, JSON, Parquet' },
  { id: 'api', name: 'REST API', icon: LinkIcon, color: 'text-purple-500', description: 'External endpoints' },
];

function Zap(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

export function SourceConnect() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
  const [step, setStep] = useState<'select' | 'configure' | 'introspect' | 'project'>('select');

  const [connectionString, setConnectionString] = useState('');
  const [kaggleUrl, setKaggleUrl] = useState('');
  const [kaggleMeta, setKaggleMeta] = useState<KaggleDatasetMeta | null>(null);
  const [isIntrospecting, setIsIntrospecting] = useState(false);
  
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectErrors, setProjectErrors] = useState<{ name?: string; description?: string }>({});
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ connectionString?: string; username?: string; password?: string }>({});

  const handleTestAndIntrospect = () => {
    if (selected === 'kaggle') {
      handleKaggleIntrospect();
      return;
    }

    const newErrors: { connectionString?: string; username?: string; password?: string } = {};
    
    if (!connectionString.trim()) {
      newErrors.connectionString = 'Connection string is required';
    } else if (!connectionString.includes('://') && selected !== 'api' && selected !== 'file') {
      newErrors.connectionString = 'Must be a valid connection string (e.g., postgres://...)';
    }

    if (!username.trim() && selected !== 'file') {
      newErrors.username = 'Username is required';
    }

    if (!password.trim() && selected !== 'file') {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStep('introspect');
  };

  const handleKaggleIntrospect = async () => {
    if (!kaggleUrl.includes('kaggle.com/datasets/')) {
      setErrors({ connectionString: 'Please enter a valid Kaggle Dataset URL' });
      return;
    }

    setIsIntrospecting(true);
    setErrors({});

    try {
      const meta = await kaggleService.introspect(kaggleUrl);
      setKaggleMeta(meta);
      setProjectName(`Kaggle: ${meta.slug.split('/')[1]}`);
      setProjectDescription(`Mirror of Kaggle dataset ${meta.slug}. Content Hash: ${meta.contentHash}`);
      setStep('introspect');
    } catch (err: any) {
      setErrors({ connectionString: err.message });
    } finally {
      setIsIntrospecting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-zinc-100">Connect Data Source</h2>
        <p className="text-zinc-500">Select a source to introspect schema and begin generation.</p>
      </div>

      {step === 'select' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => {
                setSelected(connector.id);
                setStep('configure');
              }}
              className={cn(
                "flex items-center gap-4 p-4 rounded-xl border transition-all text-left group",
                selected === connector.id 
                  ? "bg-emerald-500/10 border-emerald-500/50" 
                  : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
              )}
            >
              <div className={cn("p-3 rounded-lg bg-zinc-950 group-hover:scale-110 transition-transform", connector.color)}>
                <connector.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-zinc-100">{connector.name}</h3>
                <p className="text-xs text-zinc-500">{connector.description}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-400" />
            </button>
          ))}
        </div>
      )}

      {step === 'configure' && selected && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-6"
        >
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => setStep('select')}
              className="text-zinc-500 hover:text-zinc-100 text-sm"
            >
              ← Back
            </button>
            <h3 className="text-lg font-semibold">Configure {connectors.find(c => c.id === selected)?.name}</h3>
          </div>

          <div className="space-y-4">
            {selected === 'kaggle' ? (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Kaggle Dataset URL</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input 
                    type="text" 
                    value={kaggleUrl}
                    onChange={(e) => setKaggleUrl(e.target.value)}
                    placeholder="https://www.kaggle.com/datasets/username/dataset-name"
                    className={cn(
                      "w-full bg-zinc-950 border rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50",
                      errors.connectionString ? "border-red-500" : "border-zinc-800"
                    )}
                  />
                </div>
                {errors.connectionString && <p className="text-xs text-red-500 mt-1">{errors.connectionString}</p>}
                <p className="text-[10px] text-zinc-500 mt-2 flex items-center gap-1">
                  <Shield size={10} />
                  Authenticated via KAGGLE_API_TOKEN environment variable.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Connection String / URL</label>
                  <input 
                    type="text" 
                    value={connectionString}
                    onChange={(e) => setConnectionString(e.target.value)}
                    placeholder="e.g. postgres://user:pass@host:port/db"
                    className={cn(
                      "w-full bg-zinc-950 border rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-emerald-500/50",
                      errors.connectionString ? "border-red-500" : "border-zinc-800"
                    )}
                  />
                  {errors.connectionString && <p className="text-xs text-red-500 mt-1">{errors.connectionString}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Username</label>
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={cn(
                        "w-full bg-zinc-950 border rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-emerald-500/50",
                        errors.username ? "border-red-500" : "border-zinc-800"
                      )}
                    />
                    {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Password</label>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={cn(
                        "w-full bg-zinc-950 border rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-emerald-500/50",
                        errors.password ? "border-red-500" : "border-zinc-800"
                      )}
                    />
                    {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="pt-6 border-t border-zinc-800 flex justify-end gap-3">
            <button 
              onClick={() => setStep('select')}
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100"
            >
              Cancel
            </button>
            <button 
              onClick={handleTestAndIntrospect}
              disabled={isIntrospecting}
              className={cn(
                "bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-6 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2",
                isIntrospecting && "opacity-50 cursor-not-allowed",
                selected === 'kaggle' && "bg-blue-500 hover:bg-blue-400"
              )}
            >
              {isIntrospecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Introspecting...
                </>
              ) : (
                'Test & Introspect'
              )}
            </button>
          </div>
        </motion.div>
      )}

      {step === 'introspect' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className={cn(
            "border rounded-xl p-4 flex items-center gap-3",
            selected === 'kaggle' ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
          )}>
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-medium">
              {selected === 'kaggle' ? `Fetched Kaggle Metadata for ${kaggleMeta?.slug}` : 'Connection successful. Introspecting schema...'}
            </span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="p-4 bg-zinc-800/50 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="font-semibold text-sm">
                {selected === 'kaggle' ? `Available Files (${kaggleMeta?.files.length})` : 'Detected Entities (4)'}
              </h3>
              <span className="text-[10px] bg-zinc-700 text-zinc-300 px-2 py-0.5 rounded uppercase font-bold">
                {selected === 'kaggle' ? 'Kaggle Cache' : 'Postgres'}
              </span>
            </div>
            <div className="divide-y divide-zinc-800">
              {selected === 'kaggle' ? (
                kaggleMeta?.files.map((file) => (
                  <div key={file.name} className="p-4 flex items-center justify-between hover:bg-zinc-800/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-zinc-950 rounded flex items-center justify-center text-blue-500">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-zinc-100">{file.name}</div>
                        <div className="text-[10px] text-zinc-500">{file.size} • {file.rows.toLocaleString()} records</div>
                      </div>
                    </div>
                    {file.name === kaggleMeta.suggestedFile && (
                      <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30 font-bold uppercase">
                        Primary Source
                      </span>
                    )}
                  </div>
                ))
              ) : (
                ['users', 'transactions', 'signals', 'alerts'].map((entity) => (
                  <div key={entity} className="p-4 flex items-center justify-between hover:bg-zinc-800/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-zinc-950 rounded flex items-center justify-center text-zinc-500">
                        <Database className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-zinc-100">{entity}</div>
                        <div className="text-[10px] text-zinc-500">12 fields • 4.2k records</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-3 h-3 text-amber-500" />
                      <span className="text-[10px] text-amber-500 font-medium uppercase">PII Detected</span>
                      <ChevronRight className="w-4 h-4 text-zinc-700 ml-2" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {selected === 'kaggle' && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-start gap-4">
              <div className="p-3 bg-zinc-950 rounded-lg text-blue-400">
                <ExternalLink className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">Content Fingerprint Verification</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  The dataset's content hash <code className="text-blue-400 text-[10px]">{kaggleMeta?.contentHash}</code> has been mapped for reproducibility. 
                  Benchmark Mode will utilize this for utility score calibration.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button 
              onClick={() => setStep('project')}
              className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-8 py-3 rounded-lg font-bold transition-colors"
            >
              Continue to Project Details
            </button>
          </div>
        </motion.div>
      )}

      {step === 'project' && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-6"
        >
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => setStep('introspect')}
              className="text-zinc-500 hover:text-zinc-100 text-sm"
            >
              ← Back
            </button>
            <h3 className="text-lg font-semibold">Project Details</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Project Name</label>
              <input 
                type="text" 
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. Customer Analytics"
                className={cn(
                  "w-full bg-zinc-950 border rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-emerald-500/50",
                  projectErrors.name ? "border-red-500" : "border-zinc-800"
                )}
              />
              {projectErrors.name && <p className="text-xs text-red-500 mt-1">{projectErrors.name}</p>}
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Description</label>
              <textarea 
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Briefly describe what this project is for..."
                rows={4}
                className={cn(
                  "w-full bg-zinc-950 border rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-emerald-500/50 resize-none",
                  projectErrors.description ? "border-red-500" : "border-zinc-800"
                )}
              />
              {projectErrors.description && <p className="text-xs text-red-500 mt-1">{projectErrors.description}</p>}
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-800 flex justify-end gap-3">
            <button 
              onClick={() => {
                const newErrors: { name?: string; description?: string } = {};
                if (!projectName.trim()) newErrors.name = 'Project name is required';
                if (!projectDescription.trim()) newErrors.description = 'Project description is required';
                
                if (Object.keys(newErrors).length > 0) {
                  setProjectErrors(newErrors);
                  return;
                }
                
                setProjectErrors({});
                if (selected === 'kaggle') {
                  navigate(`/project/KAG-${kaggleMeta?.slug.split('/')[1]}`);
                } else {
                  alert('Project created successfully!');
                }
              }}
              className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-6 py-2 rounded-lg font-semibold text-sm transition-colors"
            >
              Create Project
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
