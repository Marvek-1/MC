import React from 'react';
import { SourceConnect } from '../components/SourceConnect';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function SourceConnectPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/')}
          className="p-2 hover:bg-zinc-900 rounded-lg text-zinc-500 hover:text-zinc-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">New Conduit</h1>
          <p className="text-zinc-500 text-sm">Establish a connection to your data source.</p>
        </div>
      </div>

      <SourceConnect />
    </div>
  );
}
