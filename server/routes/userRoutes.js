import express from 'express';
import { getUserData, getEnrolledCourses,purchaseCourse, updateCourseProgress, getUserCourseProgress, addUserRating } from '../controllers/userController.js';


const userRouter = express.Router();

userRouter.get('/data',getUserData)
userRouter.get('/enrolled-courses',getEnrolledCourses);
userRouter.post('/purchase', purchaseCourse); 
userRouter.post('/update-course-progress', updateCourseProgress);
userRouter.post('/get-course-progress',getUserCourseProgress);
userRouter.post('/add-rating', addUserRating)

export default userRouter;


