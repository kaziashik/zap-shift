import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useMemo, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import StatusBadge from '../../../components/Dashboard/StatusBadge';
import Loading from '../../../components/Loading/Loading';
import usePagination from '../../../hooks/usePagination';
import useRole from '../../../hooks/useRole';

const getRelativeTime = (dateValue) => {
    if (!dateValue) return '—';
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return String(dateValue);
    const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (days <= 0) return 'Today';
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
};

const PaymentHistory = () => {
    const { user } = useAuth();
    const { role } = useRole();
    const axiosSecure = useAxiosSecure();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const { data: payments = [], isLoading } = useQuery({
        queryKey: ['payments', user?.email, role],
        enabled: !!user?.email,
        queryFn: async () => {
            const url = role === 'admin' ? '/payments' : `/payments?email=${user.email}`;
            const res = await axiosSecure.get(url);
            return res.data;
        }
    });

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return payments.filter((payment) => {
            const matchesSearch = !q ||
                String(payment.parcelName || '').toLowerCase().includes(q) ||
                String(payment.transactionId || '').toLowerCase().includes(q) ||
                String(payment.customerEmail || '').toLowerCase().includes(q);
            const status = payment.paymentStatus || 'paid';
            const matchesStatus = statusFilter === 'all' || status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [payments, search, statusFilter]);

    const { page, totalPages, paginated, setPage, reset } = usePagination(filtered, 8);
    useEffect(() => { reset(); }, [search, statusFilter, reset]);

    if (isLoading) return <Loading />;

    return (
        <div className="space-y-6">
            <div className="animate-fade-up">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--zs-muted)]">Billing</p>
                <h2 className="mt-1 text-3xl font-bold text-secondary">Payment History</h2>
                <p className="mt-2 text-[var(--zs-muted)]">
                    Total payments: <span className="font-semibold text-secondary">{filtered.length}</span>
                </p>
            </div>

            <div className="zs-surface grid gap-3 p-4 md:grid-cols-3">
                <input
                    type="search"
                    className="zs-input md:col-span-2"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Filter by parcel, tracking, email"
                />
                <select className="select select-bordered rounded-xl" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="all">All statuses</option>
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                </select>
            </div>

            <div className="zs-table-wrap animate-fade-up delay-1">
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead className="bg-[var(--zs-mist)] text-secondary">
                            <tr>
                                <th>#</th>
                                <th>Parcel</th>
                                <th>Amount</th>
                                <th>Paid</th>
                                <th>Status</th>
                                <th>Transaction Id</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.map((payment, index) => (
                                <tr key={payment._id} className="hover:bg-primary/10">
                                    <th>{(page - 1) * 8 + index + 1}</th>
                                    <td className="font-semibold text-secondary">{payment.parcelName || 'Parcel payment'}</td>
                                    <td className="font-semibold">৳{payment.amount}</td>
                                    <td>
                                        <div className="text-sm">
                                            <p>{getRelativeTime(payment.paidAt || payment.createdAt)}</p>
                                            <p className="text-[var(--zs-muted)]">
                                                {payment.paidAt || payment.createdAt
                                                    ? new Date(payment.paidAt || payment.createdAt).toLocaleDateString()
                                                    : '—'}
                                            </p>
                                        </div>
                                    </td>
                                    <td><StatusBadge status={payment.paymentStatus || 'paid'} /></td>
                                    <td className="text-xs md:text-sm">{payment.transactionId}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!filtered.length && (
                        <p className="py-10 text-center text-[var(--zs-muted)]">No payments found yet.</p>
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

export default PaymentHistory;
