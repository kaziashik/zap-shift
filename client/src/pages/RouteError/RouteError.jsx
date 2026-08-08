import React from 'react';
import { Link, useNavigate, useRouteError } from 'react-router';

const RouteError = () => {
    const error = useRouteError();
    const navigate = useNavigate();
    const message = error?.statusText || error?.message || 'Something went wrong while loading this page.';

    return (
        <div className="zs-surface mx-auto my-20 max-w-xl p-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-base-content/60">Error</p>
            <h1 className="mt-2 text-3xl font-bold text-secondary dark:text-primary">Page failed to load</h1>
            <p className="mt-3 text-base-content/70">{message}</p>
            <p className="mt-2 text-sm text-base-content/60">
                If this keeps happening, open the app from <span className="font-semibold">http://localhost:5173</span> and refresh.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button type="button" className="zs-btn-primary" onClick={() => navigate(0)}>
                    Retry
                </button>
                <Link to="/" className="zs-btn-secondary">Go Home</Link>
            </div>
        </div>
    );
};

export default RouteError;
