// .wundergraph/operations/paper.ts
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

        // Fetch additional metadata for each document
        const documents = await Promise.all(data.results.map(async doc => {
            let correspondent = null;
            if (doc.correspondent) {
                const correspondentResponse = await axios.get(`https://paperless.andert.me/api/correspondents/${doc.correspondent}/`, {
                    headers: {
                        Authorization: process.env.PAPERLESS_TOKEN,
                    },
                });
                correspondent = correspondentResponse.data;
            }

            let tags = [];
            if (doc.tags) {
                const tagsResponse = await Promise.all(doc.tags.map(tag => axios.get(`https://paperless.andert.me/api/tags/${tag}/`, {
                    headers: {
                        Authorization: process.env.PAPERLESS_TOKEN,
                    },
                })));
                tags = tagsResponse.map(response => response.data);
            }

            let documentType = null;
            if (doc.document_type) {
                const documentTypeResponse = await axios.get(`https://paperless.andert.me/api/document_types/${doc.document_type}/`, {
                    headers: {
                        Authorization: process.env.PAPERLESS_TOKEN,
                    },
                });
                documentType = documentTypeResponse.data;
            }

            return {
                ...doc,
                correspondent,
                tags,
                documentType,
            };
        }));

        return documents;
    },
});