import { getAvatarUrl } from '$src/lib/server/utils';
import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';
import { messageSchema } from './validation.schema';

export async function load({ params: { conversationId }, locals: { prisma, supabase } }) {
  const form = await superValidate(messageSchema);
  const messages = await Promise.all(
    (
      await prisma.message.findMany({
        where: { conversationId },
        include: { sender: true },
        orderBy: { createdAt: 'asc' }
      })
    ).map((m) => ({
      ...m,
      sender: {
        ...m.sender,
        avatarSrc: getAvatarUrl(supabase, m.sender.avatarPath)
      }
    }))
  );

  return {
    messages,
    form
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

    return message(form, 'Messaggio inviato', { status: 200 });
  }
};
