import React from 'react';
import { Link } from 'react-router';
import SectionHeader from '../../components/ui/SectionHeader';
import { faqs } from '../../data/services';

const Help = () => {
    return (
        <div className="space-y-10 pb-12">
            <SectionHeader
                eyebrow="Help Center"
                title="Support, privacy, and terms"
                subtitle="Find quick answers or reach the ZapShift operations team."
            />

            <section className="grid gap-4 md:grid-cols-3">
                {[
                    { title: 'Book a parcel', text: 'Create pickup and delivery details, confirm cost, then pay.', to: '/send-parcel' },
                    { title: 'Track a shipment', text: 'Use your tracking ID timeline for live status history.', to: '/explore' },
                    { title: 'Contact support', text: 'Email or message us for billing and delivery questions.', to: '/contact' }
                ].map((item) => (
                    <Link key={item.title} to={item.to} className="zs-card">
                        <h3 className="text-lg font-bold text-secondary dark:text-primary">{item.title}</h3>
                        <p className="mt-2 text-sm text-base-content/70">{item.text}</p>
                    </Link>
                ))}
            </section>

            <section className="zs-surface p-6">
                <h2 className="text-xl font-bold">Frequently asked questions</h2>
                <div className="mt-4 space-y-3">
                    {faqs.map((item) => (
                        <div key={item.q} className="rounded-xl bg-base-200 p-4">
                            <h3 className="font-semibold">{item.q}</h3>
                            <p className="mt-2 text-sm text-base-content/70">{item.a}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="zs-surface grid gap-4 p-6 md:grid-cols-2">
                <div>
                    <h2 className="text-xl font-bold">Privacy Policy</h2>
                    <p className="mt-3 text-sm text-base-content/75">
                        Learn how ZapShift handles account, booking, and payment data for logistics fulfillment.
                    </p>
                    <Link to="/privacy" className="zs-btn-primary btn-sm mt-4">Read Privacy</Link>
                </div>
                <div>
                    <h2 className="text-xl font-bold">Terms of Service</h2>
                    <p className="mt-3 text-sm text-base-content/75">
                        Booking rules, pricing, OTP delivery confirmation, and rider commission terms.
                    </p>
                    <Link to="/terms" className="zs-btn-primary btn-sm mt-4">Read Terms</Link>
                </div>
            </section>
        </div>
    );
};

export default Help;
