import React, { useEffect, useRef, useState } from 'react';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

// Fades and slides content in when it scrolls into view. Built on
// IntersectionObserver + a CSS transition rather than an animation library,
// which kept ~100 KB of JavaScript off every page.
const Reveal = ({ children, delay = 0, y = 24, className = '', as: Tag = 'div', once = true, style, ...rest }) => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    const reduceMotion =
        typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    // `delay` is in seconds, but callers sometimes pass the milliseconds they'd
    // use with a CSS transition. No reveal waits 10s, so a value that large is
    // milliseconds — convert rather than hang the content.
    const delaySeconds = delay > 10 ? delay / 1000 : delay;

    useEffect(() => {
        const node = ref.current;
        if (!node || typeof IntersectionObserver === 'undefined') {
            setVisible(true);
            return undefined;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    if (once) observer.disconnect();
                } else if (!once) {
                    setVisible(false);
                }
            },
            { rootMargin: '-60px' }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, [once]);

    return (
        <Tag
            ref={ref}
            className={className}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible || reduceMotion ? 'none' : `translateY(${y}px)`,
                transition: `opacity 0.6s ${EASE} ${delaySeconds}s, transform 0.6s ${EASE} ${delaySeconds}s`,
                ...style,
            }}
            {...rest}
        >
            {children}
        </Tag>
    );
}

export default Reveal;

export { Reveal };
