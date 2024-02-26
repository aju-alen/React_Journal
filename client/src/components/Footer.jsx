import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className=' bg-slate-500 h-48 flex'>
      <div className='flex flex-col'>
        <Link to ='/mansucript_handling_fee' className='text-white text-lg'>Fee for Publication</Link>
        <Link to ='/waiver_policy' className='text-white text-lg'>Policy on Waivers</Link>
        <Link to ='/faq/authorfaq' className='text-white text-lg'>FAQ for Authors & Review</Link>
        <Link to ='/faq/reviewfaq' className='text-white text-lg'>FAQ for Reviewers</Link>
        <Link to ='/faq/editorfaq' className='text-white text-lg'>FAQ for Editors </Link>
        <Link to ='/reviewers_guidelines' className='text-white text-lg'>Reviewers Guidelines</Link>
        <Link to ='/peer_review' className='text-white text-lg'>Peer Review Process</Link>
        <Link to ='/for_editors' className='text-black text-lg'>Editors</Link>
        <Link to ='/policies' className='text-black text-lg'>Policies </Link>
        <Link to ='/contact' className='text-black text-lg'>Contact Us </Link>
        <Link to ='/all_articles.rss' className='text-black text-lg'>Subscribe to RSS </Link>
        <Link to ='/terms' className='text-black text-lg'>Terms of Use </Link>
      </div>
    </div>
  )
}

export default Footer