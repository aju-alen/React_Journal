import React,{useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ImageHeader from '../components/ImageHeader';
import { journals } from '../../data';
import { useParams } from 'react-router-dom';

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
    const [journal,setJournal] = useState(['a'])
    const [value, setValue] = React.useState(0);
    console.log(journal);

    const {catId,articleId} = useParams()

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    
    useEffect(()=>{
        const newJournal = journals.filter(journal=>{
            console.log(journal.category[0].slug == catId , journal.category[0])
            console.log(journal.id == articleId , journal.id,articleId)

           return journal.category[0].slug == catId && journal.id == articleId
         })

        setJournal(newJournal)
    },[])

    return (
        <div className="">
            <ImageHeader />
            <div className=" flex gap-3">
                
                <div className="flex flex-col">
                    <p>Views</p>
                    <p>{journal[0].views}</p>

                </div>
                <div className="">
                    <h2>{journal[0].title}</h2>
                    <p>
                        <span>authors</span>
                    </p>
                    <p>
                        <span>{journal[0].articleNo}</span>
                    </p>
                    <p>
                        <span>{journal[0].doiURL}</span>
                    </p>
                    <p>
                        <span>{journal[0].recievedDate}</span>
                        <span>{journal[0].acceptedDate}</span>
                        <span>{journal[0].publishedDate}</span>
                    </p>

                </div>
            </div>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Item One" {...a11yProps(0)} />
                        <Tab label="Item Two" {...a11yProps(1)} />
                        <Tab label="Item Three" {...a11yProps(2)} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>

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