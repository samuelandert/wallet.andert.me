import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ locals }) => {
    await locals.session.set({ myPKP: "hello1" });

    return {
        myPKP: locals.session.data.myPKP
    };
};

