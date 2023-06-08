export async function load({ locals: { getUser, getProfile, prisma } }) {
  const user = await getUser();
  const profile = await getProfile(user.id);

  return {
    conversations: prisma.conversation.findMany({
      where: { OR: [{ senderId: profile.id }, { receiverId: profile.id }] },
      include: {
        receiver: { select: { id: true, fullName: true } },
        sender: { select: { id: true, fullName: true } }
      }
    })
  };
}
