// src/ai/flows/categorize-pollution-risk.ts
'use server';

/**
 * @fileOverview Categorizes the pollution risk (Safe, Moderate, High Risk) for a batch of data based on computed indices and WHO/BIS permissible limits.
 *
 * - categorizePollutionRisk - A function that categorizes pollution risk for multiple assessments.
 * - CategorizePollutionRiskInput - The input type for the categorizePollutionRisk function.
 * - CategorizePollutionRiskOutput - The return type for the categorizePollutionRisk function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssessmentSchema = z.object({
  id: z.number().describe('Unique identifier for the data point.'),
  hpi: z.number().describe('Heavy Metal Pollution Index (HPI) value.'),
  hei: z.number().describe('Heavy Metal Evaluation Index (HEI) value.'),
  cf: z.number().describe('Contamination Factor (CF) value.'),
  pli: z.number().describe('Pollution Load Index (PLI) value.'),
});

const CategorizePollutionRiskInputSchema = z.object({
  assessments: z.array(AssessmentSchema).describe('An array of pollution assessments to be categorized.'),
  whoPermissibleLimits: z.object({
    hpi: z.number().describe('WHO permissible limit for HPI.'),
    hei: z.number().describe('WHO permissible limit for HEI.'),
    cf: z.number().describe('WHO permissible limit for CF.'),
    pli: z.number().describe('WHO permissible limit for PLI.'),
  }).describe('WHO permissible limits for each index.'),
  bisPermissibleLimits: z.object({
    hpi: z.number().describe('BIS permissible limit for HPI.'),
    hei: z.number().describe('BIS permissible limit for HEI.'),
    cf: z.number().describe('BIS permissible limit for CF.'),
    pli: z.number().describe('BIS permissible limit for PLI.'),
  }).describe('BIS permissible limits for each index.'),
  useWhoLimits: z.boolean().describe('If true, use WHO permissible limits; otherwise, use BIS limits.'),
});

export type CategorizePollutionRiskInput = z.infer<typeof CategorizePollutionRiskInputSchema>;

const RiskResultSchema = z.object({
    id: z.number().describe('The unique identifier for the data point.'),
    riskLevel: z.enum(['Safe', 'Moderate', 'High Risk']).describe('The categorized risk level.'),
});

const CategorizePollutionRiskOutputSchema = z.object({
    results: z.array(RiskResultSchema).describe('An array of categorized risk levels for each assessment.'),
});

export type CategorizePollutionRiskOutput = z.infer<typeof CategorizePollutionRiskOutputSchema>;

export async function categorizePollutionRisk(input: CategorizePollutionRiskInput): Promise<CategorizePollutionRiskOutput> {
  return categorizePollutionRiskFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizePollutionRiskPrompt',
  input: {schema: CategorizePollutionRiskInputSchema},
  output: {schema: CategorizePollutionRiskOutputSchema},
  prompt: `You are an expert environmental scientist tasked with categorizing pollution risk for a batch of water quality assessments.

You will receive an array of pollution index values. For each assessment in the array, categorize the pollution risk as "Safe", "Moderate", or "High Risk".

Base your categorization on the following rules and the provided permissible limits:
- Permissible Limits Source: {{#if useWhoLimits}}WHO{{else}}BIS{{/if}}
- HPI Limit: {{#if useWhoLimits}}{{{whoPermissibleLimits.hpi}}}{{else}}{{{bisPermissibleLimits.hpi}}}{{/if}}
- HEI Limit: {{#if useWhoLimits}}{{{whoPermissibleLimits.hei}}}{{else}}{{{bisPermissibleLimits.hei}}}{{/if}}
- CF Limit: {{#if useWhoLimits}}{{{whoPermissibleLimits.cf}}}{{else}}{{{bisPermissibleLimits.cf}}}{{/if}}
- PLI Limit: {{#if useWhoLimits}}{{{whoPermissibileLimits.pli}}}{{else}}{{{bisPermissibleLimits.pli}}}{{/if}}

Risk Levels:
- "Safe": If all indices (HPI, HEI, CF, PLI) are below their respective permissible limits.
- "High Risk": If any index is significantly above its limit (e.g., >150% of the limit), or if multiple indices are above their limits.
- "Moderate": If some indices are above their limits, but not to the extent of a "High Risk" classification.

Process the following assessments and return an array of results with the 'id' and the categorized 'riskLevel'.

Assessments:
{{{json assessments}}}

Return a JSON object containing a 'results' array with your categorizations.
`,
});

const categorizePollutionRiskFlow = ai.defineFlow(
  {
    name: 'categorizePollutionRiskFlow',
    inputSchema: CategorizePollutionRiskInputSchema,
    outputSchema: CategorizePollutionRiskOutputSchema,
  },
  async (input) => {
    const maxRetries = 3;
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        const {output} = await prompt(input);
        if (!output) {
          throw new Error('No output from prompt');
        }
        return output;
      } catch (error: any) {
        attempt++;
        if (attempt >= maxRetries) {
          throw error;
        }
        console.log(`Attempt ${attempt} failed, retrying...`);
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, 2000 * Math.pow(2, attempt)));
      }
    }
    // This should be unreachable
    throw new Error('Categorization failed after multiple retries.');
  }
);

