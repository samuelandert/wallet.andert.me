import { configureWunderGraphApplication, cors, EnvironmentVariable, introspect, templates } from '@wundergraph/sdk';
import server from './wundergraph.server';
import operations from './wundergraph.operations';
import fs from 'fs';
import path from 'path';

const directusSchema = fs.readFileSync(path.join(path.resolve(), './schemas/directus.graphql'), 'utf8');

const countries = introspect.graphql({
	apiNamespace: 'countries',
	url: 'https://countries.trevorblades.com/',
});

const spaceX = introspect.graphql({
	apiNamespace: 'spacex',
	url: 'https://spacex-api.fly.dev/graphql/',
});

const directus = introspect.graphql({
	apiNamespace: 'directus',
	loadSchemaFromString: directusSchema,
	url: 'https://directus.andert.me/graphql',
	headers: (builder) => builder.addStaticHeader('Authorization', 'Bearer Bv5RknRvv5AZouxcYdBJgVOe3ZC493Y3')
});

// configureWunderGraph emits the configuration
configureWunderGraphApplication({
	apis: [countries, spaceX, directus],
	server,
	operations,
	generate: {
		codeGenerators: [
			{
				templates: [
					// use all the typescript react templates to generate a client
					...templates.typescript.all,
				],
				path: '../src/lib/.wundergraph/generated',
			},
		],
	},
	cors: {
		...cors.allowAll,
		allowedOrigins:
			process.env.NODE_ENV === 'production'
				? [
					// change this before deploying to production to the actual domain where you're deploying your app
					'http://localhost:3000',
				]
				: ['http://localhost:3000', new EnvironmentVariable('WG_ALLOWED_ORIGIN')],
	},
	security: {
		enableGraphQLEndpoint: process.env.NODE_ENV !== 'production' || process.env.GITPOD_WORKSPACE_ID !== undefined,
	},
});
