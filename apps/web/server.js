import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const distDirectory = path.join(currentDirectory, 'dist');
const port = Number(process.env.PORT) || 3000;
const pocketbaseBackendUrl = process.env.POCKETBASE_API_URL || 'https://53ea2c41-a62a-41ac-b570-286c6836dd74.app-preview.com/hcgi/platform';

const contentTypes = {
	'.css': 'text/css; charset=utf-8',
	'.gif': 'image/gif',
	'.html': 'text/html; charset=utf-8',
	'.ico': 'image/x-icon',
	'.jpg': 'image/jpeg',
	'.js': 'application/javascript; charset=utf-8',
	'.json': 'application/json; charset=utf-8',
	'.png': 'image/png',
	'.svg': 'image/svg+xml',
	'.webp': 'image/webp',
	'.woff': 'font/woff',
	'.woff2': 'font/woff2',
};

function serveFile(response, filePath) {
	const extension = path.extname(filePath).toLowerCase();
	const contentType = contentTypes[extension] || 'application/octet-stream';

	response.writeHead(200, { 'Content-Type': contentType });
	fs.createReadStream(filePath).pipe(response);
}

async function proxyPocketbaseRequest(request, response, requestPath) {
	const requestUrl = requestPath === '/api/pocketbase'
		? `${pocketbaseBackendUrl}/api`
		: `${pocketbaseBackendUrl}${requestPath.replace(/^\/api\/pocketbase/, '')}`;

	try {
		const body = request.method === 'GET' || request.method === 'HEAD'
			? undefined
			: await new Promise((resolve, reject) => {
				let chunk = '';
				request.on('data', (data) => {
					chunk += data.toString();
				});
				request.on('end', () => resolve(chunk));
				request.on('error', reject);
			});

		const backendResponse = await fetch(requestUrl, {
			method: request.method,
			headers: {
				'Content-Type': request.headers['content-type'] || 'application/json',
				'Accept': request.headers.accept || 'application/json',
				...(request.headers.authorization ? { Authorization: request.headers.authorization } : {}),
			},
			body: body && body.length ? body : undefined,
		});

		const responseBody = await backendResponse.text();
		const headers = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
		};

		if (backendResponse.headers.get('content-type')) {
			headers['Content-Type'] = backendResponse.headers.get('content-type');
		}

		response.writeHead(backendResponse.status, headers);
		response.end(responseBody);
	} catch (error) {
		response.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' });
		response.end(JSON.stringify({ message: 'PocketBase proxy error', error: error.message }));
	}
}

const server = http.createServer(async (request, response) => {
	try {
		const requestPath = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);

		if (requestPath === '/api/pocketbase' || requestPath.startsWith('/api/pocketbase/')) {
			if (request.method === 'OPTIONS') {
				response.writeHead(204, {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
				});
				response.end();
				return;
			}
			await proxyPocketbaseRequest(request, response, requestPath);
			return;
		}

		const relativePath = requestPath === '/' ? 'index.html' : requestPath.slice(1);
		const requestedFile = path.resolve(distDirectory, relativePath);

		if (!requestedFile.startsWith(`${distDirectory}${path.sep}`) && !requestedFile.startsWith(distDirectory)) {
			response.writeHead(403);
			response.end('Forbidden');
			return;
		}

		if (fs.existsSync(requestedFile) && fs.statSync(requestedFile).isFile()) {
			serveFile(response, requestedFile);
			return;
		}

		serveFile(response, path.join(distDirectory, 'index.html'));
	} catch {
		response.writeHead(404);
		response.end('Not found');
	}
});

server.listen(port, '0.0.0.0', () => {
	console.log(`Web app listening on port ${port}`);
});