import React, { useState } from 'react';
import { ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { SERVICES } from '@/data/services';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const INTEREST_OPTIONS = [
    ...SERVICES.map((service) => ({ value: service.slug, label: service.title })),
    { value: 'other', label: 'Other' },
];

const INDUSTRY_OPTIONS = ['Automotive', 'Industrial', 'Aerospace', 'Mobility', 'Energy', 'Other'];
const TIMELINE_OPTIONS = ['Immediate', 'Within 1 month', '1–3 months', 'Exploring options'];
// `website` is a honeypot: real visitors never see or fill this field (it's
// hidden off-screen below). A non-empty value means a bot filled it.
const EMPTY_FORM = { name: '', company: '', email: '', phone: '', interest: '', industry: '', timeline: '', message: '', website: '' };

// `initialInterest` pre-selects the service, e.g. from /contact?service=cad-engineering.
export default function EnquiryForm({ initialInterest = '' }) {
    const [form, setForm] = useState(() => ({
        ...EMPTY_FORM,
        interest: INTEREST_OPTIONS.some((option) => option.value === initialInterest) ? initialInterest : '',
    }));
    const [status, setStatus] = useState('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const updateField = (field) => (event) => {
        if (field === 'phone') {
            const rawValue = event.target.value;
            const sanitized = rawValue.replace(/[\u202A-\u202E]/g, '').replace(/[^+\d()\s-]/g, '');
            setForm((prev) => ({ ...prev, [field]: sanitized }));
            return;
        }

        setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const name = form.name.trim();
        const email = form.email.trim();
        const company = form.company.trim();
        const message = form.message.trim();
        const trimmedPhone = form.phone.trim();

        if (!name || !company || !email || !form.interest || !message) {
            setStatus('error');
            setErrorMessage('Please fill in your name, company, business email, service and project description.');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setStatus('error');
            setErrorMessage('Please provide a valid email address.');
            return;
        }

        if (trimmedPhone && !/^\+?[0-9()\s-]{7,20}$/.test(trimmedPhone)) {
            setStatus('error');
            setErrorMessage('Please enter a valid phone number with an international country code if needed.');
            return;
        }

        setStatus('submitting');
        setErrorMessage('');
        try {
            const response = await fetch('/api/contact.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    company,
                    email,
                    phone: trimmedPhone,
                    message,
                    interest: form.interest,
                    industry: form.industry,
                    timeline: form.timeline,
                    website: form.website,
                }),
            });

            const body = await response.json().catch(() => null);
            if (!response.ok || !body?.ok) {
                if (response.status === 429) {
                    setErrorMessage(body?.error || 'Too many submissions. Please try again later.');
                } else if (response.status === 503) {
                    setErrorMessage(body?.error || 'Email service is not configured. Please email info@caxperts-engineering.com directly.');
                } else {
                    setErrorMessage(body?.error || 'Something went wrong while submitting your enquiry. Please try again or email info@caxperts-engineering.com directly.');
                }
                setStatus('error');
                return;
            }

            trackEvent('generate_lead', { form: 'enquiry', service: form.interest });
            setStatus('success');
            setForm(EMPTY_FORM);
        } catch (err) {
            setStatus('error');
            setErrorMessage('Something went wrong while submitting your enquiry. Please try again or email info@caxperts-engineering.com directly.');
        }
    };

    if (status === 'success') {
        return (
            <div className="flex h-full min-h-[24rem] flex-col items-center justify-center border border-white/15 bg-white/[0.03] p-10 text-center" role="status" aria-live="polite">
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
        'w-full border border-white/15 bg-white/[0.04] px-3.5 py-3 text-sm text-white placeholder:text-white/50 outline-none transition-colors focus:border-electric';
    const labelClass = 'mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] text-white/55';

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
                        Business Email *
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
                        type="text"
                        inputMode="tel"
                        autoComplete="tel"
                        value={form.phone}
                        onChange={updateField('phone')}
                        placeholder="+1 555 123 4567"
                        className={inputClass}
                        pattern="^[+()0-9\\s-]{7,20}$"
                    />
                </div>
                <div className="sm:col-span-2">
                    <label htmlFor="enquiry-interest" className={labelClass}>
                        Service Required *
                    </label>
                    <Select
                        value={form.interest}
                        onValueChange={(value) => setForm((prev) => ({ ...prev, interest: value }))}
                    >
                        <SelectTrigger
                            id="enquiry-interest"
                            className="h-auto rounded-none border-white/15 bg-white/[0.04] px-3.5 py-3 text-sm text-white focus:border-electric focus:ring-0 focus:ring-offset-0 data-[placeholder]:text-white/50 [&>svg]:text-white/50"
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
                <div>
                    <label htmlFor="enquiry-industry" className={labelClass}>
                        Industry
                    </label>
                    <Select
                        value={form.industry}
                        onValueChange={(value) => setForm((prev) => ({ ...prev, industry: value }))}
                    >
                        <SelectTrigger
                            id="enquiry-industry"
                            className="h-auto rounded-none border-white/15 bg-white/[0.04] px-3.5 py-3 text-sm text-white focus:border-electric focus:ring-0 focus:ring-offset-0 data-[placeholder]:text-white/50 [&>svg]:text-white/50"
                        >
                            <SelectValue placeholder="Select an industry" />
                        </SelectTrigger>
                        <SelectContent className="rounded-none border-white/15 bg-navy-deep text-white">
                            {INDUSTRY_OPTIONS.map((option) => (
                                <SelectItem key={option} value={option} className="text-sm focus:bg-electric focus:text-white">
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label htmlFor="enquiry-timeline" className={labelClass}>
                        Expected Timeline
                    </label>
                    <Select
                        value={form.timeline}
                        onValueChange={(value) => setForm((prev) => ({ ...prev, timeline: value }))}
                    >
                        <SelectTrigger
                            id="enquiry-timeline"
                            className="h-auto rounded-none border-white/15 bg-white/[0.04] px-3.5 py-3 text-sm text-white focus:border-electric focus:ring-0 focus:ring-offset-0 data-[placeholder]:text-white/50 [&>svg]:text-white/50"
                        >
                            <SelectValue placeholder="Select a timeframe" />
                        </SelectTrigger>
                        <SelectContent className="rounded-none border-white/15 bg-navy-deep text-white">
                            {TIMELINE_OPTIONS.map((option) => (
                                <SelectItem key={option} value={option} className="text-sm focus:bg-electric focus:text-white">
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="sm:col-span-2">
                    <label htmlFor="enquiry-message" className={labelClass}>
                        Project Description *
                    </label>
                    <textarea
                        id="enquiry-message"
                        required
                        rows={5}
                        maxLength={5000}
                        value={form.message}
                        onChange={updateField('message')}
                        placeholder="Describe the component, loadcase, model or engineering challenge."
                        className={`${inputClass} resize-y`}
                    />
                </div>
            </div>

            {/* Honeypot — hidden from real visitors and screen readers; bots that
                fill every field will trip it. */}
            <div
                aria-hidden="true"
                style={{ position: 'absolute', left: '-9999px', top: 0, width: 1, height: 1, overflow: 'hidden' }}
            >
                <label htmlFor="enquiry-website">Website</label>
                <input
                    id="enquiry-website"
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
                        Submitting
                    </>
                ) : (
                    <>
                        Submit Requirement
                        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                    </>
                )}
            </button>
            {status === 'error' && errorMessage && (
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-red-300" role="alert">
                    {errorMessage}
                </p>
            )}
            <p className="mt-4 max-w-xl text-xs leading-relaxed text-white/60">
                Your information will be treated confidentially and used only to respond to your enquiry. See our{' '}
                <a href="/privacy" className="underline transition-colors hover:text-electric">
                    Privacy Policy
                </a>
                .
            </p>
        </form>
    );
}
