import React from 'react';

import logo from '../../assets/logo.png'
import { Link } from 'react-router';

const Logo = () => {
    return (
        <Link to="/">
            <div className='flex items-end'>
                <img src={logo} alt="ZapShift logo" className="h-10 w-auto" />
                <h3 className="text-3xl font-bold -ms-2.5 text-secondary dark:text-primary">ZapShift</h3>
            </div>
        </Link>
    );
};

export default Logo;