import React, { useState, useEffect } from 'react';

function AddStudent() {
    const [formData, setFormData] = useState({
        name: '',
        department: '',
        semester: '',
        enrolledCourses: [],
        completedCourses: []
    });
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/courses');
            const data = await response.json();
            setCourses(data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const processedData = {
                ...formData,
                enrolledCourses: formData.enrolledCourses.map(courseId => {
                    const course = courses.find(c => c.id === parseInt(courseId));
                    return {
                        id: course.id,
                        name: course.name,
                        department: course.department
                    };
                }),
                completedCourses: formData.completedCourses.map(courseId => {
                    const course = courses.find(c => c.id === parseInt(courseId));
                    return {
                        id: course.id,
                        name: course.name,
                        department: course.department,
                        grade: 0
                    };
                })
            };

            const response = await fetch('http://localhost:3001/api/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(processedData)
            });
            
            if (response.ok) {
                setFormData({
                    name: '',
                    department: '',
                    semester: '',
                    enrolledCourses: [],
                    completedCourses: []
                });
                alert('Student added successfully!');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCourseSelection = (courseId, field) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].includes(courseId)
                ? prev[field].filter(id => id !== courseId)
                : [...prev[field], courseId]
        }));
    };

    return (
        <div className="form-container">
            <h2>Add New Student</h2>
            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Department:</label>
                    <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Semester:</label>
                    <input
                        type="number"
                        name="semester"
                        value={formData.semester}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Enrolled Courses:</label>
                    <div className="course-select-list">
                        {courses.map(course => (
                            <div key={course.id} className="course-item">
                                <input
                                    type="checkbox"
                                    id={`enrolled-${course.id}`}
                                    checked={formData.enrolledCourses.includes(course.id.toString())}
                                    onChange={() => handleCourseSelection(course.id.toString(), 'enrolledCourses')}
                                />
                                <label htmlFor={`enrolled-${course.id}`}>
                                    {course.name} ({course.department})
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Completed Courses:</label>
                    <div className="course-select-list">
                        {courses.map(course => (
                            <div key={course.id} className="course-item">
                                <input
                                    type="checkbox"
                                    id={`completed-${course.id}`}
                                    checked={formData.completedCourses.includes(course.id.toString())}
                                    onChange={() => handleCourseSelection(course.id.toString(), 'completedCourses')}
                                />
                                <label htmlFor={`completed-${course.id}`}>
                                    {course.name} ({course.department})
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <button type="submit" className="submit-btn">Add Student</button>
            </form>
        </div>
    );
}

export default AddStudent;