import React from 'react';
import { Link } from 'react-router';
import SectionHeader from '../../components/ui/SectionHeader';

const Privacy = () => (
    <div className="space-y-6 pb-12">
        <SectionHeader
            eyebrow="Legal"
            title="Privacy Policy"
            subtitle="How ZapShift collects and uses operational data for parcel logistics."
        />
        <section className="zs-surface space-y-4 p-6 text-sm leading-relaxed text-base-content/80">
            <p>
                ZapShift collects account details (name, email, photo), booking details (sender/receiver contacts and addresses),
                payment metadata from Stripe, and delivery status events required to fulfill courier operations across Bangladesh.
            </p>
            <p>
                Parcel data is shared only with assigned riders and platform admins for pickup, warehouse handoff, and delivery.
                We do not sell personal data. Tracking timelines are available to the parcel owner via tracking ID.
            </p>
            <p>
                You may request account corrections from Settings or contact <a className="link font-semibold" href="mailto:support@zapshift.com">support@zapshift.com</a>.
            </p>
            <Link to="/help" className="zs-btn-primary btn-sm">Back to Help</Link>
        </section>
    </div>
);

export default Privacy;
