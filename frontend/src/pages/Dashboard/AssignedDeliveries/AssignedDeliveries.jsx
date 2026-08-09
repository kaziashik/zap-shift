import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import StatusBadge from '../../../components/Dashboard/StatusBadge';
import Loading from '../../../components/Loading/Loading';

const nextActionLabel = (status, sameCity) => {
    switch (status) {
        case 'ready-to-pickup':
        case 'driver_assigned':
        case 'rider_arriving':
            return { next: 'in-transit', label: 'Mark picked up (In-Transit)' };
        case 'in-transit':
        case 'parcel_picked_up':
            return sameCity
                ? { next: 'ready-for-delivery', label: 'Out for delivery (Ready-for-Delivery)' }
                : { next: 'reached-warehouse', label: 'Reached warehouse' };
        case 'reached-warehouse':
            return { next: 'shipped', label: 'Ship to destination' };
        case 'shipped':
            return { next: 'ready-for-delivery', label: 'Out for delivery' };
        case 'ready-for-delivery':
            return { next: 'delivered', label: 'Confirm delivery (OTP)' };
        default:
            return null;
    }
};

const AssignedDeliveries = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: parcels = [], refetch, isLoading } = useQuery({
        queryKey: ['rider-active-parcels', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get('/parcels/rider');
            return res.data;
        }
    });

    const updateStatus = async (parcel, nextStatus) => {
        let otp;
        if (nextStatus === 'delivered') {
            const prompt = await Swal.fire({
                title: 'Enter delivery OTP',
                input: 'text',
                inputLabel: 'Ask the receiver for the 6-digit OTP',
                inputPlaceholder: '123456',
                showCancelButton: true,
                confirmButtonColor: '#03373D',
                confirmButtonText: 'Confirm delivery'
            });
            if (!prompt.isConfirmed) return;
            otp = prompt.value?.trim();
            if (!otp) {
                Swal.fire({ icon: 'error', title: 'OTP required' });
                return;
            }
        }

        try {
            const res = await axiosSecure.patch(`/parcels/${parcel._id}/status`, {
                deliveryStatus: nextStatus,
                riderId: parcel.riderId,
                trackingId: parcel.trackingId,
                otp
            });

            if (res.data.modifiedCount || res.data.deliveryStatus) {
                if (res.data.otpIssued) {
                    await Swal.fire({
                        icon: 'info',
                        title: 'OTP generated for receiver',
                        html: `Share this code with the receiver if needed.<br/><b class="text-2xl tracking-widest">${res.data.otpIssued}</b><br/><span class="text-sm">Sender can also see it in My Parcels.</span>`,
                        confirmButtonColor: '#03373D'
                    });
                } else {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: `Status → ${nextStatus}`,
                        showConfirmButton: false,
                        timer: 1400
                    });
                }
                refetch();
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Update failed',
                text: error?.response?.data?.message || error.message
            });
        }
    };

    if (isLoading) return <Loading />;

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-base-content/60">Rider</p>
                <h2 className="mt-1 text-3xl font-bold text-secondary dark:text-primary">Assigned Deliveries</h2>
                <p className="mt-2 text-base-content/70">Active parcels: {parcels.length}</p>
            </div>

            <div className="zs-table-wrap overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Parcel</th>
                            <th>Route</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {parcels.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-base-content/60">No active deliveries assigned.</td>
                            </tr>
                        )}
                        {parcels.map((parcel, i) => {
                            const status = parcel.normalizedStatus || parcel.deliveryStatus;
                            const sameCity = parcel.sameCity ?? parcel.senderDistrict === parcel.receiverDistrict;
                            const action = nextActionLabel(status, sameCity);
                            return (
                                <tr key={parcel._id}>
                                    <td>{i + 1}</td>
                                    <td>
                                        <p className="font-semibold">{parcel.parcelName}</p>
                                        <p className="text-xs text-base-content/60">{parcel.trackingId}</p>
                                    </td>
                                    <td className="text-sm">
                                        {parcel.senderDistrict} → {parcel.receiverDistrict}
                                        <span className="mt-1 block text-xs text-base-content/60">
                                            {sameCity ? 'Same city (80% payout)' : 'Outside city (60% payout)'}
                                        </span>
                                    </td>
                                    <td><StatusBadge status={status} /></td>
                                    <td>
                                        {action ? (
                                            <button
                                                type="button"
                                                className="btn btn-sm rounded-xl border-0 bg-primary font-semibold text-secondary"
                                                onClick={() => updateStatus(parcel, action.next)}
                                            >
                                                {action.label}
                                            </button>
                                        ) : (
                                            <span className="text-sm text-base-content/50">No action</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AssignedDeliveries;
