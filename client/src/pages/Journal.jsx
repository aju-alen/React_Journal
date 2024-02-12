import React from 'react'
import { Link } from 'react-router-dom'
import { journals } from '../../data'
import { sortJournalByAZ } from '../helperFunctions'
import { journalCategory } from '../../data'
import ListJournalBySubject from '../components/ListJournalBySubject'
const Journal = () => {

  const sortedJournal = sortJournalByAZ(journalCategory) 


  return (
    <div className="h-auto w-auto ">
      <img src="./images/cloud-main-img.jpg" alt="cloud" className=' w-full md:h-auto' />
      <h1 className=' text-3xl font-semibold mb-6 text-center p-4'>Journals</h1>
      <div className="min-h-screen md:flex  gap-6 md:p-10">
        <div className=" md:w-2/6   rounded bg-slate-100 h-2/6 ">
        <h2 className="  text-3xl font-semibold mb-6 text-center p-4">
        Browse By Subject
        </h2>
          <ListJournalBySubject/>
        </div>
        <div className="w-full">
        <h2 className='text-3xl font-semibold mb-6'>Journals by Title</h2>
          <div className=" flex flex-col item gap-7 p-6">
            {Object.entries(sortedJournal).map(([key,value]) => (
             <React.Fragment key={key} >
              
              <div className=" text-left p-2 text-3xl underline  ">
                {key}
              </div>
              <div className="">
                {value.map(data=>(
                  <Link to={`/journal/${data.slug}`} key={data.id} className=" ml-5 flex flex-col mb-6  text-blue-500">
                    {console.log(data)}
                    {data.title}
                  </Link>
                ))}
              </div>
             </React.Fragment>
            ))}
          </div>
        
        </div>
      </div>
    </div>
  )
}

export default Journal


