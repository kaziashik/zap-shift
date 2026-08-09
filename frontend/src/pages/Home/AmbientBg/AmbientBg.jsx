import React from 'react';
import { useReducedMotion } from 'motion/react';

/**
 * Soft fixed ambient motion behind the home page.
 * Keeps content readable — decorative only.
 */
const AmbientBg = () => {
    const reduceMotion = useReducedMotion();

    return (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
            {/* Soft brand mist orbs */}
            <div className={`zs-ambient-orb zs-ambient-orb-a ${reduceMotion ? '' : 'zs-ambient-drift-a'}`} />
            <div className={`zs-ambient-orb zs-ambient-orb-b ${reduceMotion ? '' : 'zs-ambient-drift-b'}`} />
            <div className={`zs-ambient-orb zs-ambient-orb-c ${reduceMotion ? '' : 'zs-ambient-drift-c'}`} />

            {/* Very light moving dots */}
            {!reduceMotion && <div className="zs-ambient-dots" />}

            {/* Slow vertical light wash */}
            {!reduceMotion && <div className="zs-ambient-sheen" />}
        </div>
    );
};

export default AmbientBg;
