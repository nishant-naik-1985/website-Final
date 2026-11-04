import React from 'react';
import { ArrowRight, ArrowUpRight, MapPin } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { SERVICES } from '@/data/services';
import {
    CAPABILITY_GROUPS,
    DELIVERY_MODELS,
    DELIVERY_SPLIT,
    INDUSTRIES,
    PROCESS_STEPS,
    QUALITY_ITEMS,
    SERVICE_ICONS,
    TOOLS,
    WHY_ITEMS,
} from '@/data/content';

// Building blocks shared by the home page and the individual pages, so each
// section looks the same wherever it appears.

const SECTION_TONES = {
    light: 'bg-background',
    muted: 'tech-grid bg-secondary/60',
    dark: 'tech-grid-dark bg-navy',
    deep: 'tech-grid-dark bg-navy-deep',
};

export function Section({ id, tone = 'light', children }) {
    return (
        <section id={id} className={SECTION_TONES[tone]}>
            <div className="mx-auto max-w-[90rem] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">{children}</div>
        </section>
    );
}

// Dark title band at the top of every page (below the fixed header).
export function PageHero({ label, title, children }) {
    return (
        <section className="tech-grid-dark bg-navy-deep pt-16">
            <div className="mx-auto max-w-[90rem] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
                <Reveal>
                    <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-electric">
                        <span className="inline-block h-2 w-2 bg-electric" aria-hidden="true" />
                        {label}
                    </p>
                </Reveal>
                <Reveal delay={0.1}>
                    <h1 className="mt-6 max-w-4xl font-display text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
                        {title}
                    </h1>
                </Reveal>
                {children && (
                    <Reveal delay={0.2}>
                        <div className="mt-6 max-w-2xl leading-relaxed text-white/70">{children}</div>
                    </Reveal>
                )}
            </div>
        </section>
    );
}

// "Learn more"-style link under a home page teaser.
export function MoreLink({ href, children, dark = false }) {
    return (
        <a
            href={href}
            className={`mt-10 inline-flex items-center gap-2 border px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors ${
                dark
                    ? 'border-white/25 text-white/85 hover:border-electric hover:text-electric'
                    : 'border-navy/25 text-navy hover:border-electric hover:text-electric'
            }`}
        >
            {children}
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
        </a>
    );
}

export function ServiceCards() {
    return (
        <div className="mt-12 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service, i) => {
                const Icon = SERVICE_ICONS[service.slug];
                return (
                    <Reveal key={service.slug} delay={0.06 * i} className="h-full">
                        <a
                            href={`/services/${service.slug}`}
                            className="group flex h-full flex-col bg-card p-6 transition-colors hover:bg-navy lg:p-8"
                        >
                            <Icon className="h-6 w-6 text-electric" strokeWidth={1.5} aria-hidden="true" />
                            <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-navy group-hover:text-white">
                                {service.title}
                            </h3>
                            <p className="mt-3 text-sm leading-relaxed text-muted-foreground group-hover:text-white/65">
                                {service.summary}
                            </p>
                            <span className="mt-auto flex items-center gap-2 pt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-electric">
                                Learn more
                                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                            </span>
                        </a>
                    </Reveal>
                );
            })}
        </div>
    );
}

export function CapabilityGroups() {
    return (
        <div className="mt-12 grid gap-px border border-white/15 bg-white/15 lg:grid-cols-3">
            {CAPABILITY_GROUPS.map((group, gi) => (
                <Reveal key={group.status} delay={0.08 * gi} className="h-full">
                    <div className="flex h-full flex-col bg-navy p-6 lg:p-8">
                        <span
                            className={`inline-flex w-fit px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.2em] ${group.statusClass}`}
                        >
                            {group.status}
                        </span>
                        <ul className="mt-6 flex-1 divide-y divide-white/10 border-y border-white/10">
                            {group.items.map((item) => (
                                <li
                                    key={item}
                                    className="flex items-center justify-between py-3.5 font-display text-lg font-semibold text-white/90"
                                >
                                    {item}
                                    <span className="h-1.5 w-1.5 bg-electric" aria-hidden="true" />
                                </li>
                            ))}
                        </ul>
                        <p className="mt-5 font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-white/60">
                            {group.note}
                        </p>
                    </div>
                </Reveal>
            ))}
        </div>
    );
}

export function Toolchain() {
    return (
        <Reveal delay={0.15}>
            <div className="mt-14 border border-white/15">
                <p className="border-b border-white/15 px-5 py-3.5 font-mono text-[11px] uppercase tracking-[0.24em] text-white/60">
                    Toolchain — Solvers · Pre/Post · CAD · Scripting
                </p>
                <div className="grid grid-cols-2 gap-px bg-white/15 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {TOOLS.map((tool) => (
                        <div key={tool} className="bg-navy px-4 py-4">
                            <p className="font-mono text-sm font-medium text-white/85">{tool}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Reveal>
    );
}

// `compact` shows icon and name only, for the home page teaser.
export function IndustryGrid({ compact = false }) {
    return (
        <div
            className={`mt-12 grid gap-px border border-border bg-border sm:grid-cols-2 ${
                compact ? 'lg:grid-cols-6' : 'lg:grid-cols-3'
            }`}
        >
            {INDUSTRIES.map((industry, i) => (
                <Reveal key={industry.name} delay={0.06 * i} className="h-full">
                    <div className={`h-full bg-card ${compact ? 'p-5' : 'p-6 lg:p-7'}`}>
                        <industry.icon className="h-5 w-5 text-electric" strokeWidth={1.5} aria-hidden="true" />
                        <h3
                            className={`mt-3 font-display font-bold tracking-tight text-navy ${
                                compact ? 'text-base' : 'text-lg'
                            }`}
                        >
                            {industry.name}
                        </h3>
                        {!compact && (
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{industry.detail}</p>
                        )}
                    </div>
                </Reveal>
            ))}
        </div>
    );
}

export function WhyGrid() {
    return (
        <div className="mt-12 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
            {WHY_ITEMS.map((item, i) => (
                <Reveal key={item.title} delay={0.06 * i} className="h-full">
                    <article className="flex h-full flex-col bg-card p-6 lg:p-7">
                        <h3 className="font-display text-lg font-bold leading-snug tracking-tight text-navy">
                            {item.title}
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
                    </article>
                </Reveal>
            ))}
        </div>
    );
}

export function ProcessSteps() {
    return (
        <>
            <div className="mt-12 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
                {PROCESS_STEPS.map((step, i) => (
                    <Reveal key={step.name} delay={0.06 * i} className="h-full">
                        <div className="flex h-full flex-col bg-card p-5">
                            <h3 className="font-display text-base font-bold tracking-tight text-navy">{step.name}</h3>
                            <p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground">{step.detail}</p>
                            {i < PROCESS_STEPS.length - 1 && (
                                <ArrowRight
                                    className="mt-auto hidden h-4 w-4 pt-0 text-navy/25 lg:mt-4 lg:block"
                                    strokeWidth={1.5}
                                    aria-hidden="true"
                                />
                            )}
                        </div>
                    </Reveal>
                ))}
            </div>
            <Reveal delay={0.2}>
                <p className="mt-8 max-w-2xl font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-muted-foreground">
                    Understand → Plan → Execute → Validate → Deliver — applied to every engagement, from a single
                    loadcase to a full programme.
                </p>
            </Reveal>
        </>
    );
}

export function DeliveryModels() {
    return (
        <>
            <div className="mt-12 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
                {DELIVERY_MODELS.map((model, i) => (
                    <Reveal key={model.name} delay={0.06 * i} className="h-full">
                        <article className="flex h-full flex-col bg-card p-6 lg:p-7">
                            <h3 className="font-display text-lg font-bold leading-snug tracking-tight text-navy">
                                {model.name}
                            </h3>
                            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{model.detail}</p>
                        </article>
                    </Reveal>
                ))}
            </div>
            <Reveal delay={0.2}>
                <div className="mt-8 grid gap-px border border-border bg-border sm:grid-cols-3">
                    {DELIVERY_SPLIT.map(([label, detail]) => (
                        <div key={label} className="bg-card px-5 py-5">
                            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-electric">{label}</p>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{detail}</p>
                        </div>
                    ))}
                </div>
            </Reveal>
        </>
    );
}

export function QualityGroups() {
    return (
        <div className="mt-12 grid gap-px border border-white/15 bg-white/15 lg:grid-cols-3">
            {QUALITY_ITEMS.map((group, gi) => (
                <Reveal key={group.status} delay={0.08 * gi} className="h-full">
                    <div className="flex h-full flex-col bg-navy-deep p-6 lg:p-8">
                        <span
                            className={`inline-flex w-fit px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.2em] ${group.statusClass}`}
                        >
                            {group.status}
                        </span>
                        <ul className="mt-6 flex-1 space-y-5">
                            {group.items.map((item) => (
                                <li key={item.name} className="border-l-2 border-electric/50 pl-4">
                                    <p className="font-display text-base font-semibold text-white/90">{item.name}</p>
                                    <p className="mt-1.5 text-sm leading-relaxed text-white/55">{item.detail}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Reveal>
            ))}
        </div>
    );
}

export function ContactInfo() {
    return (
        <div className="flex h-full flex-col">
            <div className="space-y-px border border-white/15 bg-white/15">
                <div className="bg-navy p-5">
                    <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-white/60">
                        <MapPin className="h-3.5 w-3.5 text-electric" strokeWidth={1.75} />
                        Office
                    </p>
                    <p className="mt-2 font-display text-lg font-semibold text-white">Pune, Maharashtra, India</p>
                </div>
                <div className="bg-navy p-5">
                    <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/60">Email</p>
                    <a
                        href="mailto:info@caxperts-engineering.com"
                        className="mt-2 block break-all text-sm text-white/85 transition-colors hover:text-electric"
                    >
                        info@caxperts-engineering.com
                    </a>
                </div>
                <div className="bg-navy p-5">
                    <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/60">Engagement Models</p>
                    <p className="mt-2 text-sm leading-relaxed text-white/75">
                        Fixed-scope projects · Time & material · Dedicated engineering resources
                    </p>
                </div>
                <div className="bg-navy p-5">
                    <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/60">Confidentiality</p>
                    <p className="mt-2 text-sm leading-relaxed text-white/75">
                        NDA available on request before any technical discussion.
                    </p>
                </div>
            </div>
            <p className="mt-8 font-display text-2xl font-bold leading-snug tracking-tight text-white/90 lg:text-3xl">
                Engineering Intelligence.
                <br />
                <span className="text-electric">Simulation Excellence.</span>
            </p>
        </div>
    );
}

// Closing call-to-action at the bottom of most pages.
export function CtaBand({ title = 'Discuss your engineering requirement', children }) {
    return (
        <section className="tech-grid-dark bg-navy">
            <div className="mx-auto flex max-w-[90rem] flex-col gap-8 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-20">
                <Reveal>
                    <h2 className="max-w-2xl font-display text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
                        {title}
                    </h2>
                    <p className="mt-4 max-w-xl leading-relaxed text-white/65">
                        {children ||
                            'Tell us about your programme, component or engineering challenge. We respond with a technical point of view and a clear next step.'}
                    </p>
                </Reveal>
                <Reveal delay={0.1}>
                    <a
                        href="/contact"
                        className="inline-flex shrink-0 items-center justify-center gap-2 bg-electric px-7 py-4 font-mono text-[11px] uppercase tracking-[0.18em] text-white transition-all hover:bg-electric/85 active:scale-[0.99]"
                    >
                        Contact Us
                        <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
                    </a>
                </Reveal>
            </div>
        </section>
    );
}
