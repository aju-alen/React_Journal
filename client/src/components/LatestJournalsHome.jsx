import React from 'react'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { journals } from '../../data';
import { Carousel } from 'react-responsive-carousel';
import { Link } from 'react-router-dom';

const LatestJournalsHome = ({width}) => {
    
    return (
        <div className=' h-auto w-auto '>
            <h2 className=' text-center font-bold text-3xl my-4'>View Latest Journal</h2>
            <div className=' flex justify-center h-auto'>
                 <Carousel className='' width={width} showThumbs={false}  showArrows={true} infiniteLoop="true">
                    {journals.map(journal => (
                        <React.Fragment key={journal.id}>
                            <div className=' max-h-auto overflow-y-auto border-2 border-black h-2/3 '>
                                <div className=" flex flex-col justify-between gap-4 p-10">
                                    <h2 className=' uppercase text-yellow-400 font-bold w-5/6 text-left p-2'>
                                        {journal.title}
                                    </h2>
                                    <p className=' text-left p-2'>
                                        {journal.acceptedDate} | {journal.volNo}
                                    </p>
                                    <p className=' text-justify font-light'>
                                        {journal.abstract}
                                    </p>
                                    <Link to="/" className='font-bold text-lg  border-2 rounded p-3 border-green bg-green-400'>
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