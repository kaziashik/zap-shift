import React from 'react';
import { motion } from 'motion/react';
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
    return (
        <section className="py-16">
            <SectionHeader
                eyebrow="Workflow"
                title="How ZapShift Works"
                subtitle="A clear door-to-door flow for users, riders, and admins — built for speed and transparency."
            />

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {steps.map((step, index) => (
                    <motion.article
                        key={step.title}
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.35 }}
                        transition={{ duration: 0.4, delay: index * 0.08 }}
                        className="zs-card"
                    >
                        <div className="mb-4 grid size-12 place-items-center rounded-xl bg-primary text-xl text-secondary">
                            {step.icon}
                        </div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-base-content/60">
                            Step 0{index + 1}
                        </p>
                        <h3 className="mt-1 text-xl font-bold text-secondary dark:text-primary">{step.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-base-content/70">{step.text}</p>
                    </motion.article>
                ))}
            </div>
        </section>
    );
};

export default HowItWorks;
