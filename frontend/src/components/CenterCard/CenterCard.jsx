import React from 'react';
import { Link } from 'react-router';
import { FaMapMarkerAlt } from 'react-icons/fa';
import StatusBadge from '../Dashboard/StatusBadge';

const CenterCard = ({ center }) => {
    const slug = encodeURIComponent(`${center.region}-${center.district}`.toLowerCase());
    const areas = (center.covered_area || []).slice(0, 3).join(', ');

    return (
        <article className="zs-card">
            <div className="grid h-40 place-items-center rounded-xl bg-gradient-to-br from-secondary to-accent text-white">
                <div className="text-center px-4">
                    <FaMapMarkerAlt className="mx-auto text-3xl text-primary" />
                    <p className="mt-2 text-xl font-bold">{center.city || center.district}</p>
                    <p className="text-sm text-white/80">{center.region} Region</p>
                </div>
            </div>
            <h3 className="mt-4 text-lg font-bold text-secondary dark:text-primary">{center.district} Service Center</h3>
            <p className="mt-2 line-clamp-2 text-sm text-base-content/70">
                Covers {areas || 'local areas'} and nearby pickup/delivery zones.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                <StatusBadge status={center.status || 'active'} />
                <span className="rounded-full bg-base-300 px-2 py-1 font-semibold">
                    {(center.covered_area || []).length} areas
                </span>
            </div>
            <div className="mt-auto pt-5">
                <Link to={`/coverage/${slug}`} className="zs-btn-primary btn-sm w-full">
                    View Details
                </Link>
            </div>
        </article>
    );
};

export default CenterCard;
