import React from 'react';
import Logo from '../components/Logo/Logo';
import { Outlet, Link } from 'react-router';
import authImage from '../assets/authImage.png';
import ThemeToggle from '../components/ThemeToggle/ThemeToggle';

const AuthLayout = () => {
    return (
        <div className="min-h-screen w-full px-4 py-6 md:px-6 lg:px-8 xl:px-10">
            <div className="mb-6 flex items-center justify-between">
                <Logo />
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <Link to="/" className="btn btn-sm rounded-xl">Home</Link>
                </div>
            </div>
            <div className="grid items-center gap-8 lg:grid-cols-2">
                <Outlet />
                <div className="hidden lg:block">
                    <img src={authImage} alt="ZapShift authentication" className="w-full rounded-3xl object-cover" />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
