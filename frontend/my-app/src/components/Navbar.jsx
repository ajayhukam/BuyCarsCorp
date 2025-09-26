import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import ThemeToggle from './ThemeToggle'; // <-- 1. Import the new component

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="container">
                <div className="nav-left">
                    <Link to="/" className="navbar-brand">BUYCARS.COM</Link>
                    <NavLink to="/marketplace" className="nav-link">Marketplace</NavLink>
                </div>
                <div className="nav-links">
                    <ThemeToggle /> {/* <-- 2. Add the toggle button here */}
                    {user ? (
                        <>
                            <NavLink to="/dashboard" className="nav-link">My Dashboard</NavLink>
                            <NavLink to="/add-car" className="nav-link">Add Car</NavLink>
                            <button onClick={logout} className="nav-button">Logout ({user.name})</button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login" className="nav-link">Dealer Login</NavLink>
                            <NavLink to="/signup" className="nav-link">Dealer Sign Up</NavLink>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;