import React,{useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ImageHeader from '../components/ImageHeader';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
  

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function Article() {
    const [journal,setJournal] = useState()
    const [value, setValue] = React.useState(0);
    console.log(journal);

    const {catId,articleId} = useParams()

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    
    useEffect(()=>{
       const getSinglePublishedArticle = async () => {
        const resp = await axios.get(`http://localhost:3001/api/journalArticle/singlePublishedArticle/${articleId}`)
        console.log(resp.data, 'resp in single article');
        setJournal(journal)
       }

       getSinglePublishedArticle()
    },[])

    return (
        <div className="">
            <ImageHeader />
            <div className=" flex justify-center items-center">
                <div className="">
                    <h2 className=' text-xl mt-10 font-medium'>{journal[0].title}</h2>
                    <p className=' mt-7'>
                        {journal[0].authors?.map((author, idx) => (
                            <span key={idx} className=' text-md font-bold'>{author} </span>
                        ))}
                    </p>
                    <p  className=' mt-5'>
                        <span className=' font-extralight '>Article Number - {journal[0].articleNo} | Vol.15(5), pp. 42-49 , September 2023 | </span>
                    </p>
                    <p>
                        <span className=' font-extralight text-blue-700 '>{journal[0].doiURL}</span>
                    </p>
                    <p>
                        <span className=' font-extralight '>📆 Received: {journal[0].recievedDate} | </span>
                        <span className=' font-extralight '>📆 Accepted: {journal[0].acceptedDate} | </span>
                        <span className=' font-extralight '>📆 Published: {journal[0].publishedDate} | </span>
                    </p>

                </div>
            </div>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Abstract" {...a11yProps(0)} />
                        <Link to='https://drive.google.com/file/d/1SCxv7e1J1ehUXAw-ygLGBQNC5Y1A4HMS/view?usp=sharing'>
                        <Tab label="Full Pdf" {...a11yProps(1)} />
                        </Link>
                     
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <div className=" px-28">
                        <h2 className=' text-2xl font-bold'>Abstract</h2>
                        <p className=' text-justify'>{journal[0].abstract}</p>
                        <p className=' mt-3 '><span className=' text-lg font-bold'>Keywords</span>:{journal[0].keywords}</p>
                        <Link to='https://drive.google.com/file/d/1SCxv7e1J1ehUXAw-ygLGBQNC5Y1A4HMS/view?usp=sharing'>
                        <p className=' mt-3 text-sm font-extralight '>📄 Full Text PDF</p>
                        </Link>
                    </div>
                    
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    Item Two
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                    Item Three
                </CustomTabPanel>
            </Box>
        </div>
    );
}