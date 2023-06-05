import { Session, SupabaseClient, type User } from '@supabase/supabase-js';
import type { Database, Profile } from './types/database.types';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
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
