import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import useAxios from '../../hooks/useAxios';
import Loading from '../../components/Loading/Loading';

const STATUS_LABELS = {
    parcel_created: 'Parcel created',
    unpaid: 'Awaiting payment',
    paid: 'Payment received',
    parcel_paid: 'Payment received',
    'ready-to-pickup': 'Ready for pickup',
    'pending-pickup': 'Ready for pickup',
    driver_assigned: 'Rider assigned',
    rider_arriving: 'Rider arriving',
    'in-transit': 'In transit',
    parcel_picked_up: 'Picked up',
    'reached-warehouse': 'Reached warehouse',
    shipped: 'Shipped to destination',
    'ready-for-delivery': 'Out for delivery',
    delivered: 'Delivered',
    parcel_delivered: 'Delivered'
};

const formatStatus = (status = '') =>
    STATUS_LABELS[status] ||
    String(status)
        .replace(/[_-]+/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

const ParcelTrack = () => {
    const { trackingId: routeId } = useParams();
    const trackingId = decodeURIComponent(routeId || '').trim();
    const axiosInstance = useAxios();
    const navigate = useNavigate();
    const [queryId, setQueryId] = useState(trackingId);
    const looksLikePaymentId = /^pi_/i.test(trackingId);

    useEffect(() => {
        setQueryId(trackingId);
    }, [trackingId]);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['tracking', trackingId],
        enabled: !!trackingId,
        queryFn: async () => {
            const res = await axiosInstance.get(`/trackings/${encodeURIComponent(trackingId)}/logs`);
            const body = res.data;
            // Support old array responses and new { logs, trackingId } shape
            if (Array.isArray(body)) {
                return { trackingId, logs: body, resolvedFrom: 'tracking', query: trackingId };
            }
            return {
                query: body.query || trackingId,
                trackingId: body.trackingId || trackingId,
                resolvedFrom: body.resolvedFrom || 'tracking',
                logs: Array.isArray(body.logs) ? body.logs : []
            };
        }
    });

    const trackings = data?.logs || [];
    const resolvedId = data?.trackingId || trackingId;
    const latest = useMemo(() => (trackings.length ? trackings[trackings.length - 1] : null), [trackings]);

    // If Stripe payment ID resolved to a PRCL id, jump to the canonical URL
    useEffect(() => {
        if (!data?.trackingId) return;
        if (data.resolvedFrom === 'payment' && data.trackingId !== trackingId) {
            navigate(`/parcel-track/${encodeURIComponent(data.trackingId)}`, { replace: true });
        }
    }, [data, trackingId, navigate]);

    const handleSearch = (e) => {
        e.preventDefault();
        const next = queryId.trim();
        if (!next) return;
        navigate(`/parcel-track/${encodeURIComponent(next)}`);
    };

    if (isLoading) return <Loading />;

    return (
        <div className="mx-auto max-w-3xl space-y-6 pb-14">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-base-content/60">Tracking</p>
                <h2 className="mt-1 text-3xl font-bold text-secondary dark:text-primary md:text-4xl">
                    Track your package
                </h2>
                <p className="mt-2 text-base-content/70">
                    Use your ZapShift tracking ID from My Parcels (starts with <span className="font-semibold">PRCL-</span>).
                </p>
            </div>

            <form onSubmit={handleSearch} className="zs-surface flex flex-col gap-3 p-4 sm:flex-row sm:items-end">
                <div className="w-full">
                    <label htmlFor="track-page-id" className="zs-label">Tracking ID</label>
                    <input
                        id="track-page-id"
                        className="zs-input font-mono"
                        value={queryId}
                        onChange={(e) => setQueryId(e.target.value)}
                        placeholder="PRCL-20260722-ABAECA"
                    />
                </div>
                <button type="submit" className="zs-btn-primary shrink-0">Track</button>
            </form>

            {trackingId && (
                <div className="zs-surface flex flex-wrap items-center justify-between gap-3 p-5">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-base-content/55">Tracking ID</p>
                        <p className="mt-1 font-mono text-lg font-bold text-secondary dark:text-primary">{resolvedId}</p>
                        {looksLikePaymentId && (
                            <p className="mt-1 text-xs text-base-content/60">
                                Detected a Stripe payment ID — we try to map it to your parcel automatically.
                            </p>
                        )}
                    </div>
                    {latest && (
                        <span className="rounded-full bg-primary/25 px-3 py-1.5 text-sm font-semibold text-secondary">
                            {formatStatus(latest.status)}
                        </span>
                    )}
                </div>
            )}

            {isError && (
                <div className="zs-surface p-6 text-error">
                    Could not load tracking history. {error?.response?.data?.message || error.message}
                </div>
            )}

            {!isError && trackingId && !trackings.length && (
                <div className="zs-surface p-8 text-center">
                    <h3 className="text-xl font-bold">No tracking updates found</h3>
                    <p className="mt-2 text-base-content/70">
                        {looksLikePaymentId ? (
                            <>
                                <span className="font-semibold">{trackingId}</span> looks like a Stripe payment reference, not a ZapShift tracking ID.
                                Open <span className="font-semibold">Dashboard → My Parcels</span> and copy the ID that starts with <span className="font-semibold">PRCL-</span>.
                            </>
                        ) : (
                            <>
                                This ID may be invalid, or the parcel has not been processed yet.
                                Copy the tracking ID from <span className="font-semibold">My Parcels</span> (example: <span className="font-mono">PRCL-20260722-ABAECA</span>).
                            </>
                        )}
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <Link to="/dashboard/my-parcels" className="zs-btn-primary">Open My Parcels</Link>
                        <Link to="/" className="btn rounded-xl border-base-300 bg-base-100">Back home</Link>
                    </div>
                </div>
            )}

            {!!trackings.length && (
                <div className="zs-surface p-5 md:p-7">
                    <h3 className="mb-5 text-lg font-bold text-secondary dark:text-primary">Delivery timeline</h3>
                    <ul className="timeline timeline-vertical timeline-snap-icon">
                        {trackings.map((log, index) => (
                            <li key={log._id || `${log.status}-${index}`}>
                                {index !== 0 && <hr className="bg-primary/40" />}
                                <div className="timeline-start text-sm text-base-content/65 md:w-40 md:text-end">
                                    {log.createdAt ? new Date(log.createdAt).toLocaleString() : '—'}
                                </div>
                                <div className="timeline-middle">
                                    <span className="grid size-7 place-items-center rounded-full bg-primary text-secondary">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </span>
                                </div>
                                <div className="timeline-end timeline-box border-base-300 bg-base-100 shadow-sm">
                                    <p className="font-semibold text-secondary dark:text-primary">
                                        {formatStatus(log.status)}
                                    </p>
                                    <p className="mt-0.5 text-sm text-base-content/70">
                                        {log.details || log.message || formatStatus(log.status)}
                                    </p>
                                </div>
                                {index < trackings.length - 1 && <hr className="bg-primary/40" />}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ParcelTrack;
