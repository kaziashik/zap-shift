import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Loading from '../../../components/Loading/Loading';
import {
    Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';
import usePagination from '../../../hooks/usePagination';
import StatusBadge from '../../../components/Dashboard/StatusBadge';

const AdminAnalytics = () => {
    const axiosSecure = useAxiosSecure();
    const [statusFilter, setStatusFilter] = useState('all');
    const [search, setSearch] = useState('');

    const { data: parcels = [], isLoading } = useQuery({
        queryKey: ['admin-all-parcels'],
        queryFn: async () => {
            const res = await axiosSecure.get('/parcels');
            return res.data;
        }
    });

    const { data: payments = [] } = useQuery({
        queryKey: ['admin-payments-analytics'],
        queryFn: async () => {
            const res = await axiosSecure.get('/payments');
            return res.data;
        }
    });

    const chartData = useMemo(() => {
        const map = {};
        parcels.forEach((p) => {
            const key = p.deliveryStatus || 'unknown';
            map[key] = (map[key] || 0) + 1;
        });
        return Object.entries(map).map(([name, value]) => ({
            name: name.replaceAll('_', ' '),
            value
        }));
    }, [parcels]);

    const paymentTrend = useMemo(() => {
        const map = {};
        payments.forEach((p) => {
            const raw = p.paidAt || p.createdAt;
            if (!raw) return;
            const day = new Date(raw).toISOString().slice(0, 10);
            map[day] = (map[day] || 0) + (Number(p.amount) || 0);
        });
        return Object.entries(map)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .slice(-10)
            .map(([date, amount]) => ({ date, amount }));
    }, [payments]);

    const filtered = useMemo(() => {
        return parcels.filter((p) => {
            const matchStatus = statusFilter === 'all' || p.deliveryStatus === statusFilter;
            const q = search.trim().toLowerCase();
            const matchSearch = !q ||
                String(p.parcelName || '').toLowerCase().includes(q) ||
                String(p.trackingId || '').toLowerCase().includes(q) ||
                String(p.senderEmail || '').toLowerCase().includes(q);
            return matchStatus && matchSearch;
        });
    }, [parcels, statusFilter, search]);

    const statuses = useMemo(
        () => ['all', ...new Set(parcels.map((p) => p.deliveryStatus).filter(Boolean))],
        [parcels]
    );

    const { page, totalPages, paginated, setPage } = usePagination(filtered, 8);

    if (isLoading) return <Loading />;

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-base-content/60">Analytics</p>
                <h2 className="mt-1 text-3xl font-bold text-secondary dark:text-primary">Operations Analytics</h2>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
                <div className="zs-surface p-5">
                    <h3 className="mb-3 font-bold">Parcels by status</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#03373D" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="zs-surface p-5">
                    <h3 className="mb-3 font-bold">Payment trend</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={paymentTrend}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="amount" stroke="#CAEB66" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="zs-surface grid gap-3 p-4 md:grid-cols-3">
                <input
                    className="zs-input md:col-span-2"
                    placeholder="Filter by parcel, tracking, email"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select className="select select-bordered rounded-xl" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            <div className="zs-table-wrap">
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Parcel</th>
                                <th>Sender</th>
                                <th>Tracking</th>
                                <th>Status</th>
                                <th>Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.map((parcel, index) => (
                                <tr key={parcel._id}>
                                    <td>{(page - 1) * 8 + index + 1}</td>
                                    <td className="font-semibold">{parcel.parcelName}</td>
                                    <td>{parcel.senderEmail}</td>
                                    <td className="text-xs">{parcel.trackingId || '—'}</td>
                                    <td><StatusBadge status={parcel.deliveryStatus || 'pending'} /></td>
                                    <td>৳{parcel.cost}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <button type="button" className="btn btn-sm rounded-xl" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
                    <span className="text-sm font-semibold">Page {page} / {totalPages}</span>
                    <button type="button" className="btn btn-sm rounded-xl" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
                </div>
            )}
        </div>
    );
};

export default AdminAnalytics;
