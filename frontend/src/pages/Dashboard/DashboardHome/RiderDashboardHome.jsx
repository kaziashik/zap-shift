import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Link } from 'react-router';
import { FaTasks, FaWallet } from 'react-icons/fa';
import { SiGoogletasks } from 'react-icons/si';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useRole from '../../../hooks/useRole';
import StatCard from '../../../components/Dashboard/StatCard';
import ProfileCard from '../../../components/Dashboard/ProfileCard';
import StatusBadge from '../../../components/Dashboard/StatusBadge';
import Loading from '../../../components/Loading/Loading';
import { motion } from 'motion/react';

const COLORS = ['#03373D', '#CAEB66', '#2F6FED', '#F59E0B'];

const RiderDashboardHome = () => {
    const { user } = useAuth();
    const { role } = useRole();
    const axiosSecure = useAxiosSecure();

    const { data: activeParcels = [], isLoading: loadingActive } = useQuery({
        queryKey: ['rider-active-parcels', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get('/parcels/rider');
            return res.data;
        }
    });

    const { data: completedParcels = [], isLoading: loadingCompleted } = useQuery({
        queryKey: ['rider-completed-parcels', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get('/parcels/rider?deliveryStatus=parcel_delivered');
            return res.data;
        }
    });

    const stats = useMemo(() => {
        const toPickup = activeParcels.filter((p) =>
            ['pending-pickup', 'driver_assigned', 'rider_arriving'].includes(p.deliveryStatus)
        ).length;
        const toDeliver = activeParcels.filter((p) => p.deliveryStatus === 'parcel_picked_up').length;
        const earning = completedParcels.reduce((sum, parcel) => {
            const sameCity = parcel.senderRegion === parcel.receiverRegion;
            const rate = sameCity ? 0.8 : 0.6;
            return sum + Math.round((Number(parcel.cost) || 0) * rate);
        }, 0);

        const chartData = [
            { name: 'To Pickup', value: toPickup },
            { name: 'To Deliver', value: toDeliver },
            { name: 'Completed', value: completedParcels.length }
        ].filter((item) => item.value > 0);

        return { toPickup, toDeliver, earning, chartData };
    }, [activeParcels, completedParcels]);

    if (loadingActive || loadingCompleted) return <Loading />;

    return (
        <div className="space-y-6">
            <div className="animate-fade-up">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--zs-muted)]">Rider desk</p>
                <h2 className="mt-1 text-3xl font-bold text-secondary md:text-4xl">Today&apos;s Tasks</h2>
                <p className="mt-2 max-w-2xl text-[var(--zs-muted)]">
                    Pickup, transit, and delivery jobs assigned to you — stay on top of every stop.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                <StatCard label="Earning (est.)" value={`৳${stats.earning}`} icon={<FaWallet />} delay={0.05} />
                <StatCard label="Parcel to Pickup" value={stats.toPickup} icon={<FaTasks />} delay={0.1} />
                <StatCard label="Parcel to Deliver" value={stats.toDeliver} icon={<SiGoogletasks />} delay={0.15} />
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
                    <h3 className="text-lg font-bold text-secondary">Task Breakdown</h3>
                    <p className="mb-4 text-sm text-[var(--zs-muted)]">Active vs completed workload</p>
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
                        <div className="grid h-72 place-items-center text-[var(--zs-muted)]">No assigned tasks yet.</div>
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
                    <h3 className="text-lg font-bold text-secondary">Current Tasks</h3>
                    <Link to="/dashboard/assigned-deliveries" className="btn btn-sm rounded-xl border-0 bg-primary text-secondary">
                        Open queue
                    </Link>
                </div>
                <div className="space-y-3">
                    {activeParcels.slice(0, 6).map((parcel) => (
                        <div key={parcel._id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--zs-line)] bg-white/70 px-4 py-3">
                            <div>
                                <p className="font-semibold text-secondary">{parcel.parcelName}</p>
                                <p className="text-sm text-[var(--zs-muted)]">
                                    {parcel.receiverAddress || parcel.senderAddress} · {parcel.trackingId}
                                </p>
                            </div>
                            <StatusBadge status={parcel.deliveryStatus} />
                        </div>
                    ))}
                    {!activeParcels.length && (
                        <p className="py-8 text-center text-[var(--zs-muted)]">No current pickup or delivery tasks.</p>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default RiderDashboardHome;
