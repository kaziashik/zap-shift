import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { FaBoxOpen, FaTruck, FaMapMarkerAlt } from 'react-icons/fa';
import { MdPayments } from 'react-icons/md';
import SectionHeader from '../../../components/ui/SectionHeader';

const steps = [
    {
        icon: <FaBoxOpen />,
        title: 'Book a Parcel',
        text: 'Add pickup & delivery details. Pricing updates instantly by type, weight, and city.'
    },
    {
        icon: <MdPayments />,
        title: 'Pay Securely',
        text: 'Complete payment and receive a unique tracking ID for every shipment.'
    },
    {
        icon: <FaTruck />,
        title: 'Rider Pickup',
        text: 'Approved riders collect from your door and move parcels through the network.'
    },
    {
        icon: <FaMapMarkerAlt />,
        title: 'Track & Deliver',
        text: 'Follow live status updates until doorstep delivery across Bangladesh.'
    }
];

const HowItWorks = () => {
    const reduceMotion = useReducedMotion();

    return (
        <section className="py-16">
            <SectionHeader
                eyebrow="Workflow"
                title="How ZapShift Works"
                subtitle="A clear door-to-door flow for users, riders, and admins — built for speed and transparency."
            />

            <div className="relative">
                {/* Flow line (desktop) */}
                <motion.div
                    className="pointer-events-none absolute top-[3.25rem] right-[8%] left-[8%] hidden h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent xl:block"
                    initial={reduceMotion ? false : { scaleX: 0, opacity: 0 }}
                    whileInView={{ scaleX: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                    style={{ transformOrigin: 'left center' }}
                    aria-hidden="true"
                />

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {steps.map((step, index) => (
                        <motion.article
                            key={step.title}
                            initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.96 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{
                                duration: 0.55,
                                delay: reduceMotion ? 0 : index * 0.12,
                                ease: [0.22, 1, 0.36, 1]
                            }}
                            whileHover={reduceMotion ? undefined : { y: -6 }}
                            className="zs-card group relative overflow-hidden"
                        >
                            {/* Fully inside watermark — no clipping */}
                            <span
                                className="pointer-events-none absolute top-3 right-4 z-0 font-extrabold leading-none tracking-tight text-[2.75rem] text-secondary/[0.06] select-none dark:text-primary/[0.12]"
                                aria-hidden="true"
                            >
                                0{index + 1}
                            </span>

                            <div className="relative z-10 flex items-start justify-between gap-3">
                                <motion.div
                                    className="grid size-12 place-items-center rounded-xl bg-primary text-xl text-secondary shadow-sm"
                                    whileHover={reduceMotion ? undefined : { scale: 1.08, rotate: -4 }}
                                    transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                                >
                                    <motion.span
                                        animate={reduceMotion ? undefined : { y: [0, -2, 0] }}
                                        transition={{
                                            duration: 2.4,
                                            repeat: Infinity,
                                            ease: 'easeInOut',
                                            delay: index * 0.35
                                        }}
                                        className="inline-flex"
                                    >
                                        {step.icon}
                                    </motion.span>
                                </motion.div>

                                <span className="rounded-full bg-base-200 px-2.5 py-1 text-[11px] font-bold tracking-[0.12em] text-secondary/70 dark:bg-base-300 dark:text-primary/80">
                                    STEP 0{index + 1}
                                </span>
                            </div>

                            <h3 className="relative z-10 mt-4 text-xl font-bold text-secondary transition-colors duration-300 group-hover:text-accent dark:text-primary dark:group-hover:text-primary">
                                {step.title}
                            </h3>
                            <p className="relative z-10 mt-2 text-sm leading-relaxed text-base-content/70">{step.text}</p>

                            <div
                                className="relative z-10 mt-4 h-1 w-10 origin-left rounded-full bg-primary/70 transition-all duration-500 ease-out group-hover:w-16 group-hover:bg-primary"
                                aria-hidden="true"
                            />
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
