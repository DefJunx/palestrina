import { z } from 'zod';

export const validationSchema = z.object({
	username: z
		.string({ required_error: 'Questo campo è obbligatorio' })
		.min(3, 'Il tuo username deve avere almeno 3 caratteri'),

	full_name: z
		.string({ required_error: 'Questo campo è obbligatorio' })
		.nonempty({ message: 'Per favore compila questo campo' })
});

export type ValidationSchema = z.infer<typeof validationSchema>;
