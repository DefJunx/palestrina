import { z } from 'zod';

export const validationSchema = z.object({
  fitnessData: z
    .object({
      label: z.string().nonempty(),
      value: z.string().nonempty()
    })
    .array(),
  fitnessNotes: z.string().optional()
});
