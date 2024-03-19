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
        <div className=' h-auto w-auto '>
            <h2 className=' text-center font-bold text-3xl my-4'>View Latest Journal</h2>
            <div className=' flex justify-center h-auto'>
                 <Carousel className='' width={width} showThumbs={false}  showArrows={true} infiniteLoop="true">
                    {articles.map(journal => (
                        <React.Fragment key={journal.id}>
                            <div className=' max-h-auto overflow-y-auto border-2 border-black h-2/3 '>
                                <div className=" flex flex-col justify-between gap-4 p-10">
                                    <h2 className=' uppercase text-yellow-400 font-bold w-5/6 text-left p-2'>
                                        {journal.articleTitle}
                                    </h2>
                                    <p className=' text-left p-2'>
                                        {getDates(journal.articleAcceptedDate)} | Vol.22(12), pp. 322-328
                                    </p>
                                    <p className=' text-justify font-light'>
                                        {journal.articleAbstract.substring(0, 800)}...
                                    </p>
                                    <Link to={`/journal/EIJER/${journal.id}`} className='font-bold text-lg  border-2 rounded p-3 border-green bg-green-400'>
                                        <button>Read More</button>
                                    </Link>
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