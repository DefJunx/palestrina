import { getAvatarUrl } from '$src/lib/server/utils';
import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';
import { messageSchema } from './validation.schema';

export async function load({ params: { conversationId }, locals: { prisma, supabase, getProfile, getUser } }) {
  const user = await getUser();
  const profile = await getProfile(user.id);
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

    return messages.map((m) => ({
      ...m,
      sender: {
        ...m.sender,
        avatarSrc: getAvatarUrl(supabase, m.sender.avatarPath)
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
  sendMessage: async ({ request, params: { conversationId } }) => {
    const form = await superValidate(request, messageSchema);

    if (!form.valid) return fail(400, { form });

    await prisma.message.create({
      data: {
        text: form.data.message,
        Conversation: { connect: { id: conversationId } },
        sender: { connect: { id: form.data.senderId } }
      }
    });

    await prisma.newMessageNotification.create({
      data: {
        conversationId,
        profileId: form.data.receiverId
      }
    });

    return message(form, 'Messaggio inviato', { status: 200 });
  }
};
