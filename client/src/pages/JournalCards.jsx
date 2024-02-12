import React from 'react'
import ImageHeader from '../components/ImageHeader'
import { Link,useParams } from 'react-router-dom'
import { journals } from '../../data'



const JournalCards = () => {
    const {catId} = useParams()
    
  
    

  return (
    <div className="h-auto w-auto bg-slate-200 ">
        <ImageHeader/>
    <h1 className='text-center font-bold text-4xl mt-6'>Journals</h1>
      <div className=" md:w-4/6 mx-auto  ">
                {journals.filter(journal => journal.category[0].slug === catId ).map(journal => (
                    <div key={journal.id} className=" bg-white rounded-md flex flex-col gap-2 mt-8 h-auto  ">
                        
                       
                        <h3 className=' font-medium mx-6 mt-10 '>{journal.title}</h3>
                        <p className=' mx-6 text-sm text-justify'>{journal.publishedDate}</p>
                        <p className=' mx-6 text-sm'>Authors: {journal.authors.map((author,idx) => (
                            <React.Fragment key={idx}>{author} | </React.Fragment>

                        ))}</p>
                        
                        <p className='  mx-6'>
                            <span>doi: {journal.doiURL}</span> |
                            <span> Article Number: {journal.articleNo}</span>
                            </p>

                        <Link to={`/journal/${journal.category[0].slug}/${journal.id}`} className='font-bold border-2 rounded p-2 mx-6 border-greenS bg-green-400 md:w-1/6 sm: text-center  mb-4  '>
                            <button>View Article</button>
                        </Link>
                    </div>
                ))}
            </div>
    </div>
  )
}

export default JournalCards