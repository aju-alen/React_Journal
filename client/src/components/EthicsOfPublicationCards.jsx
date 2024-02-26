import React from 'react'
import { EthicsOfPublicationdata } from '../../data'
import { Link } from 'react-router-dom'


const EthicsOfPublicationCards= () => {
   
    return (
        <div className=" w-full h-auto bg-white p-4">
            <h2 className='text-3xl font-bold text-center'>Ethics of Publication</h2>
            <div className=' flex'>
            {EthicsOfPublicationdata.map(data  => (
                <Link to={`/ethics${data.link}`} className='md:border-4 border-black '  key={data.link}>
                <div className='md:border-2 border-black '  >
                    <h2 className='text-3xl font-bold text-center'>{data.EthicsOfPublicationTitle}</h2>
                    <p className='text-justify '>{data.EthicsOfPublicationContent}</p>
                </div>
                </Link>
            )) }
            </div>
        </div>
    )
}

export default EthicsOfPublicationCards