import React from 'react';
import { Plus, Database, ArrowRight, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/src/lib/utils';

const mockProjects = [
  {
    id: '1',
    name: 'Phantom POE Simulation',
    description: 'Synthetic operational data for Phantom POE engine testing.',
    datasetCount: 4,
    lastActive: '2 hours ago',
    status: 'active'
  },
  {
    id: '2',
    name: 'MoStar Grid Analytics',
    description: 'Grid signal generation and spatial-aware datasets.',
    datasetCount: 12,
    lastActive: '1 day ago',
    status: 'idle'
  },
  {
    id: '3',
    name: 'Afro Sentinel Flow',
    description: 'Temporal event streams for sentinel-related flows.',
    datasetCount: 7,
    lastActive: '3 days ago',
    status: 'active'
  }
];

export function ProjectsPage() {
  const navigate = useNavigate();
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Projects</h1>
          <p className="text-zinc-500 mt-1">Manage your data conduits and generation recipes.</p>
        </div>
        <button 
          onClick={() => navigate('/connect')}
          className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-emerald-500/50 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-zinc-800 rounded-lg group-hover:bg-emerald-500/10 transition-colors">
                <Database className="w-6 h-6 text-zinc-400 group-hover:text-emerald-400" />
              </div>
              <div className={cn(
                "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                project.status === 'active' ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-800 text-zinc-500"
              )}>
                {project.status}
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-emerald-400 transition-colors">
              {project.name}
            </h3>
            <p className="text-sm text-zinc-500 mt-2 line-clamp-2">
              {project.description}
            </p>
            
            <div className="mt-6 pt-6 border-t border-zinc-800 flex items-center justify-between text-sm">
              <div className="flex items-center gap-4 text-zinc-400">
                <div className="flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  <span>{project.datasetCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{project.lastActive}</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 p-8 border border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-500">
          <Plus className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-zinc-300">Start a new conduit</h3>
          <p className="text-sm text-zinc-500 max-w-xs mx-auto">
            Connect to a source, introspect schema, and begin generating high-fidelity synthetic data.
          </p>
        </div>
        <button className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors">
          View documentation →
        </button>
      </div>
    </div>
  );
}
