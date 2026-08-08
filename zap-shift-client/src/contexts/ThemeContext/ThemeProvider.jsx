import React, { useEffect, useState } from 'react';
import { ThemeContext } from './ThemeContext';

const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => localStorage.getItem('zs-theme') || 'zs-light');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('zs-theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme((prev) => (prev === 'zs-light' ? 'zs-dark' : 'zs-light'));

    return (
        <ThemeContext value={{ theme, setTheme, toggleTheme, isDark: theme === 'zs-dark' }}>
            {children}
        </ThemeContext>
    );
};

export default ThemeProvider;
