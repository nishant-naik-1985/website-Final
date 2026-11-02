import React from 'react';
import { Helmet } from 'react-helmet';
import { ArrowUpRight, Mail, MapPin, Briefcase, Clock } from 'lucide-react';
import Reveal from '@/components/Reveal';
import SiteHeader from '@/components/site/Header';
import SiteFooter from '@/components/site/Footer';
import SectionHeader from '@/components/site/SectionHeader';
import Seo from '@/components/Seo';

const CAREERS_EMAIL = 'info@caxperts-engineering.com';

const WHY_JOIN = [
    { title: 'Real Engineering Work', detail: 'Work on live crash, safety and structural programmes for automotive and industrial customers.' },
    { title: 'Learn From Specialists', detail: 'Model reviews and method guidance from experienced CAE engineers on every project.' },
    { title: 'Industry Toolchain', detail: 'Hands-on experience with ANSA, META, LS-DYNA, Pam-Crash and modern scripting workflows.' },
    { title: 'Global Exposure', detail: 'Collaborate with customer engineering teams across Europe and India.' },
];

const JOBS = [
    {
        id: 'cae-engineer-crash-safety',
        title: 'CAE Engineer — Crash & Safety',
        location: 'Pune, India',
        type: 'Full-time',
        experience: '1–3 years',
        summary:
            'We are looking for a CAE Engineer to build, run and evaluate crash and occupant-safety simulations for passenger vehicle programmes, working closely with our senior engineers and customer teams.',
        responsibilities: [
            'Build full-vehicle and sub-system crash models — meshing, connections, materials and contacts.',
            'Set up and run regulatory and consumer-test loadcases (frontal, side, rear, roof crush, pedestrian).',
            'Debug models and solver runs for stability, energy balance and result quality.',
            'Post-process results, compare against targets and prepare clear technical reports.',
            'Support structural countermeasure studies and design iterations with the customer team.',
            'Follow documented methods, checklists and review points on every deliverable.',
        ],
        requirements: [
            'B.E./B.Tech or M.E./M.Tech in Mechanical, Automobile or a related engineering discipline.',
            '1–3 years of hands-on experience in crash or safety CAE.',
            'Working knowledge of LS-DYNA and/or Pam-Crash.',
            'Pre/post processing experience with ANSA, META or HyperMesh.',
            'Sound understanding of FEA fundamentals, material models and contact definitions.',
            'Good written and spoken English for communication with international customers.',
        ],
        niceToHave: [
            'Exposure to occupant safety, seats and restraint systems, or pedestrian protection.',
            'Familiarity with Euro NCAP, IIHS or ECE / FMVSS regulations.',
            'Python or MATLAB scripting for CAE automation.',
        ],
    },
];

function mailtoFor(job) {
    const subject = `Application: ${job.title.replace('—', '-')}`;
    const body = 'Dear CAxperts team,\n\nPlease find my CV attached for the above position.\n\nName:\nPhone:\nCurrent location:\nNotice period:\n';
    return `mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function JobList({ heading, items }) {
    return (
        <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{heading}</h4>
            <ul className="mt-4 space-y-3">
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

function JobPosting({ job }) {
    return (
        <article id={job.id} className="scroll-mt-20 border border-border bg-card">
            <div className="flex flex-col gap-6 border-b border-border p-6 lg:flex-row lg:items-start lg:justify-between lg:p-8">
                <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-electric">Open Position</p>
                    <h3 className="mt-3 font-display text-2xl font-bold leading-snug tracking-tight text-navy md:text-3xl">
                        {job.title}
                    </h3>
                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                        <span className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 text-electric" strokeWidth={1.75} />
                            {job.location}
                        </span>
                        <span className="flex items-center gap-2">
                            <Briefcase className="h-3.5 w-3.5 text-electric" strokeWidth={1.75} />
                            {job.type}
                        </span>
                        <span className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5 text-electric" strokeWidth={1.75} />
                            {job.experience}
                        </span>
                    </div>
                </div>
                <a
                    href={mailtoFor(job)}
                    className="inline-flex shrink-0 items-center justify-center gap-2 bg-electric px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-white transition-all hover:bg-electric/85 active:scale-[0.99]"
                >
                    Apply Now
                    <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
                </a>
            </div>

            <div className="p-6 lg:p-8">
                <p className="max-w-3xl leading-relaxed text-muted-foreground">{job.summary}</p>
                <div className="mt-8 grid gap-10 lg:grid-cols-3">
                    <JobList heading="Responsibilities" items={job.responsibilities} />
                    <JobList heading="Requirements" items={job.requirements} />
                    <JobList heading="Nice to Have" items={job.niceToHave} />
                </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-border p-6 sm:flex-row sm:items-center sm:justify-between lg:px-8">
                <p className="text-sm leading-relaxed text-muted-foreground">
                    To apply, email your CV to{' '}
                    <a href={mailtoFor(job)} className="font-medium text-electric hover:underline">
                        {CAREERS_EMAIL}
                    </a>{' '}
                    with the job title in the subject line.
                </p>
            </div>
        </article>
    );
}

export default function CareersPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Helmet>
                <title>Careers | CAXPERTS Engineering</title>
                <meta
                    name="description"
                    content="Join CAXPERTS Engineering in Pune. Explore open CAE engineering roles in crash and safety simulation for automotive product development."
                />
                {JOBS.map((job) => (
                    <script key={job.id} type="application/ld+json">
                        {JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'JobPosting',
                            title: job.title,
                            description: [job.summary, ...job.responsibilities, ...job.requirements].join(' '),
                            datePosted: '2026-11-02',
                            employmentType: 'FULL_TIME',
                            hiringOrganization: {
                                '@type': 'Organization',
                                name: 'CAxperts Engineering Pvt. Ltd.',
                                sameAs: 'https://caxperts-engineering.com/',
                            },
                            jobLocation: {
                                '@type': 'Place',
                                address: {
                                    '@type': 'PostalAddress',
                                    addressLocality: 'Pune',
                                    addressRegion: 'Maharashtra',
                                    addressCountry: 'IN',
                                },
                            },
                        })}
                    </script>
                ))}
                <Seo
                    title="Careers | CAXPERTS Engineering"
                    description="Open CAE engineering roles at CAXPERTS Engineering, Pune."
                    siteName="CAXPERTS Engineering"
                />
            </Helmet>

            <SiteHeader />

            <main>
                {/* HERO */}
                <section className="tech-grid-dark bg-navy-deep pt-16">
                    <div className="mx-auto max-w-[90rem] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
                        <Reveal>
                            <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-electric">
                                <span className="inline-block h-2 w-2 bg-electric" aria-hidden="true" />
                                Careers at CAxperts
                            </p>
                        </Reveal>
                        <Reveal delay={0.1}>
                            <h1 className="mt-6 max-w-4xl font-display text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-6xl">
                                Build your career in engineering simulation.
                            </h1>
                        </Reveal>
                        <Reveal delay={0.2}>
                            <p className="mt-8 max-w-2xl leading-relaxed text-white/65">
                                We are a Pune-based CAE and CAD engineering team working on crash, safety and structural
                                programmes for automotive and industrial customers. If you enjoy building good models and
                                understanding why structures behave the way they do, we would like to hear from you.
                            </p>
                        </Reveal>
                        <Reveal delay={0.3}>
                            <a
                                href="#open-positions"
                                className="mt-10 inline-flex items-center justify-center gap-2 bg-electric px-7 py-4 font-mono text-[11px] uppercase tracking-[0.18em] text-white transition-all hover:bg-electric/85 active:scale-[0.99]"
                            >
                                View Open Positions
                                <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
                            </a>
                        </Reveal>
                    </div>
                </section>

                {/* WHY JOIN */}
                <section id="why-join" className="bg-background">
                    <div className="mx-auto max-w-[90rem] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
                        <Reveal>
                            <SectionHeader
                                label="Why Join Us"
                                title="Grow with an engineering-first team"
                                description="We value engineering judgement, careful method and clear communication — and we invest in helping our engineers develop all three."
                            />
                        </Reveal>
                        <div className="mt-12 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
                            {WHY_JOIN.map((item, i) => (
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
                    </div>
                </section>

                {/* OPEN POSITIONS */}
                <section id="open-positions" className="tech-grid bg-secondary/60">
                    <div className="mx-auto max-w-[90rem] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
                        <Reveal>
                            <SectionHeader
                                label="Open Positions"
                                title="Current openings"
                                description="All roles are based in our Pune office. Send your CV by email — we review every application and respond to shortlisted candidates."
                            />
                        </Reveal>
                        <div className="mt-12 space-y-8">
                            {JOBS.map((job) => (
                                <Reveal key={job.id}>
                                    <JobPosting job={job} />
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* GENERAL APPLICATION */}
                <section id="general-application" className="tech-grid-dark bg-navy">
                    <div className="mx-auto max-w-[90rem] px-4 py-20 sm:px-6 lg:px-10 lg:py-24">
                        <Reveal>
                            <SectionHeader
                                dark
                                label="Don't See a Fit?"
                                title="Send us a speculative application"
                                description="We are always interested in hearing from talented CAE and CAD engineers. Email your CV and tell us which area you would like to work in."
                            />
                        </Reveal>
                        <Reveal delay={0.1}>
                            <a
                                href={`mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent('General Application')}`}
                                className="mt-10 inline-flex items-center gap-2 border border-electric px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-electric transition-colors hover:bg-electric hover:text-white"
                            >
                                <Mail className="h-3.5 w-3.5" strokeWidth={2} />
                                {CAREERS_EMAIL}
                            </a>
                        </Reveal>
                    </div>
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}
