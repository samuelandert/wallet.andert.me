// .wundergraph/operations/getChatwootConversations.ts
import { createOperation, z } from '../generated/wundergraph.factory';
import axios from 'axios';

export default createOperation.query({
    input: z.object({}),
    handler: async () => {
        console.log('Making request to Chatwoot API');

        const { data } = await axios.get('https://chatwoot.andert.me/api/v1/accounts/1/conversations?status=open&sort_by=last_activity_at', {
            headers: {
                api_access_token: process.env.CHATWOOT_API_ACCESS_TOKEN
            },
        });


        return data;
    },
});