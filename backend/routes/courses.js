const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

router.get('/ongoing', courseController.getOngoingCourses);
router.get('/', courseController.filterCourses);
router.post('/', courseController.createCourse);

module.exports = router;