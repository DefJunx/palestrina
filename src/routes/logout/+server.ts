import { auth } from '$lib/server/lucia';
import { redirect } from '@sveltejs/kit';

export const POST = async ({ locals: { authRequest } }) => {
  const { session } = await authRequest.validateUser();
  if (!session) return new Response(null, { status: 401 });

  await auth.invalidateSession(session.sessionId); // invalidate session
  authRequest.setSession(null); // remove cookie
  throw redirect(302, '/');
};
