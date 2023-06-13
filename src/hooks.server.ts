import { auth } from '$lib/server/lucia';
import prisma from '$lib/server/prisma';
import * as Sentry from '@sentry/sveltekit';
import { sequence } from '@sveltejs/kit/hooks';

Sentry.init({
  dsn: 'https://0f0e4d7691364f45907b567cf4d100d4@o4505319050903552.ingest.sentry.io/4505319067680768',
  tracesSampleRate: 1
});

export const handleError = Sentry.handleErrorWithSentry();

export const handle = sequence(Sentry.sentryHandle(), async function _handle({ event, resolve }) {
  event.locals.prisma = prisma;

  event.locals.authRequest = auth.handleRequest(event);

  event.locals.getProfile = (authUserId: string) =>
    event.locals.prisma.profile.findFirstOrThrow({
      where: { authUserId }
    });

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range';
    }
  });
});
