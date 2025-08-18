/* eslint-disable @typescript-eslint/no-explicit-any */

import prisma from './prisma';

type CreateArgs<T> = T extends { create: (args: { data: infer D }) => any } ? D : never;

export async function createData<T extends keyof typeof prisma>(
    schema: T,
    data: CreateArgs<(typeof prisma)[T]>
) {
    try {
        const result = await (prisma[schema] as any).create({ data });
        return { success: true, data: result };
    } catch (error) {
        return { success: false, error };
    } finally {
        await prisma.$disconnect();
    }
}

export async function getData<T extends keyof typeof prisma>(
    schema: T,
    where?: Record<string, any>,
) {

    try {
        const result = await (prisma[schema] as any).findMany({ where });
        return { success: true, data: result };
    } catch (error) {
        return { success: false, error };
    } finally {
        await prisma.$disconnect();
    }
}
export async function getDataWithOption<T extends keyof typeof prisma>(
    schema: T,
    option?: Record<string, any>
) {

    try {
        const result = await (prisma[schema] as any).findMany({ include: option });
        return { success: true, data: result };
    } catch (error) {
        return { success: false, error };
    } finally {
        await prisma.$disconnect();
    }
}

export async function updateData<T extends keyof typeof prisma>(
    schema: T,
    where: Record<string, any>,
    data: Partial<CreateArgs<(typeof prisma)[T]>>
) {
    try {
        const result = await (prisma[schema] as any).update({ where, data });
        return { success: true, data: result };
    } catch (error) {
        return { success: false, error };
    } finally {
        await prisma.$disconnect();
    }
}

export async function deleteData<T extends keyof typeof prisma>(
    schema: T,
    where: Record<string, any>
) {
    try {
        const result = await (prisma[schema] as any).delete({ where });
        return { success: true, data: result };
    } catch (error) {
        return { success: false, error };
    } finally {
        await prisma.$disconnect();
    }
}

export async function getDataById<T extends keyof typeof prisma>(
    schema: T,
    id: number | string
) {
    try {
        const result = await (prisma[schema] as any).findUnique({ where: { id } });
        return { success: true, data: result };
    } catch (error) {
        return { success: false, error };
    } finally {
        await prisma.$disconnect();
    }
}


export async function getDataWithRelations<T extends keyof typeof prisma>(
    schema: T,
    where?: Record<string, any>,
    include?: Record<string, boolean>
) {
    try {
        const result = await (prisma[schema] as any).findMany({ where, include });
        return { success: true, data: result };
    } catch (error) {
        return { success: false, error };
    } finally {
        await prisma.$disconnect();
    }
}

export async function countData<T extends keyof typeof prisma>(
    schema: T,
    where?: Record<string, any>
) {
    try {
        const count = await (prisma[schema] as any).count({ where });
        return { success: true, count };
    } catch (error) {
        return { success: false, error };
    } finally {
        await prisma.$disconnect();
    }
}

export async function aggregateData<T extends keyof typeof prisma>(
    schema: T,
    _args: any
) {
    try {
        const result = await (prisma[schema] as any).aggregate(_args);
        return { success: true, data: result };
    } catch (error) {
        return { success: false, error };
    } finally {
        await prisma.$disconnect();
    }
}

export async function dataTansaction(
    operations: Array<() => Promise<any>>
) {
    try {
        const results = await prisma.$transaction(async (tx) => {
            const results = [];
            for (const op of operations) {
                results.push(await op());
            }
            return results;
        });
        return { success: true, data: results };
    } catch (error) {
        return { success: false, error };
    } finally {
        await prisma.$disconnect();
    }
}


