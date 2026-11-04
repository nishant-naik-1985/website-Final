import React from 'react';
import { Helmet } from 'react-helmet';
import SiteHeader from '@/components/site/Header';
import SiteFooter from '@/components/site/Footer';
import Seo from '@/components/Seo';

const CONTACT_EMAIL = 'info@caxperts-engineering.com';
const LAST_UPDATED = '2 November 2026';

function PolicySection({ id, title, children }) {
    return (
        <section id={id} className="border-t border-border pt-8">
            <h2 className="font-display text-2xl font-bold leading-snug tracking-tight text-navy">{title}</h2>
            <div className="mt-4 space-y-4 leading-relaxed text-foreground/80">{children}</div>
        </section>
    );
}

function BulletList({ items }) {
    return (
        <ul className="space-y-2.5">
            {items.map((item) => (
                <li key={item} className="flex gap-3">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-electric" aria-hidden="true" />
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    );
}

function EmailLink() {
    return (
        <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-electric hover:underline">
            {CONTACT_EMAIL}
        </a>
    );
}

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Helmet>
                <title>Privacy Policy | CAXPERTS Engineering</title>
                <meta
                    name="description"
                    content="How CAxperts Engineering Pvt. Ltd. collects, uses and protects personal data from enquiries, job applications and visits to this website."
                />
                <Seo
                    title="Privacy Policy | CAXPERTS Engineering"
                    description="How CAxperts Engineering collects, uses and protects personal data."
                    siteName="CAXPERTS Engineering"
                />
            </Helmet>

            <SiteHeader />

            <main>
                <section className="tech-grid-dark bg-navy-deep pt-16">
                    <div className="mx-auto max-w-[90rem] px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
                        <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-electric">
                            <span className="inline-block h-2 w-2 bg-electric" aria-hidden="true" />
                            Legal
                        </p>
                        <h1 className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl">
                            Privacy Policy
                        </h1>
                        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-white/55">
                            Last updated: {LAST_UPDATED}
                        </p>
                    </div>
                </section>

                <div className="mx-auto max-w-3xl space-y-12 px-4 py-16 sm:px-6 lg:py-20">
                    <p className="text-lg leading-relaxed text-muted-foreground">
                        This policy explains what personal data CAxperts Engineering Pvt. Ltd. collects when you visit
                        this website, send us an enquiry or apply for a job, how we use it, and the rights you have. We
                        collect only what we need to respond to you, and we never sell personal data.
                    </p>

                    <PolicySection id="who-we-are" title="Who we are">
                        <p>
                            CAxperts Engineering Pvt. Ltd. (&ldquo;CAxperts&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is
                            an engineering services company based in Pune, Maharashtra, India. We are responsible for the
                            personal data described in this policy (the &ldquo;data controller&rdquo; under the EU GDPR
                            and the &ldquo;data fiduciary&rdquo; under India&rsquo;s Digital Personal Data Protection Act,
                            2023).
                        </p>
                        <p>
                            For any privacy question or request, contact us at <EmailLink />.
                        </p>
                    </PolicySection>

                    <PolicySection id="data-we-collect" title="What data we collect">
                        <p>
                            <strong className="text-navy">Business enquiries.</strong> When you use the contact form we
                            collect your name, company, business email address, phone number (optional), the service and
                            industry you select, your expected timeline and your project description.
                        </p>
                        <p>
                            <strong className="text-navy">Job applications.</strong> When you apply through the careers
                            page we collect the position, your name, email address, phone number, and optionally your
                            current location, total experience, notice period, LinkedIn profile and message, together
                            with the CV you upload. If you email us your CV instead, we receive the same kind of
                            information from your email.
                        </p>
                        <p>
                            <strong className="text-navy">Emails.</strong> If you write to us directly, we receive your
                            email address and whatever you include in your message.
                        </p>
                        <p>
                            <strong className="text-navy">Technical data.</strong> When you submit a form, our server
                            briefly records your IP address to block spam and repeated submissions. Like most websites,
                            our hosting provider also keeps standard server logs (such as IP address, browser type, the
                            page requested and the time of the request) for security and to keep the site running.
                        </p>
                        <p>
                            Please do not send us sensitive personal data (for example health information, religion or
                            identity numbers) in a form, CV or email. We do not need it.
                        </p>
                    </PolicySection>

                    <PolicySection id="cookies" title="Cookies and tracking">
                        <p>
                            This website does not use cookies, analytics, advertising or tracking tools. Fonts are served
                            from our own server, so your browser does not contact third-party font services when you
                            visit. If we introduce analytics in the future, we will update this policy and, where the
                            law requires it, ask for your consent first.
                        </p>
                    </PolicySection>

                    <PolicySection id="how-we-use" title="How we use your data">
                        <BulletList
                            items={[
                                'To reply to your enquiry, discuss your requirement and prepare proposals.',
                                'To assess your job application, contact you about it and, with your agreement, consider you for other suitable roles.',
                                'To manage our business relationship with you and your organisation.',
                                'To keep the website and our forms secure and protect them against spam and misuse.',
                                'To meet our legal, tax and accounting obligations.',
                            ]}
                        />
                        <p>
                            We do not use your data for automated decision-making or profiling, and we do not sell or
                            rent it to anyone.
                        </p>
                    </PolicySection>

                    <PolicySection id="legal-basis" title="Legal basis">
                        <p>
                            <strong className="text-navy">Under the EU GDPR</strong>, we process your data because it is
                            necessary to take steps at your request before entering into a contract (enquiries and job
                            applications), for our legitimate interests in running and securing our business and
                            communicating with business contacts, and to comply with legal obligations.
                        </p>
                        <p>
                            <strong className="text-navy">Under India&rsquo;s DPDP Act</strong>, we process the data you
                            choose to give us to respond to the purpose for which you provided it. By submitting a form or
                            sending us your CV, you consent to that use. You can withdraw your consent at any time by
                            emailing us; this does not affect processing that took place before you withdrew it.
                        </p>
                    </PolicySection>

                    <PolicySection id="sharing" title="Who we share data with">
                        <p>
                            Your data is accessed only by CAxperts staff who need it to respond to you. We use{' '}
                            <strong className="text-navy">Hostinger</strong> to host this website and to deliver our
                            email, so form submissions and emails pass through and are stored on their servers. Hostinger
                            processes this data on our behalf and only to provide those services.
                        </p>
                        <p>
                            We may also disclose data where the law requires it, for example to comply with a court
                            order or a request from a public authority. We do not share your data with anyone else
                            without your agreement.
                        </p>
                    </PolicySection>

                    <PolicySection id="transfers" title="International transfers">
                        <p>
                            Our team is based in India, and our service providers may store data on servers in other
                            countries. If you are in the European Economic Area, the UK or Switzerland, this means your
                            data may be transferred to and processed in India or other countries that may not offer the
                            same level of data protection as your own. Where the GDPR requires it, we put appropriate
                            safeguards in place for these transfers, such as the European Commission&rsquo;s Standard
                            Contractual Clauses.
                        </p>
                    </PolicySection>

                    <PolicySection id="retention" title="How long we keep data">
                        <BulletList
                            items={[
                                'Enquiries that do not lead to a project: up to 24 months after our last contact with you.',
                                'Job applications and CVs: up to 12 months after you apply, so we can consider you for future roles. If you are hired, your application becomes part of your employee record.',
                                'Data relating to customer engagements: for as long as the engagement lasts and afterwards as required by contract, tax and accounting law.',
                                'Spam-protection records of IP addresses: used for no more than one hour, then cleared automatically the next time a form is submitted.',
                            ]}
                        />
                        <p>
                            You can ask us to delete your data sooner at any time. We will do so unless the law requires
                            us to keep it.
                        </p>
                    </PolicySection>

                    <PolicySection id="security" title="How we protect data">
                        <p>
                            This website is served over an encrypted (HTTPS) connection, and forms send your data to us
                            over that connection. Access to enquiries and applications is limited to the people who need
                            it, and we treat all customer and candidate information as confidential. No system is
                            completely secure, but we take reasonable technical and organisational measures to protect
                            your data against loss, misuse and unauthorised access.
                        </p>
                    </PolicySection>

                    <PolicySection id="your-rights" title="Your rights">
                        <p>Depending on where you live, you have the right to:</p>
                        <BulletList
                            items={[
                                'Access the personal data we hold about you and receive a copy of it.',
                                'Correct data that is inaccurate or incomplete.',
                                'Have your data deleted.',
                                'Withdraw any consent you have given.',
                                'Object to or ask us to restrict certain processing (GDPR).',
                                'Receive your data in a portable format (GDPR).',
                                'Nominate another person to exercise your rights in the event of your death or incapacity (DPDP Act).',
                            ]}
                        />
                        <p>
                            To use any of these rights, email us at <EmailLink />. We will respond within one month, or
                            sooner where the law requires it. We may need to confirm your identity before acting on a
                            request.
                        </p>
                        <p>
                            If you are not satisfied with our response, you can complain to the data protection
                            authority in your country (in the EU, your local supervisory authority) or, in India, to the
                            Data Protection Board of India.
                        </p>
                    </PolicySection>

                    <PolicySection id="grievances" title="Grievances">
                        <p>
                            If you have a concern about how we handle your personal data, please contact us first at{' '}
                            <EmailLink /> with the subject &ldquo;Privacy&rdquo;. We will acknowledge your message and aim
                            to resolve it promptly.
                        </p>
                    </PolicySection>

                    <PolicySection id="children" title="Children">
                        <p>
                            This website and our services are intended for businesses and adult job seekers. We do not
                            knowingly collect personal data from anyone under 18.
                        </p>
                    </PolicySection>

                    <PolicySection id="changes" title="Changes to this policy">
                        <p>
                            We may update this policy from time to time, for example if we add new features to the
                            website. The date at the top of this page shows when it was last changed.
                        </p>
                    </PolicySection>

                    <PolicySection id="contact" title="Contact">
                        <p>
                            CAxperts Engineering Pvt. Ltd.
                            <br />
                            Pune, Maharashtra, India
                            <br />
                            <EmailLink />
                        </p>
                    </PolicySection>
                </div>
            </main>

            <SiteFooter />
        </div>
    );
}
