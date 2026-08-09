import React from 'react';
import { Outlet, useLocation } from 'react-router';
import Footer from '../pages/Shared/Footer/Footer';
import NavBar from '../pages/Shared/NavBar/NavBar';

const RootLayout = () => {
    const { pathname } = useLocation();
    const isHome = pathname === '/';

    return (
        <div className="flex min-h-screen w-full flex-col">
            <NavBar />
            <main className={`w-full flex-1 overflow-x-clip ${isHome ? 'px-0 py-0' : 'px-4 py-4 md:px-6 lg:px-8 xl:px-10'}`}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default RootLayout;
