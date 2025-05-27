import React from 'react'
import { Link } from 'react-router-dom'

const NavLinksStatic = ({handleMobileNavBar}) => {

    return (
        <>
            <Link to="/" onClick={handleMobileNavBar} >Home</Link>
            <Link to="/journal" onClick={handleMobileNavBar} >Journals</Link>
            <Link to="/proceedings" onClick={handleMobileNavBar} >Proceedings</Link>
            <Link to="/conferences" onClick={handleMobileNavBar} >Conferences</Link>
            
        </>
    )
}

export default NavLinksStatic