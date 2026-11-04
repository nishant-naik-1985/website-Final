import React from 'react';
import { MapPin } from 'lucide-react';
import { analyticsEnabled, openCookieSettings } from '@/lib/analytics';
import { SERVICES } from '@/data/services';

const EXPLORE_LINKS = [
    { label: 'About', href: '/#about' },
    { label: 'Why CAxperts', href: '/#why-caxperts' },
    { label: 'Services', href: '/#services' },
    { label: 'Capabilities', href: '/#capabilities' },
    { label: 'Industries', href: '/#industries' },
    { label: 'How We Work', href: '/#process' },
    { label: 'Delivery Model', href: '/#delivery' },
    { label: 'Quality', href: '/#quality' },
    { label: 'Careers', href: '/careers' },
];

export default function SiteFooter() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-white/10 bg-navy-deep text-white">
            <div className="mx-auto max-w-[90rem] px-4 py-14 sm:px-6 lg:px-10">
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <p className="font-display text-2xl font-bold tracking-tight">
                            CA<span className="text-electric">x</span>perts
                        </p>
                        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.22em] text-white/60">
                            Engineering Pvt. Ltd.
                        </p>
                        <p className="mt-5 max-w-xs font-display text-sm text-white/75">
                            Engineering Intelligence. Simulation Excellence.
                        </p>
                        <p className="mt-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/55">
                            <MapPin className="h-3.5 w-3.5 text-electric" strokeWidth={1.75} />
                            Pune, India
                        </p>
                    </div>

                    <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/60">Explore</p>
                        <ul className="mt-4 space-y-2.5">
                            {EXPLORE_LINKS.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        className="text-sm text-white/70 transition-colors hover:text-electric"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/60">Services</p>
                        <ul className="mt-4 space-y-2.5">
                            {SERVICES.map((service) => (
                                <li key={service.slug}>
                                    <a
                                        href={`/services/${service.slug}`}
                                        className="text-sm text-white/70 transition-colors hover:text-electric"
                                    >
                                        {service.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/60">Contact</p>
                        <p className="mt-4 text-sm leading-relaxed text-white/70">
                            CAxperts Engineering Pvt. Ltd.
                            <br />
                            Pune, Maharashtra, India
                        </p>
                        <a
                            href="mailto:info@caxperts-engineering.com"
                            className="mt-3 inline-block text-sm text-white/70 transition-colors hover:text-electric"
                        >
                            info@caxperts-engineering.com
                        </a>
                        <a
                            href="/#contact"
                            className="mt-5 inline-flex items-center gap-2 border border-electric px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-electric transition-colors hover:bg-electric hover:text-white"
                        >
                            Send an Enquiry
                        </a>
                    </div>
                </div>

                <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-mono text-[11px] tracking-[0.08em] text-white/60">
                        © {year} CAxperts Engineering Pvt. Ltd. All rights reserved.
                        <span className="mx-2 text-white/25" aria-hidden="true">·</span>
                        <a href="/privacy" className="transition-colors hover:text-electric">
                            Privacy Policy
                        </a>
                        {analyticsEnabled && (
                            <>
                                <span className="mx-2 text-white/25" aria-hidden="true">·</span>
                                <button type="button" onClick={openCookieSettings} className="transition-colors hover:text-electric">
                                    Cookie settings
                                </button>
                            </>
                        )}
                    </p>
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/60">
                        CAE · CAD · Simulation · Product Development
                    </p>
                </div>
            </div>
        </footer>
    );
}
