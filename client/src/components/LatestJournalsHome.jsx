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
        <div className='container mx-auto px-4 py-12 max-w-6xl'>
            <h2 className='text-center font-bold text-4xl mb-12 text-gray-800 relative'>
                Latest Publications
                <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-yellow-400 mt-2'></div>
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
                >
                    {articles.map(journal => (
                        <React.Fragment key={journal.id}>
                            <div className='bg-white rounded-xl shadow-xl p-8 mx-auto mb-8 max-w-4xl transform transition-all duration-300 hover:shadow-2xl'>
                                <div className="flex flex-col gap-6">
                                    <h2 className='text-3xl font-bold text-gray-800 border-l-4 border-yellow-400 pl-4 leading-tight'>
                                        {journal.articleTitle}
                                    </h2>
                                    <div className='flex flex-col gap-3 text-gray-600 bg-gray-50 p-4 rounded-lg'>
                                        <p className='text-center font-medium'>
                                            {journal.articleAuthors.map((author, idx) => (
                                                <span key={idx} className='mx-1 hover:text-green-600 transition-colors duration-200'>
                                                    {`${author.authorGivenName} ${author.authorLastName}`}
                                                    {idx < journal.articleAuthors.length - 1 ? ' •' : ''}
                                                </span>
                                            ))}
                                        </p>
                                        <p className='text-center text-sm flex justify-center items-center gap-2'>
                                            <span className='bg-green-100 text-green-700 px-3 py-1 rounded-full'>
                                                Published: {getDates(journal.articleAcceptedDate)}
                                            </span>
                                            <span className='bg-blue-100 text-blue-700 px-3 py-1 rounded-full'>
                                                Volume {journal.articleVolume}, Issue {journal.articleIssue}
                                            </span>
                                        </p>
                                    </div>
                                    <p className=' md:text-justify leading-relaxed text-gray-700 bg-gray-50 p-6 rounded-lg'>
                                        {journal.articleAbstract.substring(0, 800)}...
                                    </p>
                                    <div className='text-center pt-4'>
                                        <Link 
                                            to={`/journal/EIJER/${journal.id}`} 
                                            className='inline-block px-8 py-3 bg-green-500 text-white font-semibold rounded-full hover:bg-green-600 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg'
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