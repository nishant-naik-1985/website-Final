import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
    OPEN_SETTINGS_EVENT,
    analyticsEnabled,
    getConsent,
    initAnalytics,
    setConsent,
    trackPageView,
} from '@/lib/analytics';

// Consent banner plus page-view tracking. Renders nothing at all until a
// Google Analytics measurement ID is configured.
export default function CookieConsent() {
    const { pathname } = useLocation();
    const [open, setOpen] = useState(() => analyticsEnabled && getConsent() === null);

    useEffect(() => {
        initAnalytics();
        const reopen = () => setOpen(true);
        window.addEventListener(OPEN_SETTINGS_EVENT, reopen);
        return () => window.removeEventListener(OPEN_SETTINGS_EVENT, reopen);
    }, []);

    // Runs after the page's <Helmet> has set the title for this route.
    useEffect(() => {
        const timer = setTimeout(() => trackPageView(pathname), 0);
        return () => clearTimeout(timer);
    }, [pathname]);

    if (!analyticsEnabled || !open) return null;

    const choose = (value) => {
        setConsent(value);
        setOpen(false);
    };

    return (
        <div
            role="dialog"
            aria-live="polite"
            aria-label="Cookie consent"
            className="fixed inset-x-0 bottom-0 z-[60] border-t border-white/15 bg-navy-deep/[0.97] text-white shadow-2xl backdrop-blur-sm"
        >
            <div className="mx-auto flex max-w-[90rem] flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
                <p className="max-w-3xl text-sm leading-relaxed text-white/75">
                    We would like to use Google Analytics cookies to understand how visitors use this website, so we
                    can improve it. They are only set if you accept. You can change your choice at any time under{' '}
                    &ldquo;Cookie settings&rdquo; in the footer. See our{' '}
                    <a href="/privacy#cookies" className="underline transition-colors hover:text-electric">
                        Privacy Policy
                    </a>
                    .
                </p>
                <div className="flex shrink-0 gap-3">
                    <button
                        type="button"
                        onClick={() => choose('denied')}
                        className="flex-1 border border-white/25 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-white/85 transition-colors hover:border-electric hover:text-electric lg:flex-none"
                    >
                        Reject
                    </button>
                    <button
                        type="button"
                        onClick={() => choose('granted')}
                        className="flex-1 bg-electric px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-white transition-colors hover:bg-electric/85 lg:flex-none"
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
}
