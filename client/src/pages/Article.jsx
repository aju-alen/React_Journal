import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ImageHeaderArticle from '../components/ImageHeaderArticle';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { getDates } from '../helperFunctions';
import SingleArticleAbstractTab from '../components/SingleArticleAbstractTab';



export default function Article() {
    const { articleId } = useParams()
    const [journal, setJournal] = useState([])
    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };



    useEffect(() => {
        const getSinglePublishedArticle = async () => {
            const resp = await axios.get(`http://localhost:3001/api/journalArticle/singlePublishedArticle/${articleId}`)
            console.log(resp.data, 'resp in single article');
            setJournal(resp.data[0])
        }

        getSinglePublishedArticle()
    }, [])
    console.log(journal, "journal in article");
    return (
        <div>
            <ImageHeaderArticle />
            <div className="">
                <h2 className=' p-2 md:p-6 text-left font-medium text-xl md:text-2xl'>
                    {journal.articleTitle}
                </h2>
                <div className="flex gap-2 md:gap-12 justify-center mt-2 font-bold   ">
                    {journal?.articleAuthors?.map(author => (
                        <p className=' text-md md:text-xl '>
                            {author.authorGivenName}</p>
                    ))}
                </div>
                <div className="flex gap-2 md:gap-3 justify-center mt-2 ">
                    <span> Article Number - A000{journal.id}  | </span>
                    <span> Vol 20 - {getDates(journal.articlePublishedDate)} </span>
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
                            <Tab label="Full PDF" value="2" />
                            <Tab label="Item Three" value="3" />
                        </TabList>
                    </Box>
                    <TabPanel value="1">
                        <SingleArticleAbstractTab journal={journal} />
                    </TabPanel>
                    <TabPanel value="2">Item Two</TabPanel>
                    <TabPanel value="3">Item Three</TabPanel>
                </TabContext>
            </Box>
        </div>
    );
}
