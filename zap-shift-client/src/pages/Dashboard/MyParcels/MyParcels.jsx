import { useQuery } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaMagnifyingGlass, FaTrashCan } from 'react-icons/fa6';
import Swal from 'sweetalert2';
import { Link } from 'react-router';
import StatusBadge from '../../../components/Dashboard/StatusBadge';
import Loading from '../../../components/Loading/Loading';
import { motion } from 'motion/react';

const MyParcels = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [search, setSearch] = useState('');

    const { data: parcels = [], refetch, isLoading } = useQuery({
        queryKey: ['my-parcels', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels?email=${user.email}`);
            return res.data;
        }
    });

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return parcels;
        return parcels.filter((p) =>
            String(p.receiverContact || '').toLowerCase().includes(q) ||
            String(p.receiverPhone || '').toLowerCase().includes(q) ||
            String(p.parcelName || '').toLowerCase().includes(q) ||
            String(p.trackingId || '').toLowerCase().includes(q)
        );
    }, [parcels, search]);

    const handleParcelDelete = (id) => {
        Swal.fire({
            title: 'Delete this parcel?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#03373D',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/parcels/${id}`).then((res) => {
                    if (res.data.deletedCount) {
                        refetch();
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'Your parcel request has been deleted.',
                            icon: 'success'
                        });
                    }
                });
            }
        });
    };

    const handlePayment = async (parcel) => {
        const parcelInfo = {
            cost: parcel.cost,
            parcelId: parcel._id,
            senderEmail: parcel.senderEmail,
            parcelName: parcel.parcelName,
            trackingId: parcel.trackingId
        };
        const res = await axiosSecure.post('/payment-checkout-session', parcelInfo);
        window.location.assign(res.data.url);
    };

    if (isLoading) return <Loading />;

    return (
        <div className="space-y-6">
            <div className="animate-fade-up flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--zs-muted)]">Parcels</p>
                    <h2 className="mt-1 text-3xl font-bold text-secondary">Manage My Parcels</h2>
                    <p className="mt-2 text-[var(--zs-muted)]">Total found: <span className="font-semibold text-secondary">{filtered.length}</span></p>
                </div>
                <Link to="/send-parcel" className="btn rounded-xl border-0 bg-primary font-semibold text-secondary">
                    + Add Parcel
                </Link>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="zs-surface flex flex-col gap-3 rounded-2xl p-4 sm:flex-row"
            >
                <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by receiver phone, name, or tracking ID"
                    className="input input-bordered w-full rounded-xl"
                />
                <button type="button" className="btn rounded-xl border-0 bg-secondary text-primary">
                    <FaMagnifyingGlass /> Search
                </button>
            </motion.div>

            <div className="zs-table-wrap animate-fade-up delay-1">
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead className="bg-[var(--zs-mist)] text-secondary">
                            <tr>
                                <th>#</th>
                                <th>Parcel</th>
                                <th>Receiver</th>
                                <th>Cost</th>
                                <th>Payment</th>
                                <th>Tracking</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((parcel, index) => (
                                <tr key={parcel._id} className="hover:bg-primary/10">
                                    <th>{index + 1}</th>
                                    <td className="font-semibold text-secondary">{parcel.parcelName}</td>
                                    <td>
                                        <div className="text-sm">
                                            <p>{parcel.receiverName}</p>
                                            <p className="text-[var(--zs-muted)]">{parcel.receiverContact || parcel.receiverPhone}</p>
                                        </div>
                                    </td>
                                    <td className="font-semibold">৳{parcel.cost}</td>
                                    <td>
                                        {parcel.paymentStatus === 'paid' ? (
                                            <StatusBadge status="paid" />
                                        ) : (
                                            <button
                                                onClick={() => handlePayment(parcel)}
                                                className="btn btn-sm rounded-lg border-0 bg-primary text-secondary"
                                            >
                                                Pay
                                            </button>
                                        )}
                                    </td>
                                    <td>
                                        {parcel.trackingId ? (
                                            <Link className="link link-hover text-sm font-medium text-secondary" to={`/parcel-track/${parcel.trackingId}`}>
                                                {parcel.trackingId}
                                            </Link>
                                        ) : (
                                            <span className="text-sm text-[var(--zs-muted)]">—</span>
                                        )}
                                    </td>
                                    <td>
                                        <StatusBadge status={parcel.paymentStatus === 'paid' ? parcel.deliveryStatus : 'unpaid'} />
                                    </td>
                                    <td>
                                        <div className="flex gap-2">
                                            <Link
                                                to={`/parcel-track/${parcel.trackingId}`}
                                                className="btn btn-sm btn-square rounded-lg hover:bg-primary"
                                                title="Track"
                                            >
                                                <FaMagnifyingGlass />
                                            </Link>
                                            {parcel.paymentStatus !== 'paid' && (
                                                <button
                                                    onClick={() => handleParcelDelete(parcel._id)}
                                                    className="btn btn-sm btn-square rounded-lg hover:bg-red-100"
                                                    title="Delete"
                                                >
                                                    <FaTrashCan />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!filtered.length && (
                        <p className="py-10 text-center text-[var(--zs-muted)]">No parcels match your search.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyParcels;
