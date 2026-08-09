import React from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Loading from '../../../components/Loading/Loading';
import Swal from 'sweetalert2';

const CompletedDeliveries = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: parcels = [], isLoading } = useQuery({
        queryKey: ['parcels', user?.email, 'delivered'],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get('/parcels/rider?deliveryStatus=delivered');
            return res.data;
        }
    });

    const calculatePayout = (parcel) => {
        if (typeof parcel.riderPayout === 'number') return parcel.riderPayout;
        const sameCity = parcel.senderDistrict === parcel.receiverDistrict;
        return Math.round((Number(parcel.cost) || 0) * (sameCity ? 0.8 : 0.6));
    };

    const handleCashOut = (parcel) => {
        Swal.fire({
            icon: 'info',
            title: 'Cash-out requested',
            text: `Payout ৳${calculatePayout(parcel)} for ${parcel.parcelName} will be processed by ZapShift finance (demo).`,
            confirmButtonColor: '#03373D'
        });
    };

    if (isLoading) return <Loading />;

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-base-content/60">Rider</p>
                <h2 className="mt-1 text-3xl font-bold text-secondary dark:text-primary">Completed Deliveries</h2>
                <p className="mt-2 text-base-content/70">
                    Commission: <strong>80%</strong> same city · <strong>60%</strong> outside city
                </p>
            </div>

            <div className="zs-table-wrap overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Route</th>
                            <th>Cost</th>
                            <th>Payout</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {parcels.length === 0 && (
                            <tr>
                                <td colSpan={6} className="py-8 text-center text-base-content/60">No completed deliveries yet.</td>
                            </tr>
                        )}
                        {parcels.map((parcel, index) => (
                            <tr key={parcel._id}>
                                <th>{index + 1}</th>
                                <td>
                                    <p className="font-semibold">{parcel.parcelName}</p>
                                    <p className="text-xs text-base-content/60">{parcel.trackingId}</p>
                                </td>
                                <td className="text-sm">{parcel.senderDistrict} → {parcel.receiverDistrict}</td>
                                <td>৳{parcel.cost}</td>
                                <td className="font-semibold">৳{calculatePayout(parcel)}</td>
                                <td>
                                    <button
                                        type="button"
                                        className="btn btn-sm rounded-xl border-0 bg-primary font-semibold text-secondary"
                                        onClick={() => handleCashOut(parcel)}
                                    >
                                        Cash out
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CompletedDeliveries;
