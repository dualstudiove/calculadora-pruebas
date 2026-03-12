import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { labExams as initialLabExams, labProfiles as initialLabProfiles } from "./src/data.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, "database.json");

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // Initialize DB if it doesn't exist
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({
      labExams: initialLabExams,
      labProfiles: initialLabProfiles,
      lastUpdated: "22/12/2025"
    }, null, 2));
  }

  // API Routes
  app.get("/api/data", (req, res) => {
    try {
      const data = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: "Failed to read database" });
    }
  });

  app.post("/api/data", (req, res) => {
    try {
      const { labExams, labProfiles, lastUpdated } = req.body;
      fs.writeFileSync(DB_FILE, JSON.stringify({ labExams, labProfiles, lastUpdated }, null, 2));
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Failed to write database" });
    }
  });

  app.get("/api/bcv-rate", async (req, res) => {
    try {
      const response = await fetch("https://ve.dolarapi.com/v1/dolares/oficial");
      if (!response.ok) {
        throw new Error("Failed to fetch BCV rate");
      }
      const data = await response.json();
      res.json({ rate: data.promedio });
    } catch (e) {
      console.error("Error fetching BCV rate:", e);
      res.status(500).json({ error: "Failed to fetch BCV rate" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
