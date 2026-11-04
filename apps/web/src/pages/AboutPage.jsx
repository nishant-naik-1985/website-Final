import React from 'react';
import { Helmet } from 'react-helmet';
import Reveal from '@/components/Reveal';
import AiImageBadge from '@/components/AiImageBadge';
import SiteHeader from '@/components/site/Header';
import SiteFooter from '@/components/site/Footer';
import SectionHeader from '@/components/site/SectionHeader';
import { CtaBand, PageHero, QualityGroups, Section, WhyGrid } from '@/components/site/blocks';
import Seo from '@/components/Seo';
import { ABOUT_IMAGE } from '@/data/content';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Helmet>
                <title>About Us | CAxperts Engineering</title>
                <meta
                    name="description"
                    content="CAxperts Engineering is a Pune-based CAE and CAD engineering services company supporting automotive and industrial product development, from concept studies to validation."
                />
                <Seo
                    title="About Us | CAxperts Engineering"
                    description="A Pune-based CAE and CAD engineering services company, built around simulation."
                    siteName="CAxperts Engineering"
                />
            </Helmet>

            <SiteHeader />

            <main>
                <PageHero label="About" title="An engineering-first consultancy, built around simulation" />

                <Section>
                    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
                        <Reveal>
                            <div className="space-y-5 leading-relaxed text-muted-foreground">
                                <p>
                                    CAxperts Engineering Pvt. Ltd. is a Pune-based engineering services company
                                    specialising in computer-aided engineering and design. We support automotive and
                                    industrial customers across the product development cycle — from early concept
                                    studies to detailed simulation, design and validation support.
                                </p>
                                <p>
                                    Our practice spans CAE and simulation, CAD and engineering, pre/post processing,
                                    engineering consulting, digital engineering and automation, and resource
                                    augmentation. We work as an extension of our customers&rsquo; engineering teams —
                                    bringing specialist simulation knowledge, disciplined processes and modern
                                    automation to every engagement.
                                </p>
                                <p>
                                    We believe good simulation is not just software — it is engineering judgement,
                                    method and rigour applied consistently. That belief shapes how we build models,
                                    review results and document our work.
                                </p>
                            </div>
                            <div className="mt-8 grid grid-cols-2 gap-px border border-border bg-border">
                                {[
                                    ['Discipline', 'CAE / CAD / Automation'],
                                    ['Engagement', 'Projects & Augmentation'],
                                    ['Base', 'Pune, Maharashtra'],
                                    ['Serving', 'India & Global Teams'],
                                ].map(([label, value]) => (
                                    <div key={label} className="bg-card px-4 py-4">
                                        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                                            {label}
                                        </p>
                                        <p className="mt-1.5 font-display text-sm font-semibold text-navy">{value}</p>
                                    </div>
                                ))}
                            </div>
                        </Reveal>
                        <Reveal delay={0.1} y={32}>
                            <figure className="relative border border-border">
                                <AiImageBadge />
                                <img
                                    src={ABOUT_IMAGE}
                                    alt="Two engineers reviewing CAD chassis models on dual monitors in the CAxperts engineering office in Pune"
                                    className="h-72 w-full object-cover lg:h-[26rem]"
                                    loading="lazy"
                                />
                                <figcaption className="flex items-center justify-between border-t border-border px-4 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                                    <span>Engineering review, Pune studio</span>
                                    <span className="hidden sm:inline">CAxperts / CAD</span>
                                </figcaption>
                            </figure>
                        </Reveal>
                    </div>
                </Section>

                <Section id="why-caxperts" tone="muted">
                    <Reveal>
                        <SectionHeader
                            label="Why CAxperts"
                            title="Engineering support built around the decisions that matter"
                            description="We combine specialist simulation practice with clear communication, disciplined reviews and delivery models that fit the customer organisation."
                        />
                    </Reveal>
                    <WhyGrid />
                </Section>

                <Section id="quality" tone="deep">
                    <Reveal>
                        <SectionHeader
                            dark
                            label="Quality & Compliance"
                            title="Clear commitments, honestly stated"
                            description="We distinguish clearly between what is in place today, what is in progress, and what is planned. Certifications listed as planned are not yet held."
                        />
                    </Reveal>
                    <QualityGroups />
                </Section>

                <CtaBand />
            </main>

            <SiteFooter />
        </div>
    );
}
