import React from 'react'
import { Link } from 'react-router-dom'

const ServicesHome = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"))
    console.log(currentUser, 'in servicesHome');
    return (
        <div className="bg-[#e8dcd4] border-2 p-12 md:flex md:flex-row md:justify-around md:items-center    md:h-60 ">

            <div className="service-class py-5">
                <img src='./images/submit.png' alt='Submit' className='w-20 h-20' />
                <Link to={currentUser ? `/dashboard/${currentUser?.user?.id}?tab=1`:`/login`} className='font-light text-lg border-2 rounded p-3 border-black'>
                    <button>Submit Manuscript</button>
                </Link>
            </div>
            <div className="service-class py-5">
                <img src='./images/submit.png' alt='Submit' className='w-20 h-20' />
                <Link to='/journal/publications' className='font-light text-lg border-2 rounded p-3 border-black '>
                    <button>Journals</button>
                </Link>
            </div>
            <div className="service-class py-5">
                <img src='./images/newspaper.png' alt='Newspaper' className='w-20 h-20' />
                <Link to='/proceedings' className='font-light text-lg border-2 rounded p-3 border-black'>
                    <button>Proceedings</button>
                </Link>
            </div>
            <div className="service-class py-5">
                <img src='./images/law.png' alt='Law' className='w-20 h-20' />
                <Link to='/conferences' className='font-light text-lg border-2 rounded p-3 border-black'>
                    <button>Conferences</button>
                </Link>
            </div>
        </div>
    )
}

export default ServicesHome