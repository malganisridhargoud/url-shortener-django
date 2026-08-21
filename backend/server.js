import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
// Resolve .env beside this server file, even when started from the project root.
dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '.env') });
import app from './app.js';
import { connectDatabase } from './config/db.js';

const port = process.env.PORT || 5000;
connectDatabase().then(() => app.listen(port, () => console.log(`API listening on port ${port}`))).catch((error) => { console.error('Database connection failed:', error.message); process.exit(1); });
