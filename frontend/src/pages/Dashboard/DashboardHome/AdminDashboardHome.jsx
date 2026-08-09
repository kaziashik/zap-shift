import { useQuery } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, Bar, BarChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import StatCard from '../../../components/Dashboard/StatCard';
import Loading from '../../../components/Loading/Loading';
import { FaUsers, FaMotorcycle, FaWarehouse } from 'react-icons/fa';
import { IoCheckmarkDoneCircleOutline } from 'react-icons/io5';
import { MdPayments } from 'react-icons/md';
import { motion } from 'motion/react';
import StatusBadge from '../../../components/Dashboard/StatusBadge';

const COLORS = ['#03373D', '#CAEB66', '#2F6FED', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6'];

const AdminDashboardHome = () => {
    const axiosSecure = useAxiosSecure();

    const { data: deliveryStats = [], isLoading: loadingStats, isError: statsError } = useQuery({
        queryKey: ['delivery-status-stats'],
        queryFn: async () => {
            const res = await axiosSecure.get('/parcels/delivery-status/stats');
            return res.data;
        },
        retry: 1
    });

    const { data: users = [] } = useQuery({
        queryKey: ['admin-users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return res.data;
        }
    });

    const { data: riders = [] } = useQuery({
        queryKey: ['admin-riders'],
        queryFn: async () => {
            const res = await axiosSecure.get('/riders');
            return res.data;
        }
    });

    const { data: payments = [] } = useQuery({
        queryKey: ['admin-payments'],
        queryFn: async () => {
            const res = await axiosSecure.get('/payments');
            return res.data;
        }
    });

    const overview = useMemo(() => {
        const customers = users.filter((u) => u.role === 'user' || !u.role).length;
        const approvedRiders = riders.filter((r) => r.status === 'approved').length;
        const delivered = deliveryStats.find((s) => s._id === 'parcel_delivered')?.count || 0;
        const earning = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
        const chartData = deliveryStats.map((item) => ({
            name: String(item._id || 'unknown').replaceAll('_', ' '),
            value: item.count
        }));
        const barData = chartData.slice(0, 6);

        return { customers, approvedRiders, delivered, earning, chartData, barData };
    }, [users, riders, deliveryStats, payments]);

    if (loadingStats && !statsError) return <Loading />;

    return (
        <div className="space-y-6">
            <div className="animate-fade-up">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--zs-muted)]">Operations</p>
                <h2 className="mt-1 text-3xl font-bold text-secondary md:text-4xl">Admin Control Center</h2>
                <p className="mt-2 max-w-2xl text-[var(--zs-muted)]">
                    Monitor riders, parcels, service flow, and earnings across ZapShift.
                </p>
                {statsError && (
                    <p className="mt-2 text-sm text-error">Delivery stats could not be loaded. Other admin metrics still show below.</p>
                )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <StatCard label="Customers" value={overview.customers} icon={<FaUsers />} delay={0.05} />
                <StatCard label="Riders" value={overview.approvedRiders} icon={<FaMotorcycle />} delay={0.08} />
                <StatCard label="Delivered" value={overview.delivered} icon={<IoCheckmarkDoneCircleOutline />} delay={0.11} />
                <StatCard label="Service Centers" value={64} icon={<FaWarehouse />} delay={0.14} />
                <StatCard label="Earning" value={`৳${overview.earning}`} icon={<MdPayments />} delay={0.17} />
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="zs-surface rounded-2xl p-5"
                >
                    <h3 className="text-lg font-bold text-secondary">Delivery Status</h3>
                    <p className="mb-3 text-sm text-[var(--zs-muted)]">Parcel count by current status</p>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={overview.chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={2}
                                    label
                                >
                                    {overview.chartData.map((_, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.08 }}
                    className="zs-surface rounded-2xl p-5"
                >
                    <h3 className="text-lg font-bold text-secondary">Parcel Volume</h3>
                    <p className="mb-3 text-sm text-[var(--zs-muted)]">Quick bar view of status counts</p>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={overview.barData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(3,55,61,0.1)" />
                                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#03373D" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.12 }}
                className="zs-surface rounded-2xl p-5"
            >
                <h3 className="text-lg font-bold text-secondary">Recent Payments</h3>
                <p className="mb-4 text-sm text-[var(--zs-muted)]">Latest successful transactions</p>
                <div className="space-y-3">
                    {payments.slice(0, 8).map((payment) => (
                        <div key={payment._id || payment.transactionId} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--zs-line)] bg-white/70 px-4 py-3">
                            <div>
                                <p className="font-semibold text-secondary">{payment.parcelName || 'Parcel payment'}</p>
                                <p className="text-sm text-[var(--zs-muted)]">
                                    {payment.customerEmail} · {payment.trackingId}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <StatusBadge status={payment.paymentStatus || 'paid'} />
                                <span className="font-bold text-secondary">৳{payment.amount}</span>
                            </div>
                        </div>
                    ))}
                    {!payments.length && (
                        <p className="py-8 text-center text-[var(--zs-muted)]">No payments recorded yet.</p>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default AdminDashboardHome;
