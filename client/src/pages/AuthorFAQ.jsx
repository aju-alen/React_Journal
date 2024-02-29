import React from 'react'
import AuthorFaq from '../components/AuthorFaq';

import 'react-accessible-accordion/dist/fancy-example.css';
import ImageHeader from '../components/ImageHeader';

const AuthorFAQ = () => {
    return (
        <div>
             <ImageHeader />
            <AuthorFaq/>
        </div>
    );
}

export default AuthorFAQ