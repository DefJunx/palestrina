import { getAvatarUrl } from '$src/lib/utils';
import { error, redirect } from '@sveltejs/kit';

export async function load({ locals: { getUser, supabase } }) {
	const user = await getUser();

	if (!user) {
		throw redirect(302, '/');
	}

	const { data: userProfile, error: profileError } = await supabase
		.from('profiles')
		.select('*')
		.eq('id', user.id)
		.single();

	if (profileError) {
		throw error(500, profileError.message);
	}

	let avatarSrc = '';

	if (userProfile.avatar_path) {
		avatarSrc = await getAvatarUrl(supabase, userProfile.avatar_path);
	}

	return { userProfile, avatarSrc };
}
