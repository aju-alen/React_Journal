import React, { useEffect,useState } from 'react'
import ImageHeader from '../components/ImageHeader'
import { Link,useParams } from 'react-router-dom'
import { journals } from '../../data'
import axios from 'axios'



const JournalCards = () => {
    const {catId} = useParams()
    const [articles, setArticles] = useState([])
    
  useEffect(() => {
    const getPublishedArticles= async () => {
        try{
            const resp = await axios.get(`http://localhost:3001/api/journalArticle/publishedArticle`)
            setArticles(resp.data)
        }
        catch(error){
            console.log(error);
        }
    }
    getPublishedArticles()
  }, [])
    
console.log(articles,'articles');
if (!Array.isArray(articles) || articles.length === 0) {
    // Handle empty or non-array user prop
    return (
      <div>No Published Articles Avaialable</div>
    );
  }
  return (
    <div className="h-auto w-auto bg-slate-200 ">
        <ImageHeader/>
    <h1 className='text-center font-bold text-4xl mt-6'>Journals</h1>
      <div className=" md:w-4/6 mx-auto  ">
                {articles?.map(journal => {
                return (
                    <div key={journal.id} className=" bg-white rounded-md flex flex-col gap-2 mt-8 h-auto  ">
                        <h3 className=' font-medium mx-6 mt-10 '>{journal?.articleTitle}</h3>
                        <p className=' mx-6 text-sm text-justify'>{journal.articlePublishedDate}</p>
                        <p className=' mx-6 text-sm'>Authors: {journal.articleAuthors.map((author,idx) => (
                            <React.Fragment key={idx}>{author.authorGivenName} | </React.Fragment>

                        ))}</p>
                        
                        <p className='  mx-6'>
                            <span>doi: lkmlkmlkm</span> |
                            <span> Article Number: {journal.id}</span>
                            </p>

                        <Link to={`/journal/EIJOER/${journal.id}`} >
                            <button className='font-bold border-2 rounded p-2 mx-6 border-greenS bg-green-400 md:w-1/6 sm: text-center  mb-4'  >View Article</button>
                        </Link>
                    </div>
                )})}
            </div>
    </div>
  )
}

export default JournalCards