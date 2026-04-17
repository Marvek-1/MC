/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { DatasetPage } from './pages/DatasetPage';
import { SourceConnectPage } from './pages/SourceConnectPage';
import { TrainingPage } from './pages/TrainingPage';
import { ExportsPage } from './pages/ExportsPage';
import { DatasetsPage } from './pages/DatasetsPage';
import { ScenariosPage } from './pages/ScenariosPage';
import { ModelsPage } from './pages/ModelsPage';
import { EvaluationsPage } from './pages/EvaluationsPage';
import { GovernancePage } from './pages/GovernancePage';
import { cn } from './lib/utils';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<ProjectsPage />} />
          <Route path="/project/:id" element={<ProjectDetailPage />} />
          <Route path="/dataset/:id" element={<DatasetPage />} />
          <Route path="/connect" element={<SourceConnectPage />} />
          <Route path="/training" element={<TrainingPage />} />
          <Route path="/datasets" element={<DatasetsPage />} />
          <Route path="/models" element={<ModelsPage />} />
          <Route path="/scenarios" element={<ScenariosPage />} />
          <Route path="/evaluations" element={<EvaluationsPage />} />
          <Route path="/exports" element={<ExportsPage />} />
          <Route path="/governance" element={<GovernancePage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

