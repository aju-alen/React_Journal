import React from 'react'
import { reviewerFAQ } from '../../data'
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import ImageHeader from './ImageHeader';
const ReviewerFAQ = () => {
  return (
    <div>
    <ImageHeader />
<Accordion>
   {reviewerFAQ.map(data => (
       <AccordionItem>
       <AccordionItemHeading>
           <AccordionItemButton>
              {data.title}
           </AccordionItemButton>
       </AccordionItemHeading>
       <AccordionItemPanel>
           <p>
               {data.content}
           </p>
       </AccordionItemPanel>
   </AccordionItem>
   ))}
    
</Accordion>
</div>
  )
}

export default ReviewerFAQ