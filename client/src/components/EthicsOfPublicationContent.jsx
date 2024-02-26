import React from 'react'
import { ethicalpractice, authorship, submission } from '../../data'
import { useParams } from 'react-router-dom';
import AuthorFAQ from './AuthorFAQ';

const EthicsOfPublicationContent = () => {
  const { ethicalSlug } = useParams()
  console.log(ethicalSlug, 'ethicalSlug');
  return (
    <div>

      {ethicalSlug === 'ethicalpractice' && ethicalpractice.map(data => (
        <div key={data.title} className=' flex flex-col'>
          <h3 className=' text-lg font-bold'>{data.title}</h3>
          <p>{data.content}</p>
        </div>
      ))}

      {ethicalSlug === 'authorship' && authorship.map(data => (
        <div key={data.title} className=' flex flex-col'>
          <h3 className=' text-lg font-bold'>{data.title}</h3>
          <p>{data.content}</p>
        </div>
      ))}
      {ethicalSlug === 'submission' && submission.map(data => (
        <div key={data.title} className=' flex flex-col'>
          <h3 className=' text-lg font-bold'>{data.title}</h3>
          <p>{data.content}</p>
        </div>
      ))}
      {ethicalSlug === 'authorship' && (
        <div>
        Authors FAQ
        <AuthorFAQ/>
        </div>
      )}
    </div>
  )
}

export default EthicsOfPublicationContent