import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Reveal from '@/components/Reveal';
import SiteHeader from '@/components/site/Header';
import SiteFooter from '@/components/site/Footer';
import SectionHeader from '@/components/site/SectionHeader';
import Seo from '@/components/Seo';
import { SERVICES, getService } from '@/data/services';
import NotFoundPage from './NotFoundPage';

function DetailList({ heading, items }) {
    return (
        <div className="bg-card p-6 lg:p-8">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-electric">{heading}</h3>
            <ul className="mt-5 space-y-3">
                {items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-foreground/80">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-electric" aria-hidden="true" />
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function ServicePage() {
    const { slug } = useParams();
    const service = getService(slug);

    if (!service) return <NotFoundPage />;

    const title = `${service.title} Services | CAxperts Engineering`;
    const otherServices = SERVICES.filter((other) => other.slug !== service.slug);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={service.metaDescription} />
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Service',
                        name: service.title,
                        description: service.metaDescription,
                        serviceType: service.title,
                        url: `https://caxperts-engineering.com/services/${service.slug}`,
                        areaServed: ['Europe', 'India'],
                        provider: {
                            '@type': 'Organization',
                            name: 'CAxperts Engineering Pvt. Ltd.',
                            url: 'https://caxperts-engineering.com/',
                        },
                    })}
                </script>
                <Seo title={title} description={service.metaDescription} siteName="CAxperts Engineering" />
            </Helmet>

            <SiteHeader />

            <main>
                <section className="tech-grid-dark bg-navy-deep pt-16">
                    <div className="mx-auto max-w-[90rem] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
                        <Reveal>
                            <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-electric">
                                <span className="inline-block h-2 w-2 bg-electric" aria-hidden="true" />
                                <a href="/#services" className="transition-colors hover:text-white">
                                    Services
                                </a>
                            </p>
                        </Reveal>
                        <Reveal delay={0.1}>
                            <h1 className="mt-6 max-w-4xl font-display text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-6xl">
                                {service.title}
                            </h1>
                        </Reveal>
                        <Reveal delay={0.2}>
                            <div className="mt-8 max-w-3xl space-y-4 leading-relaxed text-white/70">
                                {service.intro.map((paragraph) => (
                                    <p key={paragraph}>{paragraph}</p>
                                ))}
                            </div>
                        </Reveal>
                        <Reveal delay={0.3}>
                            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                                <a
                                    href="/#contact"
                                    className="inline-flex items-center justify-center gap-2 bg-electric px-7 py-4 font-mono text-[11px] uppercase tracking-[0.18em] text-white transition-all hover:bg-electric/85 active:scale-[0.99]"
                                >
                                    Discuss Your Requirement
                                    <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
                                </a>
                                <div className="flex flex-wrap items-center gap-2 sm:ml-4">
                                    {service.tools.map((tool) => (
                                        <span
                                            key={tool}
                                            className="border border-white/15 px-2.5 py-1 font-mono text-[11px] text-white/75"
                                        >
                                            {tool}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </section>

                <section className="bg-background">
                    <div className="mx-auto max-w-[90rem] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
                        <Reveal>
                            <SectionHeader
                                label="Scope"
                                title={`What our ${service.title} service covers`}
                            />
                        </Reveal>
                        <Reveal delay={0.1}>
                            <div className="mt-12 grid gap-px border border-border bg-border lg:grid-cols-3">
                                <DetailList heading="What We Offer" items={service.offerings} />
                                <DetailList heading="Typical Applications" items={service.applications} />
                                <DetailList heading="Deliverables" items={service.deliverables} />
                            </div>
                        </Reveal>
                    </div>
                </section>

                <section className="tech-grid bg-secondary/60">
                    <div className="mx-auto max-w-[90rem] px-4 py-20 sm:px-6 lg:px-10 lg:py-24">
                        <Reveal>
                            <SectionHeader label="Other Services" title="Explore our other practice areas" />
                        </Reveal>
                        <div className="mt-12 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
                            {otherServices.map((other, i) => (
                                <Reveal key={other.slug} delay={0.05 * i} className="h-full">
                                    <a
                                        href={`/services/${other.slug}`}
                                        className="group flex h-full flex-col bg-card p-6 transition-colors hover:bg-navy"
                                    >
                                        <span className="font-display text-lg font-bold leading-snug tracking-tight text-navy group-hover:text-white">
                                            {other.title}
                                        </span>
                                        <span className="mt-auto flex items-center gap-2 pt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-electric">
                                            Learn more
                                            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                                        </span>
                                    </a>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}
