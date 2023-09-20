import { mockApps } from '$lib/mockApps';

export function load({ params }) {
    const { name } = params;
    const app = mockApps.find(a => a.name == name);

    if (app) {
        return { props: { app } };
    }
    
    return { status: 404 };
}
