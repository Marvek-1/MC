import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Database, 
  FileJson, 
  Zap, 
  ShieldCheck, 
  Share2, 
  Settings,
  Activity,
  Box
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const navItems = [
  { name: 'Projects', icon: Box, path: '/' },
  { name: 'Datasets', icon: Database, path: '/datasets' },
  { name: 'Training', icon: Zap, path: '/training' },
  { name: 'Models', icon: Box, path: '/models' },
  { name: 'Scenarios', icon: Activity, path: '/scenarios' },
  { name: 'Evaluations', icon: ShieldCheck, path: '/evaluations' },
  { name: 'Exports', icon: Share2, path: '/exports' },
  { name: 'Governance', icon: FileJson, path: '/governance' },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center overflow-hidden">
          <img 
            src="/mnt/data/mstar.png" 
            alt="MoStar" 
            className="w-8 h-8 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/mostar/64/64';
            }}
          />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-zinc-100 tracking-tight text-sm">MOSTAR</span>
          <span className="text-[10px] text-emerald-500 font-bold tracking-[0.2em] uppercase">Conduit</span>
        </div>
      </div>

      <div className="px-6 py-2 flex items-center gap-2 text-zinc-600 text-xs font-mono">
        <span title="Fire">🜂</span>
        <span title="Water">🜄</span>
        <span title="Air">🜁</span>
        <span title="Earth">🜃</span>
        <span className="ml-2 text-[10px] opacity-50 uppercase tracking-widest">Awakened</span>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              isActive 
                ? "bg-emerald-500/10 text-emerald-400" 
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-500">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sigil: DCX001</span>
        </div>
      </div>
    </aside>
  );
}
