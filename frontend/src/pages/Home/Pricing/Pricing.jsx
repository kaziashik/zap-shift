import React from 'react';
import { Link } from 'react-router';
import { motion, useReducedMotion } from 'motion/react';
import { FaFileAlt, FaBoxOpen, FaBalanceScale } from 'react-icons/fa';
import SectionHeader from '../../../components/ui/SectionHeader';

const highlights = [
    {
        icon: <FaFileAlt />,
        title: 'Documents',
        blurb: 'Flat rate, any weight',
        within: '৳60',
        outside: '৳80'
    },
    {
        icon: <FaBoxOpen />,
        title: 'Non-Document ≤3kg',
        blurb: 'Most everyday parcels',
        within: '৳110',
        outside: '৳150'
    },
    {
        icon: <FaBalanceScale />,
        title: 'Over 3kg',
        blurb: 'Extra per kg after base',
        within: '+৳40/kg',
        outside: '+৳40/kg + ৳40'
    }
];

const rows = [
    { type: 'Document', weight: 'Any', within: '৳60', outside: '৳80' },
    { type: 'Non-Document', weight: 'Up to 3kg', within: '৳110', outside: '৳150' },
    { type: 'Non-Document', weight: '> 3kg', within: '+৳40/kg', outside: '+৳40/kg + ৳40' }
];

const Pricing = () => {
    const reduceMotion = useReducedMotion();

    return (
        <section id="pricing" className="relative overflow-hidden py-16">
            <span
                className="pointer-events-none absolute top-8 right-4 z-0 select-none text-[7rem] font-extrabold leading-none tracking-tight text-secondary/[0.04] md:right-10 md:text-[9rem] dark:text-primary/[0.08]"
                aria-hidden="true"
            >
                ৳
            </span>

            <div className="relative z-10">
                <SectionHeader
                    eyebrow="Pricing"
                    title="Clear rates before you book"
                    subtitle="Dynamic pricing based on parcel type, weight, and city-to-city distance."
                />

                <div className="mb-6 grid gap-4 md:grid-cols-3">
                    {highlights.map((item, index) => (
                        <motion.article
                            key={item.title}
                            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{
                                duration: 0.45,
                                delay: reduceMotion ? 0 : index * 0.1,
                                ease: [0.22, 1, 0.36, 1]
                            }}
                            whileHover={reduceMotion ? undefined : { y: -5 }}
                            className="zs-card group"
                        >
                            <div className="mb-3 grid size-11 place-items-center rounded-xl bg-primary text-lg text-secondary transition-transform duration-300 group-hover:scale-105">
                                {item.icon}
                            </div>
                            <h3 className="text-lg font-bold text-secondary dark:text-primary">{item.title}</h3>
                            <p className="mt-1 text-sm text-base-content/65">{item.blurb}</p>
                            <div className="mt-4 grid grid-cols-2 gap-3">
                                <div className="rounded-xl bg-base-200/80 px-3 py-2.5 dark:bg-base-300/60">
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-base-content/55">Within city</p>
                                    <p className="mt-0.5 text-base font-bold text-secondary dark:text-primary">{item.within}</p>
                                </div>
                                <div className="rounded-xl bg-base-200/80 px-3 py-2.5 dark:bg-base-300/60">
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-base-content/55">Outside</p>
                                    <p className="mt-0.5 text-base font-bold text-secondary dark:text-primary">{item.outside}</p>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>

                <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className="zs-surface overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr className="bg-secondary text-primary">
                                    <th className="font-semibold">Parcel Type</th>
                                    <th className="font-semibold">Weight</th>
                                    <th className="font-semibold">Within City</th>
                                    <th className="font-semibold">Outside City</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row) => (
                                    <tr
                                        key={`${row.type}-${row.weight}`}
                                        className="border-b border-base-300/70 transition-colors duration-200 last:border-0 hover:bg-primary/10"
                                    >
                                        <td className="font-semibold text-secondary dark:text-primary">{row.type}</td>
                                        <td>{row.weight}</td>
                                        <td className="font-semibold">{row.within}</td>
                                        <td className="font-semibold">{row.outside}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="border-t border-base-300/70 px-4 py-3 text-xs text-base-content/60 md:px-6">
                        Final cost is calculated at booking from type, weight, and same-city vs outside-city route.
                    </p>
                </motion.div>

                <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: reduceMotion ? 0 : 0.2 }}
                    className="mt-7 text-center"
                >
                    <Link
                        to="/send-parcel"
                        className="zs-btn-primary inline-flex transition-transform duration-300 hover:-translate-y-0.5"
                    >
                        Calculate & book
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default Pricing;
