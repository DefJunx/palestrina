import { fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';
import { validationSchema } from './validation.schema.js';

export async function load({ params: { profileId }, locals: { getProfile } }) {
  const profile = await getProfile(profileId);

  return {
    form: superValidate(
      {
        fitnessNotes: profile.fitnessNotes ?? '',
        fitnessData: (profile.fitnessData as { label: string; value: string }[]) ?? []
      },
      validationSchema
    )
  };
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
        where: { id: params.profileId },
        data: {
          fitnessData,
          fitnessNotes
        }
      });
    } catch (e) {
      return message(form, 'unexpected error', { status: 500 });
    }

    throw redirect(302, '/account?profileUpdated=true');
  }
};
