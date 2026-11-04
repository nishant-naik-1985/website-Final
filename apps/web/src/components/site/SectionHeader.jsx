import React from 'react';

export default function SectionHeader({ label, title, description, dark = false }) {
    return (
        <div className="grid gap-6 border-t pt-8 md:grid-cols-12 md:gap-8" style={{ borderColor: dark ? 'hsl(0 0% 100% / 0.12)' : 'hsl(var(--border))' }}>
            <div className="md:col-span-3">
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-electric">
                    {label}
                </p>
            </div>
            <div className="md:col-span-9">
                <h2
                    className={`font-display text-3xl font-bold leading-tight tracking-tight md:text-4xl ${
                        dark ? 'text-white' : 'text-navy'
                    }`}
                >
                    {title}
                </h2>
                {description && (
                    <p className={`mt-4 max-w-2xl leading-relaxed ${dark ? 'text-white/65' : 'text-muted-foreground'}`}>
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}
