import { z } from 'zod';

export const newExerciseSchema = z.object({
  name: z
    .string({
      invalid_type_error: 'Il nome deve essere una stringa.',
      required_error: 'Questo campo è obbligatorio'
    })
    .nonempty({ message: 'Questo campo è obbligatorio' })
});
