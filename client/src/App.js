import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/Navbar';
import AddCourse from './components/AddCourse';
import AddStudent from './components/AddStudent';
import StudentManagement from './components/StudentManagement';
import StudentList from './components/StudentList';
import CourseList from './components/CourseList';
import Login from './components/Login';
import Registration from './components/Registration';
import './App.css';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/auth/check-auth', {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.isAuthenticated) {
                setUser(data.user);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
        }
    };

    return (
        <Router>
            <div className="App">
                <NavBar user={user} onLogout={() => setUser(null)} />
                <main className="content">
                    <Routes>
                        <Route path="/login" element={<Login onLogin={setUser} />} />
                        <Route path="/add-course" element={<AddCourse />} />
                        <Route path="/add-student" element={<AddStudent />} />
                        <Route path="/" element={<StudentManagement />} />
                        <Route path="/students" element={<StudentList />} />
                        <Route path="/courses" element={<CourseList />} />
                        <Route path="/register" element={<Registration />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
