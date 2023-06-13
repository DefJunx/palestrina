import pusherServer from '$src/lib/server/pusher';
import { fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';
import { messageSchema } from './validation.schema';

export async function load({ params: { conversationId }, locals: { prisma, authRequest, getProfile } }) {
  const { user, session } = await authRequest.validateUser();

  if (!user || !session) {
    throw redirect(302, '/');
  }

  const profile = await getProfile(user.userId);
  const conversation = await prisma.conversation.findFirstOrThrow({
    where: { id: conversationId },
    include: { participants: true }
  });

  const notification = await prisma.newMessageNotification.findFirst({
    where: { profileId: profile.id, conversationId }
  });

  if (notification) {
    await prisma.newMessageNotification.delete({ where: { id: notification.id } });
  }

  const getMessages = async () => {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      include: { sender: true },
      orderBy: { createdAt: 'asc' }
    });

    // TODO: getPublicBucketUrl(supabase, m.sender.avatarPath)
    return messages.map((m) => ({
      ...m,
      sender: {
        ...m.sender,
        avatarSrc: ''
      }
    }));
  };

  return {
    messages: getMessages(),
    conversation,
    form: superValidate(messageSchema)
  };
}

export const actions = {
  sendMessage: async ({ locals: { prisma }, request, params: { conversationId } }) => {
    const form = await superValidate(request, messageSchema);

    if (!form.valid) return fail(400, { form });

    const newMessage = await prisma.message.create({
      data: {
        text: form.data.message,
        Conversation: { connect: { id: conversationId } },
        sender: { connect: { id: form.data.senderId } }
      },
      include: { sender: true }
    });

    await __prisma.newMessageNotification.create({
      data: {
        conversationId,
        profileId: form.data.receiverId
      }
    });

    // TODO: getPublicBucketUrl(supabase, newMessage.sender.avatarPath)
    const pusherMessage = {
      ...newMessage,
      sender: { ...newMessage.sender, avatarSrc: '' }
    };

    pusherServer.trigger(conversationId, 'new-message', { ...pusherMessage });

    return message(form, 'Messaggio inviato', { status: 200 });
  }
};
