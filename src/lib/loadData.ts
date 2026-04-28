import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import yaml from 'js-yaml';

export interface KsMetadata {
  generated_at: string;
  country_code: string;
  category: string;
  project_state: string;
}

export interface KsSummary {
  total_records: number;
  scoped_records: number;
  top_n: number;
}

export interface ProjectEntry {
  name: string;
  creator: string;
  country: string;
  location: string;
  currency: string;
  pledged_original: number;
  usd: number;
  url: string;
  project_image_url: string;
}

export interface CreatorEntry {
  creator: string;
  projects: number;
  usd_total: number;
  mxn_total: number;
  creator_url: string;
  creator_photo_url: string;
}

export interface KsData {
  metadata: KsMetadata;
  summary: KsSummary;
  fx: { base: string; rates: Record<string, number> };
  rankings: {
    top_projects: ProjectEntry[];
    top_creators: CreatorEntry[];
  };
}

function loadYaml(relativePath: string): KsData {
  const filePath = resolve(process.cwd(), relativePath);
  const content = readFileSync(filePath, 'utf-8');
  return yaml.load(content) as KsData;
}

export function loadCurrentData(): KsData {
  return loadYaml('data/current/ks_stats.yaml');
}

export function loadLastData(): KsData {
  return loadYaml('data/last/ks_stats.yaml');
}
