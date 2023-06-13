import { dev } from '$app/environment';
import prismaAdapter from '@lucia-auth/adapter-prisma';
import { createId } from '@paralleldrive/cuid2';
import lucia from 'lucia-auth';
import { sveltekit } from 'lucia-auth/middleware';
import prisma from './prisma';

export const EMAIL_PASSWORD_PROVIDER_ID = 'email';

export const auth = lucia({
  adapter: prismaAdapter(prisma),
  middleware: sveltekit(),
  env: dev ? 'DEV' : 'PROD',
  transformDatabaseUser(userData) {
    return {
      userId: userData.id,
      email: userData.email
    };
  },
  generateCustomUserId() {
    return `user_${createId()}`;
  }
});

export type Auth = typeof auth;
