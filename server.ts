import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Serve manifest.json directly from the root if requested
  app.get("/manifest.json", (req, res) => {
    const manifestPath = path.join(process.cwd(), "manifest.json");
    if (fs.existsSync(manifestPath)) {
      res.setHeader("Content-Type", "application/json");
      res.sendFile(manifestPath);
    } else {
      res.status(404).send("Manifest not found");
    }
  });

  // Serve android instructions
  app.get("/android-apk-instructions.txt", (req, res) => {
    const instructionsPath = path.join(process.cwd(), "android-apk-instructions.txt");
    if (fs.existsSync(instructionsPath)) {
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.sendFile(instructionsPath);
    } else {
      res.status(404).send("Not found");
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
    // Production static files serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
