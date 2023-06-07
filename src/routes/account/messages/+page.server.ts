import type { Conversation, Profile } from '@prisma/client';
import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { messageSchema } from './validation.schema';

export async function load({ locals: { getSession } }) {
	const session = await getSession();
	if (!session) {
		throw redirect(302, '/');
	}

	// TODO: Fix
	const form = await superValidate(messageSchema);

	const conversations: Conversation[] = [];
	const users: Profile[] = [];

	return { form, users: users ?? [], conversations: conversations ?? [] };
}
