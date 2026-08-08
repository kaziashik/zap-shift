import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import StatusBadge from '../../../components/Dashboard/StatusBadge';
import Loading from '../../../components/Loading/Loading';

const getRelativeTime = (dateValue) => {
    if (!dateValue) return '—';
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return String(dateValue);

    const diffMs = Date.now() - date.getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (days <= 0) return 'Today';
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
};

const PaymentHistory = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: payments = [], isLoading } = useQuery({
        queryKey: ['payments', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/payments?email=${user.email}`);
            return res.data;
        }
    });

    if (isLoading) return <Loading />;

    return (
        <div className="space-y-6">
            <div className="animate-fade-up">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--zs-muted)]">Billing</p>
                <h2 className="mt-1 text-3xl font-bold text-secondary">Payment History</h2>
                <p className="mt-2 text-[var(--zs-muted)]">
                    Total payments: <span className="font-semibold text-secondary">{payments.length}</span>
                </p>
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
                            {payments.map((payment, index) => (
                                <tr key={payment._id} className="hover:bg-primary/10">
                                    <th>{index + 1}</th>
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
                    {!payments.length && (
                        <p className="py-10 text-center text-[var(--zs-muted)]">No payments found yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentHistory;
