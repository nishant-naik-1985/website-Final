import React from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import Reveal from '@/components/Reveal';
import SiteHeader from '@/components/site/Header';
import SiteFooter from '@/components/site/Footer';
import EnquiryForm from '@/components/site/EnquiryForm';
import { ContactInfo, PageHero } from '@/components/site/blocks';
import Seo from '@/components/Seo';

export default function ContactPage() {
    // Service pages link here as /contact?service=<slug> to pre-select the service.
    const [searchParams] = useSearchParams();

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Helmet>
                <title>Contact | CAxperts Engineering</title>
                <meta
                    name="description"
                    content="Discuss your CAE, CAD or simulation requirement with CAxperts Engineering, Pune. Send us your programme, component or engineering challenge and we respond with a clear next step."
                />
                <Seo
                    title="Contact | CAxperts Engineering"
                    description="Discuss your engineering requirement with CAxperts Engineering."
                    siteName="CAxperts Engineering"
                />
            </Helmet>

            <SiteHeader />

            <main>
                <PageHero label="Contact" title="Discuss your engineering requirement">
                    Tell us about your programme, component or engineering challenge. We respond with a technical point
                    of view and a clear next step.
                </PageHero>

                <section className="tech-grid-dark bg-navy">
                    <div className="mx-auto grid max-w-[90rem] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-5 lg:gap-14 lg:px-10 lg:py-24">
                        <Reveal className="lg:col-span-2">
                            <ContactInfo />
                        </Reveal>
                        <Reveal delay={0.1} className="lg:col-span-3">
                            <EnquiryForm initialInterest={searchParams.get('service') || ''} />
                        </Reveal>
                    </div>
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}
