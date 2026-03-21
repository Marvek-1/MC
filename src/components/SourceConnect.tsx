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
  Shield
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

const connectors = [
  { id: 'firebase', name: 'Firebase / Firestore', icon: Cloud, color: 'text-orange-500', description: 'NoSQL document store' },
  { id: 'postgres', name: 'Postgres / Neon', icon: Database, color: 'text-blue-500', description: 'Relational SQL database' },
  { id: 'supabase', name: 'Supabase', icon: Zap, color: 'text-emerald-500', description: 'Open source Firebase alternative' },
  { id: 'neo4j', name: 'Neo4j', icon: Globe, color: 'text-blue-400', description: 'Graph database' },
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
  const [selected, setSelected] = useState<string | null>(null);
  const [step, setStep] = useState<'select' | 'configure' | 'introspect'>('select');

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
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Connection String / URL</label>
              <input 
                type="text" 
                placeholder="e.g. postgres://user:pass@host:port/db"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Username</label>
                <input type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2.5 px-4 text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Password</label>
                <input type="password" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2.5 px-4 text-sm" />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-800 flex justify-end gap-3">
            <button 
              onClick={() => setStep('select')}
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100"
            >
              Cancel
            </button>
            <button 
              onClick={() => setStep('introspect')}
              className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-6 py-2 rounded-lg font-semibold text-sm transition-colors"
            >
              Test & Introspect
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
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-medium">Connection successful. Introspecting schema...</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="p-4 bg-zinc-800/50 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="font-semibold text-sm">Detected Entities (4)</h3>
              <span className="text-[10px] bg-zinc-700 text-zinc-300 px-2 py-0.5 rounded uppercase font-bold">Postgres</span>
            </div>
            <div className="divide-y divide-zinc-800">
              {['users', 'transactions', 'signals', 'alerts'].map((entity) => (
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
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-8 py-3 rounded-lg font-bold transition-colors">
              Continue to Schema Studio
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
