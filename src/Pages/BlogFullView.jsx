import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Breadcrumb from '../components/breadcrumb/BreadCrumb';
import testImg from '../assets/Photo-1.jpg'
import Blog from '../assets/blog.jpg'

const BlogFullView = () => {
  const { id } = useParams();

  return (
    <div className="mt-25 px-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb />

      {/* blog full view */}
      <div className='w-3/4 h-200  mx-auto p-10'>

         {/* div for the user profile image and the username, date time get from database and the title*/}
         <div className='grid grid-rows items-center gap-2'>

          {/*user profile image and the username,data time */}
          <div className='flex flex-wrap items-center gap-4'>
            <img src={testImg} alt="profile_image" className='w-16 h-16 rounded-full'/>
            
            <div className='grid grid-col p-0'>
              <h5 className='font-bold font-serif text-lg'>John Doe</h5>
            <time datetime="2025-06-10" className='text-sm font-semibold'>2025-06-10</time>

            </div>
          </div>
          <h4 className='underline font-serif font-semibold'>
            For other uses, see Research (disambiguation). "Researched" redirects here. For the organisation, see ResearchED. "Researcher" redirects here. For other uses, see Researcher (disambiguation).
          </h4>
         </div>

         {/*image for the blog */}
         <div>
          <img src={Blog} alt="" className='w-full h-100 rounded-md'/>
         </div>

      </div>
     
    </div>
  );
};

export default BlogFullView;
