import React from 'react'
import { journalCategory } from '../../data'
import { sortJournalByAZ } from '../helperFunctions'
const Journal = () => {
  console.log(sortJournalByAZ(journalCategory));
  
  return (
    <div className="h-auto w-auto bg-gray-300">
    <img src="./images/cloud-main-img.jpg" alt="cloud" className=' w-full md:h-auto' />

    </div>
  )
}

export default Journal