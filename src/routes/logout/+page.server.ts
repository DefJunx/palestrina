import { auth } from '$lib/server/lucia';
import { fail } from '@sveltejs/kit';

export const actions = {
  default: async ({ locals: { authRequest } }) => {
    const { session } = await authRequest.validateUser();
    if (!session) return fail(401);

    await auth.invalidateSession(session.sessionId); // invalidate session
    authRequest.setSession(null); // remove cookie
  }
};
