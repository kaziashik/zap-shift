import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Link, useParams } from 'react-router';
import useAxios from '../../hooks/useAxios';
import Loading from '../../components/Loading/Loading';

const ParcelTrack = () => {
    const { trackingId } = useParams();
    const axiosInstance = useAxios();

    const { data: trackings = [], isLoading, isError, error } = useQuery({
        queryKey: ['tracking', trackingId],
        enabled: !!trackingId,
        queryFn: async () => {
            const res = await axiosInstance.get(`/trackings/${trackingId}/logs`);
            return res.data;
        }
    });

    if (isLoading) return <Loading />;

    return (
        <div className="space-y-6 pb-12">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-base-content/60">Tracking</p>
                <h2 className="mt-1 text-3xl font-bold text-secondary dark:text-primary md:text-4xl">
                    Track your package
                </h2>
                <p className="mt-2 text-base-content/70">Tracking ID: <span className="font-semibold">{trackingId}</span></p>
            </div>

            {isError && (
                <div className="zs-surface p-6 text-error">
                    Could not load tracking history. {error?.response?.data?.message || error.message}
                </div>
            )}

            {!isError && !trackings.length && (
                <div className="zs-surface p-8 text-center">
                    <h3 className="text-xl font-bold">No tracking updates yet</h3>
                    <p className="mt-2 text-base-content/70">
                        This ID may be invalid, or the parcel has not been paid / processed yet.
                    </p>
                    <Link to="/explore" className="zs-btn-primary mt-6 inline-flex">Explore services</Link>
                </div>
            )}

            {!!trackings.length && (
                <ul className="timeline timeline-vertical">
                    {trackings.map((log, index) => (
                        <li key={log._id || index}>
                            <div className="timeline-start text-sm">
                                {log.createdAt ? new Date(log.createdAt).toLocaleString() : '—'}
                            </div>
                            <div className="timeline-middle">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-primary">
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="timeline-end timeline-box">
                                <span className="font-semibold capitalize">{log.status || 'update'}</span>
                                <p className="text-sm text-base-content/70">{log.details || log.message || 'Status updated'}</p>
                            </div>
                            {index < trackings.length - 1 && <hr />}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ParcelTrack;
