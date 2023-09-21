// .wundergraph/operations/getChatwootContacts.ts
import { createOperation, z } from '../generated/wundergraph.factory';
import axios from 'axios';

export default createOperation.query({
    input: z.object({
        page: z.number().optional(),
    }),
    handler: async ({ page = 1 }) => {
        console.log('Making request to Chatwoot API');

        const { data } = await axios.get(`https://chatwoot.andert.me/api/v1/accounts/1/contacts?page=${page}`, {
            headers: {
                api_access_token: process.env.CHATWOOT_API_ACCESS_TOKEN
            },
        });

        return data;
    },
});