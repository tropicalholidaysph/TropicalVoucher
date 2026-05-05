'use server';
/**
 * @fileOverview This file implements a Genkit flow to convert numerical amounts
 * in Omani Rial to their word format, including baisa for decimal values.
 *
 * - voucherAmountToWordsConverter - A function that converts a numerical amount to words.
 * - VoucherAmountToWordsConverterInput - The input type for the conversion.
 * - VoucherAmountToWordsConverterOutput - The return type for the conversion.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VoucherAmountToWordsConverterInputSchema = z
  .object({
    amountInRO: z
      .number()
      .describe('The numerical amount in Omani Rial to be converted to words.'),
  })
  .describe('Input schema for converting a numerical Omani Rial amount to words.');
export type VoucherAmountToWordsConverterInput = z.infer<
  typeof VoucherAmountToWordsConverterInputSchema
>;

const VoucherAmountToWordsConverterOutputSchema = z
  .object({
    amountInWords: z
      .string()
      .describe('The numerical amount converted into its word format.'),
  })
  .describe('Output schema for the Omani Rial amount in word format.');
export type VoucherAmountToWordsConverterOutput = z.infer<
  typeof VoucherAmountToWordsConverterOutputSchema
>;

const voucherAmountToWordsConverterPrompt = ai.definePrompt({
  name: 'voucherAmountToWordsConverterPrompt',
  input: {schema: VoucherAmountToWordsConverterInputSchema},
  output: {schema: VoucherAmountToWordsConverterOutputSchema},
  prompt: `Convert the numerical amount {{{amountInRO}}} to its word format.
  The amount is in Omani Rial. Ensure the output is formatted as 'Sum of Rial Omani' and includes any decimal parts as baisa (1 Rial Omani = 1000 baisa).`,
});

const voucherAmountToWordsConverterFlow = ai.defineFlow(
  {
    name: 'voucherAmountToWordsConverterFlow',
    inputSchema: VoucherAmountToWordsConverterInputSchema,
    outputSchema: VoucherAmountToWordsConverterOutputSchema,
  },
  async input => {
    const {output} = await voucherAmountToWordsConverterPrompt(input);
    if (!output) {
      throw new Error('Failed to convert amount to words.');
    }
    return output;
  }
);

export async function voucherAmountToWordsConverter(
  input: VoucherAmountToWordsConverterInput
): Promise<VoucherAmountToWordsConverterOutput> {
  return voucherAmountToWordsConverterFlow(input);
}
