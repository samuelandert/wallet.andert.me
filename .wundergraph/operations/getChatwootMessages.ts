// .wundergraph/operations/getChatwootMessages.ts
import { createOperation, z } from '../generated/wundergraph.factory';
import axios from 'axios';

export default createOperation.query({
    input: z.object({
        conversationId: z.string(),
    }),
    handler: async ({ input }) => {
        console.log('Making request to Chatwoot API');

        const { data } = await axios.get(`https://chatwoot.andert.me/api/v1/accounts/1/conversations/${input.conversationId}/messages`, {
            headers: {
                api_access_token: process.env.CHATWOOT_API_ACCESS_TOKEN
            },
        });

        return data;
    },
});