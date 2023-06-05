import { fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';
import { loginSchema, registerSchema } from './validation.schema.js';

export async function load({ url, locals: { getSession } }) {
	const session = await getSession();

	if (session) {
		throw redirect(303, '/account');
	}

	const loginForm = await superValidate(loginSchema, { id: 'loginForm' });
	const registerForm = await superValidate(registerSchema, { id: 'registerForm' });

	return { url: url.origin, loginForm, registerForm };
}

export const actions = {
	login: async ({ request, locals: { supabase }, url }) => {
		const loginForm = await superValidate(request, loginSchema, { id: 'loginForm' });

		if (!loginForm.valid) return fail(400, { loginForm });

		const {
			data: { email, password }
		} = loginForm;

		const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });

		if (loginError) {
			return message(loginForm, loginError.message, { status: 400 });
		}

		throw redirect(303, url.searchParams.get('redirectTo') ?? '/account');
	},
	register: async ({ request, locals: { supabase }, url }) => {
		const registerForm = await superValidate(request, registerSchema, { id: 'registerForm' });

		if (!registerForm.valid) return fail(400, { registerForm });

		const {
			data: { email, password }
		} = registerForm;

		const { error: registerError } = await supabase.auth.signUp({ email, password });

		if (registerError) {
			return message(registerForm, registerError.message, { status: 400 });
		}

		// return
	}
};
