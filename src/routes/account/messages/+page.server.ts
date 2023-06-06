import type { Conversation, Profile } from '@prisma/client';
import { error, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { messageSchema } from './validation.schema';

export async function load({ locals: { getSession, getProfile } }) {
	const session = await getSession();
	if (!session) {
		throw redirect(302, '/');
	}

	const { id: userId } = session.user;

	const profile = await getProfile(userId);

	if (!profile) {
		throw error(500, 'Profile does not exist');
	}

	const form = await superValidate(messageSchema);

	// TODO: Fix
	const conversations: Conversation[] = [];
	const users: Profile[] = [];

	return { form, users: users ?? [], conversations: conversations ?? [] };
}
