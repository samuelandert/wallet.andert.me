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
        action: 'balance',
        address: input.address,
        tag: 'latest',
        apikey: process.env.GNOSISSCAN_API,
      },
    });
    return {
      balance: parseFloat(data.result),
    };
  },
});