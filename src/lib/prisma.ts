import { PrismaClient } from '@prisma/client';

const prismaClient = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') {
  global.prisma = prismaClient;
}

export default prismaClient;
