/**
 * rotate-data.mjs
 * Copies data/current/ks_stats.yaml → data/last/ks_stats.yaml
 * before running the scraper, preserving a one-step history.
 */
import { copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const src = resolve(root, 'data/current/ks_stats.yaml');
const dst = resolve(root, 'data/last/ks_stats.yaml');

if (!existsSync(src)) {
  console.error('[rotate-data] data/current/ks_stats.yaml not found — skipping rotation.');
  process.exit(0);
}

mkdirSync(resolve(root, 'data/last'), { recursive: true });
copyFileSync(src, dst);
console.log('[rotate-data] Rotated: current → last');
