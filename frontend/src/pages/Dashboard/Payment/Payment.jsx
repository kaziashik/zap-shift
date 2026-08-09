import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Link, useParams } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Loading from '../../../components/Loading/Loading';
import Swal from 'sweetalert2';

const Payment = () => {
    const { parcelId } = useParams();
    const axiosSecure = useAxiosSecure();
    const [paying, setPaying] = useState(false);

    const { isLoading, data: parcel, isError } = useQuery({
        queryKey: ['parcels', parcelId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels/${parcelId}`);
            return res.data;
        }
    });

    const handlePayment = async () => {
        if (!parcel) return;
        setPaying(true);
        try {
            const paymentInfo = {
                cost: parcel.cost,
                parcelId: parcel._id,
                senderEmail: parcel.senderEmail,
                parcelName: parcel.parcelName,
                trackingId: parcel.trackingId
            };
            const res = await axiosSecure.post('/payment-checkout-session', paymentInfo);
            if (res.data?.url) {
                window.location.href = res.data.url;
                return;
            }
            throw new Error('Checkout URL missing');
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Payment failed',
                text: error?.response?.data?.message || error.message || 'Could not start checkout'
            });
            setPaying(false);
        }
    };

    if (isLoading) return <Loading />;

    if (isError || !parcel) {
        return (
            <div className="zs-surface mx-auto max-w-lg p-8 text-center">
                <h2 className="text-2xl font-bold">Parcel not found</h2>
                <Link to="/dashboard/my-parcels" className="zs-btn-primary mt-4">Back to My Parcels</Link>
            </div>
        );
    }

    return (
        <div className="zs-surface mx-auto max-w-lg space-y-4 p-6 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-base-content/60">Checkout</p>
            <h2 className="text-3xl font-bold text-secondary dark:text-primary">Pay for your parcel</h2>
            <p className="text-base-content/70">
                Complete Stripe checkout to unlock rider assignment and tracking for{' '}
                <span className="font-semibold text-secondary dark:text-primary">{parcel.parcelName}</span>.
            </p>
            <div className="rounded-2xl bg-base-200/60 p-4 text-sm">
                <p><span className="font-medium">Tracking ID:</span> {parcel.trackingId}</p>
                <p className="mt-1"><span className="font-medium">Amount:</span> ৳{Math.round(parcel.cost)}</p>
            </div>
            <button type="button" onClick={handlePayment} disabled={paying} className="zs-btn-primary w-full">
                {paying ? <span className="loading loading-spinner loading-sm" /> : `Pay ৳${Math.round(parcel.cost)}`}
            </button>
            <Link to="/dashboard/my-parcels" className="btn btn-ghost w-full rounded-xl">Cancel</Link>
        </div>
    );
};

export default Payment;
