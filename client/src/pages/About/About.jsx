import React from 'react';
import { Link } from 'react-router';
import SectionHeader from '../../components/ui/SectionHeader';
import { stats } from '../../data/services';

const About = () => {
    return (
        <div className="space-y-12 pb-12">
            <SectionHeader
                eyebrow="About ZapShift"
                title="Logistics that feels production-ready"
                subtitle="We streamline booking, tracking, and delivery for homes and businesses across Bangladesh."
            />

            <section className="grid gap-6 lg:grid-cols-2">
                <div className="zs-surface p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-secondary dark:text-primary">Our mission</h2>
                    <p className="mt-4 text-base-content/75">
                        ZapShift exists to make door-to-door parcel movement transparent. Senders book with accurate pricing,
                        admins orchestrate riders and hubs, and riders confirm every physical handoff with clear status updates.
                    </p>
                    <p className="mt-4 text-base-content/75">
                        From same-city drops to inter-district routing, every step is designed for accountability and speed.
                    </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    {stats.map((item) => (
                        <div key={item.label} className="zs-card text-center">
                            <p className="text-3xl font-extrabold text-secondary dark:text-primary">{item.value}</p>
                            <p className="mt-2 text-sm text-base-content/70">{item.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="zs-surface p-6 md:p-8">
                <h2 className="text-2xl font-bold text-secondary dark:text-primary">How roles work together</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                    {[
                        { role: 'User', text: 'Creates parcels, pays charges, tracks status, and manages bookings.' },
                        { role: 'Admin', text: 'Approves riders, assigns deliveries, and monitors system performance.' },
                        { role: 'Rider', text: 'Collects parcels, updates transit status, and completes final delivery.' }
                    ].map((item) => (
                        <article key={item.role} className="rounded-2xl bg-base-200 p-5">
                            <h3 className="text-lg font-bold">{item.role}</h3>
                            <p className="mt-2 text-sm text-base-content/70">{item.text}</p>
                        </article>
                    ))}
                </div>
            </section>

            <div className="text-center">
                <Link to="/contact" className="zs-btn-primary">Contact the team</Link>
            </div>
        </div>
    );
};

export default About;
