#!/usr/bin/env node
// Runs after `vite build`. The site is a single-page app, so every URL is
// served the same dist/index.html — and link-preview bots (LinkedIn, WhatsApp,
// Slack...) don't run JavaScript, so they would only ever see the home page's
// title. This writes a copy of index.html per page with that page's title,
// description, canonical URL and Open Graph tags, plus sitemap.xml and
// llms.txt from the same page list.
//
// Pages come from two places:
//   - static routes in src/App.jsx, whose <title> and description are read
//     from the literal <Helmet> tags in the page file;
//   - service pages, from src/data/services.js.
//
// Per-page files go to dist/_pages/<path>.html. The .htaccess rewrites
// /careers to /_pages/careers.html, so no real folder shadows a route.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SITE_URL = 'https://caxperts-engineering.com';
const SITE_NAME = 'CAxperts Engineering';
const OG_IMAGE = { url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 };

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = path.join(root, 'src');
const distDir = path.join(root, 'dist');
const pagesOutDir = path.join(distDir, '_pages');

function escapeHtml(value) {
	return String(value)
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

// JSX text uses HTML entities (&rsquo;, &amp;); decode the common ones so they
// aren't double-escaped.
function decodeEntities(value) {
	return value
		.replace(/&rsquo;|&lsquo;/g, "'")
		.replace(/&ldquo;|&rdquo;|&quot;/g, '"')
		.replace(/&ndash;/g, '–')
		.replace(/&mdash;/g, '—')
		.replace(/&amp;/g, '&');
}

function readStaticPages() {
	const app = fs.readFileSync(path.join(srcDir, 'App.jsx'), 'utf8');
	const pages = [];

	for (const match of app.matchAll(/<Route\s+path="([^"]+)"\s+element=\{<(\w+)\s*\/>\}/g)) {
		const [, routePath, component] = match;
		// Skip the 404 catch-all and parameterised routes (service pages are listed from data).
		if (routePath.includes('*') || routePath.includes(':')) continue;

		const file = path.join(srcDir, 'pages', `${component}.jsx`);
		if (!fs.existsSync(file)) continue;

		const helmet = fs.readFileSync(file, 'utf8').match(/<Helmet>([\s\S]*?)<\/Helmet>/);
		const title = helmet?.[1].match(/<title>\s*([^<{]+?)\s*<\/title>/)?.[1];
		const description = helmet?.[1].match(/<meta\s+name="description"\s+content="([^"]+)"/)?.[1];

		if (!title || !description) {
			console.warn(`[prerender] ${component}: no literal <title>/description in <Helmet>, skipped.`);
			continue;
		}

		pages.push({ path: routePath, title: decodeEntities(title), description: decodeEntities(description) });
	}

	return pages;
}

async function readServicePages() {
	const { SERVICES } = await import(pathToFileURL(path.join(srcDir, 'data', 'services.js')).href);
	return SERVICES.map((service) => ({
		path: `/services/${service.slug}`,
		title: `${service.title} Services | ${SITE_NAME}`,
		description: service.metaDescription,
	}));
}

// Tags carry data-react-helmet so react-helmet replaces them once the app
// loads, instead of leaving duplicates in the page.
function headTags(page) {
	const url = `${SITE_URL}${page.path === '/' ? '/' : page.path}`;
	const title = escapeHtml(page.title);
	const description = escapeHtml(page.description);
	const tag = (html) => `\t\t${html.replace(/^<(\w+)/, '<$1 data-react-helmet="true"')}`;

	return [
		tag(`<meta name="description" content="${description}" />`),
		tag(`<link rel="canonical" href="${url}" />`),
		tag(`<meta property="og:type" content="website" />`),
		tag(`<meta property="og:site_name" content="${SITE_NAME}" />`),
		tag(`<meta property="og:url" content="${url}" />`),
		tag(`<meta property="og:title" content="${title}" />`),
		tag(`<meta property="og:description" content="${description}" />`),
		tag(`<meta property="og:image" content="${OG_IMAGE.url}" />`),
		tag(`<meta property="og:image:width" content="${OG_IMAGE.width}" />`),
		tag(`<meta property="og:image:height" content="${OG_IMAGE.height}" />`),
		tag(`<meta name="twitter:card" content="summary_large_image" />`),
		tag(`<meta name="twitter:title" content="${title}" />`),
		tag(`<meta name="twitter:description" content="${description}" />`),
		tag(`<meta name="twitter:image" content="${OG_IMAGE.url}" />`),
	].join('\n');
}

function renderPage(template, page) {
	return template
		.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(page.title)}</title>`)
		.replace('</head>', `${headTags(page)}\n\t</head>`);
}

function sitemap(pages, lastmod) {
	const urls = pages
		.map((page) => `\t<url>\n\t\t<loc>${SITE_URL}${page.path}</loc>\n\t\t<lastmod>${lastmod}</lastmod>\n\t</url>`)
		.join('\n');
	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function llmsTxt(pages) {
	return `## Pages\n${pages.map((page) => `- [${page.title}](${page.path}): ${page.description}`).join('\n')}\n`;
}

async function main() {
	const templatePath = path.join(distDir, 'index.html');
	if (!fs.existsSync(templatePath)) {
		throw new Error('dist/index.html not found — run `vite build` first.');
	}

	const template = fs.readFileSync(templatePath, 'utf8');
	const pages = [...readStaticPages(), ...(await readServicePages())];
	if (!pages.some((page) => page.path === '/')) {
		throw new Error('Home page meta not found in src/pages/HomePage.jsx.');
	}

	fs.rmSync(pagesOutDir, { recursive: true, force: true });
	for (const page of pages) {
		const html = renderPage(template, page);
		// The home page's tags go into index.html itself, which also serves as
		// the fallback for any unknown URL.
		const outFile = page.path === '/' ? templatePath : path.join(pagesOutDir, `${page.path.slice(1)}.html`);
		fs.mkdirSync(path.dirname(outFile), { recursive: true });
		fs.writeFileSync(outFile, html);
	}

	const lastmod = new Date().toISOString().slice(0, 10);
	fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap(pages, lastmod));
	fs.writeFileSync(path.join(distDir, 'llms.txt'), llmsTxt(pages));

	console.log(`[prerender] ${pages.length} pages: ${pages.map((page) => page.path).join(', ')}`);
}

main().catch((error) => {
	console.error(`[prerender] ${error.message}`);
	process.exit(1);
});
