import { z } from 'zod';

export const loginSchema = z.object({
	email: z
		.string({ required_error: 'Per favore compila questo campo' })
		.nonempty({ message: 'Per favore compila questo campo' })
		.email({ message: 'Il campo deve contenere un indirizzo email valido' }),
	password: z
		.string({ required_error: 'Per favore compila questo campo' })
		.nonempty({ message: 'Per favore compila questo campo' })
});
