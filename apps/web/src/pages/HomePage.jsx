import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Reveal from '@/components/Reveal';
import SiteHeader from '@/components/site/Header';
import MeshGraphic from '@/components/site/MeshGraphic';
import SiteFooter from '@/components/site/Footer';
import SectionHeader from '@/components/site/SectionHeader';
import { CtaBand, IndustryGrid, MoreLink, Section, ServiceCards } from '@/components/site/blocks';
import Seo from '@/components/Seo';
import { CAPABILITY_GROUPS, TOOLS } from '@/data/content';

// The site used to be one long page with #anchors. Links shared before the
// split (e.g. /#contact on LinkedIn) are forwarded to the page that now holds
// that section.
const LEGACY_ANCHORS = {
    '#about': '/about',
    '#why-caxperts': '/about#why-caxperts',
    '#quality': '/about#quality',
    '#services': '/services',
    '#capabilities': '/capabilities',
    '#industries': '/industries',
    '#process': '/how-we-work',
    '#delivery': '/how-we-work#delivery',
    '#contact': '/contact',
    '#case-studies': '/',
};

export default function HomePage() {
    const { hash } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (LEGACY_ANCHORS[hash]) navigate(LEGACY_ANCHORS[hash], { replace: true });
    }, [hash, navigate]);

    const coreCapabilities = CAPABILITY_GROUPS.find((group) => group.status === 'Core').items;

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Helmet>
                <title>CAxperts Engineering | CAE, CAD & Simulation Engineering</title>
                <meta
                    name="description"
                    content="CAxperts provides CAE, CAD and simulation engineering for automotive, industrial and mobility product development, from concept to validated design."
                />
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Organization',
                        name: 'CAxperts Engineering Pvt. Ltd.',
                        url: 'https://caxperts-engineering.com/',
                        email: 'info@caxperts-engineering.com',
                        address: { '@type': 'PostalAddress', addressLocality: 'Pune', addressCountry: 'IN' },
                        areaServed: ['Europe', 'India'],
                        knowsAbout: ['CAE engineering', 'CAD engineering', 'Crash simulation', 'Finite element analysis', 'Engineering automation'],
                    })}
                </script>
                <Seo
                    title="CAxperts Engineering | CAE, CAD & Simulation Engineering"
                    description="CAE, CAD and simulation engineering for automotive, industrial and mobility product development."
                    siteName="CAxperts Engineering"
                />
            </Helmet>

            <SiteHeader />

            <main>
                {/* HERO */}
                <section id="home" className="tech-grid-dark relative bg-navy-deep pt-16">
                    <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-[90rem] flex-col justify-center px-4 py-16 sm:px-6 lg:px-10">
                        <Reveal>
                            <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-electric">
                                <span className="inline-block h-2 w-2 bg-electric" aria-hidden="true" />
                                CAE · CAD · Simulation · Product Development
                            </p>
                        </Reveal>
                        <Reveal delay={0.1}>
                            <h1 className="mt-6 max-w-5xl font-display text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">
                                Engineering Simulation.
                                <br />
                                <span className="relative inline-block">
                                    Delivered with Precision.
                                    <span
                                        className="absolute -bottom-1 left-0 h-[3px] w-full bg-electric sm:-bottom-2"
                                        aria-hidden="true"
                                    />
                                </span>
                            </h1>
                        </Reveal>
                        <Reveal delay={0.2}>
                            <p className="mt-8 max-w-2xl leading-relaxed text-white/65">
                                CAxperts Engineering delivers CAE, CAD and simulation engineering for automotive,
                                industrial and mobility product development — from concept studies to validated design.
                            </p>
                        </Reveal>
                        <Reveal delay={0.3}>
                            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                                <a
                                    href="/contact"
                                    className="inline-flex items-center justify-center gap-2 bg-electric px-7 py-4 font-mono text-[11px] uppercase tracking-[0.18em] text-white transition-all hover:bg-electric/85 active:scale-[0.99]"
                                >
                                    Discuss Your Requirement
                                    <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
                                </a>
                                <a
                                    href="/capabilities"
                                    className="inline-flex items-center justify-center gap-2 border border-white/25 px-7 py-4 font-mono text-[11px] uppercase tracking-[0.18em] text-white/85 transition-colors hover:border-electric hover:text-electric"
                                >
                                    Explore Capabilities
                                </a>
                            </div>
                        </Reveal>
                        <Reveal delay={0.4}>
                            <div className="mt-14 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-3">
                                {[
                                    ['Location', 'Pune, India'],
                                    ['Sectors', 'Automotive · Industrial · Mobility'],
                                    ['Practice', 'CAE · CAD · Automation'],
                                ].map(([label, value]) => (
                                    <div key={label} className="bg-navy-deep px-5 py-4">
                                        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/60">
                                            {label}
                                        </p>
                                        <p className="mt-1.5 font-display text-sm font-semibold text-white/90">
                                            {value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </Reveal>
                    </div>
                    <div className="mx-auto max-w-[90rem] px-4 pb-16 sm:px-6 lg:px-10">
                        <Reveal y={32}>
                            <figure className="relative border border-white/15 bg-navy-deep">
                                <div className="h-64 w-full sm:h-80 lg:h-[26rem]">
                                    <MeshGraphic />
                                </div>
                                <figcaption className="flex items-center justify-between border-t border-white/15 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/60">
                                    <span>Mesh · Loadcase · Result</span>
                                    <span className="hidden sm:inline">CAxperts / CAE</span>
                                </figcaption>
                            </figure>
                        </Reveal>
                    </div>
                </section>

                {/* ABOUT — teaser */}
                <Section>
                    <Reveal>
                        <SectionHeader
                            label="About"
                            title="An engineering-first consultancy, built around simulation"
                            description="CAxperts Engineering Pvt. Ltd. is a Pune-based engineering services company specialising in computer-aided engineering and design, supporting automotive and industrial product development from early concept studies to detailed simulation, design and validation."
                        />
                    </Reveal>
                    <Reveal delay={0.1}>
                        <div className="md:pl-[25%]">
                            <MoreLink href="/about">More about CAxperts</MoreLink>
                        </div>
                    </Reveal>
                </Section>

                {/* SERVICES — teaser */}
                <Section tone="muted">
                    <Reveal>
                        <SectionHeader
                            label="Services"
                            title="Six practice areas, one engineering standard"
                            description="Every engagement is delivered by specialist engineers using industry-standard tools and documented methods."
                        />
                    </Reveal>
                    <ServiceCards />
                </Section>

                {/* CAPABILITIES — teaser */}
                <Section tone="dark">
                    <Reveal>
                        <SectionHeader
                            dark
                            label="Capabilities"
                            title="Specialist simulation practice, industry-standard tools"
                            description="Our core practice areas today, delivered with the solvers, pre/post processors and CAD systems our customers already use."
                        />
                    </Reveal>
                    <Reveal delay={0.1}>
                        <div className="mt-12 md:pl-[25%]">
                            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/60">Core practice</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {coreCapabilities.map((item) => (
                                    <span key={item} className="bg-electric px-3 py-1.5 font-display text-sm font-semibold text-white">
                                        {item}
                                    </span>
                                ))}
                            </div>
                            <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.22em] text-white/60">Toolchain</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {TOOLS.map((tool) => (
                                    <span key={tool} className="border border-white/15 px-2.5 py-1 font-mono text-[11px] text-white/75">
                                        {tool}
                                    </span>
                                ))}
                            </div>
                            <MoreLink href="/capabilities" dark>
                                All capabilities
                            </MoreLink>
                        </div>
                    </Reveal>
                </Section>

                {/* INDUSTRIES — teaser */}
                <Section>
                    <Reveal>
                        <SectionHeader
                            label="Industries"
                            title="Sector knowledge that shapes better models"
                            description="Our engineers bring domain context to every model — so loadcases, constraints and acceptance criteria reflect real operating conditions."
                        />
                    </Reveal>
                    <IndustryGrid compact />
                    <Reveal delay={0.1}>
                        <MoreLink href="/industries">Industries we serve</MoreLink>
                    </Reveal>
                </Section>

                <CtaBand />
            </main>

            <SiteFooter />
        </div>
    );
}
