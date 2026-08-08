import React from 'react';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import useTheme from '../../hooks/useTheme';

const ThemeToggle = ({ className = '' }) => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`btn btn-ghost btn-sm btn-circle ${className}`}
        >
            {isDark ? <MdLightMode className="text-lg text-primary" /> : <MdDarkMode className="text-lg" />}
        </button>
    );
};

export default ThemeToggle;
