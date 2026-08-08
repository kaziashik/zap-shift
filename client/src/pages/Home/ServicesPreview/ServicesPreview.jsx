import React from 'react';
import { Link } from 'react-router';
import SectionHeader from '../../../components/ui/SectionHeader';
import ServiceCard from '../../../components/ServiceCard/ServiceCard';
import { services } from '../../../data/services';

const ServicesPreview = () => {
    return (
        <section className="py-16">
            <SectionHeader
                eyebrow="Services"
                title="Choose the delivery lane that fits"
                subtitle="Transparent starting prices with clear ETAs for documents, same-city drops, and inter-district shipping."
            />
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {services.slice(0, 3).map((service) => (
                    <ServiceCard key={service.id} service={service} />
                ))}
            </div>
            <div className="mt-8 text-center">
                <Link to="/explore" className="zs-btn-secondary">Browse all services</Link>
            </div>
        </section>
    );
};

export default ServicesPreview;
