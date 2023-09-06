import { createOperation, z } from '../generated/wundergraph.factory';
import axios from 'axios';

export default createOperation.query({
    input: z.object({
        address: z.string(),
    }),
    handler: async ({ input }) => {
        const { data } = await axios.get('https://api.gnosisscan.io/api', {
            params: {
                module: 'account',
                action: 'txlist',
                address: input.address,
                startblock: 0,
                endblock: 'latest',
                sort: 'desc',
                apikey: process.env.GNOSISSCAN_API,
            },
        });
        return {
            transactions: data.result.map(transaction => ({
                ...transaction,
                timestamp: new Date(transaction.timeStamp * 1000).toISOString(),
            })),
        };
    },
});