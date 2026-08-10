import React, { useEffect, useState } from 'react';
import Logo from '../../../components/Logo/Logo';
import { Link, NavLink, useNavigate } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import ThemeToggle from '../../../components/ThemeToggle/ThemeToggle';

const NavBar = () => {
    const { user, logOut } = useAuth();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleLogOut = () => {
        logOut()
            .then(() => navigate('/login'))
            .catch(() => {});
    };

    const linkClass = ({ isActive }) =>
        [
            'rounded-xl px-3.5 py-2 text-sm font-semibold tracking-tight transition-colors duration-200',
            isActive
                ? 'bg-primary text-secondary shadow-sm'
                : 'text-base-content/80 hover:bg-base-200 hover:text-secondary dark:hover:text-primary'
        ].join(' ');

    const publicLinks = (
        <>
            <li><NavLink to="/" end className={linkClass} onClick={() => setMenuOpen(false)}>Home</NavLink></li>
            <li><NavLink to="/explore" className={linkClass} onClick={() => setMenuOpen(false)}>Services</NavLink></li>
            <li><NavLink to="/coverage" className={linkClass} onClick={() => setMenuOpen(false)}>Coverage</NavLink></li>
            <li><NavLink to="/about" className={linkClass} onClick={() => setMenuOpen(false)}>About</NavLink></li>
        </>
    );

    const authLinks = user ? (
        <>
            <li><NavLink to="/dashboard" className={linkClass} onClick={() => setMenuOpen(false)}>Dashboard</NavLink></li>
            <li><NavLink to="/blog" className={linkClass} onClick={() => setMenuOpen(false)}>Blog</NavLink></li>
            <li><NavLink to="/contact" className={linkClass} onClick={() => setMenuOpen(false)}>Contact</NavLink></li>
        </>
    ) : null;

    const photo = user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'U')}&background=03373D&color=CAEB66`;

    return (
        <>
        <header
            className={[
                'fixed inset-x-0 top-0 z-50 w-full transition-[background-color,box-shadow,border-color] duration-300',
                scrolled
                    ? 'border-b border-secondary/10 bg-base-100/90 shadow-[0_8px_30px_rgba(3,55,61,0.08)] backdrop-blur-xl dark:border-primary/15 dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)]'
                    : 'border-b border-transparent bg-base-100/80 backdrop-blur-md'
            ].join(' ')}
        >
            <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between gap-3 px-4 md:h-[4.25rem] md:px-6 lg:px-8">
                {/* Left: logo + mobile menu */}
                <div className="flex min-w-0 items-center gap-1">
                    <div className="dropdown lg:hidden">
                        <button
                            type="button"
                            tabIndex={0}
                            aria-label="Open menu"
                            aria-expanded={menuOpen}
                            className="btn btn-ghost btn-square btn-sm rounded-xl"
                            onClick={() => setMenuOpen((v) => !v)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </button>
                        <ul
                            tabIndex={0}
                            className="menu dropdown-content menu-sm z-50 mt-3 w-60 rounded-2xl border border-base-300 bg-base-100 p-2 shadow-xl"
                        >
                            {publicLinks}
                            {authLinks}
                            {!user && (
                                <>
                                    <li><NavLink to="/login" className={linkClass} onClick={() => setMenuOpen(false)}>Login</NavLink></li>
                                    <li><NavLink to="/register" className={linkClass} onClick={() => setMenuOpen(false)}>Register</NavLink></li>
                                </>
                            )}
                            <li className="mt-1 border-t border-base-300 pt-1">
                                <NavLink to="/send-parcel" className={linkClass} onClick={() => setMenuOpen(false)}>
                                    Send Parcel
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                    <Logo />
                </div>

                {/* Center links */}
                <nav className="hidden lg:block" aria-label="Primary">
                    <ul className="flex items-center gap-0.5">
                        {publicLinks}
                        {authLinks}
                    </ul>
                </nav>

                {/* Right actions */}
                <div className="flex shrink-0 items-center gap-1.5 md:gap-2.5">
                    <ThemeToggle />
                    {user ? (
                        <div className="dropdown dropdown-end">
                            <button type="button" tabIndex={0} className="btn btn-ghost btn-circle avatar h-10 w-10 min-h-0 p-0" aria-label="Account menu">
                                <div className="h-9 w-9 overflow-hidden rounded-full ring-2 ring-primary/60 ring-offset-2 ring-offset-base-100">
                                    <img alt={user.displayName || 'Profile'} src={photo} className="h-full w-full object-cover" />
                                </div>
                            </button>
                            <ul tabIndex={0} className="menu dropdown-content menu-sm z-50 mt-3 w-60 rounded-2xl border border-base-300 bg-base-100 p-2 shadow-xl">
                                <li className="menu-title px-3 py-2">
                                    <span className="truncate text-xs font-normal opacity-70">{user.email}</span>
                                </li>
                                <li><Link to="/dashboard">Dashboard</Link></li>
                                <li><Link to="/dashboard/settings">Profile & Settings</Link></li>
                                <li><Link to="/dashboard/my-parcels">My Parcels</Link></li>
                                <li><button type="button" onClick={handleLogOut}>Logout</button></li>
                            </ul>
                        </div>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="btn btn-sm h-10 min-h-0 rounded-xl border border-base-300 bg-base-100 px-4 font-semibold hover:border-secondary/30"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="btn btn-sm h-10 min-h-0 rounded-xl border border-base-300 bg-base-100 px-4 font-semibold hover:border-secondary/30"
                            >
                                Register
                            </Link>
                        </>
                    )}
                    <Link
                        to="/send-parcel"
                        className="zs-btn-primary hidden h-10 min-h-0 items-center px-4 text-sm sm:inline-flex"
                    >
                        Book Now
                    </Link>
                </div>
            </div>
        </header>
        {/* Spacer so page content starts below the fixed navbar */}
        <div className="h-16 w-full shrink-0 md:h-[4.25rem]" aria-hidden="true" />
        </>
    );
};

export default NavBar;
