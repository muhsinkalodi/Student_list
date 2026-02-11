import { NextResponse } from 'next/server';
import { query } from '../../lib/db';

export async function GET() {
    try {
        const result = await query('SELECT * FROM students ORDER BY id DESC');
        return NextResponse.json(result.rows);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { name, college_type, roll_number, state } = await request.json();
        const result = await query(
            'INSERT INTO students(name, college_type, roll_number, state) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, college_type, roll_number, state]
        );
        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}