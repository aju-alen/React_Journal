import HeaderImage from '../components/HeaderImage'
import ServicesHome from '../components/ServicesHome'
import LatestJournalsHome from '../components/LatestJournalsHome'
import EthicsOfPublicationCards from '../components/EthicsOfPublicationCards'
import FullIssueHome from '../components/FullIssueHome'
import { Link } from 'react-router-dom'
const Home = () => {

  return (
    
    <div>
      <HeaderImage />
      {/* <Link to='/register'>
      <img src="./images/advertVol1Issue3.jpeg" alt="cloud" className=' w-full ' />
      </Link> */}
      <ServicesHome />
      <div className='mt-4'>
     
        <h2 className=" text-center font-bold text-3xl">About Us</h2>
        <p className=' text-justify p-10 md:px-44'>Scientific Journals Portal (SJP) is the publishing brand of Right
Intellectual Services Enterprise (RISE) Ltd., DIFC, Dubai, UAE. SJP
serves as a publisher for a wide range of hybrid – open and
subscription access journals that undergo rigorous peer review.
With a diverse collection of journals, and journal publications,
Scientific Journals Portal (SJP), covers various disciplines including
arts and humanities, engineering, medical science, social sciences,
biological sciences, physical sciences, and agricultural sciences.
The portal's purpose is to provide a geo-agnostic springboard for
research across multiple disciplines through peer reviewed
publications supported by our able editorial board which consists
of personas of reputable academia pedigree. The primary objective
of SJP is to expedite the sharing of knowledge by publishing
research articles of exceptional quality, while adhering to the
principles of knowledge sharing and accessibility for the benefit of
all.</p>
      </div>
<div className="mt-4 ">
      <EthicsOfPublicationCards />
</div>
<div className="">
{window.innerWidth >= 1536 && <LatestJournalsHome width={'1400px'} />}
      {window.innerWidth >= 919 && window.innerWidth <= 1535 && <LatestJournalsHome width={'950px'} />}
      {window.innerWidth <= 919 && <LatestJournalsHome width={'350px'} />}
</div >

    </div>
  )
}

export default Home