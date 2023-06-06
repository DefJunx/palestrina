import type { Profile } from '$src/types/database.models';
import { writable } from 'svelte/store';

type User = {
	profile: Profile | null;
	avatarSrc: string;
	avatarInitials: string;
};

export const userStore = writable<User>({ profile: null, avatarSrc: '', avatarInitials: '' });
