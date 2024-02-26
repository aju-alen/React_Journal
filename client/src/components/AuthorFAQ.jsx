import React from 'react'
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';

import 'react-accessible-accordion/dist/fancy-example.css';
import { authorFAQ } from '../../data';
import ImageHeader from './ImageHeader';

const AuthorFAQ = () => {
    return (
        <div>
             <ImageHeader />
        <Accordion>
            {authorFAQ.map(data => (
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
    );
}

export default AuthorFAQ