import React from 'react';
import { Link, useParams } from 'react-router';
import { services } from '../../data/services';
import { FaStar, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const ServiceDetails = () => {
    const { id } = useParams();
    const service = services.find((s) => s.id === id);
    const related = services.filter((s) => s.id !== id && s.category === service?.category).slice(0, 3);

    if (!service) {
        return (
            <div className="zs-surface mx-auto my-16 max-w-xl p-8 text-center">
                <h1 className="text-2xl font-bold text-secondary dark:text-primary">Service not found</h1>
                <p className="mt-2 text-base-content/70">The service you are looking for is unavailable.</p>
                <Link to="/explore" className="zs-btn-primary mt-6">Back to Explore</Link>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            <section className="grid gap-6 lg:grid-cols-2">
                <img src={service.image} alt={service.title} className="h-72 w-full rounded-3xl object-cover md:h-96" />
                <div className="zs-surface p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-base-content/60">{service.category}</p>
                    <h1 className="mt-2 text-3xl font-bold text-secondary dark:text-primary md:text-4xl">{service.title}</h1>
                    <p className="mt-4 text-base-content/75">{service.description}</p>
                    <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold">
                        <span className="inline-flex items-center gap-1"><FaStar className="text-amber-500" /> {service.rating} rating</span>
                        <span className="inline-flex items-center gap-1"><FaMapMarkerAlt /> {service.location}</span>
                        <span className="inline-flex items-center gap-1"><FaClock /> {service.eta}</span>
                    </div>
                    <p className="mt-6 text-3xl font-extrabold text-secondary dark:text-primary">From ৳{service.priceFrom}</p>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <Link to="/send-parcel" className="zs-btn-primary">Book this service</Link>
                        <Link to="/coverage" className="btn rounded-xl">Check coverage</Link>
                    </div>
                </div>
            </section>

            <section className="zs-surface p-6">
                <h2 className="text-xl font-bold text-secondary dark:text-primary">Overview</h2>
                <p className="mt-3 text-base-content/75">
                    {service.title} is designed for reliable door-to-door movement with transparent pricing and live status updates.
                    Senders get tracking after payment; admins coordinate riders; riders confirm pickup and delivery in the field.
                </p>
            </section>

            <section className="zs-surface p-6">
                <h2 className="text-xl font-bold text-secondary dark:text-primary">Key specifications</h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {service.features.map((feature) => (
                        <li key={feature} className="rounded-xl bg-base-200 px-4 py-3 text-sm font-medium">{feature}</li>
                    ))}
                    <li className="rounded-xl bg-base-200 px-4 py-3 text-sm font-medium">Starting price: ৳{service.priceFrom}</li>
                    <li className="rounded-xl bg-base-200 px-4 py-3 text-sm font-medium">Typical ETA: {service.eta}</li>
                </ul>
            </section>

            {!!related.length && (
                <section>
                    <h2 className="mb-4 text-xl font-bold text-secondary dark:text-primary">Related services</h2>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {related.map((item) => (
                            <Link key={item.id} to={`/services/${item.id}`} className="zs-card hover:border-primary">
                                <img src={item.image} alt={item.title} className="h-32 rounded-xl object-cover" />
                                <h3 className="mt-3 font-bold">{item.title}</h3>
                                <p className="mt-1 text-sm text-base-content/70">From ৳{item.priceFrom}</p>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default ServiceDetails;
