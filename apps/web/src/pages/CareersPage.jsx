import React, { useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import {
    ArrowRight,
    ArrowUpRight,
    Mail,
    MapPin,
    Briefcase,
    Clock,
    Copy,
    Check,
    Loader2,
    CheckCircle2,
    FileText,
    Upload,
    X,
} from 'lucide-react';
import Reveal from '@/components/Reveal';
import SiteHeader from '@/components/site/Header';
import SiteFooter from '@/components/site/Footer';
import SectionHeader from '@/components/site/SectionHeader';
import Seo from '@/components/Seo';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

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
    {
        id: 'business-development-cae-services',
        title: 'Business Development Manager — CAE Services',
        location: 'Pune, India (Hybrid)',
        type: 'Full-time',
        experience: '3–6 years',
        summary:
            'We are looking for a Business Development Manager to grow our CAE and engineering services business — finding new clients and projects in India and internationally, and building long-term relationships with engineering teams at OEMs and suppliers.',
        responsibilities: [
            'Identify and qualify new clients and projects for CAE, CAD and engineering services in India and international markets, especially Europe.',
            'Build a pipeline of prospects among automotive OEMs, Tier-1 suppliers and industrial manufacturers.',
            'Generate leads through networking, LinkedIn, industry events, trade fairs and direct outreach.',
            'Understand customer engineering requirements and work with our technical team on scope, effort estimates and proposals.',
            'Prepare and present capability presentations, proposals and commercial offers; negotiate and close engagements.',
            'Grow existing accounts and maintain long-term relationships with customer engineering and purchasing teams.',
            'Track market trends, competitors and opportunities, and report on pipeline and sales performance.',
        ],
        requirements: [
            'Degree in Mechanical, Automobile or a related engineering discipline; an MBA is an advantage.',
            '3–6 years of business development or sales experience in CAE, CAD or engineering services.',
            'Good understanding of CAE and simulation services — crash, structural, durability and pre/post processing.',
            'Proven track record of winning new clients and projects.',
            'Network of contacts at automotive or industrial engineering organisations in India and/or abroad.',
            'Excellent English communication, presentation and negotiation skills.',
            'Willingness to travel within India and internationally.',
        ],
        niceToHave: [
            'Experience selling engineering services to international customers.',
            'Experience with CRM tools and structured pipeline management.',
        ],
    },
];

const GENERAL_APPLICATION = 'General Application';
const POSITION_OPTIONS = [...JOBS.map((job) => job.title), GENERAL_APPLICATION];

const MAX_CV_BYTES = 5 * 1024 * 1024;
const CV_EXTENSIONS = ['pdf', 'doc', 'docx'];

// `website` is a honeypot, as on the enquiry form: real visitors never see it.
const EMPTY_APPLICATION = {
    name: '',
    email: '',
    phone: '',
    location: '',
    experience: '',
    notice_period: '',
    linkedin: '',
    message: '',
    website: '',
};

function mailtoFor(position) {
    const subject = `Application: ${position.replace('—', '-')}`;
    const body = 'Dear CAxperts team,\n\nPlease find my CV attached for the above position.\n\nName:\nPhone:\nCurrent location:\nNotice period:\n';
    return `mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function formatFileSize(bytes) {
    return bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function validateCv(file) {
    const extension = file.name.split('.').pop().toLowerCase();
    if (!CV_EXTENSIONS.includes(extension)) {
        return 'Please upload your CV as a PDF or Word document (.pdf, .doc, .docx).';
    }
    if (file.size > MAX_CV_BYTES) {
        return 'Your CV is too large. Please upload a file under 5 MB.';
    }
    return '';
}

function ApplicationForm({ position, onPositionChange }) {
    const [form, setForm] = useState(EMPTY_APPLICATION);
    const [cv, setCv] = useState(null);
    const [status, setStatus] = useState('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const fileInputRef = useRef(null);

    const updateField = (field) => (event) => {
        if (field === 'phone') {
            const sanitized = event.target.value.replace(/[‪-‮]/g, '').replace(/[^+\d()\s-]/g, '');
            setForm((prev) => ({ ...prev, phone: sanitized }));
            return;
        }

        setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const fileError = validateCv(file);
        if (fileError) {
            setCv(null);
            event.target.value = '';
            setStatus('error');
            setErrorMessage(fileError);
            return;
        }

        setCv(file);
        if (status === 'error') {
            setStatus('idle');
            setErrorMessage('');
        }
    };

    const clearFile = () => {
        setCv(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const name = form.name.trim();
        const email = form.email.trim();
        const phone = form.phone.trim();
        const linkedin = form.linkedin.trim();

        if (!name || !email || !phone || !cv) {
            setStatus('error');
            setErrorMessage('Please fill in your name, email and phone number, and attach your CV.');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setStatus('error');
            setErrorMessage('Please provide a valid email address.');
            return;
        }

        if (!/^\+?[0-9()\s-]{7,20}$/.test(phone)) {
            setStatus('error');
            setErrorMessage('Please enter a valid phone number, with country code if outside India.');
            return;
        }

        if (linkedin && !/^https?:\/\/\S+$/i.test(linkedin)) {
            setStatus('error');
            setErrorMessage('Please enter your LinkedIn profile as a full URL, starting with https://');
            return;
        }

        const payload = new FormData();
        payload.append('position', position);
        Object.entries(form).forEach(([field, value]) => payload.append(field, value.trim()));
        payload.append('cv', cv);

        setStatus('submitting');
        setErrorMessage('');
        try {
            const response = await fetch('/api/apply.php', { method: 'POST', body: payload });
            const body = await response.json().catch(() => null);

            if (!response.ok || !body?.ok) {
                setErrorMessage(
                    body?.error ||
                        `Something went wrong while sending your application. Please try again or email your CV to ${CAREERS_EMAIL}.`
                );
                setStatus('error');
                return;
            }

            setStatus('success');
            setForm(EMPTY_APPLICATION);
            clearFile();
        } catch (err) {
            setStatus('error');
            setErrorMessage(
                `Something went wrong while sending your application. Please try again or email your CV to ${CAREERS_EMAIL}.`
            );
        }
    };

    if (status === 'success') {
        return (
            <div className="flex h-full min-h-[24rem] flex-col items-center justify-center border border-white/15 bg-white/[0.03] p-10 text-center" role="status" aria-live="polite">
                <CheckCircle2 className="h-10 w-10 text-electric" strokeWidth={1.5} />
                <p className="mt-5 font-display text-2xl font-bold text-white">Application received</p>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/65">
                    Thank you for applying to CAxperts Engineering. We review every application and will contact
                    shortlisted candidates.
                </p>
                <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="mt-8 border border-electric px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-electric transition-colors hover:bg-electric hover:text-white"
                >
                    Submit another application
                </button>
            </div>
        );
    }

    const inputClass =
        'w-full border border-white/15 bg-white/[0.04] px-3.5 py-3 text-sm text-white placeholder:text-white/35 outline-none transition-colors focus:border-electric';
    const labelClass = 'mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-white/55';

    return (
        <form onSubmit={handleSubmit} className="border border-white/15 bg-white/[0.03] p-6 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <label htmlFor="apply-position" className={labelClass}>
                        Position *
                    </label>
                    <Select value={position} onValueChange={onPositionChange}>
                        <SelectTrigger
                            id="apply-position"
                            className="h-auto rounded-none border-white/15 bg-white/[0.04] px-3.5 py-3 text-sm text-white focus:border-electric focus:ring-0 focus:ring-offset-0 [&>svg]:text-white/50"
                        >
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-none border-white/15 bg-navy-deep text-white">
                            {POSITION_OPTIONS.map((option) => (
                                <SelectItem key={option} value={option} className="text-sm focus:bg-electric focus:text-white">
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label htmlFor="apply-name" className={labelClass}>
                        Full Name *
                    </label>
                    <input
                        id="apply-name"
                        type="text"
                        required
                        maxLength={150}
                        autoComplete="name"
                        value={form.name}
                        onChange={updateField('name')}
                        placeholder="Your full name"
                        className={inputClass}
                    />
                </div>
                <div>
                    <label htmlFor="apply-email" className={labelClass}>
                        Email *
                    </label>
                    <input
                        id="apply-email"
                        type="email"
                        required
                        maxLength={254}
                        autoComplete="email"
                        value={form.email}
                        onChange={updateField('email')}
                        placeholder="you@example.com"
                        className={inputClass}
                    />
                </div>
                <div>
                    <label htmlFor="apply-phone" className={labelClass}>
                        Phone *
                    </label>
                    <input
                        id="apply-phone"
                        type="text"
                        required
                        inputMode="tel"
                        autoComplete="tel"
                        value={form.phone}
                        onChange={updateField('phone')}
                        placeholder="+91 98765 43210"
                        className={inputClass}
                    />
                </div>
                <div>
                    <label htmlFor="apply-location" className={labelClass}>
                        Current Location
                    </label>
                    <input
                        id="apply-location"
                        type="text"
                        maxLength={150}
                        value={form.location}
                        onChange={updateField('location')}
                        placeholder="City, Country"
                        className={inputClass}
                    />
                </div>
                <div>
                    <label htmlFor="apply-experience" className={labelClass}>
                        Total Experience
                    </label>
                    <input
                        id="apply-experience"
                        type="text"
                        maxLength={50}
                        value={form.experience}
                        onChange={updateField('experience')}
                        placeholder="e.g. 2 years"
                        className={inputClass}
                    />
                </div>
                <div>
                    <label htmlFor="apply-notice" className={labelClass}>
                        Notice Period
                    </label>
                    <input
                        id="apply-notice"
                        type="text"
                        maxLength={100}
                        value={form.notice_period}
                        onChange={updateField('notice_period')}
                        placeholder="e.g. 30 days, immediate"
                        className={inputClass}
                    />
                </div>
                <div className="sm:col-span-2">
                    <label htmlFor="apply-linkedin" className={labelClass}>
                        LinkedIn Profile
                    </label>
                    <input
                        id="apply-linkedin"
                        type="url"
                        maxLength={300}
                        value={form.linkedin}
                        onChange={updateField('linkedin')}
                        placeholder="https://www.linkedin.com/in/your-profile"
                        className={inputClass}
                    />
                </div>
                <div className="sm:col-span-2">
                    <label htmlFor="apply-cv" className={labelClass}>
                        CV / Resume * <span className="normal-case tracking-normal text-white/40">(PDF or Word, max 5 MB)</span>
                    </label>
                    {cv ? (
                        <div className="flex items-center justify-between gap-3 border border-electric/60 bg-electric/10 px-3.5 py-3">
                            <span className="flex min-w-0 items-center gap-2.5 text-sm text-white">
                                <FileText className="h-4 w-4 shrink-0 text-electric" strokeWidth={1.75} />
                                <span className="truncate">{cv.name}</span>
                                <span className="shrink-0 text-white/45">{formatFileSize(cv.size)}</span>
                            </span>
                            <button
                                type="button"
                                onClick={clearFile}
                                className="inline-flex h-8 w-8 shrink-0 items-center justify-center text-white/60 transition-colors hover:text-white"
                                aria-label="Remove CV"
                            >
                                <X className="h-4 w-4" strokeWidth={2} />
                            </button>
                        </div>
                    ) : (
                        <label
                            htmlFor="apply-cv"
                            className="flex cursor-pointer items-center justify-center gap-2.5 border border-dashed border-white/25 bg-white/[0.02] px-3.5 py-6 text-sm text-white/65 transition-colors hover:border-electric hover:text-white"
                        >
                            <Upload className="h-4 w-4 text-electric" strokeWidth={1.75} />
                            Choose a file to upload
                        </label>
                    )}
                    <input
                        ref={fileInputRef}
                        id="apply-cv"
                        type="file"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleFileChange}
                        className="sr-only"
                    />
                </div>
                <div className="sm:col-span-2">
                    <label htmlFor="apply-message" className={labelClass}>
                        Message
                    </label>
                    <textarea
                        id="apply-message"
                        rows={4}
                        maxLength={5000}
                        value={form.message}
                        onChange={updateField('message')}
                        placeholder="Tell us briefly about your CAE experience, tools and the projects you have worked on."
                        className={`${inputClass} resize-y`}
                    />
                </div>
            </div>

            {/* Honeypot — hidden from real visitors and screen readers. */}
            <div
                aria-hidden="true"
                style={{ position: 'absolute', left: '-9999px', top: 0, width: 1, height: 1, overflow: 'hidden' }}
            >
                <label htmlFor="apply-website">Website</label>
                <input
                    id="apply-website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={updateField('website')}
                />
            </div>

            <button
                type="submit"
                disabled={status === 'submitting'}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-electric px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-white transition-all hover:bg-electric/85 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
                {status === 'submitting' ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                        Sending
                    </>
                ) : (
                    <>
                        Submit Application
                        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                    </>
                )}
            </button>
            {status === 'error' && errorMessage && (
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-red-300" role="alert">
                    {errorMessage}
                </p>
            )}
            <p className="mt-4 max-w-xl text-xs leading-relaxed text-white/50">
                Your details and CV are used only to assess your application and are treated confidentially.
            </p>
        </form>
    );
}

function EmailOption({ position }) {
    const [copied, setCopied] = useState(false);

    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText(CAREERS_EMAIL);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            // Clipboard can be blocked (e.g. non-HTTPS preview); the address stays visible to copy by hand.
        }
    };

    return (
        <div className="border border-white/15 bg-navy p-6">
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
                <Mail className="h-3.5 w-3.5 text-electric" strokeWidth={1.75} />
                Prefer Email?
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/75">
                Send your CV directly to our team, with the position in the subject line.
            </p>
            <p className="mt-4 break-all font-display text-lg font-semibold text-white">{CAREERS_EMAIL}</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <a
                    href={mailtoFor(position)}
                    className="inline-flex items-center justify-center gap-2 border border-electric px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-electric transition-colors hover:bg-electric hover:text-white"
                >
                    Open Email App
                    <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
                </a>
                <button
                    type="button"
                    onClick={copyEmail}
                    className="inline-flex items-center justify-center gap-2 border border-white/25 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-white/85 transition-colors hover:border-electric hover:text-electric"
                >
                    {copied ? <Check className="h-3.5 w-3.5" strokeWidth={2} /> : <Copy className="h-3.5 w-3.5" strokeWidth={2} />}
                    {copied ? 'Copied' : 'Copy Email'}
                </button>
            </div>
        </div>
    );
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

function JobPosting({ job, onApply }) {
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
                <button
                    type="button"
                    onClick={() => onApply(job.title)}
                    className="inline-flex shrink-0 items-center justify-center gap-2 bg-electric px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-white transition-all hover:bg-electric/85 active:scale-[0.99]"
                >
                    Apply Now
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
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
                    Apply online with the form below, or email your CV to{' '}
                    <a href={mailtoFor(job.title)} className="font-medium text-electric hover:underline">
                        {CAREERS_EMAIL}
                    </a>{' '}
                    with the job title in the subject line.
                </p>
            </div>
        </article>
    );
}

export default function CareersPage() {
    const [position, setPosition] = useState(POSITION_OPTIONS[0]);

    const applyFor = (title) => {
        setPosition(title);
        document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Helmet>
                <title>Careers | CAXPERTS Engineering</title>
                <meta
                    name="description"
                    content="Join CAXPERTS Engineering in Pune. Explore open roles in CAE crash and safety simulation and in business development for engineering services."
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
                    description="Open CAE engineering and business development roles at CAXPERTS Engineering, Pune."
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
                                programmes for automotive and industrial customers in India and abroad. Whether you build
                                simulation models or build client relationships, we would like to hear from you.
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
                                description="All roles are based in Pune. Apply online or send your CV by email — we review every application and respond to shortlisted candidates."
                            />
                        </Reveal>
                        <div className="mt-12 space-y-8">
                            {JOBS.map((job) => (
                                <Reveal key={job.id}>
                                    <JobPosting job={job} onApply={applyFor} />
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* APPLY */}
                <section id="apply" className="tech-grid-dark bg-navy">
                    <div className="mx-auto max-w-[90rem] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
                        <Reveal>
                            <SectionHeader
                                dark
                                label="Apply"
                                title="Submit your application"
                                description="Apply online in a couple of minutes, or send your CV by email if you prefer. Don't see a matching role? Choose General Application — we are always interested in talented CAE and CAD engineers."
                            />
                        </Reveal>
                        <div className="mt-12 grid gap-10 lg:grid-cols-5 lg:gap-14">
                            <Reveal delay={0.1} className="lg:col-span-3">
                                <ApplicationForm position={position} onPositionChange={setPosition} />
                            </Reveal>
                            <Reveal delay={0.2} className="lg:col-span-2">
                                <EmailOption position={position} />
                            </Reveal>
                        </div>
                    </div>
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}
