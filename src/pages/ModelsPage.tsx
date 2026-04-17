import React, { useEffect, useState } from 'react';
import { Box, Play, FileJson, Link as LinkIcon, BarChart } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockTstrHistory = [
  { version: 'v1.0', tstr: 0.81 },
  { version: 'v1.1', tstr: 0.84 },
  { version: 'v1.2', tstr: 0.88 },
  { version: 'v1.3', tstr: 0.92 },
  { version: 'v1.4', tstr: 0.942 },
];

export function ModelsPage() {
  const [models, setModels] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/models')
      .then(res => res.json())
      .then(data => setModels(data))
      .catch(err => console.error('Failed to load models', err));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Models</h1>

        <p className="text-zinc-500 mt-1">Manage trained generative engines, monitor performance history, and deploy synthesis scenarios.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {models.map((model) => (
          <div key={model.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col group hover:border-emerald-500/50 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-400">
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-100 text-lg group-hover:text-emerald-400 transition-colors">{model.name}</h3>
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                    <span className="px-1.5 py-0.5 bg-zinc-800 rounded">{model.type}</span>
                    <span>{model.version}</span>
                  </div>
                </div>
              </div>
              <div className="text-xl" title="Status">{model.status}</div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">TSTR Score</span>
                <span className="text-zinc-100 font-bold">{model.tstr}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Trained On</span>
                <span className="text-blue-400 truncate max-w-[200px]">{model.project}</span>
              </div>
              <div className="flex justify-between text-sm items-center">
                <span className="text-zinc-500">MLflow Registry</span>
                <a href="#" className="flex items-center gap-1 text-emerald-400 hover:underline">View Run <LinkIcon className="w-3 h-3" /></a>
              </div>
            </div>

            <div className="mt-auto flex gap-3 pt-4 border-t border-zinc-800">
              <button className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
                Deploy for Synthesis <Play className="w-4 h-4" />
              </button>
              <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm font-medium transition-colors">
                Archive
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <BarChart className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="font-semibold text-lg text-zinc-100">Performance Evolution</h3>
            <p className="text-sm text-zinc-500">TSTR Ratio over fine-tuning iterations (Active Model: v1.4.2)</p>
          </div>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockTstrHistory} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="version" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} domain={[0.7, 1.0]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                itemStyle={{ fontSize: '12px' }}
              />
              <Line type="monotone" dataKey="tstr" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
