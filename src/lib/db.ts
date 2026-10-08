import { PrismaClient } from '@prisma/client';
import { DB_FILE } from './paths';

const g = globalThis as unknown as { prisma?: PrismaClient };

export const db = g.prisma ?? new PrismaClient({ datasourceUrl: `file:${DB_FILE}` });

if (process.env.NODE_ENV !== 'production') g.prisma = db;
