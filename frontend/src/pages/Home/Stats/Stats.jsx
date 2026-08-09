import React from 'react';
import { motion } from 'motion/react';
import { stats } from '../../../data/services';

const Stats = () => {
    return (
        <section className="w-full bg-secondary py-10 text-white">
            <div className="grid w-full gap-4 px-4 sm:grid-cols-2 md:px-6 lg:grid-cols-4 lg:px-8 xl:px-10">
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
