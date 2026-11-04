import React from 'react';
import { Helmet } from 'react-helmet';
import SiteHeader from '@/components/site/Header';
import SiteFooter from '@/components/site/Footer';
import { CtaBand, PageHero, Section, ServiceCards } from '@/components/site/blocks';
import Seo from '@/components/Seo';

export default function ServicesPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Helmet>
                <title>Services | CAxperts Engineering</title>
                <meta
                    name="description"
                    content="CAE and simulation, CAD and engineering, pre/post processing, engineering consulting, CAE automation and resource augmentation from CAxperts Engineering, Pune."
                />
                <Seo
                    title="Services | CAxperts Engineering"
                    description="Six CAE and CAD engineering practice areas from CAxperts Engineering, Pune."
                    siteName="CAxperts Engineering"
                />
            </Helmet>

            <SiteHeader />

            <main>
                <PageHero label="Services" title="Six practice areas, one engineering standard">
                    Every engagement is delivered by specialist engineers using industry-standard tools and documented
                    methods. Choose a service to see what it covers.
                </PageHero>

                <Section tone="muted">
                    <ServiceCards />
                </Section>

                <CtaBand />
            </main>

            <SiteFooter />
        </div>
    );
}
