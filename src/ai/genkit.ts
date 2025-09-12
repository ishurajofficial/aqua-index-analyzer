import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const GEMINI_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
export const aiEnabled = Boolean(GEMINI_KEY);

export const ai = genkit({
  plugins: aiEnabled ? [googleAI({ apiKey: GEMINI_KEY })] : [],
  model: aiEnabled ? 'googleai/gemini-2.5-flash' : undefined,
});
