import jwt from 'jsonwebtoken';
import { error } from '@sveltejs/kit';

const secretKey = process.env.JWT_KEY;

export async function POST({ request }) {
  const user = await request.json();
  const token = jwt.sign(user, secretKey);
  if (!token) {
    throw error(400, 'No token created.');
  }
  return new Response(JSON.stringify({ token }), { status: 200 });
}