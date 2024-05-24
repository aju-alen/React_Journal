import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className=' bg-[#543a31]   w-full'>
      <div className='md:flex-row flex flex-col  w-full h-full justify-around md:items-start items-center sm:gap-5 sm:text-xs font-extralight text-white md:my-6 text-md'>
        <div className="flex flex-col gap-6 text-center ">
          <Link  className='flex justify-center font-bold  '>Authors</Link>
          <Link to='/mansucript_handling_fee' className='  '>Fee for Publication</Link>
          <Link to='/faq/authorfaq' className='  '>FAQ for Authors </Link>
          <Link to='/waiver_policy' className='  '>Policy on Waivers</Link>

        </div>
        <div className=" flex flex-col gap-6 text-center mb-6">
          <Link to='/waiver_policy' className=' font-bold '>Editors & Reviewers</Link>
          
          <Link to='/faq/reviewfaq' className='  '>FAQ for Reviewers</Link>
          <Link to='/faq/editorfaq' className=' '>FAQ for Editors </Link>
          <Link to='/reviewers_guidelines' className=' '>Reviewers Guidelines</Link>
          <Link to='/peer_review' className=' '>Peer Review Process</Link>
          <Link to='/for_editors' className=' '>Editors</Link>
          <Link to='/editorial-board' className=' '>Editorial board</Link>
        </div>
        <div className="flex flex-col gap-6 text-center mb-6">
          <Link  className=' font-bold '>General </Link>
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