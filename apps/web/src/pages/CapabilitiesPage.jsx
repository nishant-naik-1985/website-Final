import React from 'react';
import { Helmet } from 'react-helmet';
import Reveal from '@/components/Reveal';
import SiteHeader from '@/components/site/Header';
import SiteFooter from '@/components/site/Footer';
import SectionHeader from '@/components/site/SectionHeader';
import { CapabilityGroups, CtaBand, PageHero, Section, Toolchain } from '@/components/site/blocks';
import Seo from '@/components/Seo';

export default function CapabilitiesPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Helmet>
                <title>Capabilities | CAxperts Engineering</title>
                <meta
                    name="description"
                    content="CAxperts Engineering capabilities: structural analysis, crash and safety, seats and restraints, pedestrian safety, durability, optimisation and CAE automation, with LS-DYNA, Pam-Crash, Abaqus, ANSA and more."
                />
                <Seo
                    title="Capabilities | CAxperts Engineering"
                    description="Core CAE capabilities and the toolchain CAxperts Engineering works with."
                    siteName="CAxperts Engineering"
                />
            </Helmet>

            <SiteHeader />

            <main>
                <PageHero label="Capabilities" title="What we deliver today — and what is on our roadmap">
                    We are transparent about maturity: core practice areas, available capabilities, and planned
                    additions are clearly separated.
                </PageHero>

                <Section tone="dark">
                    <Reveal>
                        <SectionHeader
                            dark
                            label="Practice Areas"
                            title="Core, available and planned"
                            description="Core areas are our primary practice. Available capabilities are offered within current engagements. Planned capabilities are on our roadmap and not yet delivered."
                        />
                    </Reveal>
                    <CapabilityGroups />
                    <Toolchain />
                </Section>

                <CtaBand />
            </main>

            <SiteFooter />
        </div>
    );
}
