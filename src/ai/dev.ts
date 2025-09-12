import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-dataset-insights.ts';
import '@/ai/flows/categorize-pollution-risk.ts';
import '@/ai/flows/calculate-indices.ts';
import '@/ai/flows/generate-report.ts';
