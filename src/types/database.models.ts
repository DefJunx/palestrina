import type { Database } from './database.types';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type FitnessDataType = { label: string; value: string };
