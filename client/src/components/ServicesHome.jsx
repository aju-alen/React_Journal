import React from 'react'
import { Link } from 'react-router-dom'

const ServicesHome = () => {
    return (
        <div className="bg-gray-200   md:flex md:flex-row md:justify-around md:items-center  md:h-60 ">

            <div className="service-class">
                <img src='./images/submit.png' alt='Submit' className='w-20 h-20' />
                <Link to='/' className='font-bold text-lg border-2 rounded p-3 border-black'>
                    <button>Submit Manuscript</button>
                </Link>
            </div>
            <div className="service-class">
                <img src='./images/submit.png' alt='Submit' className='w-20 h-20' />
                <Link to='/' className='font-bold text-lg border-2 rounded p-3 border-black'>
                    <button>Submit Manuscript</button>
                </Link>
            </div>
            <div className="service-class">
                <img src='./images/newspaper.png' alt='Newspaper' className='w-20 h-20' />
                <Link to='/' className='font-bold text-lg border-2 rounded p-3 border-black'>
                    <button>Submit Manuscript</button>
                </Link>
            </div>
            <div className="service-class">
                <img src='./images/law.png' alt='Law' className='w-20 h-20' />
                <Link to='/' className='font-bold text-lg border-2 rounded p-3 border-black'>
                    <button>Submit Manuscript</button>
                </Link>
            </div>
        </div>
    )
}

export default ServicesHome