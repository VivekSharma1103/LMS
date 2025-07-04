import React, { use, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/student/Loading';
import { assets } from '../../assets/assets';
import humanizeDuration from 'humanize-duration';
import Footer from '../../components/student/Footer';
import YouTube from 'react-youtube';
import { toast } from 'react-toastify';

function CourseDetails() {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);


  const { allCourses, calculateRatings, calculateChapterTime, calculateCourseDuration, calculateNoOfLectures,currency ,backendUrl,userData,getToken} = useContext(AppContext);

   const fetchCourseData = async () => {
      try {
        const {data} = await axios.get(`${backendUrl}/api/course/${id}`);
        if(data.success) {
          setCourseData(data.course);
          
        } else {
          toast.error(data.message);
        }   
      } catch (error) {
        toast.error(error.message);
      }
      
    };
    const enrollCourse = async ()=>{
      try {
        if(!userData){
          return toast.warn('Please login to enroll in the course');
        }
        if(isAlreadyEnrolled){
          return toast.warn('You are already enrolled in this course');
        }
        const token = await getToken();
        const {data} = await axios.post(`${backendUrl}/api/user/purchase`,{courseId:courseData._id},{headers:{Authorization:`Bearer ${token}`}});
        if(data.success){
          const {session_url} = data;
          window.location.replace(session_url);
          // Optionally, you can redirect to the course player or my enrollments page
          // navigate(`/player/${courseData._id}`);
        } else {
          toast.error(error.message);
        }
      } catch (error) {
        
      }
    }

  useEffect(() => {
   
    fetchCourseData();
  }, []);

  useEffect(() => {
    if(userData && courseData){
      setIsAlreadyEnrolled(userData.enrolledCourses.includes(courseData._id));
    }
  },[]);

  if (!courseData) return <Loading />;

  const avgRating = calculateRatings(courseData);

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index], // toggle the selected index
    }));
  };


  return (
    <>
    <div className='flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-20 text-left'>
      <div className='absolute top-0 left-0 w-full h-96 z-[1] bg-gradient-to-b from-cyan-100/70'></div>

      {/* Left Section */}
      <div className='max-w-xl z-10 text-gray-500'>
        <h1 className='md:text-5xl sm:text-4xl font-semibold text-gray-800'>
          {courseData.courseTitle}
        </h1>
        <p
          className='pt-4 md:text-base text-sm'
          dangerouslySetInnerHTML={{
            __html: courseData.courseDescription?.slice(0, 200),
          }}
        ></p>

        {/* review and rating */}
        <div className='flex items-center space-x-2 mt-1 pt-3 pb-1 text-sm'>
          <p>{avgRating.toFixed(1)}</p>
          <div className='flex'>
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={i < Math.floor(avgRating) ? assets.star : assets.star_blank}
                alt='star'
                className='w-3.5 h-3.5'
              />
            ))}
          </div>
          <p className='text-gray-500'>({courseData.courseRatings?.length || 0}) {courseData.courseRatings.length > 1 ? 'ratings' : 'rating'}</p>
          <p className='text-blue-600'>
            ({courseData.enrolledStudents.length}{courseData.enrolledStudents.length > 1 ? 'students' : 'student'})
          </p>
        </div>
        <p>
          Course by <span className='text-blue-600 underline'>New Orleans</span>
        </p>
        <div className='pt-8 text-gray-800'>
          <h2 className='text-xl font semibold'>Course Structure</h2>
          <div className='pt-5'>
            {courseData.courseContent.map((chapter, index) => (
              <div key={index} className='border border-gray-400 bg-white mb-2 rounded'>
                <div className='flex items-center justify-between px-4 py-3 cursor-pointer select-none' onClick={() => { toggleSection(index) }}>
                  <div className='flex items-center gap-2'>
                    <img
                      src={assets.down_arrow_icon}
                      alt="arrow_icon"
                      className={`w-4 h-4 transform transition-transform duration-300 ${openSections[index] ? 'rotate-180' : 'rotate-0'}`}
                    />

                    <p className='font-medium md:text-default'>{chapter.chapterTitle}</p>
                  </div>
                  <p className='text-sm md:text-default'>{chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)}</p>
                </div>
                <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? 'max-h-96' : 'max-h-0'}`}>

                  <ul className='list disc md:pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300'>
                    {chapter.chapterContent.map((lecture, i) => (
                      <li key={i} className='flex items-start gap-2 py-1'>
                        <img src={assets.play_icon} alt="" className='w-4 h-4 ' />
                        <div className='flex items-center justify-between w-full text-gray-800 text-xs md:text-default'>
                          <p>{lecture.lectureTitle}</p>
                          <div className='flex gap-2'>
                            {lecture.isPreviewFree && <p 
                            onClick={()=>setPlayerData({
                              videoId:lecture.lectureUrl.split('/').pop()
                            })}
                            className='text-blue-500 cursor-pointer'>Preview</p>}
                            <p>{humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ['h', 'm'] })}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}

          </div>
        </div>
        <div className='py-20 text-sm md:text-default'>
          <h3 className='text-xl font-semibold text-gray-800'>Course Description</h3>
           <p
          className='pt-3 rich-text'
          dangerouslySetInnerHTML={{
            __html: courseData.courseDescription
          }}
        ></p>
        </div>
      </div>

      {/* Right Section */}
      <div className='max-w-40 z-10 shadow-2xl rounded-t-xl md:rounded-none overflow-hidden bg-white min-w-[300px] sm:min-w-[420px]'>
        {
           playerData ?<YouTube videoId={playerData.videoId} opts={{playerVars:{autoplay:1}}} iframeClassName='w-full aspect-video'/> : <img src={courseData.courseThumbnail} alt="" />
        }
       
        <div className='p-5'>
          <div className='flex items-center gap-2'>
           
              <img className='w-3.5' src={assets.time_left_clock_icon} alt="" />
            
          <p className='text-red-500'><span className='font-medium'>5 days </span>left at this price</p>
        </div>
        <div className='flex gap-3 items-center pt-2'>
          <p className='text-gray-800 md:text-4xl text-2xl font-semibold'>{currency}{(courseData.coursePrice - courseData.discount * courseData.coursePrice/100).toFixed(2)} </p>
          <p className='md:text-lg text-gray-500 line-through'>{currency}{courseData.coursePrice }</p>
          <p className='md:text-lg text-red-700'>{courseData.discount}% off</p>
        </div>
        <div className='flex items-center text-sm md:text-default gap-4 pt-2 md:pt-4 text-gray-500'>
          <div className='flex items-center gap-1'>
            <img src={assets.star} alt="" />
            <p>{calculateRatings(courseData)}</p>
          </div>

          <div className='h-4 w-px bg-gray-500/40'></div>
            <div className='flex items-center gap-1'>
          <img src={assets.time_clock_icon} alt="" />
          <p>{calculateCourseDuration(courseData)}</p>
          </div>
          

          <div className='h-4 w-px bg-gray-500/40'></div>

          <div className='flex items-center gap-1'>
            <img src={assets.lesson_icon} alt="" />
            <p>{calculateNoOfLectures(courseData)} lessons</p>
          </div>
        </div>
        <button onClick={enrollCourse} className='md:mt-6 mt-4 w-full py-3 rounded bg-blue-600 text-white font-medium'>{isAlreadyEnrolled ? 'Already Enrolled' : 'Enroll Now'}</button>
        <div className='pt-6'>
          <p className='md:text-xl text-lg font-medium text-gray-800'>What's in the course?</p>
          <ul className='ml-4 pt-2 text-sm md:text-default list-disc text-gray-500'>
            <li>LifeTime access with free updates.</li>
            <li>Step-by-Step, hands on project guidance.</li>
            <li>Downloadable resources and source code.</li>
            <li>Quizzes to test your knowledge.</li>
            <li>Certificates of Completion</li>
          </ul>
        </div>
        </div>
      </div>
      
    </div>
    <Footer/>
    </>
  );
}

export default CourseDetails;
