import { fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';
import { loginSchema } from './validation.schema.js';

export async function load({ url, locals: { getSession } }) {
	const session = await getSession();

	if (session) {
		throw redirect(303, '/account');
	}

	const loginForm = await superValidate(loginSchema, { id: 'loginForm' });

	return { url: url.origin, loginForm };
}

export const actions = {
	login: async ({ request, locals: { supabase }, url }) => {
		const loginForm = await superValidate(request, loginSchema, { id: 'loginForm' });

		if (!loginForm.valid) return fail(400, { loginForm });

		const {
			data: { email, password }
		} = loginForm;

		const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });

		if (loginError) return message(loginForm, loginError.message);

		throw redirect(303, url.searchParams.get('redirectTo') ?? '/account');
	}
};
