// src/ai/flows/calculate-indices.ts
'use server';

/**
 * @fileOverview Calculates various pollution indices (HPI, HEI, CF, PLI) from heavy metal concentration data.
 *
 * - calculateIndices - A function that calculates pollution indices.
 * - CalculateIndicesInput - The input type for the calculateIndices function.
 * - CalculateIndicesOutput - The return type for the calculateIndices function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HeavyMetalConcentrationSchema = z.object({
  As: z.number().describe('Arsenic concentration.'),
  Cd: z.number().describe('Cadmium concentration.'),
  Cr: z.number().describe('Chromium concentration.'),
  Pb: z.number().describe('Lead concentration.'),
  Zn: z.number().describe('Zinc concentration.'),
});

const CalculateIndicesInputSchema = z.object({
  metalConcentrations: z.array(HeavyMetalConcentrationSchema).describe('An array of heavy metal concentrations for different locations.'),
  permissibleLimits: HeavyMetalConcentrationSchema.describe('Permissible limits for each heavy metal.'),
  idealLimits: HeavyMetalConcentrationSchema.describe('Ideal limits for each heavy metal.'),
  metalWeights: HeavyMetalConcentrationSchema.describe('Weights for each heavy metal used in HPI calculation.'),
});

export type CalculateIndicesInput = z.infer<typeof CalculateIndicesInputSchema>;

const CalculatedIndicesSchema = z.object({
  hpi: z.number().describe('Heavy Metal Pollution Index (HPI) value.'),
  hei: z.number().describe('Heavy Metal Evaluation Index (HEI) value.'),
  cf: HeavyMetalConcentrationSchema.describe('Contamination Factor (CF) for each metal.'),
  pli: z.number().describe('Pollution Load Index (PLI) value.'),
});

const CalculateIndicesOutputSchema = z.object({
  results: z.array(CalculatedIndicesSchema).describe('An array of calculated indices for each location.'),
});

export type CalculateIndicesOutput = z.infer<typeof CalculateIndicesOutputSchema>;

export async function calculateIndices(input: CalculateIndicesInput): Promise<CalculateIndicesOutput> {
  return calculateIndicesFlow(input);
}

const calculateIndicesFlow = ai.defineFlow(
  {
    name: 'calculateIndicesFlow',
    inputSchema: CalculateIndicesInputSchema,
    outputSchema: CalculateIndicesOutputSchema,
  },
  async (input) => {
    const results = input.metalConcentrations.map(concentrations => {
      // Calculate CF (Contamination Factor)
      const cf = {
        As: concentrations.As / input.permissibleLimits.As,
        Cd: concentrations.Cd / input.permissibleLimits.Cd,
        Cr: concentrations.Cr / input.permissibleLimits.Cr,
        Pb: concentrations.Pb / input.permissibleLimits.Pb,
        Zn: concentrations.Zn / input.permissibleLimits.Zn,
      };

      // Calculate HEI (Heavy Metal Evaluation Index)
      const hei = (Object.keys(cf) as (keyof typeof cf)[]).reduce(
        (sum, metal) => sum + (concentrations[metal] / input.permissibleLimits[metal]),
        0
      );
      
      // Calculate PLI (Pollution Load Index)
      const pli = Math.pow(
        (Object.keys(cf) as (keyof typeof cf)[]).reduce(
          (prod, metal) => prod * cf[metal],
          1
        ),
        1 / Object.keys(cf).length
      );

      // Calculate HPI (Heavy Metal Pollution Index)
      const numerator = (Object.keys(concentrations) as (keyof typeof concentrations)[]).reduce(
        (sum, metal) => {
            const weight = input.metalWeights[metal] || 0;
            const mac = concentrations[metal] - input.idealLimits[metal];
            if (isNaN(mac) || isNaN(weight)) return sum;
            return sum + (mac * weight);
        },
        0
      );
      const denominator = (Object.keys(concentrations) as (keyof typeof concentrations)[]).reduce(
        (sum, metal) => {
            const weight = input.metalWeights[metal] || 0;
            if (isNaN(weight)) return sum;
            return sum + weight;
        },
        0
      );
      
      const hpi = denominator > 0 ? (numerator / denominator) * 100 : 0;

      return { hpi, hei, cf, pli };
    });

    return { results };
  }
);
