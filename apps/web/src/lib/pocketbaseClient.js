import Pocketbase from 'pocketbase';

const DEFAULT_POCKETBASE_API_URL = 'https://53ea2c41-a62a-41ac-b570-286c6836dd74.app-preview.com/hcgi/platform';
const POCKETBASE_API_URL =
    import.meta.env.VITE_POCKETBASE_API_URL ||
    (typeof window !== 'undefined' && window.location.hostname === 'dev.caxperts-engineering.com'
        ? DEFAULT_POCKETBASE_API_URL
        : '/hcgi/platform');

const pocketbaseClient = new Pocketbase(POCKETBASE_API_URL);

export default pocketbaseClient;

export { pocketbaseClient };
