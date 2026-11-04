import React, { Suspense, lazy } from 'react';
import { Navigate, Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import CookieConsent from './components/site/CookieConsent';
import HomePage from './pages/HomePage';

// Most visitors only see the home page, so the other pages are split into
// their own files and downloaded only when opened.
const CareersPage = lazy(() => import('./pages/CareersPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const ServicePage = lazy(() => import('./pages/ServicePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
    return (
        <Router>
            <ScrollToTop />
            <Suspense fallback={<div className="min-h-screen bg-navy-deep" />}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/careers" element={<CareersPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="/services/:slug" element={<ServicePage />} />
                    {/* There is no services index page; send it to the home page's Services section. */}
                    <Route path="/services" element={<Navigate to="/#services" replace />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Suspense>
            <CookieConsent />
        </Router>
    );
}

export default App;
