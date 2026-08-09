import React from 'react';
import { Link } from 'react-router';
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';

const ServiceCard = ({ service }) => {
    return (
        <article className="zs-card group overflow-hidden">
            <div className="zs-card-media relative mb-4 overflow-hidden rounded-xl bg-base-200">
                <img
                    src={service.image}
                    alt={service.title}
                    className="h-44 w-full object-cover object-center transition-transform duration-500 ease-out will-change-transform group-hover:scale-110"
                    loading="lazy"
                />
                <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-secondary/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
                    aria-hidden="true"
                />
            </div>

            <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-bold text-secondary transition-colors duration-300 group-hover:text-accent dark:text-primary dark:group-hover:text-primary">
                    {service.title}
                </h3>
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
                <Link
                    to={`/services/${service.id}`}
                    className="zs-btn-primary btn-sm transition-transform duration-300 ease-out group-hover:translate-x-0.5"
                >
                    View Details
                </Link>
            </div>
        </article>
    );
};

export default ServiceCard;
