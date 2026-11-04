import React from 'react';
import { Helmet } from 'react-helmet';
import Reveal from '@/components/Reveal';
import SiteHeader from '@/components/site/Header';
import SiteFooter from '@/components/site/Footer';
import SectionHeader from '@/components/site/SectionHeader';
import { CtaBand, DeliveryModels, PageHero, ProcessSteps, Section } from '@/components/site/blocks';
import Seo from '@/components/Seo';

export default function ProcessPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Helmet>
                <title>How We Work | CAxperts Engineering</title>
                <meta
                    name="description"
                    content="How CAxperts Engineering delivers CAE and CAD projects: a disciplined process from requirement to delivery, and flexible delivery models across Europe and India."
                />
                <Seo
                    title="How We Work | CAxperts Engineering"
                    description="Our engineering process and delivery models across Europe and India."
                    siteName="CAxperts Engineering"
                />
            </Helmet>

            <SiteHeader />

            <main>
                <PageHero label="How We Work" title="A disciplined loop from requirement to delivery">
                    A clear process and flexible delivery models, adapted to the scope, team and review rhythm of each
                    engagement.
                </PageHero>

                <Section tone="muted">
                    <Reveal>
                        <SectionHeader label="Process" title="Five steps, applied to every engagement" />
                    </Reveal>
                    <ProcessSteps />
                </Section>

                <Section id="delivery">
                    <Reveal>
                        <SectionHeader
                            label="Delivery Model"
                            title="Flexible collaboration across Europe and India"
                            description="A structured customer interface paired with practical engineering execution. The model adapts to the scope, team and review rhythm of each engagement."
                        />
                    </Reveal>
                    <DeliveryModels />
                </Section>

                <CtaBand />
            </main>

            <SiteFooter />
        </div>
    );
}
