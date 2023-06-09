import { getAvatarUrl } from '$src/lib/server/utils';
import { fail, redirect } from '@sveltejs/kit';
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

export const actions = {
  createNewConversation: async ({ request }) => {
    const { destinationId, profileId } = Object.fromEntries(await request.formData()) as Record<string, string>;

    if (!profileId || !destinationId || profileId === '' || destinationId === '') {
      return fail(400);
    }

    const { id: conversationId } = await prisma.conversation.create({
      data: { participants: { connect: [{ id: profileId }, { id: destinationId }] } }
    });

    throw redirect(302, `/account/messages/${conversationId}`);
  }
};
