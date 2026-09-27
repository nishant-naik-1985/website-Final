import Pocketbase from 'pocketbase';

// Always use the same-origin proxy from the web app. The browser cannot
// directly call the PocketBase preview URL without CORS errors, and a build-time
// override here is what caused the live site to bypass the proxy.
const POCKETBASE_API_URL = '/api/pocketbase';

const pocketbaseClient = new Pocketbase(POCKETBASE_API_URL);

export default pocketbaseClient;

export { pocketbaseClient };
