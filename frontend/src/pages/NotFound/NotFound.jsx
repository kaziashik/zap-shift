import React from 'react';
import { Link } from 'react-router';

const NotFound = () => {
    return (
        <div className="zs-surface mx-auto my-20 max-w-xl p-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-base-content/60">404</p>
            <h1 className="mt-2 text-3xl font-bold text-secondary dark:text-primary">Page not found</h1>
            <p className="mt-3 text-base-content/70">
                The page you requested does not exist or may have moved.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link to="/" className="zs-btn-primary">Go Home</Link>
                <Link to="/explore" className="zs-btn-secondary">Explore Services</Link>
            </div>
        </div>
    );
};

export default NotFound;
