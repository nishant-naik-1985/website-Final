// Google Analytics 4, loaded only after the visitor accepts analytics cookies
// in the consent banner (GDPR). Until a measurement ID is set, analytics is
// fully off: no banner, no script, no cookies.
//
// Set the ID in apps/web/.env.production as VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
// (it is public, so committing it is fine).
export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || '';

export const analyticsEnabled = /^G-[A-Z0-9]+$/.test(GA_MEASUREMENT_ID);

const CONSENT_KEY = 'caxperts-analytics-consent';
export const OPEN_SETTINGS_EVENT = 'caxperts:open-cookie-settings';

let loaded = false;

export function getConsent() {
    try {
        const value = localStorage.getItem(CONSENT_KEY);
        return value === 'granted' || value === 'denied' ? value : null;
    } catch {
        return null;
    }
}

function gtag() {
    // gtag.js expects the `arguments` object itself, not an array.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
}

function loadGoogleAnalytics() {
    if (loaded || !analyticsEnabled) return;
    loaded = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
        // Page views are sent by trackPageView on each route change instead.
        send_page_view: false,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
    });

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);
}

// Remove the _ga / _ga_<id> cookies GA4 sets, on every domain level they may
// have been written to.
function deleteAnalyticsCookies() {
    const parts = window.location.hostname.split('.');
    const domains = [''];
    for (let i = 0; i < parts.length - 1; i += 1) {
        domains.push(`; domain=.${parts.slice(i).join('.')}`);
    }

    document.cookie.split(';').forEach((cookie) => {
        const name = cookie.split('=')[0].trim();
        if (name === '_ga' || name.startsWith('_ga_')) {
            domains.forEach((domain) => {
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
            });
        }
    });
}

export function setConsent(value) {
    try {
        localStorage.setItem(CONSENT_KEY, value);
    } catch {
        // Storage can be blocked (private mode); the choice then lasts for this visit only.
    }

    if (value === 'granted') {
        loadGoogleAnalytics();
        trackPageView(window.location.pathname);
        return;
    }

    if (loaded) {
        window[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
    }
    deleteAnalyticsCookies();
}

// Call once on start-up: restores a previous "Accept" without asking again.
export function initAnalytics() {
    if (analyticsEnabled && getConsent() === 'granted') {
        loadGoogleAnalytics();
    }
}

export function trackPageView(path) {
    if (!loaded || getConsent() !== 'granted') return;
    window.gtag('event', 'page_view', {
        page_path: path,
        page_location: window.location.href,
        page_title: document.title,
    });
}

export function trackEvent(name, params = {}) {
    if (!loaded || getConsent() !== 'granted') return;
    window.gtag('event', name, params);
}

export function openCookieSettings() {
    window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
}
