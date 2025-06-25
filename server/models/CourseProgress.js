import mongoose from "mongoose";

const coursePrgressSchema = new mongoose.Schema({
    userId: { type: String, required: true, ref: 'User' },
    courseId: { type: String, required: true, ref: 'Course' },
    completed: { type: Boolean, default: false },
    lectureCompleted:[]
}, { minimize:false});

export const CourseProgress = mongoose.model('CourseProgress', coursePrgressSchema);

