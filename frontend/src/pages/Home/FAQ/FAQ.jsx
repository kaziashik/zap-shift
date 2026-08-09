import React, { useState } from 'react';
import { Link } from 'react-router';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { FaChevronDown, FaHeadset, FaMapMarkedAlt, FaMoneyBillWave, FaTruck } from 'react-icons/fa';
import SectionHeader from '../../../components/ui/SectionHeader';
import { faqs } from '../../../data/services';

const quickLinks = [
    { icon: FaMoneyBillWave, label: 'Pricing', to: '/#pricing' },
    { icon: FaMapMarkedAlt, label: 'Coverage', to: '/coverage' },
    { icon: FaTruck, label: 'Send parcel', to: '/send-parcel' },
    { icon: FaHeadset, label: 'Contact', to: '/contact' }
];

const FAQ = () => {
    const reduceMotion = useReducedMotion();
    const [openIndex, setOpenIndex] = useState(0);

    const toggle = (index) => {
        setOpenIndex((current) => (current === index ? -1 : index));
    };

    return (
        <section className="py-16" id="faq">
            <SectionHeader
                eyebrow="FAQ"
                title="Answers before you ship"
                subtitle="Common questions about pricing, tracking, riders, and coverage."
            />

            <div className="grid items-start gap-6 lg:grid-cols-[0.9fr_1.4fr] lg:gap-8">
                {/* Side panel */}
                <motion.aside
                    initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="zs-surface relative overflow-hidden p-6 md:p-7"
                >
                    <span
                        className="pointer-events-none absolute -right-2 top-2 select-none text-7xl font-extrabold text-secondary/[0.05] dark:text-primary/[0.1]"
                        aria-hidden="true"
                    >
                        ?
                    </span>
                    <div className="relative z-10">
                        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-base-content/55">
                            Need a fast answer?
                        </p>
                        <h3 className="mt-2 text-2xl font-bold text-secondary dark:text-primary">
                            Jump to the right place
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-base-content/70">
                            Still stuck? Our support team can help with booking, payments, and delivery status.
                        </p>

                        <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                            {quickLinks.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.label}
                                        to={item.to}
                                        className="flex items-center gap-3 rounded-xl border border-base-300/80 bg-base-100 px-3 py-2.5 transition hover:border-primary/50 hover:bg-primary/10"
                                    >
                                        <span className="grid size-9 place-items-center rounded-lg bg-primary text-secondary">
                                            <Icon className="text-sm" />
                                        </span>
                                        <span className="text-sm font-semibold text-secondary dark:text-primary">
                                            {item.label}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </motion.aside>

                {/* Accordion list */}
                <div className="space-y-3">
                    {faqs.map((item, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <motion.div
                                key={item.q}
                                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{
                                    duration: 0.4,
                                    delay: reduceMotion ? 0 : index * 0.06,
                                    ease: [0.22, 1, 0.36, 1]
                                }}
                                className={`zs-surface overflow-hidden transition-shadow duration-300 ${
                                    isOpen ? 'ring-1 ring-primary/40 shadow-md' : ''
                                }`}
                            >
                                <button
                                    type="button"
                                    onClick={() => toggle(index)}
                                    aria-expanded={isOpen}
                                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left md:px-6"
                                >
                                    <span className="flex items-start gap-3">
                                        <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-primary/25 text-xs font-bold text-secondary">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <span className="text-base font-semibold text-secondary dark:text-primary md:text-lg">
                                            {item.q}
                                        </span>
                                    </span>
                                    <motion.span
                                        animate={{ rotate: isOpen ? 180 : 0 }}
                                        transition={{ duration: 0.25 }}
                                        className="grid size-9 shrink-0 place-items-center rounded-full bg-base-200 text-secondary dark:bg-base-300 dark:text-primary"
                                    >
                                        <FaChevronDown className="text-sm" />
                                    </motion.span>
                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            key="content"
                                            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                                            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                                            className="overflow-hidden"
                                        >
                                            <div className="border-t border-base-300/70 px-5 pb-5 pt-3 md:px-6">
                                                <p className="pl-10 text-sm leading-relaxed text-base-content/75 md:text-[0.95rem]">
                                                    {item.a}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
