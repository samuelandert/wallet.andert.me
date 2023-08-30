// src/routes/api/session/+server.ts
import jwt from 'jsonwebtoken';
import { error } from '@sveltejs/kit';

const secretKey = process.env.JWT_KEY;

export async function GET({ request }) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    throw error(401, 'No Authorization header provided.');
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    throw error(401, 'No token provided.');
  }

  try {
    const user = jwt.verify(token, secretKey);
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (err) {
    throw error(401, 'Invalid token.');
  }
}