import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { httpRoute } from '../helperFunctions'

const ImageHeaderArticle = ({catId}) => {

  const [journalCategory, setJournalCategory] = useState([])
  useEffect(() => {
    const fetchJournalCategory = async () => {
      const response = await axios.get(`${httpRoute}/api/journal/${catId}`)
      setJournalCategory(response.data)
    }
    fetchJournalCategory()
  }, [])

  console.log(journalCategory, 'journalCategory in image header article');
  
  return (
    <div className=" w-auto ">
    <img src="./images/desert.jpg" alt="cloud" className=' w-full h-80 relative object-cover' />
    <h2 className=' text-center font-bold text-2xl md:text-xl  md:h2-class absolute top-20 md:top-36 w-full md:text-center  text-black' >{journalCategory[0]?.journalTitle}</h2 >
    {/* <img src="./images/advertVol1Issue3.jpeg" alt="cloud" className=' w-full h-72 ' /> */}
    </div>
    
  )
}

export default ImageHeaderArticle