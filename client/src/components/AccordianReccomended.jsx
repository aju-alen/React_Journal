import React,{useEffect,useState} from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { wordLimitReccomendedTitle, wordLimitReccomendedAbstract } from '../helperFunctions';
import FullIssueHome from './FullIssueHome';
import FullIssueSearch from './FullIssueSearch';
import { Link } from 'react-router-dom';

export default function AccordianReccomended({articles}) {
    const [reccomendedArticles, setReccomendedArticles] = useState([])

    useEffect(() => {
        const fetchReccomendedArticles = async () => {
            setReccomendedArticles(articles)
        }
        fetchReccomendedArticles()
    })
    console.log(reccomendedArticles, 'reccomended articles');
   
  return (
    <div>
    <Accordion defaultExpanded >
      <AccordionSummary
        expandIcon={<ArrowDropDownIcon />}
        aria-controls="panel2-content"
        id="panel2-header"
      >
        <Typography>Recommended articles</Typography>
      </AccordionSummary>
      <AccordionDetails>
       {
       reccomendedArticles.map((article,index)=>(
        <div className="">
        <Link to={`/journal/EIJER/${article.id}`} >
        <Typography key={index} sx={{
            cursor:'pointer',
            fontSize:'1.3rem',
            fontFamily:'serif',
            color:'#0272b1',
        }}>
            {wordLimitReccomendedTitle(article.articleTitle)}
        </Typography>
        </Link>
        <Typography sx={{
            fontSize:'.9rem',
            color:'gray'
        
        }}>
            {wordLimitReccomendedAbstract(article.articleAbstract)}
        </Typography>
        </div>
       ))
       
    }
      </AccordionDetails>
      
    </Accordion>
    {/* <Accordion>
      <AccordionSummary
        expandIcon={<ArrowDropDownIcon />}
        aria-controls="panel2-content"
        id="panel2-header"
      >
        <Typography>Purchase Full Issue</Typography>
      </AccordionSummary>
      <AccordionDetails>
      <FullIssueHome purchase={false} />
      </AccordionDetails>
      
    </Accordion> */}

    <Accordion>
      <AccordionSummary
        expandIcon={<ArrowDropDownIcon />}
        aria-controls="panel2-content"
        id="panel2-header"
      >
        <Typography>Purchase Full Issue</Typography>
      </AccordionSummary>
      <AccordionDetails>
      <FullIssueSearch purchase={false}/>
      </AccordionDetails>
      
    </Accordion>
  </div>
  );
}
