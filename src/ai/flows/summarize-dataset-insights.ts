// SummarizeDatasetInsights.ts
'use server';

/**
 * @fileOverview A Genkit flow to summarize key insights from the uploaded dataset.
 *
 * - summarizeDatasetInsights - A function that summarizes key insights from the uploaded dataset.
 * - SummarizeDatasetInsightsInput - The input type for the summarizeDatasetInsights function.
 * - SummarizeDatasetInsightsOutput - The return type for the summarizeDatasetInsights function.
 */

import {ai, aiEnabled} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeDatasetInsightsInputSchema = z.object({
  datasetDescription: z
    .string()
    .describe(
      'Description of the dataset, including the names of the heavy metals, geo-coordinates, and their concentrations.'
    ),
  permissibleLimits: z
    .string()
    .describe(
      'WHO/BIS permissible limits for each heavy metal in the dataset, including units.'
    ),
  calculatedIndices: z
    .string()
    .describe(
      'Calculated heavy metal pollution indices (HPI, HEI, CF, PLI) along with their corresponding locations.'
    ),
});
export type SummarizeDatasetInsightsInput = z.infer<
  typeof SummarizeDatasetInsightsInputSchema
>;

const SummarizeDatasetInsightsOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A summary of the key insights from the dataset, highlighting potential risks and areas needing immediate attention.'
    ),
});
export type SummarizeDatasetInsightsOutput = z.infer<
  typeof SummarizeDatasetInsightsOutputSchema
>;

export async function summarizeDatasetInsights(
  input: SummarizeDatasetInsightsInput
): Promise<SummarizeDatasetInsightsOutput> {
  if (!aiEnabled) {
    // Simple heuristic fallback summary
    const indices = JSON.parse(input.calculatedIndices || '[]');
    const total = indices.length;
    const high = indices.filter((d:any)=>d.risk === 'High Risk').length;
    const moderate = indices.filter((d:any)=>d.risk === 'Moderate').length;
    const low = indices.filter((d:any)=>d.risk === 'Safe').length;
    return {
      summary: `Analyzed ${total} locations. High risk: ${high}. Moderate: ${moderate}. Low: ${low}. Focus mitigation on high-risk sites and monitor moderate locations.`
    };
  }
  return summarizeDatasetInsightsFlow(input);
}

const summarizeDatasetInsightsPrompt = ai.definePrompt({
  name: 'summarizeDatasetInsightsPrompt',
  input: {schema: SummarizeDatasetInsightsInputSchema},
  output: {schema: SummarizeDatasetInsightsOutputSchema},
  prompt: `You are an AI assistant helping a policymaker understand a water quality dataset.

  Based on the following information, provide a concise summary of the key insights,
  highlighting potential risks and areas needing immediate attention.

  Dataset Description: {{{datasetDescription}}}
  Permissible Limits: {{{permissibleLimits}}}
  Calculated Indices: {{{calculatedIndices}}}

  Summary:
  `,
});

const summarizeDatasetInsightsFlow = ai.defineFlow(
  {
    name: 'summarizeDatasetInsightsFlow',
    inputSchema: SummarizeDatasetInsightsInputSchema,
    outputSchema: SummarizeDatasetInsightsOutputSchema,
  },
  async input => {
    const maxRetries = 3;
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        const {output} = await summarizeDatasetInsightsPrompt(input);
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
    throw new Error('Summary generation failed after multiple retries.');
  }
);
