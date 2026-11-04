import { useLocation } from 'react-router-dom';
import { useLayoutEffect } from 'react';

// How long to wait for a #hash target that isn't rendered yet, e.g. a job card
// on a page that is still downloading.
const HASH_WAIT_MS = 3000;

const ScrollToTop = () => {
    const { pathname, hash } = useLocation();

    useLayoutEffect(() => {
        if (!hash) {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            return undefined;
        }

        const id = decodeURIComponent(hash.slice(1));
        const scrollToTarget = () => {
            const target = document.getElementById(id);
            if (!target) return false;
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return true;
        };

        if (scrollToTarget()) return undefined;

        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        const observer = new MutationObserver(() => {
            if (scrollToTarget()) observer.disconnect();
        });
        observer.observe(document.body, { childList: true, subtree: true });
        const timeout = setTimeout(() => observer.disconnect(), HASH_WAIT_MS);

        return () => {
            observer.disconnect();
            clearTimeout(timeout);
        };
    }, [pathname, hash]);

    return null;
}

export default ScrollToTop;

export { ScrollToTop };
