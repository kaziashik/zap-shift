import React from 'react';
import { Link } from 'react-router';
import SectionHeader from '../../components/ui/SectionHeader';

const Terms = () => (
    <div className="space-y-6 pb-12">
        <SectionHeader
            eyebrow="Legal"
            title="Terms of Service"
            subtitle="Rules for booking, payment, and delivery on ZapShift."
        />
        <section className="zs-surface space-y-4 p-6 text-sm leading-relaxed text-base-content/80">
            <p>
                By creating an account or booking a parcel you agree to provide accurate shipment details, pack lawful contents,
                and complete payment before rider assignment. Pricing follows the published document / non-document rate table.
            </p>
            <p>
                Delivery statuses progress from unpaid → paid → ready-to-pickup → in-transit → ready-for-delivery (or warehouse path)
                → delivered with OTP confirmation. ZapShift may refuse prohibited items and may cancel unpaid bookings.
            </p>
            <p>
                Rider commissions are 80% for same-city deliveries and 60% for outside-city deliveries, calculated from paid parcel cost.
            </p>
            <Link to="/help" className="zs-btn-primary btn-sm">Back to Help</Link>
        </section>
    </div>
);

export default Terms;
