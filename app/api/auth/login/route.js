
import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import { encrypt, verifyPassword, hashPassword } from '../../../../lib/auth';

export async function POST(request) {
    try {
        const { username, password } = await request.json();

        // 1. Find user
        const result = await query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

        // If no user found, check if it's the initial superuser setup
        if (!user && username === 'dpt' && password === 'muhadmin1') {
            // Auto-create the initial superuser if it doesn't exist
            const hashedPassword = await hashPassword(password);
            const newUser = await query(
                `INSERT INTO users (name, phone_number, username, password, role) 
          VALUES ($1, $2, $3, $4, $5) RETURNING *`,
                ['Muhsin', '8778484505', 'dpt', hashedPassword, 'superuser']
            );

            const session = await encrypt({ id: newUser.rows[0].id, role: newUser.rows[0].role, name: newUser.rows[0].name });

            return new NextResponse(JSON.stringify({ success: true }), {
                status: 200,
                headers: {
                    'Set-Cookie': `session=${session}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`,
                },
            });
        }

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // 2. Verify password
        // Check if password matches direct plain text (migration) or hash
        let isValid = await verifyPassword(password, user.password);

        // Fallback for the prompt's specific initial password if it wasn't hashed yet
        if (!isValid && password === user.password) {
            // It matched plain text, so let's update it to hash for security
            const newHash = await hashPassword(password);
            await query('UPDATE users SET password = $1 WHERE id = $2', [newHash, user.id]);
            isValid = true;
        }

        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // 3. Create session
        const session = await encrypt({ id: user.id, role: user.role, name: user.name });

        // 4. Set cookie
        return new NextResponse(JSON.stringify({ success: true }), {
            status: 200,
            headers: {
                'Set-Cookie': `session=${session}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`, // 1 day
            },
        });
    } catch (err) {
        console.error('Login error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
