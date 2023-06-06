import type { FitnessDataType } from '$src/types/database.models.js';
import { error, fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';
import { validationSchema } from './validation.schema.js';

export async function load({ locals, params: { userId } }) {
	const userProfile = await locals.getProfile(userId);

	if (!userProfile) {
		throw error(500, { message: 'Internal server error' });
	}

	const form = await superValidate(
		{
			fitnessNotes: userProfile.fitness_notes ?? '',
			fitnessData: (userProfile.fitness_data as FitnessDataType[]) ?? []
		},
		validationSchema
	);

	return { form };
}

export const actions = {
	default: async ({ locals: { supabase }, params, request }) => {
		const form = await superValidate(request, validationSchema);

		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const { error: supabaseUpdateError } = await supabase
			.from('profiles')
			.update({
				fitness_data: form.data.fitnessData,
				updated_at: new Date().toISOString(),
				fitness_notes: form.data.fitnessNotes as string
			})
			.eq('id', params.userId);

		if (supabaseUpdateError) return message(form, supabaseUpdateError.message, { status: 500 });

		throw redirect(302, '/account');
	}
};
