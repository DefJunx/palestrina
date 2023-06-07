import { fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';
import { validationSchema } from './validation.schema.js';

export async function load({ parent }) {
	const userProfile = (await parent()).profile;

	const form = await superValidate(
		{
			fitnessNotes: userProfile.fitnessNotes ?? '',
			fitnessData: (userProfile.fitnessData as { label: string; value: string }[]) ?? []
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
				where: { userId: params.userId },
				data: {
					fitnessData,
					fitnessNotes
				}
			});
		} catch (e) {
			console.log(e);

			return message(form, 'unexpected error', { status: 500 });
		}

		throw redirect(302, '/account?profileUpdated=true');
	}
};
