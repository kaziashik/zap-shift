import React from 'react';
import { Link } from 'react-router';
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';

const ServiceCard = ({ service }) => {
    return (
        <article className="zs-card">
            <img
                src={service.image}
                alt={service.title}
                className="h-40 w-full rounded-xl object-cover"
                loading="lazy"
            />
            <div className="mt-4 flex items-start justify-between gap-2">
                <h3 className="text-lg font-bold text-secondary dark:text-primary">{service.title}</h3>
                <span className="rounded-full bg-primary/30 px-2 py-0.5 text-xs font-semibold text-secondary">
                    {service.category}
                </span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-base-content/70">{service.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-base-content/70">
                <span className="inline-flex items-center gap-1"><FaStar className="text-amber-500" /> {service.rating}</span>
                <span className="inline-flex items-center gap-1"><FaMapMarkerAlt /> {service.location}</span>
                <span>ETA {service.eta}</span>
            </div>
            <div className="mt-auto flex items-center justify-between pt-5">
                <p className="text-lg font-bold text-secondary dark:text-primary">From ৳{service.priceFrom}</p>
                <Link to={`/services/${service.id}`} className="zs-btn-primary btn-sm">
                    View Details
                </Link>
            </div>
        </article>
    );
};

export default ServiceCard;
