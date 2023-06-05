export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];
export type Profile = Database['public']['Tables']['profiles']['Row'];

export interface Database {
	public: {
		Tables: {
			exercises: {
				Row: {
					created_at: string | null;
					id: number;
					name: string | null;
					photo_path: string | null;
					video_path: string | null;
				};
				Insert: {
					created_at?: string | null;
					id?: number;
					name?: string | null;
					photo_path?: string | null;
					video_path?: string | null;
				};
				Update: {
					created_at?: string | null;
					id?: number;
					name?: string | null;
					photo_path?: string | null;
					video_path?: string | null;
				};
			};
			profiles: {
				Row: {
					avatar_path: string | null;
					fitness_data: Json | null;
					fitness_notes: string | null;
					full_name: string | null;
					has_compiled: boolean;
					id: string;
					updated_at: string | null;
					user_role: Database['public']['Enums']['user_role_enum'] | null;
					username: string | null;
				};
				Insert: {
					avatar_path?: string | null;
					fitness_data?: Json | null;
					fitness_notes?: string | null;
					full_name?: string | null;
					has_compiled?: boolean;
					id: string;
					updated_at?: string | null;
					user_role?: Database['public']['Enums']['user_role_enum'] | null;
					username?: string | null;
				};
				Update: {
					avatar_path?: string | null;
					fitness_data?: Json | null;
					fitness_notes?: string | null;
					full_name?: string | null;
					has_compiled?: boolean;
					id?: string;
					updated_at?: string | null;
					user_role?: Database['public']['Enums']['user_role_enum'] | null;
					username?: string | null;
				};
			};
			training_program: {
				Row: {
					athleteId: string | null;
					created_at: string | null;
					exerciseId: number | null;
					id: number;
					instructions: string | null;
				};
				Insert: {
					athleteId?: string | null;
					created_at?: string | null;
					exerciseId?: number | null;
					id?: number;
					instructions?: string | null;
				};
				Update: {
					athleteId?: string | null;
					created_at?: string | null;
					exerciseId?: number | null;
					id?: number;
					instructions?: string | null;
				};
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			user_role_enum: 'User' | 'Admin';
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
}
