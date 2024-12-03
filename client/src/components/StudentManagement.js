import React, { useState, useEffect } from 'react';
import '../styles/StudentManagement.css';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [courses, setStudentCourses] = useState({ enrolled: [], completed: [] });
  const [courseAction, setCourseAction] = useState({
    courseId: '',
    grade: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      fetchStudentCourses(selectedStudent);
    }
  }, [selectedStudent]);

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/students');
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchStudentCourses = async (studentId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/students/${studentId}/courses`);
      const data = await response.json();
      setStudentCourses(data);
    } catch (error) {
      console.error('Error fetching student courses:', error);
    }
  };

  const handleEnrollCourse = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!courseAction.courseId) {
      setError('Please enter a course ID');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/students/${selectedStudent}/courses/${courseAction.courseId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to enroll in course');
      }

      await fetchStudentCourses(selectedStudent);
      setCourseAction({ ...courseAction, courseId: '' });
    } catch (error) {
      setError(error.message);
      console.error('Error enrolling in course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawCourse = async (courseId) => {
    try {
      await fetch(`http://localhost:3001/api/students/${selectedStudent}/courses/${courseId}`, {
        method: 'DELETE'
      });
      fetchStudentCourses(selectedStudent);
    } catch (error) {
      console.error('Error withdrawing from course:', error);
    }
  };

  const handleUpdateGrade = async (e) => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:3001/api/students/${selectedStudent}/courses/${courseAction.courseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade: Number(courseAction.grade) })
      });
      fetchStudentCourses(selectedStudent);
    } catch (error) {
      console.error('Error updating grade:', error);
    }
  };

  return (
    <div className="student-management">
      <h2>Course Management</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <select 
        value={selectedStudent} 
        onChange={(e) => setSelectedStudent(e.target.value)}
        className="student-select"
      >
        <option value="">Select Student</option>
        {students.map(student => (
          <option key={student.id} value={student.id}>
            {student.name}
          </option>
        ))}
      </select>

      {selectedStudent && (
        <div className="course-actions">
          <div className="action-forms">
            <div className="form-section">
              <h3>Enroll in Course</h3>
              <form onSubmit={handleEnrollCourse}>
                <input
                  type="number"
                  placeholder="Course ID"
                  value={courseAction.courseId}
                  onChange={(e) => {
                    setError(null);
                    setCourseAction({...courseAction, courseId: e.target.value})
                  }}
                />
                <button type="submit" disabled={loading}>
                  {loading ? 'Enrolling...' : 'Enroll'}
                </button>
              </form>
            </div>

            <div className="form-section">
              <h3>Update Grade</h3>
              <form onSubmit={handleUpdateGrade}>
                <input
                  type="number"
                  placeholder="Course ID"
                  value={courseAction.courseId}
                  onChange={(e) => setCourseAction({...courseAction, courseId: e.target.value})}
                />
                <input
                  type="number"
                  placeholder="Grade"
                  min="0"
                  max="100"
                  value={courseAction.grade}
                  onChange={(e) => setCourseAction({...courseAction, grade: e.target.value})}
                />
                <button type="submit">Update Grade</button>
              </form>
            </div>
          </div>

          <div className="courses-display">
            <div className="enrolled-courses">
              <h3>Enrolled Courses</h3>
              {courses.enrolled.map(course => (
                <div key={course.id} className="course-item">
                  <span>{course.name} (ID: {course.id})</span>
                  <button onClick={() => handleWithdrawCourse(course.id)}>Withdraw</button>
                </div>
              ))}
            </div>

            <div className="completed-courses">
              <h3>Completed Courses</h3>
              {courses.completed.map(course => (
                <div key={course.id} className="course-item">
                  <span>{course.name} (ID: {course.id})</span>
                  <span>Grade: {course.grade}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;