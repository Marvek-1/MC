import React, { useEffect, useState } from 'react';
import { cn } from '@/src/lib/utils';
import { FileJson, Eye, ScrollText, Users, Link as LinkIcon, Download, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export function GovernancePage() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/governance/audit')
      .then(res => res.json())
      .then(data => setLogs(data))
      .catch(err => console.error('Failed to load audit logs', err));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Governance & Lineage</h1>
        <p className="text-zinc-500 mt-1">Track dataset provenance, generation recipes, and privacy compliance logs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Fire', glyph: '🜂', desc: 'Ignition & Jobs', color: 'text-red-500' },
          { label: 'Water', glyph: '🜄', desc: 'Flow & Routing', color: 'text-blue-500' },
          { label: 'Air', glyph: '🜁', desc: 'Metadata & Signals', color: 'text-zinc-100' },
          { label: 'Earth', glyph: '🜃', desc: 'Persistence & Writes', color: 'text-emerald-500' }
        ].map((el) => (
          <div key={el.label} className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-2 relative overflow-hidden">
            <div className={cn("text-5xl opacity-10 absolute right-4 top-4", el.color)}>{el.glyph}</div>
            <div className={cn("text-3xl", el.color)}>{el.glyph}</div>
            <div className="font-bold text-zinc-200">{el.label}</div>
            <div className="text-xs text-zinc-500 relative z-10">{el.desc}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 text-zinc-400">
            <ScrollText size={18} />
            <h2 className="text-sm font-bold uppercase tracking-wider">Provenance Ledger</h2>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-950/50 border-b border-zinc-800">
                <tr>
                  <th className="p-4 font-medium text-zinc-400">Ledger ID</th>
                  <th className="p-4 font-medium text-zinc-400">Entity</th>
                  <th className="p-4 font-medium text-zinc-400">Event</th>
                  <th className="p-4 font-medium text-zinc-400">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="p-4 font-mono text-xs text-zinc-500">{log.id}</td>
                    <td className="p-4 text-emerald-400 font-medium">{log.dataset}</td>
                    <td className="p-4 text-zinc-300">
                      <div className="max-w-xs truncate">{log.event}</div>
                      <div className="text-xs text-zinc-500 flex items-center gap-1 mt-1">
                        <Users className="w-3 h-3" /> {log.actor}
                      </div>
                    </td>
                    <td className="p-4 text-zinc-500 text-xs">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2 text-zinc-400">
            <FileJson size={18} />
            <h2 className="text-sm font-bold uppercase tracking-wider">Compliance Artifacts</h2>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
            <p className="text-sm text-zinc-400 leading-relaxed mb-6">
              Download PDF certificates of epsilon budget enforcement, synthetic ranking agreement, and full generator provenance paths.
            </p>
            <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-3 rounded-lg flex items-center justify-between transition-colors">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="font-semibold text-sm">NDPR / POPIA Compliance</span>
              </div>
              <Download className="w-4 h-4 text-zinc-400" />
            </button>
            <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-3 rounded-lg flex items-center justify-between transition-colors">
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-sm">Full Lineage Graph JSON</span>
              </div>
              <Download className="w-4 h-4 text-zinc-400" />
            </button>
            <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-3 rounded-lg flex items-center justify-between transition-colors">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-red-500" />
                <span className="font-semibold text-sm">MIA Threshold Attestation</span>
              </div>
              <Download className="w-4 h-4 text-zinc-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
