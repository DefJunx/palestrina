import { getAvatarFallbackfromName, getAvatarUrl, handleLoginRedirect } from '$src/lib/server/utils';
import { redirect } from '@sveltejs/kit';

export async function load(event) {
  const session = await event.locals.getSession();

  if (!session) throw redirect(302, handleLoginRedirect(event));

  const user = await event.locals.getUser();

  const profile = await event.locals.getProfile(user.id);
  const fitnessData = (profile.fitnessData as { label: string; value: string }[]) ?? [];

  console.log('avatar path', profile.avatarPath);

  return {
    profile,
    fitnessData,
    avatarSrc: getAvatarUrl(event.locals.supabase, profile.avatarPath),
    avatarFallback: getAvatarFallbackfromName(profile.fullName)
  };
}
