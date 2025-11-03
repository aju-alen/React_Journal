import React, { useEffect, useState } from 'react'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { journals } from '../../data';
import { Carousel } from 'react-responsive-carousel';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getDates, httpRoute } from '../helperFunctions';

const LatestJournalsHome = ({width}) => {
    const [articles, setArticles] = useState([])

    useEffect(() => {
        const getPublishedArticles= async () => {
            try{
                const resp = await axios.get(`${httpRoute}/api/journalArticle/publishedArticle`)
                setArticles(resp.data)
            }
            catch(error){
                console.log(error);
            }
        }
        getPublishedArticles()
    },[])
    console.log(articles,'articles in home ');
    return (
        <div className='container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-6xl'>
            <h2 className='text-center font-bold text-3xl sm:text-4xl md:text-5xl mb-8 sm:mb-12 text-gray-800 relative pb-4'>
                Latest Publications
                <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 sm:w-24 h-1 bg-yellow-400'></div>
            </h2>
            <div className='flex justify-center items-center w-full'>
                <Carousel 
                    className='w-full'
                    width="100%" 
                    showThumbs={false} 
                    showArrows={true}
                    showStatus={false}
                    infiniteLoop={true}
                    autoPlay={true}
                    interval={6000}
                    stopOnHover={true}
                    swipeable={true}
                    emulateTouch={true}
                    renderArrowPrev={(onClickHandler, hasPrev) =>
                        hasPrev && (
                            <button
                                onClick={onClickHandler}
                                className="absolute left-2 sm:left-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 sm:p-3 shadow-lg transition-all duration-300 hover:scale-110"
                                aria-label="Previous"
                            >
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                        )
                    }
                    renderArrowNext={(onClickHandler, hasNext) =>
                        hasNext && (
                            <button
                                onClick={onClickHandler}
                                className="absolute right-2 sm:right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 sm:p-3 shadow-lg transition-all duration-300 hover:scale-110"
                                aria-label="Next"
                            >
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        )
                    }
                >
                    {articles.map(journal => (
                        <React.Fragment key={journal.id}>
                            <div className='bg-white rounded-xl shadow-xl p-4 sm:p-6 md:p-8 mx-auto mb-8 max-w-4xl transform transition-all duration-300 hover:shadow-2xl'>
                                <div className="flex flex-col gap-4 sm:gap-6">
                                    <h2 className='text-xl sm:text-2xl md:text-3xl text-left md:text-center font-bold text-gray-800 border-l-4 border-yellow-400 pl-3 sm:pl-4 leading-tight'>
                                        {journal.articleTitle}
                                    </h2>
                                    <div className='flex flex-col gap-2 sm:gap-3 text-gray-600 bg-gray-50 p-3 sm:p-4 rounded-lg'>
                                        <p className='text-center font-medium text-sm sm:text-base'>
                                            {journal.articleAuthors.map((author, idx) => (
                                                <span key={idx} className='mx-1 hover:text-green-600 transition-colors duration-200'>
                                                    {`${author.authorGivenName} ${author.authorLastName}`}
                                                    {idx < journal.articleAuthors.length - 1 ? ' •' : ''}
                                                </span>
                                            ))}
                                        </p>
                                        <div className='text-center text-xs sm:text-sm flex flex-wrap justify-center items-center gap-2'>
                                            <span className='bg-green-100 text-green-700 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap'>
                                                Published: {getDates(journal.articleAcceptedDate)}
                                            </span>
                                            <span className='bg-blue-100 text-blue-700 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap'>
                                                Vol. {journal.articleVolume}, Iss. {journal.articleIssue}
                                            </span>
                                        </div>
                                    </div>
                                    <p className='text-left md:text-justify leading-relaxed text-sm sm:text-base text-gray-700 bg-gray-50 p-4 sm:p-6 rounded-lg'>
                                        {journal.articleAbstract.substring(0, 300)}...
                                    </p>
                                    <div className='text-center pt-2 sm:pt-4'>
                                        <Link 
                                            to={`/journal/EIJER/${journal.id}`} 
                                            className='inline-block px-6 sm:px-8 py-2 sm:py-3 bg-green-500 text-white text-sm sm:text-base font-semibold rounded-full hover:bg-green-600 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg'
                                        >
                                            Read Full Article →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    ))}
                </Carousel>
            </div>
        </div>
    )
}

export default LatestJournalsHome