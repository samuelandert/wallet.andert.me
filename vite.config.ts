import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { fetchSchema } from './.wundergraph/schemas/fetch-schemas';

export default defineConfig({
	plugins: [
		sveltekit(),
		{
			name: 'fetch-schema',
			apply: 'build',
			configResolved(config) {
				if (config.command === 'build' || config.command === 'serve') {
					fetchSchemas().catch(console.error);
				}
			},
		},
	],
});