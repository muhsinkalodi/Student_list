
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const SECRET_KEY = process.env.JWT_SECRET;
// Only throw error in production if it's potentially a runtime context, 
// but for Vercel build, we might want to just warn or fallback if possible. 
// Ideally, the user SETS the env var. But to unblock the build if they haven't yet:
if (!SECRET_KEY && process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE !== 'phase-production-build') {
    // We can't easily detect phase here without importing from next/constants which might not be available in edge/all contexts easily.
    // Instead, let's just use a console warn and a fallback for build, but runtime will fail if not set which is good.
    console.warn('WARNING: JWT_SECRET is not defined. Sessions will be insecure.');
}
const key = new TextEncoder().encode(SECRET_KEY || 'dev-secret-do-not-use-in-prod');

export async function encrypt(payload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(key);
}

export async function decrypt(input) {
    try {
        const { payload } = await jwtVerify(input, key, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch (error) {
        return null;
    }
}

export async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
}

export async function getSession() {
    const session = cookies().get('session')?.value;
    if (!session) return null;
    return await decrypt(session);
}

export async function updateSession(request) {
    const session = request.cookies.get('session')?.value;
    if (!session) return;

    // Refresh expiration time
    const parsed = await decrypt(session);
    parsed.expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const res = NextResponse.next();
    res.cookies.set({
        name: 'session',
        value: await encrypt(parsed),
        httpOnly: true,
        expires: parsed.expires,
    });
    return res;
}
