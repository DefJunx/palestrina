import type { PrismaClient, Profile } from '@prisma/client';
import { Session, SupabaseClient, type User } from '@supabase/supabase-js';
import type { Database } from './types/database.types';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient<Database>;
			prisma: PrismaClient;
			getSession(): Promise<Session | null>;
			getUser(): Promise<User>;
			getProfile(userId: string): Promise<Profile>;
		}
		interface PageData {
			session: Session | null;
			profile: Profile;
			userId: string;
		}
		// interface Platform {}
	}
	// eslint-disable-next-line no-var
	var prisma: PrismaClient;
}

export {};
