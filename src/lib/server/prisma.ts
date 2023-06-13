import { env } from '$env/dynamic/private';
import { DEBUG_PRISMA } from '$env/static/private';
import { PrismaClient } from '@prisma/client';

const prisma =
  global.__prisma || new PrismaClient({ log: DEBUG_PRISMA === 'true' ? ['query', 'info', 'warn', 'error'] : [] });

if (env.NODE_ENV === 'development') {
  global.__prisma = prisma;
}

export default prisma;
