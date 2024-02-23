import React from 'react'
import { Link } from 'react-router-dom'

const NavLinksStatic = () => {
    return (
        <>
            <Link to="/">Home</Link>
            <Link to="/journal/EIJOER" >Journals</Link>
            <Link to="/proceedings" >Proceedings</Link>
            <Link to="/" >Conferences</Link>
            
        </>
    )
}

export default NavLinksStatic