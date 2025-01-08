import React,{useState,useEffect} from 'react'
import AccordianReccomended from './AccordianReccomended'
import axios from 'axios'
import { httpRoute } from '../helperFunctions'

const SingleArticleAbstractTab = ({ journal }) => {
  const [articles, setArticles] = useState([])
  useEffect(() => {
    const getPublishedArticles = async () => {
        try {
            const resp = await axios.get(`${httpRoute}/api/journalArticle/publishedArticle`)
            setArticles(resp.data)
        }
        catch (error) {
            console.log(error);
        }
    }
    getPublishedArticles()
}, [])
console.log(articles,'articles');
const reccomendedArticles = articles.slice(7)

  return (
    <div className='flex flex-col md:flex-row'>
      <div className="">
        <div className=" md:px-10 md:py-10">
          <h1 className="font-bold text-3xl  ">Abstract</h1>
          <p className="text-justify">{journal.articleAbstract}</p>
        </div>
        <div className=" md:px-10 md:py-10">
          <span className="font-bold text-xl  ">Keywords:</span>
          <span className="text-justify">{` ` + journal.articleKeywords}</span>
        </div>
      </div>
      <div className=' md:w-9/12 md:ml-auto ' >
      <AccordianReccomended articles={reccomendedArticles} />
      </div>
    </div>
  )
}

export default SingleArticleAbstractTab