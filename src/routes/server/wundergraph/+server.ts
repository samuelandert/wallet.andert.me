import { verifyJwt } from "@lit-protocol/lit-node-client";
import { error } from '@sveltejs/kit';

export async function GET({ request }) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
        throw error(401, 'No Authorization header provided.');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        throw error(401, 'No jwt provided.');
    }

    try {
        const { verified, payload } = await verifyJwt({ jwt: token });
        if (
            payload.baseUrl !== "https://localhost:3000" ||
            payload.path !== "/server/wundergraph" ||
            payload.orgId !== "°" ||
            payload.role !== "owner" ||
            payload.extraData !== ""
        ) {
            console.log("JWT payload not matching");
            throw error(401, "JWT payload not matching")
        }
        console.log("JWT Server request verified: ", verified);
        console.log("JWT Server request payload: ", payload);
        return new Response(JSON.stringify(payload), { status: 200 });
    } catch (err) {
        console.log("JWT error");
        throw error(401, "JWT error")
    }
}