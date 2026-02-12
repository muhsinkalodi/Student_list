
import { NextResponse } from 'next/server';

export async function POST() {
    return new NextResponse(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
            'Set-Cookie': `session=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict`,
        },
    });
}
