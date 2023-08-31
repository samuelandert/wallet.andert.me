import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { fetchSchemas } from './.wundergraph/schemas/fetch-schemas';
import { vitePreprocess } from '@sveltejs/kit/vite';

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