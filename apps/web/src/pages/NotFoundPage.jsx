import React from 'react';
import { Helmet } from 'react-helmet';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import SiteHeader from '@/components/site/Header';
import SiteFooter from '@/components/site/Footer';

const QUICK_LINKS = [
    { label: 'Services', href: '/#services' },
    { label: 'Case Studies', href: '/#case-studies' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/#contact' },
];

export default function NotFoundPage() {
    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Helmet>
                <title>Page Not Found | CAxperts Engineering</title>
                <meta name="description" content="The page you are looking for could not be found." />
                {/* The server answers every unknown URL with the app, so tell
                    search engines not to index this as a real page. */}
                <meta name="robots" content="noindex" />
            </Helmet>

            <SiteHeader />

            <main className="tech-grid-dark flex flex-1 items-center bg-navy-deep pt-16">
                <div className="mx-auto w-full max-w-[90rem] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
                    <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-electric">
                        <span className="inline-block h-2 w-2 bg-electric" aria-hidden="true" />
                        Error 404
                    </p>
                    <h1 className="mt-6 max-w-3xl font-display text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-6xl">
                        Page not found.
                    </h1>
                    <p className="mt-6 max-w-xl leading-relaxed text-white/65">
                        The page you are looking for doesn&rsquo;t exist or may have moved. Check the address, or use
                        one of the links below.
                    </p>
                    <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                        <a
                            href="/"
                            className="inline-flex items-center justify-center gap-2 bg-electric px-7 py-4 font-mono text-[11px] uppercase tracking-[0.18em] text-white transition-all hover:bg-electric/85 active:scale-[0.99]"
                        >
                            Back to Home
                            <ArrowRight className="h-4 w-4" strokeWidth={2} />
                        </a>
                        <a
                            href="/#contact"
                            className="inline-flex items-center justify-center gap-2 border border-white/25 px-7 py-4 font-mono text-[11px] uppercase tracking-[0.18em] text-white/85 transition-colors hover:border-electric hover:text-electric"
                        >
                            Contact Us
                            <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
                        </a>
                    </div>
                    <nav className="mt-14 border-t border-white/10 pt-6" aria-label="Popular pages">
                        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/60">Popular pages</p>
                        <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
                            {QUICK_LINKS.map((link) => (
                                <li key={link.href}>
                                    <a href={link.href} className="text-sm text-white/70 transition-colors hover:text-electric">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </main>

            <SiteFooter />
        </div>
    );
}
