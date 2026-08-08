import React from 'react';
import { motion } from 'motion/react';

const StatCard = ({ label, value, icon, delay = 0, accent = 'primary' }) => {
    const accentClass = accent === 'secondary'
        ? 'bg-secondary/10 text-secondary'
        : 'bg-primary/40 text-secondary';

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            className="zs-surface zs-stat rounded-2xl p-5"
        >
            <div className="relative z-10 flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-[var(--zs-muted)]">{label}</p>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-secondary">{value}</p>
                </div>
                <div className={`grid size-11 place-items-center rounded-xl text-xl ${accentClass}`}>
                    {icon}
                </div>
            </div>
        </motion.div>
    );
};

export default StatCard;
