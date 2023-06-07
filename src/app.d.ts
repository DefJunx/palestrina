import type { PrismaClient, Profile } from '@prisma/client';
import { Session, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types/database.types';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient<Database>;
			prisma: PrismaClient;
			getSession(): Promise<Session | null>;
			getProfile(userId: string): Promise<Profile>;
		}
		interface PageData {
			session: Session | null;
		}
		// interface Platform {}
	}
}

export {};
