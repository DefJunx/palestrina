import { getPublicBucketUrl } from '$src/lib/server/utils';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { conversationSchema } from './validation.schema';

export async function load({ locals: { getUser, getProfile, prisma, supabase } }) {
  const user = await getUser();
  const profile = await getProfile(user.id);

  const getConversations = async () => {
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: { some: { id: profile.id } }
      },
      include: {
        participants: true
      }
    });

    return conversations.map((c) => ({
      ...c,
      participants: c.participants.map((p) => ({ ...p, avatarSrc: getPublicBucketUrl(supabase, p.avatarPath) }))
    }));
  };

  return {
    conversations: getConversations(),
    users: prisma.profile.findMany({ where: { id: { not: profile.id } } }),
    form: superValidate(conversationSchema)
  };
}

export const actions = {
  createNewConversation: async ({ request, locals: { prisma } }) => {
    const { destinationId, profileId } = Object.fromEntries(await request.formData()) as Record<string, string>;

    if (!profileId || !destinationId || profileId === '' || destinationId === '') {
      return fail(400);
    }

    const { id: conversationId } = await prisma.conversation.create({
      data: { participants: { connect: [{ id: profileId }, { id: destinationId }] } }
    });

    throw redirect(302, `/account/messages/${conversationId}`);
  },
  deleteConversation: async ({ request }) => {
    const form = Object.fromEntries(await request.formData());
    const { conversationId } = form;

    if (!conversationId) {
      throw error(500, 'Conversation ID unavailable');
    }

    await prisma.conversation.delete({ where: { id: conversationId as string } });

    return {};
  }
};
