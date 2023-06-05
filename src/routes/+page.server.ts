import { redirect } from '@sveltejs/kit';

export async function load({ url, locals: { getSession } }) {
	const session = await getSession();

	if (session) {
		throw redirect(303, '/account');
	}

	return { url: url.origin };
}
