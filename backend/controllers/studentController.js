const students = require('../data/studentData');
const courses = require('../data/courseData');  
const fs = require('fs').promises;
const path = require('path');

const getAllStudents = (req, res) => {
    res.json(students);
};

const getStudentById = (req, res) => {
    const student = students.find(s => s.id === parseInt(req.params.id));
    
    if (!student) {
        return res.status(404).json({ message: 'Student not found' });
    }

    const averageGrade = student.completedCourses.length > 0
        ? student.completedCourses.reduce((sum, course) => sum + course.grade, 0) / student.completedCourses.length
        : 0;

    res.json({
        ...student,
        averageGrade: averageGrade.toFixed(2)
    });
};

const createStudent = async (req, res) => {
    try {
        const { name, department, semester } = req.body;
        
        if (!name || !department || !semester) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newStudent = {
            id: students.length + 1,
            name,
            department,
            semester: parseInt(semester),
            enrolledCourses: [],  
            completedCourses: []  
        };
        
        students.push(newStudent);

        const filePath = path.join(__dirname, '../data/studentData.js');
        const fileContent = `const students = ${JSON.stringify(students, null, 2)};\n\nmodule.exports = students;`;
        await fs.writeFile(filePath, fileContent, 'utf8');

        res.status(201).json(newStudent);
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(500).json({ message: 'Error creating student' });
    }
};

const getStudentCourses = (req, res) => {
    const student = students.find(s => s.id === parseInt(req.params.id));
    if (!student) return res.status(404).json({ message: 'Student not found' });
    
    res.json({
        enrolled: student.enrolledCourses,
        completed: student.completedCourses
    });
};

const enrollCourse = async (req, res) => {
    try {
        const studentId = parseInt(req.params.id);
        const courseId = parseInt(req.params.courseId);
        
        const student = students.find(s => s.id === studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        
        const course = courses.find(c => c.id === courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if student is already enrolled
        if (student.enrolledCourses.some(c => c.id === courseId)) {
            return res.status(400).json({ message: 'Student already enrolled in this course' });
        }

        // Add course to enrolled courses
        student.enrolledCourses.push({
            id: course.id,
            name: course.name,
            department: course.department
        });

        await updateStudentData();
        res.status(200).json({ message: 'Enrollment successful' });
    } catch (error) {
        console.error('Error in enrollCourse:', error);
        res.status(500).json({ message: 'Internal server error during enrollment' });
    }
};

const withdrawCourse = async (req, res) => {
    const studentId = parseInt(req.params.id);
    const courseId = parseInt(req.params.courseId);
    
    const student = students.find(s => s.id === studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    
    const courseIndex = student.enrolledCourses.findIndex(c => c.id === courseId);
    if (courseIndex === -1) return res.status(404).json({ message: 'Course not found' });
    
    student.enrolledCourses.splice(courseIndex, 1);
    await updateStudentData();
    res.json({ message: 'Course withdrawn successfully' });
};

const updateCourseGrade = async (req, res) => {
    const { grade } = req.body;
    const studentId = parseInt(req.params.id);
    const courseId = parseInt(req.params.courseId);
    
    const student = students.find(s => s.id === studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    
    student.completeCourse(courseId, grade);
    await updateStudentData();
    res.json({ message: 'Grade updated successfully' });
};

const updateStudentData = async () => {
    const filePath = path.join(__dirname, '../data/studentData.js');
    const fileContent = `const students = ${JSON.stringify(students, null, 2)};\n\nmodule.exports = students;`;
    await fs.writeFile(filePath, fileContent, 'utf8');
};

module.exports = {
    getAllStudents,
    getStudentById,
    createStudent,
    getStudentCourses,
    enrollCourse,
    withdrawCourse,
    updateCourseGrade
};