import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import {
    Activity,
    DraftingCompass,
    Layers,
    LineChart,
    Workflow,
    Users,
    Car,
    Tractor,
    Bot,
    Wind,
    Plane,
    HeartPulse,
    ArrowRight,
    ArrowUpRight,
    MapPin,
    Loader2,
    CheckCircle2,
    AlertCircle,
} from 'lucide-react';
import Reveal from '@/components/Reveal';
import SiteHeader from '@/components/site/Header';
import SiteFooter from '@/components/site/Footer';
import pb from '@/lib/pocketbaseClient';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const HERO_IMAGE = 'https://images.hostinger.com/cf164097-67c4-40f2-8a60-a14114e849ba.png';
const ABOUT_IMAGE = 'https://images.hostinger.com/67362f6f-7741-4dad-bb9d-36896c181121.png';
const CASE_CRASH_IMAGE = 'https://images.hostinger.com/18523841-866b-4851-8e2f-900c694fe4cc.png';
const CASE_STRUCTURAL_IMAGE = 'https://images.hostinger.com/a557888b-0823-4d5a-9ce4-32b78bd18bc5.png';
const CASE_AUTOMATION_IMAGE = 'https://images.hostinger.com/37c35307-550d-41be-9326-0f4f57ad6875.png';

const SERVICES = [
    {
        icon: Activity,
        title: 'CAE & Simulation',
        description:
            'Structural, crash and safety simulation across the product development cycle — from concept studies to validation support.',
    },
    {
        icon: DraftingCompass,
        title: 'CAD & Engineering',
        description:
            '3D modelling, detailed design and engineering drawings built for downstream simulation and manufacturing.',
    },
    {
        icon: Layers,
        title: 'Pre/Post Processing',
        description:
            'High-quality meshing, model assembly and results post-processing with ANSA, META and HyperMesh workflows.',
    },
    {
        icon: LineChart,
        title: 'Engineering Consulting',
        description:
            'Simulation strategy, method development and independent design reviews for automotive and industrial programs.',
    },
    {
        icon: Workflow,
        title: 'Digital Engineering & Automation',
        description:
            'Python and MATLAB based automation of repetitive CAE tasks — model checks, deck preparation and reporting.',
    },
    {
        icon: Users,
        title: 'Resource Augmentation',
        description:
            'Skilled CAE and CAD engineers embedded with customer teams to extend in-house engineering capacity.',
    },
];

const CAPABILITY_GROUPS = [
    {
        status: 'Core',
        statusClass: 'bg-electric text-white',
        note: 'Delivered today as a primary practice area.',
        items: ['Structural Analysis', 'Crash & Safety', 'Seats & Restraints', 'Pedestrian Safety'],
    },
    {
        status: 'Available',
        statusClass: 'border border-electric/60 text-electric',
        note: 'Available as part of current engagements.',
        items: ['Durability', 'Optimisation', 'CAE Automation', 'CAD'],
    },
    {
        status: 'Planned',
        statusClass: 'border border-white/25 text-white/60',
        note: 'Roadmap capabilities — not currently delivered.',
        items: ['NVH', 'Thermal', 'CFD'],
    },
];

const TOOLS = [
    'ANSA',
    'META',
    'HyperMesh',
    'LS-DYNA',
    'Pam-Crash',
    'Abaqus',
    'OptiStruct',
    'CATIA',
    'Siemens NX',
    'SolidWorks',
    'Creo',
    'Python',
    'MATLAB',
];

const INDUSTRIES = [
    { icon: Car, name: 'Automotive', detail: 'Body, chassis, closures, seating and restraint systems.' },
    { icon: Tractor, name: 'Heavy Machinery', detail: 'Structures, brackets and load-bearing assemblies.' },
    { icon: Bot, name: 'Automation & Robotics', detail: 'Frames, end-effectors and motion system structures.' },
    { icon: Wind, name: 'Renewable Energy', detail: 'Structural assessment of energy system components.' },
    { icon: Plane, name: 'Aerospace & Defence', detail: 'Lightweight structures and safety-critical analysis.' },
    { icon: HeartPulse, name: 'Medical / Biomechanical', detail: 'Device structures and biomechanical simulation.' },
];

const PROCESS_STEPS = [
    { name: 'Understand', detail: 'Requirements, constraints, regulations and success criteria are captured up front.' },
    { name: 'Plan', detail: 'Scope, methods, tools and deliverables are defined with clear review points.' },
    { name: 'Engineer', detail: 'Models are built, analysed and iterated by specialist CAE and CAD engineers.' },
    { name: 'Review', detail: 'Results are checked against requirements and discussed with your team.' },
    { name: 'Deliver', detail: 'Documented models, reports and design proposals are handed over on schedule.' },
    { name: 'Improve', detail: 'Feedback feeds method refinement for the next loop of development.' },
];

const QUALITY_ITEMS = [
    {
        status: 'In place',
        statusClass: 'bg-electric text-white',
        items: [
            { name: 'NDA & IP Protection', detail: 'Confidentiality agreements and IP safeguards on every engagement.' },
            { name: 'GDPR-aligned Data Handling', detail: 'Personal data handled in line with GDPR principles.' },
        ],
    },
    {
        status: 'In progress',
        statusClass: 'border border-electric/60 text-electric',
        items: [
            { name: 'Information Security', detail: 'Information security management practices are being formalised.' },
        ],
    },
    {
        status: 'Planned',
        statusClass: 'border border-white/25 text-white/60',
        items: [
            { name: 'ISO 9001', detail: 'Quality management system — planned, not yet certified.' },
            { name: 'TISAX AL2', detail: 'Automotive information security assessment — planned.' },
            { name: 'ISO 27001', detail: 'Information security certification — planned.' },
        ],
    },
];

const CASE_STUDIES = [
    {
        image: CASE_CRASH_IMAGE,
        figure: 'Fig. 03',
        caption: 'Full-vehicle crash simulation study',
        tag: 'Crash & Occupant Safety',
        title: 'Passenger vehicle crash & occupant safety program',
        scope:
            'Full-vehicle crash model build, loadcase setup and occupant-safety simulation for a passenger vehicle program.',
        approach:
            'Detailed meshing and model assembly, regulatory and consumer-test loadcases, and structural countermeasure studies with the customer engineering team.',
    },
    {
        image: CASE_STRUCTURAL_IMAGE,
        figure: 'Fig. 04',
        caption: 'Structural stress contour review',
        tag: 'Structural & Durability',
        title: 'Structural & durability assessment for heavy machinery',
        scope:
            'Stiffness, strength and durability assessment of chassis and mounting structures for a heavy-machinery application.',
        approach:
            'Finite element modelling of welded assemblies, duty-cycle based loadcases and iterative design proposals for critical regions.',
    },
    {
        image: CASE_AUTOMATION_IMAGE,
        figure: 'Fig. 05',
        caption: 'Scripted CAE workflow automation',
        tag: 'CAE Automation',
        title: 'Automation of a repetitive crash-simulation workflow',
        scope:
            'Automation of repetitive pre- and post-processing tasks within an established crash-simulation workflow.',
        approach:
            'Python-based scripting for model checks, deck preparation and standardised report generation, integrated into the existing tool chain.',
    },
];

const LEADERS = [
    { name: 'Medha Naik', initials: 'MN' },
    { name: 'Nilam Kadam', initials: 'NK' },
    { name: 'Samar Kadam', initials: 'SK' },
];

const INTEREST_OPTIONS = [
    { value: 'cae-simulation', label: 'CAE & Simulation' },
    { value: 'cad-engineering', label: 'CAD & Engineering' },
    { value: 'pre-post-processing', label: 'Pre/Post Processing' },
    { value: 'engineering-consulting', label: 'Engineering Consulting' },
    { value: 'digital-engineering-automation', label: 'Digital Engineering & Automation' },
    { value: 'resource-augmentation', label: 'Resource Augmentation' },
    { value: 'other', label: 'Other' },
];

const EMPTY_FORM = { name: '', company: '', email: '', phone: '', interest: '', message: '' };

function SectionHeader({ label, title, description, dark = false }) {
    return (
        <div className="grid gap-6 border-t pt-8 md:grid-cols-12 md:gap-8" style={{ borderColor: dark ? 'hsl(0 0% 100% / 0.12)' : 'hsl(var(--border))' }}>
            <div className="md:col-span-3">
                <p className={`font-mono text-[10px] uppercase tracking-[0.24em] ${dark ? 'text-electric' : 'text-electric'}`}>
                    {label}
                </p>
            </div>
            <div className="md:col-span-9">
                <h2
                    className={`font-display text-3xl font-bold leading-tight tracking-tight md:text-4xl ${
                        dark ? 'text-white' : 'text-navy'
                    }`}
                >
                    {title}
                </h2>
                {description && (
                    <p className={`mt-4 max-w-2xl leading-relaxed ${dark ? 'text-white/65' : 'text-muted-foreground'}`}>
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}

function EnquiryForm() {
    const [form, setForm] = useState(EMPTY_FORM);
    const [status, setStatus] = useState('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const updateField = (field) => (event) => {
        setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!form.interest) {
            setStatus('error');
            setErrorMessage('Please select your area of interest.');
            return;
        }
        setStatus('submitting');
        setErrorMessage('');
        try {
            await pb.collection('enquiries').create({ ...form });
            setStatus('success');
            setForm(EMPTY_FORM);
        } catch (err) {
            setStatus('error');
            setErrorMessage('Something went wrong while submitting your enquiry. Please try again.');
        }
    };

    if (status === 'success') {
        return (
            <div className="flex h-full min-h-[24rem] flex-col items-center justify-center border border-white/15 bg-white/[0.03] p-10 text-center">
                <CheckCircle2 className="h-10 w-10 text-electric" strokeWidth={1.5} />
                <p className="mt-5 font-display text-2xl font-bold text-white">Enquiry received</p>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/65">
                    Thank you for reaching out to CAxperts Engineering. Our team will review your requirement and get
                    back to you shortly.
                </p>
                <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="mt-8 border border-electric px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-electric transition-colors hover:bg-electric hover:text-white"
                >
                    Send another enquiry
                </button>
            </div>
        );
    }

    const inputClass =
        'w-full border border-white/15 bg-white/[0.04] px-3.5 py-3 text-sm text-white placeholder:text-white/35 outline-none transition-colors focus:border-electric';
    const labelClass = 'mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-white/55';

    return (
        <form onSubmit={handleSubmit} className="border border-white/15 bg-white/[0.03] p-6 sm:p-8" noValidate={false}>
            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label htmlFor="enquiry-name" className={labelClass}>
                        Name *
                    </label>
                    <input
                        id="enquiry-name"
                        type="text"
                        required
                        maxLength={200}
                        value={form.name}
                        onChange={updateField('name')}
                        placeholder="Your full name"
                        className={inputClass}
                    />
                </div>
                <div>
                    <label htmlFor="enquiry-company" className={labelClass}>
                        Company *
                    </label>
                    <input
                        id="enquiry-company"
                        type="text"
                        required
                        maxLength={200}
                        value={form.company}
                        onChange={updateField('company')}
                        placeholder="Organisation name"
                        className={inputClass}
                    />
                </div>
                <div>
                    <label htmlFor="enquiry-email" className={labelClass}>
                        Email *
                    </label>
                    <input
                        id="enquiry-email"
                        type="email"
                        required
                        value={form.email}
                        onChange={updateField('email')}
                        placeholder="you@company.com"
                        className={inputClass}
                    />
                </div>
                <div>
                    <label htmlFor="enquiry-phone" className={labelClass}>
                        Phone
                    </label>
                    <input
                        id="enquiry-phone"
                        type="tel"
                        maxLength={40}
                        value={form.phone}
                        onChange={updateField('phone')}
                        placeholder="+91 ..."
                        className={inputClass}
                    />
                </div>
                <div className="sm:col-span-2">
                    <label htmlFor="enquiry-interest" className={labelClass}>
                        Area of Interest *
                    </label>
                    <Select
                        value={form.interest}
                        onValueChange={(value) => setForm((prev) => ({ ...prev, interest: value }))}
                    >
                        <SelectTrigger
                            id="enquiry-interest"
                            className="h-auto rounded-none border-white/15 bg-white/[0.04] px-3.5 py-3 text-sm text-white focus:border-electric focus:ring-0 focus:ring-offset-0 data-[placeholder]:text-white/35 [&>svg]:text-white/50"
                        >
                            <SelectValue placeholder="Select a service area" />
                        </SelectTrigger>
                        <SelectContent className="rounded-none border-white/15 bg-navy-deep text-white">
                            {INTEREST_OPTIONS.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                    className="text-sm focus:bg-electric focus:text-white"
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="sm:col-span-2">
                    <label htmlFor="enquiry-message" className={labelClass}>
                        Message *
                    </label>
                    <textarea
                        id="enquiry-message"
                        required
                        rows={5}
                        maxLength={5000}
                        value={form.message}
                        onChange={updateField('message')}
                        placeholder="Briefly describe your requirement, program or challenge."
                        className={`${inputClass} resize-y`}
                    />
                </div>
            </div>

            {status === 'error' && (
                <p className="mt-5 flex items-center gap-2 border border-red-400/40 bg-red-400/10 px-3.5 py-3 text-sm text-red-200">
                    <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                    {errorMessage}
                </p>
            )}

            <button
                type="submit"
                disabled={status === 'submitting'}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-electric px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-white transition-all hover:bg-electric/85 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
                {status === 'submitting' ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                        Submitting
                    </>
                ) : (
                    <>
                        Submit Enquiry
                        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                    </>
                )}
            </button>
            <p className="mt-4 font-mono text-[10px] leading-relaxed tracking-[0.06em] text-white/40">
                Submissions are handled under NDA on request and processed in line with GDPR principles.
            </p>
        </form>
    );
}

export default function HomePage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Helmet>
                <title>CAxperts Engineering Pvt. Ltd. — Engineering Intelligence. Simulation Excellence.</title>
                <meta
                    name="description"
                    content="CAxperts Engineering Pvt. Ltd. provides CAE, CAD, simulation, engineering consulting, automation and engineering resource support for automotive and industrial customers. Based in Pune, India."
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
                                Engineering Intelligence.
                                <br />
                                <span className="relative inline-block">
                                    Simulation Excellence.
                                    <span
                                        className="absolute -bottom-1 left-0 h-[3px] w-full bg-electric sm:-bottom-2"
                                        aria-hidden="true"
                                    />
                                </span>
                            </h1>
                        </Reveal>
                        <Reveal delay={0.2}>
                            <p className="mt-8 max-w-2xl leading-relaxed text-white/65">
                                CAxperts Engineering Pvt. Ltd. is an engineering services company based in Pune, India —
                                delivering CAE, CAD, simulation, engineering consulting, automation and engineering
                                resource support for automotive and industrial customers.
                            </p>
                        </Reveal>
                        <Reveal delay={0.3}>
                            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                                <a
                                    href="#contact"
                                    className="inline-flex items-center justify-center gap-2 bg-electric px-7 py-4 font-mono text-[11px] uppercase tracking-[0.18em] text-white transition-all hover:bg-electric/85 active:scale-[0.99]"
                                >
                                    Discuss Your Requirement
                                    <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
                                </a>
                                <a
                                    href="#capabilities"
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
                                    ['Focus', 'Automotive & Industrial'],
                                    ['Practice', 'CAE · CAD · Automation'],
                                ].map(([label, value]) => (
                                    <div key={label} className="bg-navy-deep px-5 py-4">
                                        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
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
                            <figure className="border border-white/15">
                                <img
                                    src={HERO_IMAGE}
                                    alt="Finite element mesh of an automotive body-in-white with electric-blue wireframe on a dark navy background"
                                    className="h-64 w-full object-cover sm:h-80 lg:h-[26rem]"
                                    loading="eager"
                                />
                                <figcaption className="flex items-center justify-between border-t border-white/15 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
                                    <span>Fig. 01 — Finite element mesh study, body-in-white</span>
                                    <span className="hidden sm:inline">CAxperts / CAE</span>
                                </figcaption>
                            </figure>
                        </Reveal>
                    </div>
                </section>

                {/* ABOUT — 01 */}
                <section id="about" className="bg-background">
                    <div className="mx-auto max-w-[90rem] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
                        <Reveal>
                                label="About"
                                title="An engineering-first consultancy, built around simulation"
                            />
                        </Reveal>
                        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">
                            <Reveal delay={0.1}>
                                <div className="space-y-5 leading-relaxed text-muted-foreground">
                                    <p>
                                        CAxperts Engineering Pvt. Ltd. is a Pune-based engineering services company
                                        specialising in computer-aided engineering and design. We support automotive
                                        and industrial customers across the product development cycle — from early
                                        concept studies to detailed simulation, design and validation support.
                                    </p>
                                    <p>
                                        Our practice spans CAE and simulation, CAD and engineering, pre/post
                                        processing, engineering consulting, digital engineering and automation, and
                                        resource augmentation. We work as an extension of our customers' engineering
                                        teams — bringing specialist simulation knowledge, disciplined processes and
                                        modern automation to every engagement.
                                    </p>
                                    <p>
                                        We believe good simulation is not just software — it is engineering judgement,
                                        method and rigour applied consistently. That belief shapes how we build
                                        models, review results and document our work.
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
                                            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                                                {label}
                                            </p>
                                            <p className="mt-1.5 font-display text-sm font-semibold text-navy">
                                                {value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </Reveal>
                            <Reveal delay={0.2} y={32}>
                                <figure className="border border-border">
                                    <img
                                        src={ABOUT_IMAGE}
                                        alt="Two engineers reviewing CAD chassis models on dual monitors in the CAxperts engineering office in Pune"
                                        className="h-72 w-full object-cover lg:h-[26rem]"
                                        loading="lazy"
                                    />
                                    <figcaption className="flex items-center justify-between border-t border-border px-4 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                                        <span>Fig. 02 — Engineering review, Pune studio</span>
                                        <span className="hidden sm:inline">CAxperts / CAD</span>
                                    </figcaption>
                                </figure>
                            </Reveal>
                        </div>
                    </div>
                </section>

                {/* SERVICES — 02 */}
                <section id="services" className="tech-grid bg-secondary/60">
                    <div className="mx-auto max-w-[90rem] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
                        <Reveal>
                                label="Services"
                                title="Six practice areas, one engineering standard"
                                description="Every engagement is delivered by specialist engineers using industry-standard tools and documented methods."
                            />
                        </Reveal>
                        <div className="mt-12 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
                            {SERVICES.map((service, i) => (
                                <Reveal key={service.title} delay={0.06 * i} className="h-full">
                                    <article className="group flex h-full flex-col bg-card p-6 transition-colors hover:bg-navy lg:p-8">
                                        <div className="flex items-start justify-between">
                                            <service.icon
                                                className="h-6 w-6 text-electric"
                                                strokeWidth={1.5}
                                                aria-hidden="true"
                                            />
                                            <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground group-hover:text-white/40">
                                                S.0{i + 1}
                                            </span>
                                        </div>
                                        <h3 className="mt-6 font-display text-xl font-bold tracking-tight text-navy group-hover:text-white">
                                            {service.title}
                                        </h3>
                                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground group-hover:text-white/65">
                                            {service.description}
                                        </p>
                                    </article>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CAPABILITIES — 03 */}
                <section id="capabilities" className="tech-grid-dark bg-navy">
                    <div className="mx-auto max-w-[90rem] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
                        <Reveal>
                                label="Capabilities"
                                title="What we deliver today — and what is on our roadmap"
                                description="We are transparent about maturity: core practice areas, available capabilities, and planned additions are clearly separated."
                            />
                        </Reveal>
                        <div className="mt-12 grid gap-px border border-white/15 bg-white/15 lg:grid-cols-3">
                            {CAPABILITY_GROUPS.map((group, gi) => (
                                <Reveal key={group.status} delay={0.08 * gi} className="h-full">
                                    <div className="flex h-full flex-col bg-navy p-6 lg:p-8">
                                        <div className="flex items-center justify-between">
                                            <span
                                                className={`inline-flex px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] ${group.statusClass}`}
                                            >
                                                {group.status}
                                            </span>
                                            <span className="font-mono text-[10px] tracking-[0.2em] text-white/30">
                                                C.0{gi + 1}
                                            </span>
                                        </div>
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
                                        <p className="mt-5 font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-white/45">
                                            {group.note}
                                        </p>
                                    </div>
                                </Reveal>
                            ))}
                        </div>

                        <Reveal delay={0.15}>
                            <div className="mt-14 border border-white/15">
                                <p className="border-b border-white/15 px-5 py-3.5 font-mono text-[10px] uppercase tracking-[0.24em] text-white/50">
                                    Toolchain — Solvers · Pre/Post · CAD · Scripting
                                </p>
                                <div className="grid grid-cols-2 gap-px bg-white/15 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                                    {TOOLS.map((tool, i) => (
                                        <div key={tool} className="bg-navy px-4 py-4">
                                            <p className="font-mono text-[9px] tracking-[0.2em] text-white/30">
                                                T.{String(i + 1).padStart(2, '0')}
                                            </p>
                                            <p className="mt-1 font-mono text-sm font-medium text-white/85">{tool}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </section>

                {/* INDUSTRIES — 04 */}
                <section id="industries" className="bg-background">
                    <div className="mx-auto max-w-[90rem] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
                        <Reveal>
                                label="Industries"
                                title="Sector knowledge that shapes better models"
                                description="Our engineers bring domain context to every model — so loadcases, constraints and acceptance criteria reflect real operating conditions."
                            />
                        </Reveal>
                        <div className="mt-12 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
                            {INDUSTRIES.map((industry, i) => (
                                <Reveal key={industry.name} delay={0.06 * i} className="h-full">
                                    <div className="flex h-full items-start gap-5 bg-card p-6 lg:p-7">
                                        <span className="font-display text-3xl font-bold leading-none text-navy/10">
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        <div>
                                            <industry.icon
                                                className="h-5 w-5 text-electric"
                                                strokeWidth={1.5}
                                                aria-hidden="true"
                                            />
                                            <h3 className="mt-3 font-display text-lg font-bold tracking-tight text-navy">
                                                {industry.name}
                                            </h3>
                                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                                {industry.detail}
                                            </p>
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* HOW WE WORK — 05 */}
                <section id="process" className="tech-grid bg-secondary/60">
                    <div className="mx-auto max-w-[90rem] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
                        <Reveal>
                                label="How We Work"
                                title="A disciplined loop from requirement to delivery"
                            />
                        </Reveal>
                        <div className="mt-12 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-6">
                            {PROCESS_STEPS.map((step, i) => (
                                <Reveal key={step.name} delay={0.06 * i} className="h-full">
                                    <div className="flex h-full flex-col bg-card p-5">
                                        <span className="font-display text-4xl font-bold leading-none text-electric">
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        <h3 className="mt-5 font-display text-base font-bold tracking-tight text-navy">
                                            {step.name}
                                        </h3>
                                        <p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground">
                                            {step.detail}
                                        </p>
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
                                Understand → Plan → Engineer → Review → Deliver → Improve — applied to every
                                engagement, from a single loadcase to a full program.
                            </p>
                        </Reveal>
                    </div>
                </section>

                {/* QUALITY — 06 */}
                <section id="quality" className="tech-grid-dark bg-navy-deep">
                    <div className="mx-auto max-w-[90rem] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
                        <Reveal>
                                label="Quality & Compliance"
                                title="Clear commitments, honestly stated"
                                description="We distinguish clearly between what is in place today, what is in progress, and what is planned. Certifications listed as planned are not yet held."
                            />
                        </Reveal>
                        <div className="mt-12 grid gap-px border border-white/15 bg-white/15 lg:grid-cols-3">
                            {QUALITY_ITEMS.map((group, gi) => (
                                <Reveal key={group.status} delay={0.08 * gi} className="h-full">
                                    <div className="flex h-full flex-col bg-navy-deep p-6 lg:p-8">
                                        <span
                                            className={`inline-flex w-fit px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] ${group.statusClass}`}
                                        >
                                            {group.status}
                                        </span>
                                        <ul className="mt-6 flex-1 space-y-5">
                                            {group.items.map((item) => (
                                                <li key={item.name} className="border-l-2 border-electric/50 pl-4">
                                                    <p className="font-display text-base font-semibold text-white/90">
                                                        {item.name}
                                                    </p>
                                                    <p className="mt-1.5 text-sm leading-relaxed text-white/55">
                                                        {item.detail}
                                                    </p>
                                                </li>
                                            ))}
                                        </ul>
                                        <p className="mt-6 font-mono text-[10px] tracking-[0.2em] text-white/30">
                                            Q.0{gi + 1}
                                        </p>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CASE STUDIES — 07 */}
                <section id="case-studies" className="bg-background">
                    <div className="mx-auto max-w-[90rem] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
                        <Reveal>
                                label="Case Studies"
                                title="Representative engagements, anonymised under NDA"
                                description="Client identities and program details are withheld under confidentiality agreements. Scope and approach are described as delivered."
                            />
                        </Reveal>
                        <div className="mt-12 grid gap-8 lg:grid-cols-3">
                            {CASE_STUDIES.map((study, i) => (
                                <Reveal key={study.tag} delay={0.08 * i} className="h-full">
                                    <article className="flex h-full flex-col border border-border bg-card">
                                        <figure>
                                            <img
                                                src={study.image}
                                                alt={study.caption}
                                                className="h-52 w-full object-cover"
                                                loading="lazy"
                                            />
                                            <figcaption className="flex items-center justify-between border-t border-border px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                                                <span>
                                                    {study.figure} — {study.caption}
                                                </span>
                                            </figcaption>
                                        </figure>
                                        <div className="flex flex-1 flex-col border-t border-border p-6">
                                            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-electric">
                                                {study.tag}
                                            </p>
                                            <h3 className="mt-3 font-display text-lg font-bold leading-snug tracking-tight text-navy">
                                                {study.title}
                                            </h3>
                                            <dl className="mt-4 flex-1 space-y-4 text-sm leading-relaxed">
                                                <div>
                                                    <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                                                        Scope
                                                    </dt>
                                                    <dd className="mt-1 text-foreground/80">{study.scope}</dd>
                                                </div>
                                                <div>
                                                    <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                                                        Approach
                                                    </dt>
                                                    <dd className="mt-1 text-foreground/80">{study.approach}</dd>
                                                </div>
                                            </dl>
                                            <p className="mt-5 border-t border-border pt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                                                Anonymised engagement — details under NDA
                                            </p>
                                        </div>
                                    </article>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* LEADERSHIP — 08 */}
                <section id="leadership" className="tech-grid bg-secondary/60">
                    <div className="mx-auto max-w-[90rem] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
                        <Reveal>
                                label="Leadership"
                                title="The team behind CAxperts"
                                description="CAxperts is led by practising engineers who stay close to the work — reviewing models, methods and deliverables first-hand."
                            />
                        </Reveal>
                        <div className="mt-12 grid gap-px border border-border bg-border sm:grid-cols-3">
                            {LEADERS.map((leader, i) => (
                                <Reveal key={leader.name} delay={0.08 * i} className="h-full">
                                    <div className="flex h-full flex-col items-start bg-card p-8">
                                        <span className="flex h-16 w-16 items-center justify-center bg-navy font-display text-xl font-bold text-white">
                                            {leader.initials}
                                        </span>
                                        <h3 className="mt-6 font-display text-xl font-bold tracking-tight text-navy">
                                            {leader.name}
                                        </h3>
                                        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                                            Leadership — CAxperts Engineering
                                        </p>
                                        <span className="mt-6 font-display text-4xl font-bold leading-none text-navy/10">
                                            L.0{i + 1}
                                        </span>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CONTACT — 09 */}
                <section id="contact" className="tech-grid-dark bg-navy">
                    <div className="mx-auto max-w-[90rem] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
                        <Reveal>
                                label="Contact"
                                title="Discuss your requirement"
                                description="Tell us about your program, component or engineering challenge. We respond to every enquiry with a technical point of view — not a sales script."
                            />
                        </Reveal>
                        <div className="mt-12 grid gap-10 lg:grid-cols-5 lg:gap-14">
                            <Reveal delay={0.1} className="lg:col-span-2">
                                <div className="flex h-full flex-col">
                                    <div className="space-y-px border border-white/15 bg-white/15">
                                        <div className="bg-navy p-5">
                                            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
                                                <MapPin className="h-3.5 w-3.5 text-electric" strokeWidth={1.75} />
                                                Office
                                            </p>
                                            <p className="mt-2 font-display text-lg font-semibold text-white">
                                                Pune, Maharashtra, India
                                            </p>
                                        </div>
                                        <div className="bg-navy p-5">
                                            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
                                                Engagement Models
                                            </p>
                                            <p className="mt-2 text-sm leading-relaxed text-white/75">
                                                Fixed-scope projects · Time & material · Dedicated engineering
                                                resources
                                            </p>
                                        </div>
                                        <div className="bg-navy p-5">
                                            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
                                                Confidentiality
                                            </p>
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
                            </Reveal>
                            <Reveal delay={0.2} className="lg:col-span-3">
                                <EnquiryForm />
                            </Reveal>
                        </div>
                    </div>
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}
