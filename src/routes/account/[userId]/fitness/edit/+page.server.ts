import type { Json } from '$src/types/database.types.js';
import { error, fail } from '@sveltejs/kit';
import { z } from 'zod';

export async function load({ locals, params: { userId } }) {
	const userProfile = await locals.getProfile(userId);

	if (!userProfile) {
		throw error(500, { message: 'Internal server error' });
	}

	const notesContent = userProfile.fitness_notes ?? '';

	return { userProfile, notesContent };
}

export const actions = {
	default: async ({ locals: { supabase }, params, request }) => {
		const payload = Object.fromEntries(await request.formData());
		const { fitness_notes, ...fitness_data } = payload;
		const validationSchema = z.record(z.string().nonempty(), z.string().nonempty());
		const validationResult = validationSchema.safeParse(fitness_data);

		if (!validationResult.success) {
			return fail(400, {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				fitnessData: fitness_data as Record<string, any>,
				error: true,
				errorMessage: 'Si prega di compilare tutti i campi'
			});
		}

		const { error: supabaseUpdateError } = await supabase
			.from('profiles')
			.update({
				fitness_data: fitness_data as Json,
				updated_at: new Date().toISOString(),
				fitness_notes: fitness_notes as string
			})
			.eq('id', params.userId);

		if (supabaseUpdateError) {
			throw error(500, { message: `Internal server error: ${supabaseUpdateError.message}` });
		}

		return { success: true };
	}
};
