import { EMAIL_PASSWORD_PROVIDER_ID, auth } from '$src/lib/server/lucia.js';
import { fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';
import { forgotPasswordSchema, loginSchema, registerSchema } from './validation.schema.js';

export async function load({ url, locals: { authRequest } }) {
  const { session } = await authRequest.validateUser();

  if (session) {
    throw redirect(303, '/account');
  }

  return {
    url: url.origin,
    loginForm: superValidate(loginSchema, { id: 'loginForm' }),
    registerForm: superValidate(registerSchema, { id: 'registerForm' }),
    forgotPasswordForm: superValidate(forgotPasswordSchema, {
      id: 'forgotPasswordForm'
    })
  };
}

export const actions = {
  login: async ({ request, locals: { authRequest }, url }) => {
    const loginForm = await superValidate(request, loginSchema, { id: 'loginForm' });

    if (!loginForm.valid) return fail(400, { loginForm });

    const {
      data: { email, password }
    } = loginForm;

    try {
      const key = await auth.useKey(EMAIL_PASSWORD_PROVIDER_ID, email, password);
      const session = await auth.createSession(key.userId);
      authRequest.setSession(session);
    } catch (e) {
      console.log(e);

      return message(loginForm, 'Login fallito. Si prega di riprovare più tardi', { status: 500 });
    }

    throw redirect(303, url.searchParams.get('redirectTo') ?? '/account');
  },
  register: async ({ request, locals: { authRequest, prisma } }) => {
    const registerForm = await superValidate(request, registerSchema, { id: 'registerForm' });

    if (!registerForm.valid) return fail(400, { registerForm });

    const {
      data: { email, password }
    } = registerForm;

    try {
      const user = await auth.createUser({
        primaryKey: {
          providerId: EMAIL_PASSWORD_PROVIDER_ID,
          providerUserId: email,
          password
        },
        attributes: {
          email
        }
      });
      const session = await auth.createSession(user.userId);

      authRequest.setSession(session);

      await prisma.profile.create({ data: { authUserId: user.userId } });
    } catch (e) {
      console.log(e);

      return message(registerForm, 'There was an error in registration', { status: 400 });
    }

    throw redirect(302, '/account');
  },
  forgotPassword: async ({ request }) => {
    const forgotPasswordForm = await superValidate(request, forgotPasswordSchema, {
      id: 'forgotPasswordForm'
    });

    if (!forgotPasswordForm.valid) return fail(400, { forgotPasswordForm });

    try {
      const {
        data: { email }
      } = forgotPasswordForm;

      const [sessionId] = await auth.generateSessionId();

      // TODO: send sessionId to user and then validateSession on an endpoint

      return message(forgotPasswordForm, 'Controlla il tuo indirizzo email');
    } catch {
      return message(
        forgotPasswordForm,
        'Si è verificato un errore nel reset della password. Si prega di riprovare più tardi',
        { status: 500 }
      );
    }
  }
};
