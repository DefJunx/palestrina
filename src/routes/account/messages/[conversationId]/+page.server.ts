import { getAvatarUrl } from '$src/lib/server/utils';

export async function load({ params: { conversationId }, locals: { prisma, supabase } }) {
  const messages = await Promise.all(
    (
      await prisma.message.findMany({
        where: { conversationId },
        include: { sender: true },
        orderBy: { createdAt: 'asc' }
      })
    ).map(async (m) => ({
      ...m,
      sender: {
        ...m.sender,
        avatarSrc: await getAvatarUrl(supabase, m.sender.avatarPath)
      }
    }))
  );

  return {
    messages
  };
}
