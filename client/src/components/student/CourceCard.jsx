import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { Link } from 'react-router-dom'

function CourceCard({ course }) {
  const { currency, calculateRatings } = useContext(AppContext)
  const avgRating = calculateRatings(course)
  const discountedPrice = (course.coursePrice - course.discount * course.coursePrice / 100).toFixed(2)

  return (
    <Link to={'/course/' + course._id} onClick={() => scrollTo(0, 0)} className='border border-gray-500/30 pb-6 overflow-hidden rounded-lg'>
      <img className='w-full' src={course.courseThumbnail} alt={course.courseTitle} />
      <div className='p-3 text-left'>
        <h3 className='text-base font-semibold'>{course.courseTitle}</h3>
        <p className='text-gray-500'>{course.educator.name}</p>
        
        <div className='flex items-center space-x-2 mt-1'>
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
          <p className='text-gray-500'>({course.courseRatings.length})</p>
        </div>

        <p className='text-base font-semibold text-gray-800 mt-1'>
          {currency}{discountedPrice}
        </p>
      </div>
    </Link>
  )
}

export default CourceCard
