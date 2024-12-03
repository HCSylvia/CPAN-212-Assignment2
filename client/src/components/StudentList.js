
import React, { useState, useEffect } from 'react';
import '../styles/StudentList.css';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/students');
        if (!response.ok) throw new Error('Failed to fetch students');
        const data = await response.json();
        setStudents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="student-list">
      <h2>Students Directory</h2>
      <div className="student-grid">
        {students.map(student => (
          <div key={student.id} className="student-card">
            <h3>{student.name}</h3>
            <p>ID: {student.id}</p>
            <p>Department: {student.department}</p>
            <p>Semester: {student.semester}</p>
            <div className="course-counts">
              <span>Enrolled Courses: {student.enrolledCourses?.length || 0}</span>
              <span>Completed Courses: {student.completedCourses?.length || 0}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentList;