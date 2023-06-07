import {sequence} from '@sveltejs/kit/hooks';
import * as Sentry from '@sentry/sveltekit';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import { error } from '@sveltejs/kit';
import prismaClient from './lib/prisma';
import type { Database } from './types/database.types';

Sentry.init({
    dsn: "https://0f0e4d7691364f45907b567cf4d100d4@o4505319050903552.ingest.sentry.io/4505319067680768",
    tracesSampleRate: 1
})

export const handleError = Sentry.handleErrorWithSentry();

export const handle = sequence(Sentry.sentryHandle(), async function _handle({ event, resolve }) {
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

  event.locals.getUser = async () => {
    const {
      data: { user },
      error: userError
    } = await event.locals.supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    if (!user) {
      throw error(500, 'User not found');
    }

    return user;
  };

  event.locals.getProfile = (profileOrUserId: string) =>
    event.locals.prisma.profile.findFirstOrThrow({
      where: { OR: [{ userId: profileOrUserId }, { id: profileOrUserId }] }
    });

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range';
    }
  });
});