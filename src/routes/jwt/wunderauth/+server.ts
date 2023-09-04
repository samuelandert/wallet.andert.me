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
        const { payload } = await verifyJwt({ jwt: token });
        if (
            payload.baseUrl !== "https://localhost:3000/" ||
            payload.path !== "wunderauth" ||
            payload.orgId !== "°" ||
            payload.role !== "owner" ||
            payload.extraData !== ""
        ) {
            console.log("JWT payload not matching");
            throw error(401, "JWT payload not macting")
        }
        console.log(payload);
        return new Response(JSON.stringify(payload), { status: 200 });
    } catch (err) {
        console.log("JWT error");
        throw error(401, "JWT payload not machting")
    }
}