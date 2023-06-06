import { error, fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';
import { updatePasswordSchema } from './validation.schema.js';

export async function load({ url, locals: { supabase } }) {
	const code = url.searchParams.get('code') ?? '';

	if (code === '') {
		console.log('No auth code, redirecting to login');
		throw redirect(302, '/');
	}

	const { data, error: authError } = await supabase.auth.exchangeCodeForSession(code);

	if (authError) {
		throw error(500, authError.message);
	}

	const form = await superValidate(updatePasswordSchema);

	return { form };
}

export const actions = {
	default: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, updatePasswordSchema);

		if (!form.valid) return fail(400, { form });

		const { error: updateUserError } = await supabase.auth.updateUser({
			password: form.data.newPassword
		});

		if (updateUserError) {
			return message(form, updateUserError, { status: 500 });
		}

		throw redirect(307, '/account');
	}
};
