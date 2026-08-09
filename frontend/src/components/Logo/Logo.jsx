import React from 'react';

import logo from '../../assets/logo.png'
import { Link } from 'react-router';

const Logo = () => {
    return (
        <Link to="/" className="group inline-flex items-end gap-0 focus-visible:outline-none">
            <img src={logo} alt="" className="h-9 w-auto md:h-10" />
            <span className="-ms-2 text-2xl font-extrabold tracking-tight text-secondary transition-colors group-hover:text-secondary/90 dark:text-primary md:text-[1.7rem]">
                ZapShift
            </span>
            <span className="sr-only">ZapShift home</span>
        </Link>
    );
};

export default Logo;