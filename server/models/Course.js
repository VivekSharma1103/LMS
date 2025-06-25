import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
    lectureId: {type: String, required: true},
    lectureTitle: {type: String, required: true},
    lectureDuration: {type: Number, required: true, min: 1},
    lectureUrl: {type: String, required: true},
    isPreviewFree: {type: Boolean, default: true},
    lectureOrder: {type: Number, required: true},
},{_id:false})

const chatperSchema = new mongoose.Schema({
    chapterId: {type: String, required: true},
    chaterOrder: {type: Number, required: true},
    chapterTitle: {type: String, required: true},
    chapterContent:[lectureSchema]
},{_id: false, timestamps: true});

const courseSchema = new mongoose.Schema({
    courseTitle:{type: String, required: true},
    courseDescription: {type: String, required: true},  
    courseThumbnail: {type: String, required: true},
    coursePrice: {type: Number, required: true},
    isPublished: {type: Boolean, default: true},
    discount: {type: Number, required:true,min:0,max:100},
    courseContent:[chatperSchema],
    courseRatings:[
        {
            userId: {type: String, ref: 'User'},
            rating: {type: Number, required: true, min: 1, max: 5},
        }
    ],
    educator: {type: String, ref: 'User', required: true},
    enrolledStudents: [{type: String, ref: 'User'}],
},{timestamps: true,minimize:false});

const Course = mongoose.model('Course', courseSchema);

export default Course;