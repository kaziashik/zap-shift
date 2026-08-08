import React from 'react';
import { motion } from 'motion/react';

const SectionHeader = ({ eyebrow, title, subtitle, align = 'center' }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.4 }}
            className={`mb-10 max-w-3xl ${align === 'center' ? 'mx-auto text-center' : 'text-left'}`}
        >
            {eyebrow && (
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-base-content/60">
                    {eyebrow}
                </p>
            )}
            <h2 className="mt-2 text-3xl font-bold text-secondary dark:text-primary md:text-4xl">{title}</h2>
            {subtitle && <p className="mt-3 text-base-content/70">{subtitle}</p>}
        </motion.div>
    );
};

export default SectionHeader;
