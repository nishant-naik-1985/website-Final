import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import nodemailer from 'nodemailer';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const distDirectory = path.join(currentDirectory, 'dist');
const port = Number(process.env.PORT) || 3000;
const pocketbaseBackendUrl = process.env.POCKETBASE_API_URL || 'https://53ea2c41-a62a-41ac-b570-286c6836dd74.app-preview.com/hcgi/platform';

const MAIL_CONFIG_PATH = process.env.MAIL_CONFIG_PATH || '../mail.config.json';
const MAIL_CONFIG_FILE = path.resolve(currentDirectory, MAIL_CONFIG_PATH);

function maskSecret(value) {
	if (!value) return 'not set';
	if (value.length <= 4) return '****';
	return `${value.slice(0, 2)}${'*'.repeat(Math.max(2, value.length - 4))}${value.slice(-2)}`;
}

function readMailConfigFile(filePath) {
	try {
		const raw = fs.readFileSync(filePath, 'utf-8');
		return JSON.parse(raw);
	} catch (error) {
		if (error.code !== 'ENOENT') {
			console.warn(`[SMTP] Could not read mail config file at ${filePath}: ${error.message}`);
		}
		return null;
	}
}

function loadMailConfig() {
	const envConfig = {
		host: process.env.SMTP_HOST || 'smtp.hostinger.com',
		port: Number(process.env.SMTP_PORT) || 465,
		secure: process.env.SMTP_SECURE === 'false' ? false : true,
		username: process.env.SMTP_USER || process.env.SMTP_USERNAME || '',
		password: process.env.SMTP_PASS || process.env.SMTP_PASSWORD || '',
		from_email: process.env.SMTP_FROM_EMAIL || process.env.CONTACT_FROM || 'info@caxperts-engineering.com',
		from_name: process.env.SMTP_FROM_NAME || 'CAxperts Engineering',
		to_email: process.env.CONTACT_TO || process.env.SMTP_TO || 'info@caxperts-engineering.com',
	};

	const fileConfig = readMailConfigFile(MAIL_CONFIG_FILE);
	const mergedConfig = {
		...envConfig,
		...(fileConfig || {}),
	};

	const finalConfig = {
		host: mergedConfig.host || envConfig.host,
		port: Number(mergedConfig.port) || envConfig.port,
		secure: mergedConfig.secure === false ? false : true,
		username: mergedConfig.username || mergedConfig.user || '',
		password: mergedConfig.password || mergedConfig.pass || '',
		from_email: mergedConfig.from_email || mergedConfig.fromEmail || envConfig.from_email,
		from_name: mergedConfig.from_name || mergedConfig.fromName || envConfig.from_name,
		to_email: mergedConfig.to_email || mergedConfig.to || envConfig.to_email,
	};

	if (!finalConfig.username || !finalConfig.password || !finalConfig.to_email || !finalConfig.from_email) {
		console.warn(`[SMTP] No SMTP config found for the contact form. Expected ${MAIL_CONFIG_FILE} or SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS/CONTACT_TO. SMTP is disabled.`);
		return null;
	}

	return finalConfig;
}

const mailConfig = loadMailConfig();

const INTEREST_LABELS = {
	'cae-simulation': 'CAE & Simulation',
	'cad-engineering': 'CAD & Engineering',
	'pre-post-processing': 'Pre/Post Processing',
	'engineering-consulting': 'Engineering Consulting',
	'digital-engineering-automation': 'Digital Engineering & Automation',
	'resource-augmentation': 'Resource Augmentation',
	other: 'Other',
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9()\s-]{7,20}$/;

let mailTransporter = null;
function getMailTransporter() {
	if (!mailConfig) {
		return null;
	}

	if (!mailTransporter) {
		mailTransporter = nodemailer.createTransport({
			host: mailConfig.host,
			port: Number(mailConfig.port),
			secure: Boolean(mailConfig.secure),
			auth: { user: mailConfig.username, pass: mailConfig.password },
		});
	}

	return mailTransporter;
}

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const rateLimitHits = new Map();

function isRateLimited(clientIp) {
	const now = Date.now();
	const windowStart = now - RATE_LIMIT_WINDOW_MS;
	const hits = (rateLimitHits.get(clientIp) || []).filter((timestamp) => timestamp > windowStart);
	hits.push(now);
	rateLimitHits.set(clientIp, hits);
	return hits.length > RATE_LIMIT_MAX_REQUESTS;
}

setInterval(() => {
	const windowStart = Date.now() - RATE_LIMIT_WINDOW_MS;
	for (const [clientIp, hits] of rateLimitHits) {
		const recentHits = hits.filter((timestamp) => timestamp > windowStart);
		if (recentHits.length === 0) {
			rateLimitHits.delete(clientIp);
		} else {
			rateLimitHits.set(clientIp, recentHits);
		}
	}
}, RATE_LIMIT_WINDOW_MS).unref();

function getClientIp(request) {
	const forwardedFor = request.headers['x-forwarded-for'];
	if (typeof forwardedFor === 'string' && forwardedFor.trim()) {
		return forwardedFor.split(',')[0].trim();
	}
	return request.socket.remoteAddress || 'unknown';
}

function readRequestBody(request, maxBytes = 20_000) {
	return new Promise((resolve, reject) => {
		let body = '';
		let size = 0;

		request.on('data', (chunk) => {
			size += chunk.length;
			if (size > maxBytes) {
				reject(new Error('Payload too large'));
				request.destroy();
				return;
			}
			body += chunk.toString();
		});
		request.on('end', () => resolve(body));
		request.on('error', reject);
	});
}

function stripHtml(value = '') {
	return String(value)
		.replace(/<script[\s\S]*?<\/script>/gi, ' ')
		.replace(/<style[\s\S]*?<\/style>/gi, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function escapeHtml(value = '') {
	return String(value)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}

function validateContactSubmission(payload) {
	const errors = [];
	const name = stripHtml(typeof payload.name === 'string' ? payload.name : '').slice(0, 200);
	const company = stripHtml(typeof payload.company === 'string' ? payload.company : '').slice(0, 200);
	const email = stripHtml(typeof payload.email === 'string' ? payload.email : '').slice(0, 200);
	const message = stripHtml(typeof payload.message === 'string' ? payload.message : '').slice(0, 5000);
	const phone = stripHtml(typeof payload.phone === 'string' ? payload.phone : '').slice(0, 40);
	const interest = stripHtml(typeof payload.interest === 'string' ? payload.interest : '').slice(0, 200);

	if (!name) {
		errors.push('Please provide your name.');
	}
	if (!email || !EMAIL_PATTERN.test(email)) {
		errors.push('Please provide a valid email address.');
	}
	if (!message) {
		errors.push('Please provide a message.');
	}
	if (phone && !PHONE_PATTERN.test(phone)) {
		errors.push('Please provide a valid phone number.');
	}
	if (company && company.length > 200) {
		errors.push('Company name is too long.');
	}
	if (message && message.length > 5000) {
		errors.push('Your message is too long.');
	}
	if (interest && !INTEREST_LABELS[interest]) {
		errors.push('Please select a valid area of interest.');
	}

	return { errors, data: { name, company, email, phone, message, interest } };
}

async function handleContactRequest(request, response) {
	if (request.method !== 'POST') {
		response.writeHead(405, { 'Content-Type': 'application/json; charset=utf-8', Allow: 'POST' });
		response.end(JSON.stringify({ ok: false, error: 'Method not allowed.' }));
		return;
	}

	const clientIp = getClientIp(request);
	if (isRateLimited(clientIp)) {
		response.writeHead(429, { 'Content-Type': 'application/json; charset=utf-8' });
		response.end(JSON.stringify({ ok: false, error: 'Too many submissions. Please try again later.' }));
		return;
	}

	let payload;
	try {
		const rawBody = await readRequestBody(request);
		payload = rawBody ? JSON.parse(rawBody) : {};
	} catch {
		response.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
		response.end(JSON.stringify({ ok: false, error: 'Invalid request body.' }));
		return;
	}

	if (typeof payload.website === 'string' && payload.website.trim() !== '') {
		response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
		response.end(JSON.stringify({ ok: true }));
		return;
	}

	const { errors, data } = validateContactSubmission(payload);
	if (errors.length > 0) {
		response.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
		response.end(JSON.stringify({ ok: false, error: errors[0] }));
		return;
	}

	if (!mailConfig) {
		console.warn('[SMTP] Contact form is unavailable because no SMTP config was found.');
		response.writeHead(503, { 'Content-Type': 'application/json; charset=utf-8' });
		response.end(JSON.stringify({ ok: false, error: 'Email service is not configured. Please contact us directly at info@caxperts-engineering.com.' }));
		return;
	}

	const transporter = getMailTransporter();
	if (!transporter) {
		console.error('[SMTP] Transporter could not be created.');
		response.writeHead(503, { 'Content-Type': 'application/json; charset=utf-8' });
		response.end(JSON.stringify({ ok: false, error: 'Email service is not configured. Please contact us directly at info@caxperts-engineering.com.' }));
		return;
	}

	const interestLabel = INTEREST_LABELS[data.interest] || 'Not provided';
	const timestamp = new Date().toISOString();
	const companyLabel = data.company || 'No company provided';
	const plainText = [
		`Name: ${data.name}`,
		`Company: ${companyLabel}`,
		`Email: ${data.email}`,
		`Phone: ${data.phone || 'Not provided'}`,
		`Area of interest: ${interestLabel}`,
		`Time: ${timestamp}`,
		'',
		'Message:',
		data.message,
	].join('\n');
	const htmlBody = `
		<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
			<h2 style="margin-bottom: 12px;">Website enquiry</h2>
			<p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
			<p><strong>Company:</strong> ${escapeHtml(companyLabel)}</p>
			<p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
			<p><strong>Phone:</strong> ${escapeHtml(data.phone || 'Not provided')}</p>
			<p><strong>Area of interest:</strong> ${escapeHtml(interestLabel)}</p>
			<p><strong>Submitted:</strong> ${escapeHtml(timestamp)}</p>
			<p><strong>Message:</strong></p>
			<div style="white-space: pre-wrap; background: #f3f4f6; padding: 12px; border-radius: 6px;">${escapeHtml(data.message)}</div>
		</div>
	`;

	try {
		await transporter.sendMail({
			from: `${mailConfig.from_name} <${mailConfig.from_email}>`,
			to: mailConfig.to_email,
			replyTo: `${data.name} <${data.email}>`,
			subject: `Website enquiry: ${data.name} (${companyLabel})`,
			text: plainText,
			html: htmlBody,
		});

		response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
		response.end(JSON.stringify({ ok: true }));
	} catch (error) {
		console.error('[SMTP] Failed to send contact form email:', error.message || error);
		response.writeHead(503, { 'Content-Type': 'application/json; charset=utf-8' });
		response.end(JSON.stringify({ ok: false, error: 'We could not send your message right now. Please email info@caxperts-engineering.com directly.' }));
	}
}

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

		if (requestPath === '/api/contact') {
			await handleContactRequest(request, response);
			return;
		}

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