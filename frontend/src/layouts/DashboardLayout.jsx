import React from 'react';
import { CiDeliveryTruck } from 'react-icons/ci';
import { FaMotorcycle, FaRegCreditCard, FaTasks, FaUsers, FaHome, FaMapMarkedAlt, FaChartLine } from 'react-icons/fa';
import { Link, NavLink, Outlet, useNavigate } from 'react-router';
import useRole from '../hooks/useRole';
import { RiEBikeFill, RiLogoutBoxRLine } from 'react-icons/ri';
import { SiGoogletasks } from 'react-icons/si';
import { IoSettingsOutline } from 'react-icons/io5';
import logoImg from '../assets/logo.png';
import useAuth from '../hooks/useAuth';
import { motion } from 'motion/react';
import ThemeToggle from '../components/ThemeToggle/ThemeToggle';

const DashboardLayout = () => {
    const { role } = useRole();
    const { user, logOut } = useAuth();
    const navigate = useNavigate();

    const photo = user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'User')}&background=CAEB66&color=03373D`;

    const handleLogOut = () => {
        logOut()
            .then(() => navigate('/login'))
            .catch(() => {});
    };

    const navClass = ({ isActive }) =>
        `rounded-xl transition-all duration-200 ${isActive ? 'zs-nav-active' : 'hover:bg-white/60 dark:hover:bg-white/10'}`;

    return (
        <div className="drawer lg:drawer-open min-h-screen">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex min-h-screen flex-col">
                <nav className="sticky top-0 z-20 flex items-center justify-between border-b border-base-300 bg-base-100/85 px-4 py-3 backdrop-blur-md lg:px-6">
                    <div className="flex items-center gap-3">
                        <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="2" fill="none" stroke="currentColor" className="size-5"><path d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </label>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/60">ZapShift</p>
                            <h1 className="text-lg font-bold capitalize text-secondary dark:text-primary">{role} Dashboard</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-9 rounded-full ring ring-primary/50">
                                    <img alt="profile" src={photo} />
                                </div>
                            </div>
                            <ul tabIndex={0} className="menu dropdown-content z-50 mt-3 w-56 rounded-box bg-base-100 p-2 shadow">
                                <li className="menu-title"><span className="truncate text-xs font-normal">{user?.email}</span></li>
                                <li><Link to="/dashboard/settings">Profile</Link></li>
                                <li><Link to="/dashboard">Overview</Link></li>
                                <li><Link to="/">Website</Link></li>
                                <li><button type="button" onClick={handleLogOut}>Logout</button></li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <main className="flex-1 p-4 md:p-6 lg:p-8">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                        <Outlet />
                    </motion.div>
                </main>
            </div>

            <div className="drawer-side z-30 is-drawer-close:overflow-visible">
                <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                <aside className="flex min-h-full w-72 flex-col bg-secondary text-white">
                    <div className="border-b border-white/10 px-5 py-5">
                        <Link to="/" className="flex items-center gap-2">
                            <img src={logoImg} alt="ZapShift" className="h-10 w-auto brightness-110" />
                            <span className="text-xl font-bold tracking-tight">ZapShift</span>
                        </Link>
                    </div>

                    <div className="mx-4 mt-5 rounded-2xl bg-white/10 p-4">
                        <div className="flex items-center gap-3">
                            <img src={photo} alt={user?.displayName || 'User'} className="size-12 rounded-xl object-cover ring-2 ring-primary/70" />
                            <div className="min-w-0">
                                <p className="truncate font-semibold">{user?.displayName || 'User'}</p>
                                <p className="truncate text-xs text-white/70">{user?.email}</p>
                                <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-primary">{role}</p>
                            </div>
                        </div>
                    </div>

                    <ul className="menu w-full grow gap-1 px-3 py-5 text-[15px]">
                        <li>
                            <NavLink to="/dashboard" end className={navClass}>
                                <FaHome /><span>Overview</span>
                            </NavLink>
                        </li>

                        {(role === 'user' || !role) && (
                            <>
                                <li><NavLink to="/dashboard/my-parcels" className={navClass}><CiDeliveryTruck className="text-lg" /><span>My Parcels</span></NavLink></li>
                                <li><NavLink to="/dashboard/payment-history" className={navClass}><FaRegCreditCard /><span>Payment History</span></NavLink></li>
                                <li><NavLink to="/send-parcel" className={navClass}><CiDeliveryTruck className="text-lg" /><span>Create Parcel</span></NavLink></li>
                            </>
                        )}

                        {role === 'rider' && (
                            <>
                                <li><NavLink to="/dashboard/assigned-deliveries" className={navClass}><FaTasks /><span>Assigned Deliveries</span></NavLink></li>
                                <li><NavLink to="/dashboard/completed-deliveries" className={navClass}><SiGoogletasks /><span>Completed Deliveries</span></NavLink></li>
                                <li><NavLink to="/dashboard/payment-history" className={navClass}><FaRegCreditCard /><span>Earnings History</span></NavLink></li>
                            </>
                        )}

                        {role === 'admin' && (
                            <>
                                <li><NavLink to="/dashboard/analytics" className={navClass}><FaChartLine /><span>Analytics</span></NavLink></li>
                                <li><NavLink to="/dashboard/approve-riders" className={navClass}><FaMotorcycle /><span>Approve Riders</span></NavLink></li>
                                <li><NavLink to="/dashboard/assign-riders" className={navClass}><RiEBikeFill /><span>Assign Riders</span></NavLink></li>
                                <li><NavLink to="/dashboard/users-management" className={navClass}><FaUsers /><span>Manage Users</span></NavLink></li>
                                <li><NavLink to="/dashboard/payment-history" className={navClass}><FaRegCreditCard /><span>Payments</span></NavLink></li>
                            </>
                        )}

                        <div className="my-3 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">Public</div>
                        <li><NavLink to="/" className={navClass}><FaHome /><span>Website Home</span></NavLink></li>
                        <li><NavLink to="/coverage" className={navClass}><FaMapMarkedAlt /><span>Coverage</span></NavLink></li>
                        <li><NavLink to="/dashboard/settings" className={navClass}><IoSettingsOutline /><span>Settings</span></NavLink></li>
                        <li>
                            <button type="button" onClick={handleLogOut} className="rounded-xl text-red-200 hover:bg-red-500/20 hover:text-white">
                                <RiLogoutBoxRLine /><span>Log Out</span>
                            </button>
                        </li>
                    </ul>
                </aside>
            </div>
        </div>
    );
};

export default DashboardLayout;
