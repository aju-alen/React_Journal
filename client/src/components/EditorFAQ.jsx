



import React from 'react'
import { editorFAQ } from '../../data'
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import ImageHeader from './ImageHeader';
const EditorFAQ = () => {
  return (
    <div>
    <ImageHeader />
<Accordion>
   {editorFAQ.map(data => (
       <AccordionItem key={data.title}>
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

export default EditorFAQ