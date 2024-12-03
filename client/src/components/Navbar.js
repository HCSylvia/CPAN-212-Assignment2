import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const NavBar = ({ user, onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await fetch('http://localhost:3001/api/auth/logout', {
                credentials: 'include'
            });
            onLogout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <nav className="navbar">
            <div className="nav-text">Student Course Manager</div>
            <div className="nav-links">
                <Link to="/">Dashboard</Link>
                <Link to="/add-course">Add Course</Link>
                <Link to="/add-student">Add Student</Link>
                <Link to="/students">Students</Link>
                <Link to="/courses">Courses</Link>
                {user ? (
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </div>
        </nav>
    );
};

export default NavBar;
