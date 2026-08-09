import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import SectionHeader from '../../../components/ui/SectionHeader';
import { featureHighlights } from '../../../data/services';

const Features = () => {
    const reduceMotion = useReducedMotion();

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
                            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.25 }}
                            transition={{
                                duration: 0.45,
                                delay: reduceMotion ? 0 : index * 0.07,
                                ease: [0.22, 1, 0.36, 1]
                            }}
                            whileHover={reduceMotion ? undefined : { y: -5 }}
                            className="zs-card group"
                        >
                            <motion.div
                                className="grid size-12 place-items-center rounded-xl bg-primary text-secondary shadow-sm"
                                whileHover={reduceMotion ? undefined : { scale: 1.08, rotate: -3 }}
                                transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                            >
                                <Icon className="text-xl transition-transform duration-300 group-hover:scale-110" />
                            </motion.div>
                            <h3 className="mt-4 text-xl font-bold text-secondary transition-colors duration-300 group-hover:text-accent dark:text-primary dark:group-hover:text-primary">
                                {item.title}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-base-content/70">{item.text}</p>
                            <div
                                className="mt-4 h-1 w-8 origin-left rounded-full bg-primary/60 transition-all duration-400 ease-out group-hover:w-14 group-hover:bg-primary"
                                aria-hidden="true"
                            />
                        </motion.article>
                    );
                })}
            </div>
        </section>
    );
};

export default Features;
