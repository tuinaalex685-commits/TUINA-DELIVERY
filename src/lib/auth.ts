import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = process.env.JWT_SECRET;

if (!secretKey) {
  // En production, on plante volontairement l'application pour des raisons de sécurité
  if (process.env.NODE_ENV === 'production') {
    throw new Error('CRITICAL SECURITY ERROR: JWT_SECRET environment variable is missing.');
  } else {
    console.warn('WARNING: JWT_SECRET is missing. Using a fallback key for development only.');
  }
}

const key = new TextEncoder().encode(secretKey || 'tuina-super-secret-key-for-dev-only');

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload;
}

export async function getSession() {
  const session = (await cookies()).get('session')?.value;
  if (!session) return null;
  return await decrypt(session);
}
