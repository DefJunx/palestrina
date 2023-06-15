import type { Profile } from '@prisma/client';
import { writable } from 'svelte/store';

type User = {
  profile: Profile;
  avatarInitials: string;
};

export const userStore = writable<User>({ profile: {} as Profile, avatarInitials: '' });
