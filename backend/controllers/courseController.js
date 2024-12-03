const courses = require('../data/courseData');
const fs = require('fs');
const path = require('path');

const getOngoingCourses = (req, res) => {
    const ongoingCourses = courses.filter(course => course.isOpen);
    res.json(ongoingCourses);
};

const filterCourses = (req, res) => {
    try {
        const filteredCourses = courses;
        if (!filteredCourses || filteredCourses.length === 0) {
            return res.status(404).json({ message: 'No courses found' });
        }
        res.json(filteredCourses);
    } catch (error) {
        console.error('Error filtering courses:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const createCourse = (req, res) => {
    try {
        const { id, name, department, isOpen } = req.body;
        
        if (!id || !name || !department) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Check if course with same ID already exists
        if (courses.find(course => course.id === parseInt(id))) {
            return res.status(400).json({ message: 'Course with this ID already exists' });
        }

        const newCourse = {
            id: parseInt(id),
            name,
            department,
            isOpen: isOpen === undefined ? true : isOpen
        };

        courses.push(newCourse);

        const filePath = path.join(__dirname, '../data/courseData.js');
        const fileContent = `// data/courseData.js\nconst courses = ${JSON.stringify(courses, null, 2)};\nmodule.exports = courses;`;
        
        fs.writeFileSync(filePath, fileContent, 'utf8');
        res.status(201).json(newCourse);
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getOngoingCourses,
    filterCourses,
    createCourse
};