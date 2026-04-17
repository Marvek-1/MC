import React, { useEffect, useState } from 'react';
import { Download, Search, Eye, Trash2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

export function DatasetsPage() {
  const [datasets, setDatasets] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/datasets')
      .then(res => res.json())
      .then(data => setDatasets(data))
      .catch(err => console.error('Failed to load datasets', err));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Datasets</h1>

        <p className="text-zinc-500 mt-1">Browse, preview, and manage ingested sources and synthetic outputs.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search datasets..." 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-1.5 pl-9 pr-4 text-sm text-zinc-300 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
        </div>
        
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-950/50 border-b border-zinc-800">
            <tr>
              <th className="p-4 font-medium text-zinc-400">Name</th>
              <th className="p-4 font-medium text-zinc-400">Type</th>
              <th className="p-4 font-medium text-zinc-400">Project</th>
              <th className="p-4 font-medium text-zinc-400">Rows / Cols</th>
              <th className="p-4 font-medium text-zinc-400">Size</th>
              <th className="p-4 font-medium text-zinc-400">Created</th>
              <th className="p-4 font-medium text-zinc-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {datasets.map((ds) => (
              <tr key={ds.id} className="hover:bg-zinc-800/30 transition-colors">
                <td className="p-4 font-medium text-zinc-200">{ds.name}</td>
                <td className="p-4">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                    ds.type === 'Synthetic' ? "bg-emerald-500/10 text-emerald-400" : "bg-blue-500/10 text-blue-400"
                  )}>
                    {ds.type}
                  </span>
                </td>
                <td className="p-4 text-zinc-400">{ds.project}</td>
                <td className="p-4 text-zinc-400 font-mono text-xs">{ds.rows.toLocaleString()} / {ds.cols}</td>
                <td className="p-4 text-zinc-400">{ds.size}</td>
                <td className="p-4 text-zinc-500 text-xs">
                  {new Date(ds.created).toLocaleString()}
                </td>
                <td className="p-4 flex items-center gap-2">
                  <button className="p-1.5 hover:bg-zinc-800 rounded text-zinc-400 hover:text-emerald-400 transition-colors" title="Preview">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 hover:bg-zinc-800 rounded text-zinc-400 hover:text-blue-400 transition-colors" title="Download">
                    <Download className="w-4 h-4" />
                  </button>
                  {ds.type === 'Synthetic' && (
                    <button className="p-1.5 hover:bg-zinc-800 rounded text-zinc-400 hover:text-red-400 transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
