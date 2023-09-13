import { configureWunderGraphApplication, cors, EnvironmentVariable, introspect, templates } from '@wundergraph/sdk';
import server from './wundergraph.server';
import operations from './wundergraph.operations';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const directusSchema = fs.readFileSync(path.join(path.resolve(), './schemas/directus.graphql'), 'utf8');
const directusSystemSchema = fs.readFileSync(path.join(path.resolve(), './schemas/directus_system.graphql'), 'utf8');

const spaceX = introspect.graphql({
	apiNamespace: 'spacex',
	url: 'https://spacex-api.fly.dev/graphql/',
});

const db = introspect.graphql({
	apiNamespace: 'db',
	loadSchemaFromString: directusSchema,
	url: 'https://directus.andert.me/graphql',
	headers: (builder) => builder
		.addStaticHeader('Authorization', new EnvironmentVariable('DIRECTUS', process.env.DIRECTUS))
});

const system_db = introspect.graphql({
	apiNamespace: 'system_db',
	loadSchemaFromString: directusSystemSchema,
	url: 'https://directus.andert.me/graphql/system',
	headers: (builder) => builder
		.addStaticHeader('Authorization', new EnvironmentVariable('DIRECTUS', process.env.DIRECTUS))
});

// configureWunderGraph emits the configuration
configureWunderGraphApplication({
	apis: [spaceX, db, system_db],
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
	authentication: {
		tokenBased: {
			providers: [
				{
					userInfoEndpoint: 'http://localhost:3000/server/wundergraph',
				},
			],
		},
	},
	authorization: {
		roles: ['owner'],
	},
});
