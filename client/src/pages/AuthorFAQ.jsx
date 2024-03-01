import React from 'react'
import AuthorFaqComponent from '../components/AuthorFaqComponent';
import 'react-accessible-accordion/dist/fancy-example.css';
import ImageHeader from '../components/ImageHeader';

const AuthorFAQ = () => {
    return (
        <div>
             <ImageHeader />
            <AuthorFaqComponent/>
        </div>
    );
}

export default AuthorFAQ