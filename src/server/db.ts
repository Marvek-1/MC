import Database from 'better-sqlite3';
import path from 'path';

// Setup database connection
const dbPath = path.join(process.cwd(), 'mostar.sqlite');
const db = new Database(dbPath);

export function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      datasetCount INTEGER DEFAULT 0,
      lastActive TEXT,
      status TEXT
    );

    CREATE TABLE IF NOT EXISTS datasets (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      project TEXT NOT NULL,
      rows INTEGER,
      cols INTEGER,
      size TEXT,
      created TEXT
    );

    CREATE TABLE IF NOT EXISTS models (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      version TEXT,
      project TEXT,
      created TEXT,
      status TEXT,
      tstr REAL
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      dataset TEXT NOT NULL,
      actor TEXT NOT NULL,
      event TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      status TEXT
    );
  `);

  // Seed DB if it is empty
  const projectCount = db.prepare('SELECT count(*) as count FROM projects').get() as { count: number };
  if (projectCount.count === 0) {
    seedDB();
  }
}

function seedDB() {
  const insertProject = db.prepare('INSERT INTO projects (id, name, description, datasetCount, lastActive, status) VALUES (?, ?, ?, ?, ?, ?)');
  insertProject.run('KAG-ieee-cis-fraud-detection', 'Kaggle: IEEE-CIS Fraud Detection', 'Mirror of Kaggle dataset ieee-cis-fraud-detection. Content Hash: sha256_ieee...', 3, 'Just now', 'active');
  insertProject.run('1', 'Phantom POE Simulation', 'Synthetic operational data for Phantom POE engine testing.', 4, '2 hours ago', 'active');
  insertProject.run('2', 'MoStar Grid Analytics', 'Grid signal generation and spatial-aware datasets.', 12, '1 day ago', 'idle');
  insertProject.run('3', 'Afro Sentinel Flow', 'Temporal event streams for sentinel-related flows.', 7, '3 days ago', 'active');

  const insertDataset = db.prepare('INSERT INTO datasets (id, name, type, project, rows, cols, size, created) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  insertDataset.run('1', 'trap_train.csv', 'Real Source', 'MoStar Deck - Trap', 3500, 6, '250 KB', '2026-04-16T20:34:00Z');
  insertDataset.run('2', 'synthetic_trap_output.csv', 'Synthetic', 'MoStar Deck - Trap', 3500, 6, '245 KB', '2026-04-16T21:05:00Z');
  insertDataset.run('3', 'fraud_train.csv', 'Real Source', 'IEEE-CIS Fraud', 413346, 394, '105 MB', '2026-04-16T19:20:00Z');

  const insertModel = db.prepare('INSERT INTO models (id, name, type, version, project, created, status, tstr) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  insertModel.run('1', 'MoStar Sovereign Generator v1', 'TabDDPM', 'v1.4.2', 'MoStar Deck - Trap', '2026-04-16T21:05:00Z', '✅', 0.942);
  insertModel.run('2', 'Phantom Base Engine', 'CTGAN', 'v2.0.1', 'Phantom POE Simulation', '2026-04-15T10:00:00Z', '✅', 0.885);

  const insertAudit = db.prepare('INSERT INTO audit_logs (id, dataset, actor, event, timestamp, status) VALUES (?, ?, ?, ?, ?, ?)');
  insertAudit.run('LIN-001', 'synthetic_trap_output.csv', 'marvek72@gmail.com', 'Exported synthetic data to Postgres staging.', '2026-04-16T21:10:00Z', '✅');
  insertAudit.run('LIN-002', 'Model v1.4.2 [TabDDPM]', 'marvek72@gmail.com', 'Trained model on MoStar Deck - Trap source.', '2026-04-16T21:05:00Z', '✅');
  insertAudit.run('LIN-003', 'trap_train.csv', 'marvek72@gmail.com', 'Ingested raw source from secure local environment.', '2026-04-16T20:34:00Z', '✅');
}

export function getAllProjects() {
  return db.prepare('SELECT * FROM projects').all();
}

export function getAllDatasets() {
  return db.prepare('SELECT * FROM datasets ORDER BY created DESC').all();
}

export function getAllModels() {
  return db.prepare('SELECT * FROM models ORDER BY created DESC').all();
}

export function getAuditLogs() {
  return db.prepare('SELECT * FROM audit_logs ORDER BY timestamp DESC').all();
}

export function createProject(data: any) {
  const stmt = db.prepare('INSERT INTO projects (id, name, description, status, datasetCount, lastActive) VALUES (?, ?, ?, ?, ?, ?)');
  stmt.run(data.id, data.name, data.description, data.status || 'idle', data.datasetCount || 0, data.lastActive || new Date().toISOString());
  return data;
}
