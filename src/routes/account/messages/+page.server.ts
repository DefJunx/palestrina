import { getAvatarUrl } from '$src/lib/server/utils';

export async function load({ locals: { getUser, getProfile, prisma, supabase } }) {
  const user = await getUser();
  const profile = await getProfile(user.id);

  const conversations = prisma.conversation
    .findMany({
      where: {
        participants: { some: { id: profile.id } }
      },
      include: {
        participants: true
      }
    })
    .then((conversations) => {
      return conversations.map((c) => ({
        ...c,
        participants: c.participants.map((p) => ({ ...p, avatarSrc: getAvatarUrl(supabase, p.avatarPath) }))
      }));
    });

  return {
    conversations
  };
}
