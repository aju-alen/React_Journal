import React from 'react'
import { Link } from 'react-router-dom'

const NavLinksStatic = ({handleMobileNavBar}) => {
    const isMobile = handleMobileNavBar !== undefined;
    
    const linkClassName = isMobile 
        ? "hover:text-[#543a31] transition-colors duration-200 font-medium py-2"
        : "hover:text-[#543a31] transition-colors duration-200 text-sm sm:text-base";

    return (
        <>
            <Link to="/" onClick={handleMobileNavBar} className={linkClassName}>Home</Link>
            <Link to="/journal/publications" onClick={handleMobileNavBar} className={linkClassName}>Journals</Link>
            <Link to="/proceedings" onClick={handleMobileNavBar} className={linkClassName}>Proceedings</Link>
            <Link to="/conferences" onClick={handleMobileNavBar} className={linkClassName}>Conferences</Link>
        </>
    )
}

export default NavLinksStatic