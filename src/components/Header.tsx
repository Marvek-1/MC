import React from 'react';
import { Search, Bell, User } from 'lucide-react';

export function Header() {
  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search conduits, datasets, or jobs..." 
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 pl-10 pr-4 text-sm text-zinc-300 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400">
          <User className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
}
