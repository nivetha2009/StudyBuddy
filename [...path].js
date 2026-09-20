/**
 * Vercel serverless entry point.
 *
 * Vercel maps every request under /api/* to this catch-all file and preserves
 * the original URL, so the Express app keeps its existing /api/... mounts.
 * There is no app.listen() here: Vercel invokes the exported handler, and an
 * Express app is itself a (req, res) handler.
 *
 * Local development does NOT use this file. `npm run dev` starts the real
 * server from server/src/index.js and Vite proxies /api to it.
 */
import { createApp } from '../server/src/app.js';

const app = createApp();

export default app;
