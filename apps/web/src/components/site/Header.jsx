import React, { useState } from 'react';
import { Menu, ArrowUpRight } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

const NAV_LINKS = [
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Capabilities', href: '#capabilities' },
    { label: 'Industries', href: '#industries' },
    { label: 'Process', href: '#process' },
    { label: 'Case Studies', href: '#case-studies' },
    { label: 'Contact', href: '#contact' },
];

export default function SiteHeader() {
    const [open, setOpen] = useState(false);

    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-navy-deep/95 backdrop-blur-sm">
            <div className="mx-auto flex h-16 max-w-[90rem] items-center justify-between px-4 sm:px-6 lg:px-10">
                <a href="#home" className="flex items-baseline gap-2.5">
                    <span className="font-display text-xl font-bold tracking-tight text-white">
                        CA<span className="text-electric">x</span>perts
                    </span>
                    <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-white/50 md:inline">
                        Engineering Pvt. Ltd.
                    </span>
                </a>

                <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/65 transition-colors hover:text-electric"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    <a
                        href="#contact"
                        className="hidden items-center gap-1.5 bg-electric px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-white transition-colors hover:bg-electric/85 lg:inline-flex"
                    >
                        Discuss Your Requirement
                        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
                    </a>

                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <button
                                type="button"
                                className="inline-flex h-11 w-11 items-center justify-center border border-white/15 text-white transition-colors hover:border-electric hover:text-electric lg:hidden"
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
                                            className="flex items-center justify-between border-b border-white/10 py-3.5 font-display text-lg text-white/90 transition-colors hover:text-electric"
                                        >
                                            {link.label}
                                            <span className="font-mono text-[10px] tracking-[0.2em] text-white/35">
                                                0{i + 1}
                                            </span>
                                        </a>
                                    ))}
                                </nav>
                                <a
                                    href="#contact"
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
