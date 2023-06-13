import { getAvatarFallbackfromName, handleLoginRedirect } from '$src/lib/server/utils';
import { redirect } from '@sveltejs/kit';

export async function load({ locals: { authRequest, getProfile, prisma }, url }) {
  const { user, session } = await authRequest.validateUser();

  if (!session || !user) throw redirect(302, handleLoginRedirect(url));

  const profile = await getProfile(user.userId);
  const fitnessData = (profile.fitnessData as { label: string; value: string }[]) ?? [];
  const newMessageCount = (await prisma.newMessageNotification.findMany({ where: { profileId: profile.id } })).length;

  return {
    profile,
    fitnessData,
    avatarSrc: '', // getPublicBucketUrl(supabase, profile.avatarPath),
    avatarFallback: getAvatarFallbackfromName(profile.fullName),
    newMessageCount
  };
}
