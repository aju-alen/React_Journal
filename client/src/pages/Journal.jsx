import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { sortJournalByAZ } from '../helperFunctions'
import ListJournalBySubject from '../components/ListJournalBySubject'
import axios from 'axios'
import { DNA } from 'react-loader-spinner'
const Journal = () => {
  const [journalCategory, setJournalCategory] = useState([])
  const [loading, setLoading] = useState(true)
  const sortedJournal = sortJournalByAZ(journalCategory)
  console.log(sortedJournal, 'sortedJournal');

  useEffect(() => {
    const fetchAllJournalCategory = async () => {
      const resp = await axios('http://localhost:3001/api/journal')
      setJournalCategory(resp.data)
      console.log(resp.data, 'journalCategory in useEffect');
      setLoading(false)
    }
    fetchAllJournalCategory()
  }, [])


  return (
    <div>
     {!loading ? (<div className="h-auto w-auto ">
        <img src="./images/cloud-main-img.jpg" alt="cloud" className=' w-full md:h-auto' />
        <h1 className=' text-3xl font-semibold mb-6 text-center p-4'>Journals</h1>
        <div className="min-h-screen md:flex  gap-6 md:p-10">
          <div className=" md:w-2/6   rounded bg-slate-100 h-2/6 ">
            <h2 className="  text-3xl font-semibold mb-6 text-center p-4">
              Browse By Subject
            </h2>
            <ListJournalBySubject />
          </div>
          <div className="w-full">
            <h2 className='text-3xl font-semibold mb-6'>Journals by Title</h2>
            <div className=" flex flex-col item gap-7 p-6">
              {Object.entries(sortedJournal).map(([key, value]) => (
                <React.Fragment key={key} >
                  <div className=" text-left p-2 text-3xl underline  ">
                    {key}
                  </div>
                  <div className="">
                    {value.map(data => (
                      <Link to={`/journal/${data.id}`} key={data.id} className=" ml-5 flex flex-col mb-6  text-blue-500">

                        {data.journalTitle}
                      </Link>
                    ))}
                  </div>
                </React.Fragment>
              ))}
            </div>

          </div>
        </div>
      </div>):
      (<div className='flex justify-center items-center h-96'>
        <DNA
          visible={true}
          height="80"
          width="80"
          ariaLabel="dna-loading"
          wrapperStyle={{}}
          wrapperClass="dna-wrapper"
        />
      </div>)
      }
    </div>
  )
}

export default Journal


