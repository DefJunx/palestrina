import { NODE_ENV } from '$env/static/private';
import { PrismaClient } from '@prisma/client';

const prismaClient = global.prisma || new PrismaClient();

if (NODE_ENV === 'development') {
	global.prisma = prismaClient;
}

export default prismaClient;
