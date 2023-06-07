import { dev } from '$app/environment';
import { PrismaClient } from '@prisma/client';

const prismaClient = global.prisma || new PrismaClient({ log: dev ? ['query', 'info', 'warn', 'error'] : [] });

if (process.env.NODE_ENV === 'development') {
  global.prisma = prismaClient;
}

export default prismaClient;
