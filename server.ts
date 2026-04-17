import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";
import { initDB, getAllProjects, createProject, getAllDatasets, getAllModels, getAuditLogs } from './src/server/db';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Local SQLite Persistence
  initDB();

  // SOVEREIGN CONDUIT: DB ENDPOINTS
  app.get("/api/projects", (req, res) => {
    try {
      res.json(getAllProjects());
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/projects", (req, res) => {
    try {
      res.json(createProject(req.body));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/datasets", (req, res) => {
    res.json(getAllDatasets());
  });

  app.get("/api/models", (req, res) => {
    res.json(getAllModels());
  });

  app.get("/api/governance/audit", (req, res) => {
    res.json(getAuditLogs());
  });

  // KAGGLE API ENDPOINTS
  app.post("/api/kaggle/introspect", async (req, res) => {
    const { url } = req.body;
    
    // Safety check for credentials
    const hasCreds = !!process.env.KAGGLE_API_TOKEN || (!!process.env.KAGGLE_USERNAME && !!process.env.KAGGLE_KEY);
    
    if (!hasCreds) {
      return res.status(401).json({ 
        error: "Kaggle API credentials not configured in system environment." 
      });
    }

    try {
      // Mocking the 'kagglehub' or 'kaggle' API call
      // In a real prod environment, we would use child_process to call kaggle CLI 
      // or a dedicated node-kaggle library if available.
      
      const slugMatch = url.match(/kaggle\.com\/datasets\/([^/]+\/[^/]+)/);
      if (!slugMatch) {
        return res.status(400).json({ error: "Invalid Kaggle Dataset URL format." });
      }

      const slug = slugMatch[1];
      console.log(`Introspecting Kaggle Dataset: ${slug}`);

      // Simulate a lightweight schema fingerprint extraction
      await new Promise(resolve => setTimeout(resolve, 1200));

      res.json({
        slug,
        files: [
          { name: "train.csv", size: "1.2 GB", rows: 590540 },
          { name: "test.csv", size: "450 MB", rows: 120000 },
          { name: "sample_submission.csv", size: "2 MB", rows: 120000 }
        ],
        suggestedFile: "train.csv",
        schema: [
          { name: "TransactionID", type: "int" },
          { name: "isFraud", type: "int" },
          { name: "TransactionDT", type: "timestamp" },
          { name: "TransactionAmt", type: "float" },
          { name: "ProductCD", type: "string" },
          { name: "card1", type: "int" },
          { name: "P_emaildomain", type: "string" }
        ],
        contentHash: `sha256_${slug.replace('/', '_')}_${Date.now()}`
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to connect to Kaggle conduit." });
    }
  });

  app.post("/api/kaggle/download", (req, res) => {
    const { slug, fileName } = req.body;
    console.log(`Initiating cached download for ${slug}/${fileName}`);
    
    // Simulate background download/cache logic
    res.json({ status: "queued", jobId: "KAG-" + Math.random().toString(36).substring(7).toUpperCase() });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
