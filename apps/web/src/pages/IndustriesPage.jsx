import React from 'react';
import { Helmet } from 'react-helmet';
import SiteHeader from '@/components/site/Header';
import SiteFooter from '@/components/site/Footer';
import { CtaBand, IndustryGrid, PageHero, Section } from '@/components/site/blocks';
import Seo from '@/components/Seo';

export default function IndustriesPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Helmet>
                <title>Industries | CAxperts Engineering</title>
                <meta
                    name="description"
                    content="CAE and CAD engineering for automotive, heavy machinery, automation and robotics, renewable energy, aerospace and defence, and medical device development."
                />
                <Seo
                    title="Industries | CAxperts Engineering"
                    description="The industries CAxperts Engineering supports with CAE and CAD engineering."
                    siteName="CAxperts Engineering"
                />
            </Helmet>

            <SiteHeader />

            <main>
                <PageHero label="Industries" title="Sector knowledge that shapes better models">
                    Our engineers bring domain context to every model — so loadcases, constraints and acceptance
                    criteria reflect real operating conditions.
                </PageHero>

                <Section>
                    <IndustryGrid />
                </Section>

                <CtaBand />
            </main>

            <SiteFooter />
        </div>
    );
}
