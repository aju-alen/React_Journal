import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className=' bg-[#543a31]   w-full'>
      <div className='md:flex-row flex flex-col  w-full h-full justify-around items-center sm:gap-5 sm:text-xs font-extralight text-white md:my-6 text-md'>
        <div className="flex flex-col gap-6 text-center my-6">
          <Link to='/mansucript_handling_fee' className='flex justify-center  '>Fee for Publication</Link>
          <Link to='/waiver_policy' className='  '>Policy on Waivers</Link>
          <Link to='/faq/authorfaq' className='  '>FAQ for Authors & Review</Link>
          <Link to='/faq/reviewfaq' className='  '>FAQ for Reviewers</Link>
        </div>
        <div className=" flex flex-col gap-6 text-center mb-6">
          <Link to='/faq/editorfaq' className=' '>FAQ for Editors </Link>
          <Link to='/reviewers_guidelines' className=' '>Reviewers Guidelines</Link>
          <Link to='/peer_review' className=' '>Peer Review Process</Link>
          <Link to='/for_editors' className=' '>Editors</Link>
        </div>
        <div className="flex flex-col gap-6 text-center mb-6">
          <Link to='/policies' className=' '>Policies </Link>
          <Link to='/contact' className=' '>Contact Us </Link>
          <Link to='/all_articles.rss' className=' '>Subscribe to RSS </Link>
          <Link to='/terms' className=' '>Terms of Use </Link>
        </div>
      </div>
    </div>
  )
}

export default Footer