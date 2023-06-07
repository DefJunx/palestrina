import type { FitnessDataType } from '$src/types/database.models.js';
import { fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';
import { validationSchema } from './validation.schema.js';

export async function load({ locals, params: { userId } }) {
	const userProfile = await locals.getProfile(userId);

	const form = await superValidate(
		{
			fitnessNotes: userProfile.fitnessNotes ?? '',
			fitnessData: (userProfile.fitnessData as FitnessDataType[]) ?? []
		},
		validationSchema
	);

	return { form };
}

export const actions = {
	default: async ({ locals: { prisma }, params, request }) => {
		const form = await superValidate(request, validationSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const { fitnessData, fitnessNotes } = form.data;
			await prisma.profile.update({
				where: { id: params.userId },
				data: {
					fitnessData,
					fitnessNotes
				}
			});
			throw redirect(302, '/account');
		} catch (e) {
			return message(form, 'unexpected error', { status: 500 });
		}
	}
};
