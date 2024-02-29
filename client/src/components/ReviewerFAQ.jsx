import React from 'react'
import { reviewerFAQ } from '../../data'

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ImageHeader from './ImageHeader';
const ReviewerFAQ = () => {
  return (
    <div className="">
    <ImageHeader />
    <div className=' mx-10 p-14'>
        
    {reviewerFAQ.map((faq,idx) =>(
<Accordion className='p-4 m-2'>
        <AccordionSummary
        expandIcon={<ArrowDropDownIcon />}
        aria-controls="panel1-content"
        id={`panel${idx}-header`}
      >
        <Typography>{faq.title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
         {faq.content}
        </Typography>
      </AccordionDetails>
</Accordion>
    )) }


</div>
</div>
  )
}

export default ReviewerFAQ