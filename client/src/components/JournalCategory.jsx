import { useState, useEffect, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { journalCategory } from '../../data'
import axios from 'axios'
import React from 'react'
import { DNA } from 'react-loader-spinner'
import { httpRoute } from '../helperFunctions.js'


const JournalCategory = () => {
    const [journalCategory, setJournalCategory] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchJournalCategory = async () => {
            const resp = await axios(`${httpRoute}/api/journal`)
            setJournalCategory(resp.data)
            setLoading(false)

            console.log('child component fn called');
        }
        fetchJournalCategory()
    }, [])
    console.log(journalCategory,'journal category data called');
    return (
        <div>
           {!loading ? (<div className=" w-full h-auto bg-white p-4">
                <div className='   md:grid md:grid-cols-4 sm:grid sm:grid-cols-1 gap-2 justify-center'>

                    {journalCategory.map(data => (
                        <Fragment key={data.id}>
                            <Link to='/' className='relative md:border-4 border-black '>
                                <img src={data.journalImageURL} className=' bg-slate-900 object-cover' />
                                <div className={`absolute md:top-0 md:left-0 w-full h-full  opacity-60`} style={{ backgroundColor: `${data.color}` }}></div>
                                <p className='absolute bottom-24 left-10 z-1 text-xl font-bold text-gray-900 '>
                                    {data.journalTitle}
                                </p>
                            </Link>
                        </Fragment>
                    ))}

                </div>
                <div className=" p-6 text-center">
                    <Link to="/journal" className='font-bold text-lg  border-2 rounded p-3 border-green bg-green-400 '>
                        <button>View All Journals</button>
                    </Link>
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

export default JournalCategory