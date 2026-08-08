import React from 'react';
import { Outlet } from 'react-router';
import Footer from '../pages/Shared/Footer/Footer';
import NavBar from '../pages/Shared/NavBar/NavBar';

const RootLayout = () => {
    return (
        <div className="mx-auto max-w-7xl px-3 py-3 md:px-4">
            <NavBar />
            <Outlet />
            <Footer />
        </div>
    );
};

export default RootLayout;