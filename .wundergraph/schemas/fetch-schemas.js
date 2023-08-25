import axios from 'axios';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

export async function fetchSchemas() {

  // Define the Directus server URL and credentials
  const serverUrl = 'https://directus.andert.me';
  const credentials = {
    email: process.env.EMAIL,
    password: process.env.DIRECTUS_PW
  };

  // Login to the Directus server and get the access token
  const { data: { data: { token } } } = await axios.post(`${serverUrl}/auth/login`, credentials);

  // Fetch the GraphQL SDL schema
  const { data: schema } = await axios.get(`${serverUrl}/server/specs/graphql`, {
    headers: {
      'Authorization': `Bearer ${process.env.DIRECTUS_API}`
    }
  });

  // Save the schema to a file
  fs.writeFileSync('./.wundergraph/schemas/directus.graphql', schema);
}

fetchSchemas().catch(console.error);