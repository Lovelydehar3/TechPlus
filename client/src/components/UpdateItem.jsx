import { useState } from 'react';

export default function UpdateItem({ title, summary, category, source, date, link, colorScheme }) {
    const [expanded, setExpanded] = useState(false);

    const formattedDate = date
        ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : '';

    return (
        <article
            className="group border-b cursor-pointer"
            style={{ borderColor: 'rgba(255,255,255,0.05)' }}
            onClick={() => link && link !== '#' ? window.open(link, '_blank') : setExpanded(e => !e)}
        >
            <div
                className="relative py-7 transition-all duration-300 rounded-xl -mx-4 px-4"
                style={{
                    '--hover-bg': 'rgba(255,255,255,0.02)',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
                {/* Top row */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                    {/* Category pill */}
                    <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest"
                        style={{
                            background: colorScheme?.bg || 'rgba(124,58,237,0.1)',
                            border: `1px solid ${colorScheme?.border || 'rgba(124,58,237,0.3)'}`,
                            color: colorScheme?.text || '#a78bfa',
                        }}
                    >
                        {category}
                    </span>
                    {source && (
                        <span className="text-[11px] font-semibold" style={{ color: 'rgba(255,255,255,0.25)' }}>
                            {source}
                        </span>
                    )}
                    {formattedDate && (
                        <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
                            · {formattedDate}
                        </span>
                    )}
                </div>

                {/* Title */}
                <h2
                    className="text-lg sm:text-xl font-semibold leading-snug transition-colors duration-200 mb-3"
                    style={{ color: 'rgba(255,255,255,0.88)' }}
                    onMouseEnter={e => e.target.style.color = '#a78bfa'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.88)'}
                >
                    {title}
                </h2>

                {/* Summary */}
                {summary && (
                    <p
                        className={`text-sm leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}
                        style={{ color: 'rgba(255,255,255,0.45)' }}
                    >
                        {summary}
                    </p>
                )}

                {/* Read more indicator */}
                <div className="mt-3 flex items-center gap-2">
                    <span
                        className="text-xs font-bold uppercase tracking-wider transition-colors duration-200"
                        style={{ color: 'rgba(124,58,237,0.6)' }}
                        onMouseEnter={e => e.target.style.color = '#a78bfa'}
                        onMouseLeave={e => e.target.style.color = 'rgba(124,58,237,0.6)'}
                    >
                        {link && link !== '#' ? 'Read Full Article →' : (expanded ? 'Show Less ↑' : 'Expand ↓')}
                    </span>
                </div>

                {/* Hover glow bleed */}
                <div
                    className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ boxShadow: '0 0 40px rgba(124,58,237,0.07)' }}
                />
            </div>
        </article>
    );
}
