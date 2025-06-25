import Stripe from 'stripe';
import Course from '../models/Course.js';
import User from '../models/user.js';
import { Purchase } from '../models/Purchase.js';


// Get all courses
export const getAllCourses = async (req, res) => {
  try {
   const courses = await Course.find({ isPublished: true })
  .select('-courseContent -enrolledStudents')
  .populate('educator'); 

    res.json({
      success: true,
      courses,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Get course by ID
export const getCourseId = async (req, res) => {
    const {id} = req.params;
  try {
    const courseData = await Course.findById(id).populate({path:'educator'});
    //remove course content for non-preview lectures
    courseData.courseContent.forEach((chapter) => {
      chapter.chapterContent.forEach((lecture) => {
        lecture.lectureUrl = lecture.isPreviewFree ? lecture.lectureUrl : null;
      });
    });

    res.json({
      success: true,
      courseData,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};  

