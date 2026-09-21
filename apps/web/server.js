import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const distDirectory = path.join(currentDirectory, 'dist');
const port = Number(process.env.PORT) || 3000;

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

const server = http.createServer((request, response) => {
	try {
		const requestPath = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
		const relativePath = requestPath === '/' ? 'index.html' : requestPath.slice(1);
		const requestedFile = path.resolve(distDirectory, relativePath);

		if (!requestedFile.startsWith(`${distDirectory}${path.sep}`)) {
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