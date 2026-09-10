const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getCourses, createCourse, updateCourse, deleteCourse } = require('../controllers/courseController');

router.use(protect);

router.get('/', getCourses);
router.post('/', authorize('admin', 'staff', 'masterAdmin'), createCourse);
router.put('/:id', authorize('admin', 'staff', 'masterAdmin'), updateCourse);
router.delete('/:id', authorize('admin', 'masterAdmin'), deleteCourse);

module.exports = router;
