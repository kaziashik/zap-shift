import React from 'react';
import { motion } from 'motion/react';
import { stats } from '../../../data/services';

const Stats = () => {
    return (
        <section className="py-10">
            <div className="grid gap-4 rounded-3xl bg-secondary px-6 py-10 text-white sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((item, index) => (
                    <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.06 }}
                        className="text-center"
                    >
                        <p className="text-4xl font-extrabold text-primary">{item.value}</p>
                        <p className="mt-2 text-sm font-medium text-white/75">{item.label}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default Stats;
