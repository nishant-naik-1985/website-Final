import React, { Suspense, lazy } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import CookieConsent from './components/site/CookieConsent';
import HomePage from './pages/HomePage';

// Most visitors only see the home page, so the other pages are split into
// their own files and downloaded only when opened.
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
