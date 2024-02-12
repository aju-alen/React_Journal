import React from 'react'
import { Link } from 'react-router-dom'
import { journalCategory } from '../../data'

const JournalCategory = () => {
    return (
        <div className=" w-full h-auto bg-white p-4">
            <div className='   md:grid md:grid-cols-4 sm:grid sm:grid-cols-1 gap-2 justify-center'>

                {journalCategory.map(data => (
                    <React.Fragment key={data.id}>
                        <Link to='/' className='relative md:border-4 border-black '>
                            <img src={data.imgURL} className=' bg-slate-900 object-cover' />
                            <div className={`absolute md:top-0 md:left-0 w-full h-full  opacity-60`} style={{backgroundColor:`${data.color}`}}></div>
                            <p className='absolute top-2 left-10 z-1 text-xl font-bold'>
                                {data.title}
                            </p>
                        </Link>
                    </React.Fragment>
                ))}
                
            </div>
            <div className=" p-6 text-center">
                    <Link to="/journal" className='font-bold text-lg  border-2 rounded p-3 border-green bg-green-400 '>
                        <button>View All Journals</button>
                    </Link>
                </div>
        </div>
    )
}

export default JournalCategory