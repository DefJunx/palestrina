import { Session, SupabaseClient, type User } from '@supabase/supabase-js';
import type { Profile } from './types/database.models';
import type { Database } from './types/database.types';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient<Database>;
			getSession(): Promise<Session | null>;
			getUser(): Promise<User | null>;
			getProfile(userId: string): Promise<Profile | null>;
		}
		interface PageData {
			session: Session | null;
		}
		// interface Platform {}
	}
}

export {};
