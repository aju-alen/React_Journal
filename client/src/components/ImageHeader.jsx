import React from 'react'
import { Link } from 'react-router-dom'

const ImageHeader = () => {
  return (
<div className=" w-auto ">
    <img src="./images/desert.jpg" alt="cloud" className=' w-full h-80 relative object-cover' />
    {/* <Link to='/register'>
    <img src="./images/advertVol1Issue3.jpeg" alt="cloud" className=' w-full sm:h-72 md:h-auto ' />
    </Link> */}

    </div>
  )
}

export default ImageHeader