import { z } from 'zod';

export const validationSchema = z.object({
  fitnessData: z
    .object({
      label: z
        .string({ required_error: 'Questo campo è obbligatorio' })
        .nonempty({ message: 'Per favore compila questo campo' }),
      value: z
        .string({ required_error: 'Questo campo è obbligatorio' })
        .nonempty({ message: 'Per favore compila questo campo' })
    })
    .array(),
  fitnessNotes: z.string().optional()
});
