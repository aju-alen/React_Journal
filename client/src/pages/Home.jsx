import React from 'react'
import { Link } from 'react-router-dom'
import HeaderImage from '../components/HeaderImage'
import ServicesHome from '../components/ServicesHome'
import JournalCategory from '../components/JournalCategory'
import LatestJournalsHome from '../components/LatestJournalsHome'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div>
      <HeaderImage />

      <ServicesHome />

      <JournalCategory />

      {window.innerWidth >= 919 && <LatestJournalsHome />}
      
    </div>
  )
}

export default Home