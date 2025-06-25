import express from 'express';
import { getUserData, getEnrolledCourses,purchaseCourse } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/data',getUserData)
userRouter.get('/enrolled-courses',getEnrolledCourses);
userRouter.post('/purchase', purchaseCourse); 

export default userRouter;


