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
    <div className="min-h-screen bg-gray-50">
      <HeaderImage />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ServicesHome />
        
        <section className="mt-16">
          <h2 className="text-center font-bold text-4xl text-gray-900 mb-8">
            About Us
          </h2>
          <p className="text-justify max-w-4xl mx-auto text-lg text-gray-700 leading-relaxed">
            Scientific Journals Portal (SJP) is the publishing brand of Right
            Intellectual Services Enterprise (RISE) Ltd., DIFC, Dubai, UAE. SJP
            serves as a publisher for a wide range of hybrid – open and
            subscription access journals that undergo rigorous peer review.
            With a diverse collection of journals, and journal publications,
            Scientific Journals Portal (SJP), covers various disciplines including
            arts and humanities, engineering, medical science, social sciences,
            biological sciences, physical sciences, and agricultural sciences.
          </p>
          <p className="mt-4 text-justify max-w-4xl mx-auto text-lg text-gray-700 leading-relaxed">
            The portal's purpose is to provide a geo-agnostic springboard for
            research across multiple disciplines through peer reviewed
            publications supported by our able editorial board which consists
            of personas of reputable academia pedigree. The primary objective
            of SJP is to expedite the sharing of knowledge by publishing
            research articles of exceptional quality, while adhering to the
            principles of knowledge sharing and accessibility for the benefit of
            all.
          </p>
        </section>

        <section className="mt-16">
          <EthicsOfPublicationCards />
        </section>

        <section className="mt-16">
          <LatestJournalsHome width={journalWidth} />
        </section>
      </main>
    </div>
  )
}

export default Home