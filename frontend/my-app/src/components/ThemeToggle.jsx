import React, { useState, useEffect } from 'react';

const ThemeToggle = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        document.body.className = ''; 
        document.body.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <button onClick={toggleTheme} className="theme-toggle-btn">
            {theme === 'light' ? '🌙' : '☀️'}
        </button>
    );
};

export default ThemeToggle;