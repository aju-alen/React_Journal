import React, { useEffect, useState } from 'react'
import ImageHeader from '../components/ImageHeader'
import { Link, useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { DNA } from 'react-loader-spinner'
import { getDates } from '../helperFunctions'
import { httpRoute } from '../helperFunctions.js'
import FullIssueHome from '../components/FullIssueHome.jsx'
import AccordianReccomended from '../components/AccordianReccomended.jsx'
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box
} from '@mui/material';

const JournalCards = () => {
    const { catId } = useParams();
    const navigate = useNavigate();
    
    const [articles, setArticles] = useState([])
    const [journalCategory, setJournalCategory] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [slicedArticles, setSlicedArticles] = useState([])
    const [selectedJournal, setSelectedJournal] = useState('');
    const [journalAbbreviation, setJournalAbbreviation] = useState('');
    const [journalDescription, setJournalDescription] = useState('');
    const [journalList, setJournalList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // Add effect to monitor journalCategory changes
    useEffect(() => {
        console.log('Journal Category Updated:', journalCategory);
    }, [journalCategory]);

    useEffect(() => {
        setSlicedArticles(articles.slice((currentPage - 1) * 10, currentPage * 10))
    }, [currentPage, articles])

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    useEffect(() => {
        const getJournalList = async () => {
            try {
                setLoading(true);
                const getJournalList = await axios.get(`${httpRoute}/api/journal`);
                setJournalList(getJournalList.data);
                
                // If there's a catId in the URL, set the initial journal
                if (catId && catId !== 'publications') {
                    const currentJournal = getJournalList.data.find(journal => journal.journalAbbreviation === catId);
                    if (currentJournal) {
                        setSelectedJournal(currentJournal.id);
                        setJournalAbbreviation(currentJournal.journalAbbreviation);
                        setJournalCategory([{
                            journalTitle: currentJournal.journalTitle,
                            journalAbbreviation: currentJournal.journalAbbreviation,
                            journalDescription: currentJournal.journalDescription
                        }]);
                        // Fetch articles for the initial journal
                        const resp = await axios.get(`${httpRoute}/api/journalArticle/publishedArticle/${currentJournal.journalAbbreviation}`);
                        setArticles(resp.data);
                        setSlicedArticles(resp.data.slice(0, 10));
                    }
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
                setIsInitialLoad(false);
            }
        };
        getJournalList();
    }, [catId]);

    useEffect(() => {
        setLoading(true);
        const fetchJournalCategory = async () => {
            const resp = await axios(`${httpRoute}/api/journal/${catId}`)
            // setJournalCategory(resp.data)
            console.log('child component fn called');
            setLoading(false);
        }
        fetchJournalCategory()
    }, [])

    // console.log(articles,'articles');
    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
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

    if (!Array.isArray(articles)) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <p className="text-gray-600">No articles available</p>
            </div>
        );
    }
    const reccomendedArticles = articles.slice(7)
    return (
        <div className="min-h-screen bg-gray-100">
            <ImageHeader />
            <div className="w-full px-4 sm:px-6 md:px-8">
                <Box 
                    sx={{ 
                        width: {
                            xs: '100%',    // Full width on mobile
                            sm: '80%',     // 80% width on small screens
                            md: '80%',     // 60% width on medium screens
                            lg: '80%'      // 40% width on large screens
                        },
                        marginX: 'auto',  // Center the dropdown
                        marginTop: '10px'
                    }}
                >
                    <FormControl fullWidth>
                        <InputLabel 
                            id="journal-select-label"
                            sx={{
                                fontSize: {
                                    xs: '0.875rem',  // Smaller font on mobile
                                    sm: '1rem'       // Normal font on larger screens
                                }
                            }}
                        >
                            Select Journal
                        </InputLabel>
                        <Select
                            labelId="journal-select-label"
                            id="journal-select"
                            value={selectedJournal}
                            label="Select Journal"
                            onChange={async (event) => {
                                try {
                                    setLoading(true);
                                    const selectedId = event.target.value;
                                    const selectedJournal = journalList.find(journal => journal.id === selectedId);
                                    
                                    setSelectedJournal(selectedId);
                                    setJournalAbbreviation(selectedJournal.journalAbbreviation);
                                    
                                    setJournalCategory([{
                                        journalTitle: selectedJournal.journalTitle,
                                        journalAbbreviation: selectedJournal.journalAbbreviation,
                                        journalDescription: selectedJournal.journalDescription
                                    }]);
                                    
                                    const resp = await axios.get(`${httpRoute}/api/journalArticle/publishedArticle/${selectedJournal.journalAbbreviation}`);
                                    setArticles(resp.data);
                                    setSlicedArticles(resp.data.slice(0, 10));
                                    
                                    await navigate(`/journal/${selectedJournal.journalAbbreviation}`);
                                } catch (error) {
                                    console.error('Error during navigation:', error);
                                } finally {
                                    setLoading(false);
                                }
                            }}
                            sx={{
                                backgroundColor: 'white',
                                borderRadius: 1,
                                height: {
                                    xs: '40px',  // Smaller height on mobile
                                    sm: '48px'   // Normal height on larger screens
                                },
                                fontSize: {
                                    xs: '0.875rem',  // Smaller font on mobile
                                    sm: '1rem'       // Normal font on larger screens
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(0, 0, 0, 0.23)',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'primary.main',
                                },
                                '& .MuiSelect-select': {
                                    padding: {
                                        xs: '8px 14px',  // Smaller padding on mobile
                                        sm: '10px 16px'  // Normal padding on larger screens
                                    }
                                }
                            }}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        maxHeight: {
                                            xs: '200px',  // Smaller max height on mobile
                                            sm: '300px'   // Normal max height on larger screens
                                        }
                                    }
                                }
                            }}
                        >
                            {journalList.map(journal => (
                                <MenuItem 
                                    key={journal.id}
                                    value={journal.id}
                                    sx={{
                                        fontSize: {
                                            xs: '0.875rem',
                                            sm: '1rem'
                                        }
                                    }}
                                >
                                    {journal.journalTitle}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </div>
            
            {!isInitialLoad && !loading && selectedJournal && (
                <div className="container mx-auto px-4 py-8">
                    {journalCategory[0] && (
                        <h1 className='text-center font-bold text-4xl mt-6 text-gray-800'>
                            {`${journalCategory[0].journalTitle || ''} ${journalCategory[0].journalAbbreviation ? `(${journalCategory[0].journalAbbreviation})` : ''}`}
                        </h1>
                    )}
                    <div className="flex flex-col items-center mt-6 mb-10">
                        <h3 className='text-2xl mb-4 font-semibold text-gray-700 border-b-2 border-gray-300 pb-2'>Journal Description</h3>
                        <div 
                            className='text-left md:text-justify max-w-4xl text-gray-600 prose prose-lg'
                            dangerouslySetInnerHTML={{ 
                                __html: journalCategory[0]?.journalDescription || 'No description available'
                            }}
                        />
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
                                    <Link to={`/journal/${journalCategory[0].journalAbbreviation}/${journal.id}`}>
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
                            <AccordianReccomended articles={articles.slice(0, 5)} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default JournalCards