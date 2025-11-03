import EthicsOfPublicationCards from '../components/EthicsOfPublicationCards'
import HeaderImage from '../components/HeaderImage'
import LatestJournalsHome from '../components/LatestJournalsHome'
import ServicesHome from '../components/ServicesHome'
import { useState, useEffect } from 'react'

const Home = () => {
  const [journalWidth, setJournalWidth] = useState('350px')

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1536) {
        setJournalWidth('1400px')
      } else if (window.innerWidth >= 919) {
        setJournalWidth('950px')
      } else {
        setJournalWidth('350px')
      }
    }

    handleResize() // Initial check
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="pt-16 md:pt-0">
        <HeaderImage />
      </div>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <ServicesHome />
        
        <section className="mt-12 sm:mt-16 md:mt-20">
          <h2 className="text-center font-bold text-3xl sm:text-4xl md:text-5xl text-gray-900 mb-6 sm:mb-8">
            About Us
          </h2>
          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
            <p className="text-justify text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed px-2 sm:px-0">
              Scientific Journals Portal (SJP) is the publishing brand of Right
              Intellectual Services Enterprise (RISE) Ltd., DIFC, Dubai, UAE. SJP
              serves as a publisher for a wide range of hybrid – open and
              subscription access journals that undergo rigorous peer review.
              With a diverse collection of journals, and journal publications,
              Scientific Journals Portal (SJP), covers various disciplines including
              arts and humanities, engineering, medical science, social sciences,
              biological sciences, physical sciences, and agricultural sciences.
            </p>
            <p className="text-justify text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed px-2 sm:px-0">
              The portal's purpose is to provide a geo-agnostic springboard for
              research across multiple disciplines through peer reviewed
              publications supported by our able editorial board which consists
              of personas of reputable academia pedigree. The primary objective
              of SJP is to expedite the sharing of knowledge by publishing
              research articles of exceptional quality, while adhering to the
              principles of knowledge sharing and accessibility for the benefit of
              all.
            </p>
          </div>
        </section>

        <section className="mt-12 sm:mt-16 md:mt-20">
          <EthicsOfPublicationCards />
        </section>

        <section className="mt-12 sm:mt-16 md:mt-20">
          <LatestJournalsHome width={journalWidth} />
        </section>
      </main>
    </div>
  )
}

export default Home