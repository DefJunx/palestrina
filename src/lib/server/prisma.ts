import { DEBUG_PRISMA } from '$env/static/private';
import { PrismaClient } from '@prisma/client';

const prismaClient =
  global.prisma || new PrismaClient({ log: DEBUG_PRISMA === 'true' ? ['query', 'info', 'warn', 'error'] : [] });

if (process.env.NODE_ENV === 'development') {
  global.prisma = prismaClient;
}

export default prismaClient;
