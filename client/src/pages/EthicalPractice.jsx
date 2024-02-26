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

    {window.innerWidth >= 919 && <LatestJournalsHome />}
</div>
  )
}

export default EthicalPractice