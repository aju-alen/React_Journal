import React from 'react'
import { Link } from 'react-router-dom'

const ServicesHome = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"))
    console.log(currentUser, 'in servicesHome');
    return (
        <div className="bg-gradient-to-r from-[#e8dcd4] to-[#f1ded7] rounded-2xl shadow-lg p-6 sm:p-8 md:p-12 my-8 sm:my-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                <div className="service-class group transition-transform duration-300 hover:scale-105">
                    <div className="bg-white rounded-full p-4 mb-4 shadow-md group-hover:shadow-xl transition-shadow duration-300 w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mx-auto">
                        <img src='./images/submit.png' alt='Submit' className='w-12 h-12 sm:w-16 sm:h-16 object-contain' />
                    </div>
                    <Link 
                        to={currentUser ? `/dashboard/${currentUser?.user?.id}?tab=1`:`/login`} 
                        className='font-medium text-sm sm:text-base md:text-lg border-2 rounded-lg px-4 py-2 sm:px-6 sm:py-3 border-[#543a31] bg-white text-[#543a31] hover:bg-[#543a31] hover:text-white transition-all duration-300 block text-center shadow-sm hover:shadow-md'
                    >
                        <button>Submit Manuscript</button>
                    </Link>
                </div>
                <div className="service-class group transition-transform duration-300 hover:scale-105">
                    <div className="bg-white rounded-full p-4 mb-4 shadow-md group-hover:shadow-xl transition-shadow duration-300 w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mx-auto">
                        <img src='./images/submit.png' alt='Journals' className='w-12 h-12 sm:w-16 sm:h-16 object-contain' />
                    </div>
                    <Link 
                        to='/journal/publications' 
                        className='font-medium text-sm sm:text-base md:text-lg border-2 rounded-lg px-4 py-2 sm:px-6 sm:py-3 border-[#543a31] bg-white text-[#543a31] hover:bg-[#543a31] hover:text-white transition-all duration-300 block text-center shadow-sm hover:shadow-md'
                    >
                        <button>Journals</button>
                    </Link>
                </div>
                <div className="service-class group transition-transform duration-300 hover:scale-105">
                    <div className="bg-white rounded-full p-4 mb-4 shadow-md group-hover:shadow-xl transition-shadow duration-300 w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mx-auto">
                        <img src='./images/newspaper.png' alt='Newspaper' className='w-12 h-12 sm:w-16 sm:h-16 object-contain' />
                    </div>
                    <Link 
                        to='/proceedings' 
                        className='font-medium text-sm sm:text-base md:text-lg border-2 rounded-lg px-4 py-2 sm:px-6 sm:py-3 border-[#543a31] bg-white text-[#543a31] hover:bg-[#543a31] hover:text-white transition-all duration-300 block text-center shadow-sm hover:shadow-md'
                    >
                        <button>Proceedings</button>
                    </Link>
                </div>
                <div className="service-class group transition-transform duration-300 hover:scale-105">
                    <div className="bg-white rounded-full p-4 mb-4 shadow-md group-hover:shadow-xl transition-shadow duration-300 w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mx-auto">
                        <img src='./images/law.png' alt='Conferences' className='w-12 h-12 sm:w-16 sm:h-16 object-contain' />
                    </div>
                    <Link 
                        to='/conferences' 
                        className='font-medium text-sm sm:text-base md:text-lg border-2 rounded-lg px-4 py-2 sm:px-6 sm:py-3 border-[#543a31] bg-white text-[#543a31] hover:bg-[#543a31] hover:text-white transition-all duration-300 block text-center shadow-sm hover:shadow-md'
                    >
                        <button>Conferences</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ServicesHome