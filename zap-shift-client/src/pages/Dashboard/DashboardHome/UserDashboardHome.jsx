import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Link } from 'react-router';
import { CiDeliveryTruck } from 'react-icons/ci';
import { FaRegCreditCard } from 'react-icons/fa';
import { MdOutlineLocalShipping } from 'react-icons/md';
import { IoCheckmarkDoneCircleOutline } from 'react-icons/io5';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useRole from '../../../hooks/useRole';
import StatCard from '../../../components/Dashboard/StatCard';
import ProfileCard from '../../../components/Dashboard/ProfileCard';
import StatusBadge from '../../../components/Dashboard/StatusBadge';
import Loading from '../../../components/Loading/Loading';
import { motion } from 'motion/react';

const COLORS = ['#03373D', '#CAEB66', '#2F6FED', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6', '#14B8A6'];

const UserDashboardHome = () => {
    const { user } = useAuth();
    const { role } = useRole();
    const axiosSecure = useAxiosSecure();

    const { data: parcels = [], isLoading } = useQuery({
        queryKey: ['my-parcels', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels?email=${user.email}`);
            return res.data;
        }
    });

    const stats = useMemo(() => {
        const unpaid = parcels.filter((p) => p.paymentStatus !== 'paid').length;
        const paid = parcels.filter((p) => p.paymentStatus === 'paid').length;
        const inMotion = parcels.filter((p) =>
            ['pending-pickup', 'driver_assigned', 'rider_arriving', 'parcel_picked_up'].includes(p.deliveryStatus)
        ).length;
        const delivered = parcels.filter((p) => p.deliveryStatus === 'parcel_delivered').length;

        const chartMap = {};
        parcels.forEach((p) => {
            const key = p.paymentStatus !== 'paid' ? 'unpaid' : (p.deliveryStatus || 'paid');
            chartMap[key] = (chartMap[key] || 0) + 1;
        });

        const chartData = Object.entries(chartMap).map(([name, value]) => ({
            name: name.replaceAll('_', ' '),
            value
        }));

        return { unpaid, paid, inMotion, delivered, chartData };
    }, [parcels]);

    if (isLoading) return <Loading />;

    return (
        <div className="space-y-6">
            <div className="animate-fade-up">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--zs-muted)]">Welcome back</p>
                <h2 className="mt-1 text-3xl font-bold text-secondary md:text-4xl">
                    {user?.displayName || 'User'} Overview
                </h2>
                <p className="mt-2 max-w-2xl text-[var(--zs-muted)]">
                    Track your parcel pipeline — from unpaid bookings to successful deliveries.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Unpaid" value={stats.unpaid} icon={<FaRegCreditCard />} delay={0.05} />
                <StatCard label="Paid" value={stats.paid} icon={<CiDeliveryTruck />} delay={0.1} />
                <StatCard label="In Transit" value={stats.inMotion} icon={<MdOutlineLocalShipping />} delay={0.15} />
                <StatCard label="Delivered" value={stats.delivered} icon={<IoCheckmarkDoneCircleOutline />} delay={0.2} />
            </div>

            <div className="grid gap-4 lg:grid-cols-5">
                <div className="lg:col-span-2">
                    <ProfileCard user={user} role={role} />
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.1 }}
                    className="zs-surface rounded-2xl p-5 lg:col-span-3"
                >
                    <h3 className="text-lg font-bold text-secondary">Parcel Status Mix</h3>
                    <p className="mb-4 text-sm text-[var(--zs-muted)]">Live distribution of your parcels</p>
                    {stats.chartData.length ? (
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.chartData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={55}
                                        outerRadius={95}
                                        paddingAngle={3}
                                        label
                                    >
                                        {stats.chartData.map((_, index) => (
                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="grid h-72 place-items-center text-[var(--zs-muted)]">
                            No parcels yet. <Link className="ml-1 link link-hover text-secondary" to="/send-parcel">Send one</Link>
                        </div>
                    )}
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.15 }}
                className="zs-surface rounded-2xl p-5"
            >
                <div className="mb-4 flex items-center justify-between gap-3">
                    <h3 className="text-lg font-bold text-secondary">Recent Parcels</h3>
                    <Link to="/dashboard/my-parcels" className="btn btn-sm rounded-xl bg-primary text-secondary border-0">
                        View all
                    </Link>
                </div>
                <div className="space-y-3">
                    {parcels.slice(0, 5).map((parcel) => (
                        <div key={parcel._id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--zs-line)] bg-white/70 px-4 py-3">
                            <div>
                                <p className="font-semibold text-secondary">{parcel.parcelName}</p>
                                <p className="text-sm text-[var(--zs-muted)]">{parcel.trackingId || 'Awaiting payment'}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <StatusBadge status={parcel.paymentStatus === 'paid' ? parcel.deliveryStatus : 'unpaid'} />
                                <span className="font-bold text-secondary">৳{parcel.cost}</span>
                            </div>
                        </div>
                    ))}
                    {!parcels.length && (
                        <p className="py-8 text-center text-[var(--zs-muted)]">You have not created any parcels yet.</p>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default UserDashboardHome;
