import { getAvatarFallbackfromName, getAvatarUrl, handleLoginRedirect } from '$src/lib/utils.js';
import type { FitnessDataType } from '$src/types/database.models.js';
import { redirect } from '@sveltejs/kit';

export async function load(event) {
	event.depends('update:profile');

	const session = await event.locals.getSession();

	if (!session) throw redirect(302, handleLoginRedirect(event));

	const userProfile = await event.locals.getProfile(session.user.id);
	const fitnessData = (userProfile.fitnessData as FitnessDataType[]) ?? [];

	return {
		userProfile,
		fitnessData,
		userId: session.user.id,
		avatarSrc: userProfile.avatarPath
			? getAvatarUrl(event.locals.supabase, userProfile.avatarPath)
			: '',
		avatarFallback: userProfile.fullName ? getAvatarFallbackfromName(userProfile.fullName) : ''
	};
}
