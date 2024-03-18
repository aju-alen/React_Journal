import React from 'react'
import HeaderImage from '../components/HeaderImage'
import ServicesHome from '../components/ServicesHome'
import LatestJournalsHome from '../components/LatestJournalsHome'
import EthicsOfPublicationContent from '../components/EthicsOfPublicationContent'


const EthicalPractice = () => {
  return (
    <div>
    <HeaderImage />

    <ServicesHome />

    <EthicsOfPublicationContent/>

    {window.innerWidth >= 1536 && <LatestJournalsHome width={'1400px'} />}
      {window.innerWidth >= 919 && window.innerWidth <= 1535 && <LatestJournalsHome width={'950px'} />}
      {window.innerWidth <= 919 && <LatestJournalsHome width={'350px'} />}</div>
  )
}

export default EthicalPractice