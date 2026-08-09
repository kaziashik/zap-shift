import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useMemo, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaMagnifyingGlass, FaTrashCan, FaPen } from 'react-icons/fa6';
import Swal from 'sweetalert2';
import { Link } from 'react-router';
import StatusBadge from '../../../components/Dashboard/StatusBadge';
import Loading from '../../../components/Loading/Loading';
import { motion } from 'motion/react';
import usePagination from '../../../hooks/usePagination';

const MyParcels = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [search, setSearch] = useState('');
    const [paymentFilter, setPaymentFilter] = useState('all');

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
        return parcels.filter((p) => {
            const matchesSearch = !q ||
                String(p.receiverContact || '').toLowerCase().includes(q) ||
                String(p.receiverPhone || '').toLowerCase().includes(q) ||
                String(p.parcelName || '').toLowerCase().includes(q) ||
                String(p.trackingId || '').toLowerCase().includes(q);
            const matchesPayment = paymentFilter === 'all' ||
                (paymentFilter === 'paid' && p.paymentStatus === 'paid') ||
                (paymentFilter === 'unpaid' && p.paymentStatus !== 'paid');
            return matchesSearch && matchesPayment;
        });
    }, [parcels, search, paymentFilter]);

    const { page, totalPages, paginated, setPage, reset } = usePagination(filtered, 6);
    useEffect(() => { reset(); }, [search, paymentFilter, reset]);

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

    const handleReview = async (parcel) => {
        const { value: formValues } = await Swal.fire({
            title: 'Review this delivery',
            html:
                '<select id="zs-rating" class="swal2-input">' +
                '<option value="5">5 - Excellent</option>' +
                '<option value="4">4 - Good</option>' +
                '<option value="3">3 - Average</option>' +
                '<option value="2">2 - Poor</option>' +
                '<option value="1">1 - Bad</option>' +
                '</select>' +
                '<textarea id="zs-comment" class="swal2-textarea" placeholder="Your feedback"></textarea>',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonColor: '#03373D',
            preConfirm: () => ({
                rating: document.getElementById('zs-rating').value,
                comment: document.getElementById('zs-comment').value
            })
        });

        if (!formValues) return;

        try {
            await axiosSecure.post('/reviews', {
                parcelId: parcel._id,
                rating: formValues.rating,
                comment: formValues.comment,
                displayName: user?.displayName || user?.email
            });
            Swal.fire({ icon: 'success', title: 'Thanks for your review!', timer: 1600, showConfirmButton: false });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Could not submit review',
                text: error?.response?.data?.message || error.message
            });
        }
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
                className="zs-surface grid gap-3 rounded-2xl p-4 md:grid-cols-3"
            >
                <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by receiver phone, name, or tracking ID"
                    className="input input-bordered w-full rounded-xl md:col-span-2"
                />
                <select
                    className="select select-bordered rounded-xl"
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value)}
                >
                    <option value="all">All payments</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                </select>
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
                            {paginated.map((parcel, index) => (
                                <tr key={parcel._id} className="hover:bg-primary/10">
                                    <th>{(page - 1) * 6 + index + 1}</th>
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
                                        <div className="flex flex-wrap items-center gap-2">
                                            {parcel.deliveryStatus === 'ready-for-delivery' && parcel.deliveryOtp && (
                                                <span className="rounded-lg bg-primary/30 px-2 py-1 text-xs font-bold tracking-widest text-secondary" title="Share with rider/receiver">
                                                    OTP {parcel.deliveryOtp}
                                                </span>
                                            )}
                                            {(parcel.deliveryStatus === 'delivered' || parcel.deliveryStatus === 'parcel_delivered') && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleReview(parcel)}
                                                    className="btn btn-xs rounded-lg border-0 bg-secondary text-primary"
                                                >
                                                    Review
                                                </button>
                                            )}
                                            {parcel.paymentStatus !== 'paid' && (
                                                <Link
                                                    to={`/edit-parcel/${parcel._id}`}
                                                    className="btn btn-sm btn-square rounded-lg hover:bg-primary"
                                                    title="Edit"
                                                >
                                                    <FaPen />
                                                </Link>
                                            )}
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

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <button type="button" className="btn btn-sm rounded-xl" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
                    <span className="text-sm font-semibold">Page {page} of {totalPages}</span>
                    <button type="button" className="btn btn-sm rounded-xl" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
                </div>
            )}
        </div>
    );
};

export default MyParcels;
