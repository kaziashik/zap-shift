import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Loading from '../../../components/Loading/Loading';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const axiosSecure = useAxiosSecure();

    const [paymentInfo, setPaymentInfo] = useState({});
    const [error, setError] = useState(() => (sessionId ? '' : 'Missing checkout session.'));
    const [loading, setLoading] = useState(() => Boolean(sessionId));

    useEffect(() => {
        if (!sessionId) return undefined;

        let cancelled = false;
        axiosSecure
            .patch(`/payment-success?session_id=${sessionId}`)
            .then((res) => {
                if (cancelled) return;
                setPaymentInfo({
                    transactionId: res.data.transactionId,
                    trackingId: res.data.trackingId
                });
            })
            .catch((err) => {
                if (cancelled) return;
                setError(err?.response?.data?.message || err.message || 'Could not confirm payment');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [sessionId, axiosSecure]);

    if (loading) return <Loading />;

    return (
        <div className="zs-surface mx-auto max-w-xl space-y-4 p-6 text-center">
            <h2 className="text-3xl font-bold text-secondary dark:text-primary">
                {error ? 'Payment confirmation issue' : 'Payment successful'}
            </h2>
            {error ? (
                <p className="text-error">{error}</p>
            ) : (
                <>
                    <p>Transaction ID: <span className="font-semibold">{paymentInfo.transactionId || '—'}</span></p>
                    <p>Tracking ID: <span className="font-semibold">{paymentInfo.trackingId || '—'}</span></p>
                </>
            )}
            <div className="flex flex-wrap justify-center gap-3 pt-2">
                <Link to="/dashboard/my-parcels" className="zs-btn-primary">My Parcels</Link>
                {paymentInfo.trackingId && (
                    <Link to={`/parcel-track/${paymentInfo.trackingId}`} className="btn rounded-xl">Track parcel</Link>
                )}
            </div>
        </div>
    );
};

export default PaymentSuccess;
