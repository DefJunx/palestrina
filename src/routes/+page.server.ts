import { error, fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';
import { forgotPasswordSchema, loginSchema, registerSchema } from './validation.schema.js';

export async function load({ url, locals: { getSession, supabase, prisma } }) {
	const session = await getSession();

	if (session) {
		throw redirect(303, '/account');
	}

	const code = url.searchParams.get('code') ?? '';

	if (code) {
		const {
			data: { user },
			error: authError
		} = await supabase.auth.exchangeCodeForSession(code);

		if (authError || !user) {
			throw error(500, authError?.message ?? 'Unexpected authentication error');
		}

		await prisma.profile.create({ data: { userId: user.id } });

		throw redirect(307, '/account');
	}

	const loginForm = await superValidate(loginSchema, { id: 'loginForm' });
	const registerForm = await superValidate(registerSchema, { id: 'registerForm' });
	const forgotPasswordForm = await superValidate(forgotPasswordSchema, {
		id: 'forgotPasswordForm'
	});

	return { url: url.origin, loginForm, registerForm, forgotPasswordForm };
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
	register: async ({ request, locals: { supabase } }) => {
		const registerForm = await superValidate(request, registerSchema, { id: 'registerForm' });

		if (!registerForm.valid) return fail(400, { registerForm });

		const {
			data: { email, password }
		} = registerForm;

		const { error: registerError } = await supabase.auth.signUp({ email, password });

		if (registerError) {
			console.log(registerError);

			return message(registerForm, 'There was an error in registration', { status: 400 });
		}

		return message(registerForm, 'Controlla il tuo indirizzo email');
	},
	forgotPassword: async ({ request, locals: { supabase }, url }) => {
		const forgotPasswordForm = await superValidate(request, forgotPasswordSchema, {
			id: 'forgotPasswordForm'
		});

		if (!forgotPasswordForm.valid) return fail(400, { forgotPasswordForm });

		const {
			data: { email }
		} = forgotPasswordForm;

		const { error: forgotPasswordError } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${url.origin}/updatePassword`
		});

		if (forgotPasswordError) {
			return message(forgotPasswordForm, forgotPasswordError.message, { status: 400 });
		}

		return message(forgotPasswordForm, 'Controlla il tuo indirizzo email');
	}
};
