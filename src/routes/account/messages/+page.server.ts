import { getAvatarUrl } from '$src/lib/server/utils';
import { superValidate } from 'sveltekit-superforms/server';
import { conversationSchema } from './validation.schema';

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

  const users = await prisma.profile.findMany({ where: { id: { not: profile.id } } });
  const form = await superValidate(conversationSchema);

  return {
    conversations,
    users,
    form
  };
}
