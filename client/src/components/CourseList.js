
import React, { useState, useEffect } from 'react';
import '../styles/CourseList.css';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/courses');
        if (!response.ok) throw new Error('Failed to fetch courses');
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="course-list">
      <h2>Courses Directory</h2>
      <div className="course-grid">
        {courses.map(course => (
          <div key={course.id} className="course-card">
            <h3>{course.name}</h3>
            <p>ID: {course.id}</p>
            <p>Department: {course.department}</p>
            <p className={`status ${course.isOpen ? 'open' : 'closed'}`}>
              Status: {course.isOpen ? 'Open' : 'Closed'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;