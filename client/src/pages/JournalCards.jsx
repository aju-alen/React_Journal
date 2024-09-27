import React, { useEffect, useState } from 'react'
import ImageHeader from '../components/ImageHeader'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { DNA } from 'react-loader-spinner'
import { getDates } from '../helperFunctions'
import { httpRoute } from '../helperFunctions.js'
import FullIssueHome from '../components/FullIssueHome.jsx'
import AccordianReccomended from '../components/AccordianReccomended.jsx'
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const JournalCards = () => {
    const [articles, setArticles] = useState([])
    const [journalCategory, setJournalCategory] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [slicedArticles, setSlicedArticles] = useState([])

    useEffect(() => {
        setSlicedArticles(articles.slice((currentPage - 1) * 10, currentPage * 10))
    }, [currentPage])

    const handlePageChange = (event, value) => {
        console.log(value, 'value--value');
        
        setCurrentPage(value);
      };

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


    useEffect(() => {
        const fetchJournalCategory = async () => {
            const resp = await axios(`${httpRoute}/api/journal`)
            setJournalCategory(resp.data)
            console.log('child component fn called');
        }
        fetchJournalCategory()
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
    console.log(journalCategory, 'journal category data called');
    const reccomendedArticles = articles.slice(7)
    return (
        <div className="h-auto w-auto bg-slate-200 ">
            <ImageHeader />
            <h1 className='text-center font-bold text-4xl mt-6'>Emirates International Journal Of Empirical Research (EIJER)</h1>
            <div className="flex flex-col items-center mt-4 ">
                <h3 className='mx-10 text-lg mb-3 font-medium '>Journal description</h3>
                <p className=' text-justify mx-10 text-sm md:w-3/4'>
                    {journalCategory[0]?.journalDescription}
                </p>
            </div>
            <div className="flex flex-col md:flex-row">
                <div className="md:w-9/12 mx-auto pb-10">
                    {slicedArticles?.map(journal => {
                        return (
                            <div key={journal.id} className="bg-white rounded-md flex flex-col gap-2 mt-8 h-auto md:w-11/12 md:mx-auto">
                                <h3 className='font-medium mx-6 mt-10'>{journal?.articleTitle}</h3>
                                <div className="flex flex-col justify-center items-center">
                                    <p className='mx-6 text-sm text-justify'>Published on: {getDates(journal.articlePublishedDate)}</p>
                                    <p className='mx-6 p-2 text-sm'>Authors: {journal.articleAuthors.map((author, idx) => (
                                        <React.Fragment key={idx}>| {author.authorGivenName} {author.authorLastName} </React.Fragment>
                                    ))}</p>
                                    <p className='mx-6'>
                                        <span>Article Number - A000{journal.id.split('').splice(4, journal.id.length - 5 - 27).join('')}</span>
                                    </p>
                                </div>
                                <Link to={`/journal/EIJER/${journal.id}`}>
                                    <div className="flex justify-center items-center">
                                        <button className='font-bold border-2 rounded p-2 mx-6 border-greenS bg-green-400 md:w-1/6 sm:text-center mb-4'>View Article</button>
                                    </div>
                                </Link>
                            </div>
                            
                        )
                        
                    })}
                     <Stack spacing={2} sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            margin: '10px 0' 
                     }} >
                     <Pagination count={Math.ceil(articles.length/10)} shape="rounded"   page={currentPage}
        onChange={handlePageChange} />
                     </Stack>
                </div>
                <div className=" md:w-3/12 mt-8 md:mx:auto">
                    <AccordianReccomended articles={reccomendedArticles} />
                </div>
            </div>

            {/* <FullIssueHome purchase={true} /> */}
        </div>
    )
}

export default JournalCards