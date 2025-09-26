import React, { useState, useEffect } from 'react';

const ThemeToggle = () => {
    // Check for saved theme in localStorage, default to 'light'
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    // Apply the theme to the body element whenever it changes
    useEffect(() => {
        document.body.className = ''; // Clear existing theme classes
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