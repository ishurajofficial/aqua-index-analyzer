// src/ai/flows/generate-report.ts
'use server';

/**
 * @fileOverview A Genkit flow to generate a downloadable report from the analysis data.
 *
 * - generateReport - A function that generates a markdown report.
 * - GenerateReportInput - The input type for the generateReport function.
 * - GenerateReportOutput - The return type for the generateReport function.
 */

import {ai, aiEnabled} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReportInputSchema = z.object({
  processedData: z
    .string()
    .describe(
      'JSON string of the processed pollution data including locations, indices (HPI, HEI, PLI, CF), and risk levels.'
    ),
  summary: z
    .string()
    .describe('The overall AI-generated summary of the dataset.'),
  selectedStandard: z
    .string()
    .describe('The standard used for analysis (e.g., "WHO" or "BIS").'),
});
export type GenerateReportInput = z.infer<typeof GenerateReportInputSchema>;

const GenerateReportOutputSchema = z.object({
  report: z
    .string()
    .describe(
      'A comprehensive report in Markdown format summarizing the analysis.'
    ),
});
export type GenerateReportOutput = z.infer<typeof GenerateReportOutputSchema>;

export async function generateReport(
  input: GenerateReportInput
): Promise<GenerateReportOutput> {
  if (!aiEnabled) {
    // Simple local markdown fallback
    const data = JSON.parse(input.processedData || '[]');
    const lines = [
      `# Aqua Index Analysis Report`,
      `\n**Standard:** ${input.selectedStandard}`,
      `\n## Executive Summary`,
      input.summary || 'No summary available.',
      `\n## Sample Data`,
      `| Location | HPI | HEI | PLI | Risk |`,
      `|---|---:|---:|---:|---|`,
      ...data.slice(0, 50).map((d:any)=>`| ${d.location} | ${d.hpi?.toFixed?.(2) ?? '-'} | ${d.hei?.toFixed?.(2) ?? '-'} | ${d.pli?.toFixed?.(2) ?? '-'} | ${d.risk ?? '-'} |`)
    ];
    return { report: lines.join('\n') };
  }
  return generateReportFlow(input);
}

const generateReportPrompt = ai.definePrompt({
  name: 'generateReportPrompt',
  input: {schema: GenerateReportInputSchema},
  output: {schema: GenerateReportOutputSchema},
  prompt: `You are an expert environmental scientist creating a formal report.

  Based on the following data, generate a comprehensive report in Markdown format.

  The report should include:
  1.  An executive summary (using the provided summary).
  2.  The analysis standard used ({{{selectedStandard}}}).
  3.  A summary table of the processed data.
  4.  Key findings, highlighting locations with high risk.
  5.  Recommendations for the high-risk areas.

  Provided Summary:
  {{{summary}}}

  Processed Data (JSON):
  {{{processedData}}}

  Generate the report now.
  `,
});

const generateReportFlow = ai.defineFlow(
  {
    name: 'generateReportFlow',
    inputSchema: GenerateReportInputSchema,
    outputSchema: GenerateReportOutputSchema,
  },
  async (input) => {
    const {output} = await generateReportPrompt(input);
    return output!;
  }
);
