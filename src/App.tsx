/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { SourceConnectPage } from './pages/SourceConnectPage';
import { cn } from './lib/utils';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<ProjectsPage />} />
          <Route path="/project/:id" element={<ProjectDetailPage />} />
          <Route path="/connect" element={<SourceConnectPage />} />
          <Route path="/datasets" element={<div className="text-zinc-500 italic">Datasets module coming soon...</div>} />
          <Route path="/models" element={<div className="text-zinc-500 italic">Models module coming soon...</div>} />
          <Route path="/scenarios" element={<div className="text-zinc-500 italic">Scenarios module coming soon...</div>} />
          <Route path="/evaluations" element={<div className="text-zinc-500 italic">Evaluations module coming soon...</div>} />
          <Route path="/exports" element={<div className="text-zinc-500 italic">Exports module coming soon...</div>} />
          <Route path="/governance" element={
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Governance & Lineage</h1>
                <p className="text-zinc-500 mt-1">Track dataset provenance, generation recipes, and privacy compliance.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Fire', glyph: '🜂', desc: 'Ignition & Jobs', color: 'text-red-500' },
                  { label: 'Water', glyph: '🜄', desc: 'Flow & Routing', color: 'text-blue-500' },
                  { label: 'Air', glyph: '🜁', desc: 'Metadata & Signals', color: 'text-zinc-100' },
                  { label: 'Earth', glyph: '🜃', desc: 'Persistence & Writes', color: 'text-emerald-500' }
                ].map((el) => (
                  <div key={el.label} className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-2">
                    <div className={cn("text-3xl", el.color)}>{el.glyph}</div>
                    <div className="font-bold text-zinc-200">{el.label}</div>
                    <div className="text-xs text-zinc-500">{el.desc}</div>
                  </div>
                ))}
              </div>
              <div className="p-12 border border-dashed border-zinc-800 rounded-2xl text-center text-zinc-600 italic">
                Governance ledger initializing...
              </div>
            </div>
          } />

        </Routes>
      </Layout>
    </Router>
  );
}

