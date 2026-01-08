import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
dotenv.config();
if (!process.env.MONGODB_URI) {
  const p = path.resolve(process.cwd(), '../.env');
  if (fs.existsSync(p)) {
    dotenv.config({ path: p });
  }
}
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import { ensureSeedData } from './utils/seed.js';
import authRouter from './routes/auth.js';
import issuesRouter from './routes/issues.js';
import techniciansRouter from './routes/technicians.js';
import teamRouter from './routes/team.js';
import maintenanceRouter from './routes/maintenance.js';

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGODB_URI || '';

app.use(cors({ origin: '*', credentials: false }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/issues', issuesRouter);
app.use('/api/technicians', techniciansRouter);
app.use('/api/team', teamRouter);
app.use('/api/maintenance', maintenanceRouter);

async function start() {
  if (!MONGO_URI) {
    console.error('Missing MONGODB_URI environment variable');
    process.exit(1);
  }
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    await ensureSeedData();
    const attemptListen = (port) =>
      new Promise((resolve, reject) => {
        const srv = app.listen(port, () => resolve(srv));
        srv.on('error', reject);
      });
    let port = Number(PORT);
    let server;
    for (let i = 0; i < 10; i++) {
      try {
        server = await attemptListen(port);
        console.log(`CivicFix server listening on http://localhost:${port}`);
        break;
      } catch (err) {
        if (err && err.code === 'EADDRINUSE') {
          port += 1;
          continue;
        }
        throw err;
      }
    }
    if (!server) {
      throw new Error('Unable to bind to any port');
    }
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
