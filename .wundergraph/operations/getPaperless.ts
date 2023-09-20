// .wundergraph/operations/getPaperless.ts
import { createOperation, z } from '../generated/wundergraph.factory';
import axios from 'axios';

export default createOperation.query({
    input: z.object({}),
    handler: async () => {
        console.log('Making request to Paperless API');

        const { data } = await axios.get('https://paperless.andert.me/api/documents/', {
            headers: {
                Authorization: process.env.PAPERLESS_TOKEN,
            },
        });

        console.log('Received response:', data.results);

        // Add download link, thumbnail link, preview link, and PDF data to each document
        const documentsWithLinksAndData = await Promise.all(data.results.map(async doc => {
            const response = await axios.get(`https://paperless.andert.me/api/documents/${doc.id}/preview/`, {
                responseType: 'arraybuffer',
                headers: {
                    Authorization: process.env.PAPERLESS_TOKEN,
                },
            });
            const pdfData = Buffer.from(response.data, 'binary').toString('base64');

            return {
                ...doc,
                downloadLink: `https://paperless.andert.me/api/documents/${doc.id}/download/`,
                thumbnailLink: `https://paperless.andert.me/api/documents/${doc.id}/thumb/`,
                previewLink: `https://paperless.andert.me/api/documents/${doc.id}/preview/`,
                pdfData,
            };
        }));

        return documentsWithLinksAndData;
    },
});