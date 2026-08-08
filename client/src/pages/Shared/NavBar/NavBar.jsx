import React from 'react';
import Logo from '../../../components/Logo/Logo';
import { Link, NavLink, useNavigate } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import ThemeToggle from '../../../components/ThemeToggle/ThemeToggle';

const NavBar = () => {
    const { user, logOut } = useAuth();
    const navigate = useNavigate();

    const handleLogOut = () => {
        logOut()
            .then(() => navigate('/login'))
            .catch(() => {});
    };

    const linkClass = ({ isActive }) =>
        `rounded-lg px-3 py-2 text-sm font-semibold transition ${isActive ? 'bg-primary/70 text-secondary' : 'hover:bg-base-300'}`;

    const publicLinks = (
        <>
            <li><NavLink to="/" end className={linkClass}>Home</NavLink></li>
            <li><NavLink to="/explore" className={linkClass}>Services</NavLink></li>
            <li><NavLink to="/coverage" className={linkClass}>Coverage</NavLink></li>
            <li><NavLink to="/about" className={linkClass}>About</NavLink></li>
            {!user && <li><NavLink to="/login" className={linkClass}>Login</NavLink></li>}
        </>
    );

    const authLinks = user ? (
        <>
            <li><NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink></li>
            <li><NavLink to="/blog" className={linkClass}>Blog</NavLink></li>
            <li><NavLink to="/contact" className={linkClass}>Contact</NavLink></li>
        </>
    ) : null;

    const photo = user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'U')}&background=03373D&color=CAEB66`;

    return (
        <header className="sticky top-0 z-50 -mx-3 mb-4 border-b border-base-300 bg-base-100/90 backdrop-blur-md md:-mx-4">
            <div className="navbar mx-auto max-w-7xl px-3 md:px-4">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden" aria-label="Open menu">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </div>
                        <ul tabIndex={0} className="menu dropdown-content menu-sm z-50 mt-3 w-56 rounded-box bg-base-100 p-2 shadow">
                            {publicLinks}
                            {authLinks}
                            <li><NavLink to="/send-parcel" className={linkClass}>Send Parcel</NavLink></li>
                        </ul>
                    </div>
                    <Logo />
                </div>

                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal gap-1 px-1">
                        {publicLinks}
                        {authLinks}
                    </ul>
                </div>

                <div className="navbar-end gap-1 md:gap-2">
                    <ThemeToggle />
                    {user ? (
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-9 rounded-full ring ring-primary/50">
                                    <img alt={user.displayName || 'Profile'} src={photo} />
                                </div>
                            </div>
                            <ul tabIndex={0} className="menu dropdown-content menu-sm z-50 mt-3 w-56 rounded-box bg-base-100 p-2 shadow">
                                <li className="menu-title px-3 py-2">
                                    <span className="truncate text-xs font-normal">{user.email}</span>
                                </li>
                                <li><Link to="/dashboard">Dashboard</Link></li>
                                <li><Link to="/dashboard/settings">Profile & Settings</Link></li>
                                <li><Link to="/dashboard/my-parcels">My Parcels</Link></li>
                                <li><button type="button" onClick={handleLogOut}>Logout</button></li>
                            </ul>
                        </div>
                    ) : (
                        <Link to="/register" className="btn btn-sm rounded-xl border border-base-300 bg-base-100 font-semibold">
                            Register
                        </Link>
                    )}
                    <Link to="/send-parcel" className="zs-btn-primary btn-sm hidden sm:inline-flex">
                        Book Now
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default NavBar;
