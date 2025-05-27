import React, { useEffect, useState } from 'react'
import ImageHeader from '../components/ImageHeader'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { DNA } from 'react-loader-spinner'
import { getDates } from '../helperFunctions'
import { httpRoute } from '../helperFunctions.js'
import FullIssueHome from '../components/FullIssueHome.jsx'
import AccordianReccomended from '../components/AccordianReccomended.jsx'
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const JournalCards = () => {
    const { catId } = useParams();
    console.log(catId, 'catId');
    
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
                const resp = await axios.get(`${httpRoute}/api/journalArticle/publishedArticle/${catId}`)
                setArticles(resp.data)
                console.log(resp.data, 'published articles--');
                setSlicedArticles(resp.data.slice(0, 10))
                
            }
            catch (error) {
                console.log(error);
            }
        }
        getPublishedArticles()
    }, [])


    useEffect(() => {
        const fetchJournalCategory = async () => {
            const resp = await axios(`${httpRoute}/api/journal/${catId}`)
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
        <div className="min-h-screen bg-gray-100">
            <ImageHeader />
            <div className="container mx-auto px-4 py-8">
                <h1 className='text-center font-bold text-4xl mt-6 text-gray-800'>{`${journalCategory[0]?.journalTitle} (${journalCategory[0]?.journalAbbreviation})`}</h1>
                <div className="flex flex-col items-center mt-6 mb-10">
                    <h3 className='text-xl mb-4 font-semibold text-gray-700'>Journal Description</h3>
                    <p className='text-justify max-w-4xl text-gray-600 '>
                        {journalCategory[0]?.journalDescription}
                    </p>
                </div>
                
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-9/12">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Published Articles</h2>
                        {slicedArticles?.map(journal => (
                            <div key={journal.id} className="bg-white rounded-lg shadow-md p-6 mb-6 transition-all hover:shadow-lg">
                                <h3 className='font-semibold text-lg mb-3 text-gray-800'>{journal?.articleTitle}</h3>
                                <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-4">
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>Published: {getDates(journal.articlePublishedDate)}</span>
                                    </div>
                                    <div className="flex items-center ml-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span>Authors: {journal.articleAuthors.map((author, idx) => (
                                            <React.Fragment key={idx}>
                                                {idx > 0 && ", "}
                                                {author.authorGivenName} {author.authorLastName}
                                            </React.Fragment>
                                        ))}</span>
                                    </div>
                                </div>
                                <p className='text-sm text-gray-500 mb-4'>
                                    Article Number: A000{journal.id.split('').splice(4, journal.id.length - 5 - 27).join('')}
                                </p>
                                <Link to={`/journal/EIJER/${journal.id}`}>
                                    <button className='px-4 py-2 bg-green-500 text-white font-medium rounded hover:bg-green-600 transition-colors'>
                                        View Article
                                    </button>
                                </Link>
                            </div>
                        ))}
                        
                        <div className="mt-8 mb-6">
                            <Stack spacing={2} sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <Pagination 
                                    count={Math.ceil(articles.length/10)} 
                                    shape="rounded" 
                                    page={currentPage}
                                    onChange={handlePageChange} 
                                    color='primary' 
                                    size="large"
                                />
                            </Stack>
                        </div>
                    </div>
                    
                    <div className="md:w-3/12">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Recommended</h2>
                        <AccordianReccomended articles={reccomendedArticles.slice(0, 5)} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JournalCards