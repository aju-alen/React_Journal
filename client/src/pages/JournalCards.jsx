import React, { useEffect,useState } from 'react'
import ImageHeader from '../components/ImageHeader'
import { Link,useParams } from 'react-router-dom'
import { journals } from '../../data'
import axios from 'axios'
import { DNA } from 'react-loader-spinner'
import { getDates } from '../helperFunctions'
import { httpRoute } from '../helperFunctions.js'
import FullIssueHome from '../components/FullIssueHome.jsx'

const JournalCards = () => {
    const {catId} = useParams()
    const [articles, setArticles] = useState([])
    
  useEffect(() => {
    const getPublishedArticles= async () => {
        try{
            const resp = await axios.get(`${httpRoute}/api/journalArticle/publishedArticle`)
            setArticles(resp.data)
        }
        catch(error){
            console.log(error);
        }
    }
    getPublishedArticles()
  }, [])
    
// console.log(articles,'articles');
if (!Array.isArray(articles) || articles.length === 0) {
    // Handle empty or non-array user prop
    return (
      <div className='  min-h-screen flex items-center justify-center '>
          <DNA
  visible={true}
  height="80"
  width="80"
  ariaLabel="dna-loading"
  wrapperStyle={{}}
  wrapperClass="dna-wrapper"
  />
      </div>
    );
  }
  return (
    <div className="h-auto w-auto bg-slate-200 ">
        <ImageHeader/>
    <h1 className='text-center font-bold text-4xl mt-6'>Emirates International Journal Of Empirical Research</h1>
      <div className=" md:w-4/6 mx-auto  ">
                {articles?.map(journal => {
                return (
                    <div key={journal.id} className=" bg-white rounded-md flex flex-col gap-2 mt-8 h-auto  ">
                        <h3 className=' font-medium mx-6 mt-10 '>{journal?.articleTitle}</h3>
                        <div className=" flex flex-col justify-center items-center">
                        <p className=' mx-6 text-sm text-justify'> Published on: {getDates(journal.articlePublishedDate)}</p>
                        <p className=' mx-6 p-2 text-sm'>Authors: {journal.articleAuthors.map((author,idx) => (
                            <React.Fragment key={idx}>{author.authorGivenName}  {author.authorLastName } | </React.Fragment>
                        ))}</p>
                        
                        <p className='  mx-6'>
                            {/* <span>doi: testlive.com</span> | */}
                            <span> Article Number - A000{journal.id.split('').splice(4,journal.id.length-5-27).join('')}</span>
                            </p>
                            </div>
                        <Link to={`/journal/EIJER/${journal.id}`} >
                            <div className="flex justify-center items-center">

                            <button className='  font-bold border-2 rounded p-2 mx-6 border-greenS bg-green-400 md:w-1/6 sm: text-center  mb-4'  >View Article</button>
                            </div>
                        </Link>
                    </div>
                )})}
            </div>
            <FullIssueHome/>
    </div>
  )
}

export default JournalCards