import React, { useState, useEffect } from 'react';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ImageHeaderArticle from '../components/ImageHeaderArticle';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { getDates } from '../helperFunctions';
import SingleArticleAbstractTab from '../components/SingleArticleAbstractTab';
import { httpRoute, axiosTokenHeader } from '../helperFunctions.js';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import { useNavigate } from 'react-router-dom'
import { DNA } from 'react-loader-spinner'
import FullIssueHome from '../components/FullIssueHome.jsx'



export default function Article() {
    const navigate = useNavigate()
    const { articleId } = useParams()
    const [journal, setJournal] = useState([])
    const [loading, setLoading] = useState(true)
    const [userSubscriptionData, setUserSubscriptionData] = useState({})
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

    useEffect(() => {
        try {

            const getSubscriptionDetails = async () => {
                axios.defaults.headers.common['Authorization'] = axiosTokenHeader();
                console.log(currentUser.user.email, 'currentUser.user.email in article');
                const userSubscription = await axios.get(`${httpRoute}/api/subscription/user-details/${currentUser.user.email}`);
                console.log('api loaded');
                console.log(userSubscription.data.getSubscription, 'userSubscription in article');
                setUserSubscriptionData(userSubscription?.data?.getSubscription)
            }

            getSubscriptionDetails();
        } catch (err) {
            console.log(err);
        }
    }, [])

    const handleCheckSubscription = () => {
        if (userSubscriptionData) {
            let currentTimeUnix = Math.floor(Date.now() / 1000);
            if (userSubscriptionData.subscriptionEndDate > currentTimeUnix) {
                window.open(getPublicManuscriptUrl)
            } else {
                navigate('/productDisplay')
            }
        } else {
            return (
                navigate('/productDisplay')
            )
        }
    }

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
                    <div className="flex justify-center items-center w-12/12 mx-auto ">
    <div className="w-52 justify-center items-center hidden md:block">
        <img src="./images/logo.jpeg" />
    </div>
    <div className="flex-1 w-full px-4 md:px-12 py-4">
      {/* Article Title */}
      <h2 className="text-lg md:text-xl lg:text-2xl font-medium text-left mb-4">
        {journal.articleTitle}
      </h2>

      {/* Authors */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-4">
        {journal?.articleAuthors?.map((author, idx) => (
          <p key={idx} className="text-sm md:text-base font-bold">
            {author.authorGivenName + ' ' + author.authorLastName}
            {idx < journal.articleAuthors.length - 1 && <span className="ml-1">•</span>}
          </p>
        ))}
      </div>

      {/* Article Details */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-2 text-sm md:text-base mb-4">
        <span>
          Article Number - A000{journal?.id?.split('').splice(4, journal.id.length - 5 - 27).join('')}
        </span>
        <span className="hidden sm:inline">|</span>
        <span>
          Vol-{journal?.articleVolume} Issue-{journal?.articleIssue}
        </span>
      </div>

      {/* Dates */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-2 text-xs md:text-sm text-gray-600">
        <span>Received: {getDates(journal.articleReceivedDate)}</span>
        <span className="hidden sm:inline">|</span>
        <span>Accepted: {getDates(journal.articleAcceptedDate)}</span>
        <span className="hidden sm:inline">|</span>
        <span>Published: {getDates(journal.articlePublishedDate)}</span>
      </div>
    </div>
    <div className="w-48 py-8 hidden md:block">
        {/* <FullIssueHome purchase={false} /> */}
        {
            journal?.articleIssue === 1 && journal.articleVolume === 1 ? (
                <img src="./images/vol1_issue1.jpg"  className= 'w-full' />

            ):journal?.articleIssue === 2 && journal.articleVolume === 1 ? (
                <img src="./images/vol1_issue2.jpg"  className= 'w-full' />

            ):(
                null
            )
        }
    </div>
</div>

                    <Box sx={{ width: '100%', typography: 'body1' }}>
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleChange} aria-label="lab API tabs example">
                                    <Tab label="Abstract" value="1" />
                                    {
                                        currentUser ?
                                            <Tab label="Full PDF" value="2" onClick={handleCheckSubscription} />
                                            : <Tab label="Full PDF" value="2" onClick={handleClick({ vertical: 'top', horizontal: 'center' })} />
                                    }

                                    {/* <Tab label="Item Three" value="3" /> */}
                                </TabList>
                            </Box>
                            <TabPanel value="1">
                                <div className="">
                                <SingleArticleAbstractTab journal={journal} />
                                    
                                </div>
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
