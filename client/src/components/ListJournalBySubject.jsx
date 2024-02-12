import React from 'react'
import { Link } from 'react-router-dom'

const ListJournalBySubject = () => {
  return (
    <div className=" text-lg p-4 bg-white m-4 border-8 border-white rounded text-blue-500">
    <Link className='m-2'>List All Journal</Link>
    <hr className=' border-t-2 border-black m-2 ' ></hr>
    <Link className='m-2'>Medical Sciences</Link>
    <hr className='border-t-2 border-black m-2'></hr>
    <Link className='m-2'>Social Sciences</Link>
    <hr className='border-t-2 border-black m-2'></hr>
    <Link className='m-2'>Biological Sciences</Link>
    <hr className='border-t-2 border-black m-2'></hr>
    <Link className='m-2'>Agricultural Sciences</Link>
    <hr className='border-t-2 border-black m-2'></hr>
    <Link className='m-2'>Physical Sciences</Link>
    <hr className='border-t-2 border-black m-2'></hr>
    <Link className='m-2'>Engineering</Link>
    <hr className='border-t-2 border-black m-2'></hr>
    <Link className='m-2'>Arts and Education</Link>
    <hr className='border-t-2 border-black m-2'></hr>
    <Link className='m-2'>Legal Studies</Link>
    <hr className='border-t-2 border-black m-2'></hr>
    <Link className='m-2'>Other Journals</Link>
    <hr className='border-t-2 border-black m-2'></hr>
  </div>
  )
}

export default ListJournalBySubject