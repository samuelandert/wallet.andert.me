// src/routes/api/auth/+server.ts
import jwt from 'jsonwebtoken';
import { error } from '@sveltejs/kit';

const secretKey = 'mysecrettestkey';

export async function POST() {
  const token = jwt.sign({ name: 'Samuel', loggedIn: true, roles: ['admin'] }, secretKey);
  if (!token) {
    throw error(400, 'No token created.');
  }
  return new Response(JSON.stringify({ token }), { status: 200 });
}