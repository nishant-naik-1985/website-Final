import React from 'react';

export default function AiImageBadge({ label = 'AI generated' }) {
    return (
        <span
            className="absolute right-2 top-2 z-10 rounded-[4px] border border-orange-400 bg-[#0a1428]/[0.85] px-2.5 py-1 text-[11px] font-medium tracking-[0.3px] text-white"
            aria-label={`${label} image`}
        >
            {label}
        </span>
    );
}
