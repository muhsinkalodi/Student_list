
import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';
import { getSession, hashPassword } from '../../../lib/auth';

export async function GET() {
    const session = await getSession();
    if (!session || session.role !== 'superuser') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const result = await query('SELECT id, name, username, role, phone_number, created_at FROM users ORDER BY id DESC');
        return NextResponse.json(result.rows);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(request) {
    const session = await getSession();
    if (!session || session.role !== 'superuser') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const { name, username, password, phone_number, role } = await request.json();

        // Validation
        if (!name || !username || !password || !phone_number) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const hashedPassword = await hashPassword(password);

        const result = await query(
            `INSERT INTO users (name, username, password, phone_number, role) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id, name, username, role`,
            [name, username, hashedPassword, phone_number, role || 'admin']
        );

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (err) {
        // Handle unique constraint violations
        if (err.code === '23505') {
            return NextResponse.json({ error: 'Username or phone number already exists' }, { status: 409 });
        }
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
