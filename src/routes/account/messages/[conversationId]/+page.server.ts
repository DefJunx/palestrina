export async function load({ params: { conversationId }, locals: { prisma } }) {
  return {
    messages: prisma.message.findMany({ where: { conversationId } })
  };
}
