/* eslint-disable @typescript-eslint/no-explicit-any */
import { createData, getData, updateData, deleteData, getDataById, getDataWithOption, getDataWithRelations } from '@/app/lib/database';
import { getCurrentUser } from '@/app/lib/jwt';
import prisma from '@/app/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';


// Helper to get slug parts
function getSlugParts(req: NextRequest) {
    // /api/predictions/[...slug]
    // req.nextUrl.pathname = /api/predictions, /api/predictions/123, etc.
    const base = '/api/';
    const path = req.nextUrl.pathname.slice(base.length);
    const slug = path.split('/').filter(Boolean);
    return slug;
}

export async function GET(req: NextRequest) {
    const slug = getSlugParts(req);
    const searchParams = req.nextUrl.searchParams;

    const query = searchParams.get("include")
    const params = JSON.parse(query!) as Record<string, any> || {};

    //console.log("slug", slug, "query", query, "params", params);

    if (slug.length === 1 && !query) {

        // GET /api/predictions
        const model = slug[0] as keyof typeof prisma;
        const result = await getData(model);
        if (!result.success) return NextResponse.json({ error: 'Failed to fetch ' + model.toString() }, { status: 500 });
        return NextResponse.json(result.data, { status: 200 });

    }
    else if (query && slug.length === 1 && (query.startsWith("{\"userId") || query.startsWith("{\"id") || query.startsWith("{\"authorId"))) {
        //console.log("2 slugs and a query")

        // GET /api/predictions
        const model = slug[0] as keyof typeof prisma;
        const result = await getData(model, params);
        if (!result.success) return NextResponse.json({ error: 'Failed to fetch ' + model.toString() }, { status: 500 });
        return NextResponse.json(result.data, { status: 200 });

    }

    else if (slug.length === 2 && !query) {

        // GET /api/predictions/[id]
        const model = slug[0] as keyof typeof prisma;
        const id = slug[1];
        const result = await getDataById(model, id);
        if (!result.success) return NextResponse.json({ error: model.toString() + ' not found' }, { status: 404 });
        return NextResponse.json(result.data, { status: 200 });

    } else if (slug.length === 2 && query) {
        //console.log("2 slugs with query", query)
        // GET /api/predictions/[id]
        const model = slug[0] as keyof typeof prisma;
        const id = slug[1];
        const include = JSON.parse(query!)
        const result = await getDataWithRelations(model, { id }, include);
        if (!result.success) return NextResponse.json({ error: model.toString() + ' not found' }, { status: 404 });
        return NextResponse.json(result.data, { status: 200 });

    } else if (slug.length === 1 && query) {

        // GET /api/predictions/[id]
        const model = slug[0] as keyof typeof prisma;
        const id = slug[1];
        const include = JSON.parse(query!)
        const result = await getDataWithOption(model, include as Record<string, any>);
        if (!result.success) return NextResponse.json({ error: model.toString() + ' not found' }, { status: 404 });
        return NextResponse.json(result.data, { status: 200 });

    } else return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function POST(req: NextRequest) {
    const slug = getSlugParts(req);
    if (slug.length === 1) {
        // POST /api/predictions
        try {
            const user = await getCurrentUser();
            if (!user || user.role !== 'ADMIN') {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }

            const model = slug[0] as keyof typeof prisma;
            const body = await req.json();
            //if (!body.publishedAt) body.publishedAt = new Date().toISOString();

            if (model.toString() === 'prediction') {
                await createData('league', { name: body.league, sporttype: body.sportType });
            }


            const result = await createData(model, body);
            if (!result.success) {
                return NextResponse.json({ error: 'Failed to create ' + model.toString(), result }, { status: 500 });
            }
            return NextResponse.json(result.data, { status: 201 });
        } catch (error: any) {
            return NextResponse.json({ error: 'Server error: ' + error.message }, { status: 500 });
        }
    }
    else return NextResponse.json({ error: 'Schema Not found' }, { status: 404 });
}

export async function PUT(req: NextRequest) {
    const slug = getSlugParts(req);
    if (slug.length === 2) {
        // PUT /api/predictions/[id]
        try {
            const user = await getCurrentUser();
            if (!user || user.role !== 'ADMIN') {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            const model = slug[0] as keyof typeof prisma;
            const id = slug[1];

            const body = await req.json();

            const result = await updateData(model, { id }, body);
            if (!result.success) {
                return NextResponse.json({ error: 'Failed to update ' + model.toString(), result }, { status: 500 });
            }
            return NextResponse.json(result.data, { status: 200 });
        } catch (error: any) {
            return NextResponse.json({ error: 'Server error' + error }, { status: 500 });
        }
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function DELETE(req: NextRequest) {
    const slug = getSlugParts(req);
    if (slug.length === 2) {
        // DELETE /api/predictions/[id]
        try {
            const user = await getCurrentUser();
            if (!user || user.role !== 'ADMIN') {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            const model = slug[0] as keyof typeof prisma;
            const id = slug[1];
            const result = await deleteData(model, { id });
            if (!result.success) {
                return NextResponse.json({ error: 'Failed to delete ' + model.toString(), result }, { status: 500 });
            }
            return NextResponse.json({ success: true });
        } catch (error) {
            return NextResponse.json({ error: 'Server error' }, { status: 500 });
        }
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
