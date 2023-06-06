// src/hooks.server.ts
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import { prismaClient } from './lib/prisma';
import type { Database } from './types/database.types';

export async function handle({ event, resolve }) {
	event.locals.supabase = createSupabaseServerClient<Database>({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event
	});
	event.locals.prisma = prismaClient;

	event.locals.getSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		return session;
	};

	event.locals.getProfile = async (userId: string) => {
		const userProfile = await event.locals.prisma.profile.findUnique({ where: { id: userId } });

		if (!userProfile) return null;

		return userProfile;
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
}
