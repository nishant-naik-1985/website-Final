import React, { Suspense, lazy } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import CookieConsent from './components/site/CookieConsent';
import HomePage from './pages/HomePage';

// Each page is split into its own file and downloaded only when opened.
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ServicePage = lazy(() => import('./pages/ServicePage'));
const CapabilitiesPage = lazy(() => import('./pages/CapabilitiesPage'));
const IndustriesPage = lazy(() => import('./pages/IndustriesPage'));
const ProcessPage = lazy(() => import('./pages/ProcessPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const CareersPage = lazy(() => import('./pages/CareersPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
    return (
        <Router>
            <ScrollToTop />
            <Suspense fallback={<div className="min-h-screen bg-navy-deep" />}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/services/:slug" element={<ServicePage />} />
                    <Route path="/capabilities" element={<CapabilitiesPage />} />
                    <Route path="/industries" element={<IndustriesPage />} />
                    <Route path="/how-we-work" element={<ProcessPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/careers" element={<CareersPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Suspense>
            <CookieConsent />
        </Router>
    );
}

export default App;
