import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, ArrowUpRight } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

// `desktop: false` keeps Contact out of the desktop bar, where the
// "Discuss Your Requirement" button already links to it.
const NAV_LINKS = [
    { label: 'About', href: '/#about' },
    { label: 'Services', href: '/#services' },
    { label: 'Capabilities', href: '/#capabilities' },
    { label: 'Industries', href: '/#industries' },
    { label: 'Process', href: '/#process' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/#contact', desktop: false },
];

export default function SiteHeader() {
    const [open, setOpen] = useState(false);
    const { pathname } = useLocation();
    // Only page links (not home-page section anchors) can be "current".
    const isCurrent = (href) => !href.includes('#') && href === pathname;

    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-navy-deep/95 backdrop-blur-sm">
            <div className="mx-auto flex h-16 max-w-[90rem] items-center justify-between px-4 sm:px-6 lg:px-10">
                <a href="/" className="flex items-center gap-2" aria-label="CAxperts Engineering home">
                    <img
                        src="/logo_only_C.png"
                        alt=""
                        aria-hidden="true"
                        className="h-10 w-10 shrink-0 object-contain brightness-[1.15] contrast-[1.12] sm:h-11 sm:w-11"
                    />
                    <span className="flex min-w-0 flex-col items-start leading-none">
                        <span className="font-display text-xl font-bold tracking-tight text-white sm:text-[1.35rem]">
                            CA<span className="text-electric">x</span>perts
                        </span>
                        <span className="mt-1.5 whitespace-nowrap font-sans text-[8px] font-semibold uppercase tracking-[0.1em] text-white/80 sm:text-[9px]">
                            Engineering Pvt. Ltd.
                        </span>
                    </span>
                </a>

                {/* The full bar needs ~1,100px, so it only appears from xl (1280px); narrower screens use the menu. */}
                <nav className="hidden items-center gap-5 xl:flex 2xl:gap-7" aria-label="Primary">
                    {NAV_LINKS.filter((link) => link.desktop !== false).map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            aria-current={isCurrent(link.href) ? 'page' : undefined}
                            className={`border-b-2 py-1 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors hover:text-electric ${
                                isCurrent(link.href) ? 'border-electric text-white' : 'border-transparent text-white/75'
                            }`}
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    <a
                        href="/#contact"
                        className="hidden items-center gap-1.5 bg-electric px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-white transition-colors hover:bg-electric/85 lg:inline-flex"
                    >
                        Discuss Your Requirement
                        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
                    </a>

                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <button
                                type="button"
                                className="inline-flex h-11 w-11 items-center justify-center border border-white/15 text-white transition-colors hover:border-electric hover:text-electric xl:hidden"
                                aria-label="Open menu"
                            >
                                <Menu className="h-5 w-5" strokeWidth={1.75} />
                            </button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-80 border-white/10 bg-navy-deep p-0 text-white">
                            <SheetTitle className="sr-only">Site menu</SheetTitle>
                            <div className="flex h-full flex-col px-6 pb-8 pt-16">
                                <nav className="flex flex-col" aria-label="Mobile">
                                    {NAV_LINKS.map((link, i) => (
                                        <a
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setOpen(false)}
                                            aria-current={isCurrent(link.href) ? 'page' : undefined}
                                            className={`flex items-center justify-between border-b border-white/10 py-3.5 font-display text-lg transition-colors hover:text-electric ${
                                                isCurrent(link.href) ? 'text-electric' : 'text-white/90'
                                            }`}
                                        >
                                            {link.label}
                                            <span className="font-mono text-[11px] tracking-[0.2em] text-white/60" aria-hidden="true">
                                                0{i + 1}
                                            </span>
                                        </a>
                                    ))}
                                </nav>
                                <a
                                    href="/#contact"
                                    onClick={() => setOpen(false)}
                                    className="mt-8 inline-flex items-center justify-center gap-2 bg-electric px-4 py-3.5 font-mono text-[11px] uppercase tracking-[0.16em] text-white transition-colors hover:bg-electric/85"
                                >
                                    Discuss Your Requirement
                                    <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
                                </a>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
