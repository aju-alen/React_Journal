import React from 'react'
import HeaderImage from '../components/HeaderImage'
import ServicesHome from '../components/ServicesHome'
import LatestJournalsHome from '../components/LatestJournalsHome'
import EthicsOfPublicationCards from '../components/EthicsOfPublicationCards'

const Home = () => {

  return (
       <div>
        <HeaderImage />

        <ServicesHome />
        <div>
            <h2 className="text-center">About Us
      <p>Scientific Journals Portal serves as a publisher for a wide range of open access journals that undergo rigorous peer review. With a diverse collection of over 100 journals, we cover various disciplines including art and humanities, engineering, medical science, social sciences, biological sciences, physical sciences, and agricultural sciences. Our primary objective is to expedite the sharing of knowledge by publishing research articles of exceptional quality, while adhering to the principles of open access.</p>
</h2>
        </div>

        <EthicsOfPublicationCards />

        {window.innerWidth >= 919 && <LatestJournalsHome />}
    </div>
  )
}

export default Home