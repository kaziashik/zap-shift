import React from 'react';
import { motion } from 'motion/react';
import SectionHeader from '../../../components/ui/SectionHeader';
import { featureHighlights } from '../../../data/services';

const Features = () => {
    return (
        <section className="py-16">
            <SectionHeader
                eyebrow="Features"
                title="Everything a modern courier stack needs"
                subtitle="Booking, payments, routing, and role-based operations in one production workflow."
            />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {featureHighlights.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <motion.article
                            key={item.title}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="zs-card"
                        >
                            <div className="grid size-12 place-items-center rounded-xl bg-primary text-secondary">
                                <Icon className="text-xl" />
                            </div>
                            <h3 className="mt-4 text-xl font-bold text-secondary dark:text-primary">{item.title}</h3>
                            <p className="mt-2 text-sm text-base-content/70">{item.text}</p>
                        </motion.article>
                    );
                })}
            </div>
        </section>
    );
};

export default Features;
