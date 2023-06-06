import { z } from 'zod';

export const updatePasswordSchema = z
	.object({
		newPassword: z
			.string({ required_error: 'Per favore compila questo campo' })
			.nonempty({ message: 'Per favore compila questo campo' })
			.min(6, { message: 'La password deve contenere almeno 6 caratteri' }),
		confirmNewPassword: z
			.string({ required_error: 'Per favore compila questo campo' })
			.nonempty({ message: 'Per favore compila questo campo' })
			.min(6, { message: 'La password deve contenere almeno 6 caratteri' })
	})
	.superRefine((val, ctx) => {
		if (val.newPassword !== val.confirmNewPassword) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'La password e la sua conferma devono essere uguali',
				path: ['confirmNewPassword']
			});

			return z.NEVER;
		}
	});
