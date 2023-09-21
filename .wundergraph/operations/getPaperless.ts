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


        // Add download link, thumbnail link, preview link, PDF data, and metadata to each document
        const documentsWithLinksDataAndMetadata = await Promise.all(data.results.map(async doc => {
            const response = await axios.get(`https://paperless.andert.me/api/documents/${doc.id}/preview/`, {
                responseType: 'arraybuffer',
                headers: {
                    Authorization: process.env.PAPERLESS_TOKEN,
                },
            });

            const pdfData = Buffer.from(response.data, 'binary').toString('base64');

            const correspondentResponse = await axios.get(`https://paperless.andert.me/api/correspondents/${doc.correspondent}/`, {
                headers: {
                    Authorization: process.env.PAPERLESS_TOKEN,
                },
            });
            const correspondent = correspondentResponse.data;

            const tagsResponse = await Promise.all(doc.tags.map(tag => axios.get(`https://paperless.andert.me/api/tags/${tag}/`, {
                headers: {
                    Authorization: process.env.PAPERLESS_TOKEN,
                },
            })));
            const tags = tagsResponse.map(response => response.data);

            const documentTypeResponse = await axios.get(`https://paperless.andert.me/api/document_types/${doc.document_type}/`, {
                headers: {
                    Authorization: process.env.PAPERLESS_TOKEN,
                },
            });
            const documentType = documentTypeResponse.data;

            return {
                ...doc,
                downloadLink: `https://paperless.andert.me/api/documents/${doc.id}/download/`,
                thumbnailLink: `https://paperless.andert.me/api/documents/${doc.id}/thumb/`,
                previewLink: `https://paperless.andert.me/api/documents/${doc.id}/preview/`,
                pdfData,
                correspondent,
                tags,
                document_type: documentType,
            };
        }));

        return documentsWithLinksDataAndMetadata;
    },
});