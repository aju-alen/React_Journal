import React, { useState, useEffect } from 'react';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ImageHeaderArticle from '../components/ImageHeaderArticle';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { getDates } from '../helperFunctions';
import SingleArticleAbstractTab from '../components/SingleArticleAbstractTab';
import { httpRoute } from '../helperFunctions.js';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import { DNA } from 'react-loader-spinner'



export default function Article() {
    const { articleId } = useParams()
    const [journal, setJournal] = useState([])
    const [loading, setLoading] = useState(true)
    const [value, setValue] = React.useState('1');
    const currentUser = JSON.parse(localStorage.getItem("currentUser"))
    const [state, setState] = React.useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
    });

    const { vertical, horizontal, open } = state;

    const handleClick = (newState) => () => {
        setState({ ...newState, open: true });
    };

    const handleClose = () => {
        setState({ ...state, open: false });
    };




    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    let getPublicManuscriptUrl = ` https://s3-scientific-journal.s3.ap-south-1.amazonaws.com/${journal.userId}/${journal.awsId}/${journal.publicPdfName}`
    console.log(getPublicManuscriptUrl, 'getpublicArticleUrl in article');

    useEffect(() => {
        const getSinglePublishedArticle = async () => {
            const resp = await axios.get(`${httpRoute}/api/journalArticle/singlePublishedArticle/${articleId}`)
            console.log(resp.data, 'resp in single article');
            setJournal(resp.data[0])
            setLoading(false)
        }

        getSinglePublishedArticle()
    }, [])
    console.log(journal, "journal in article");
    const articleYear = journal.articlePublishedDate
    const year = new Date(articleYear).getFullYear()
    console.log(year, 'year');
    return (
        <div>
            {loading ? ((<div className='flex justify-center items-center h-96'>
                <DNA
                    visible={true}
                    height="80"
                    width="80"
                    ariaLabel="dna-loading"
                    wrapperStyle={{}}
                    wrapperClass="dna-wrapper"
                />
            </div>)) : (
                <div>
                    <ImageHeaderArticle />
                    <div className="">
                        <h2 className=' p-2 md:p-6 text-left font-medium text-xl md:text-2xl'>
                            {journal.articleTitle}
                        </h2>
                        <div className="flex gap-2 md:gap-12 justify-center mt-2 font-bold   ">
                            {journal?.articleAuthors?.map((author, idx) => (
                                <p key={idx} className=' text-md md:text-xl '>
                                    {author.authorGivenName + author.authorLastName}</p>
                            ))}
                        </div>
                        <div className="flex gap-2 md:gap-3 justify-center mt-2 ">
                            <span> Article Number - A000{journal?.id?.split('').splice(4, journal.id.length - 5 - 27).join('')}  | </span>
                            <span> Vol-{journal?.articleVolume} Issue-{journal?.articleIssue}   </span>

                        </div>
                        <div className=" text-center  mt-2  text-sm md:text-lg">
                            <span>Recieved: {getDates(journal.articleReceivedDate)} | </span>
                            <span> Accepted: {getDates(journal.articleAcceptedDate)} |</span>
                            <span>Published: {getDates(journal.articlePublishedDate)}</span>
                        </div>
                    </div>
                    <Box sx={{ width: '100%', typography: 'body1' }}>
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleChange} aria-label="lab API tabs example">
                                    <Tab label="Abstract" value="1" />
                                    {
                                        currentUser ? <a href={getPublicManuscriptUrl} target="_blank" rel="noreferrer">
                                            <Tab label="Full PDF" value="2" />
                                        </a> : <Tab label="Full PDF" value="2" onClick={handleClick({ vertical: 'top', horizontal: 'center' })} />
                                    }
                                    {/* <a href={getPublicManuscriptUrl} target="_blank" rel="noreferrer">
                            <Tab label="Full PDF" value="2" />
                            </a> */}
                                    {/* <Tab label="Item Three" value="3" /> */}
                                </TabList>
                            </Box>
                            <TabPanel value="1">
                                <SingleArticleAbstractTab journal={journal} />
                            </TabPanel>
                            <TabPanel value="2">
                            </TabPanel>
                            <TabPanel value="3">Item Three</TabPanel>
                        </TabContext>
                    </Box>
                    <Box sx={{ width: 500 }}>

                        <Snackbar
                            anchorOrigin={{ vertical, horizontal }}
                            open={open}
                            onClose={handleClose}
                            message="Please login or register to have full access to the article"
                            key={vertical + horizontal}
                        />
                    </Box>
                </div>
            )}

        </div>
    );
}
