const express = require('express');
const router = express.Router();
const { 
    getAllStudents, 
    getStudentById, 
    createStudent,
    enrollCourse,
    withdrawCourse,
    updateCourseGrade,
    getStudentCourses 
} = require('../controllers/studentController');

router.get('/', getAllStudents);
router.get('/:id', getStudentById);
router.post('/', createStudent);

router.get('/:id/courses', getStudentCourses);
router.post('/:id/courses/:courseId', enrollCourse);
router.put('/:id/courses/:courseId', updateCourseGrade);
router.delete('/:id/courses/:courseId', withdrawCourse);

module.exports = router;