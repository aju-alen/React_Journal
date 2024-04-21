import HeaderImage from '../components/HeaderImage'
import ServicesHome from '../components/ServicesHome'
import LatestJournalsHome from '../components/LatestJournalsHome'
import EthicsOfPublicationCards from '../components/EthicsOfPublicationCards'
import FullIssueHome from '../components/FullIssueHome'
const Home = () => {

  return (
    
    <div>
      <HeaderImage />

      <ServicesHome />
      <div className='mt-4'>
        <h2 className=" text-center font-bold text-3xl">About Us</h2>
        <p className=' text-justify p-10 md:px-44'>Scientific Journals Portal serves as a publisher for a wide range of open access journals that undergo rigorous peer review. With a diverse collection of over 100 journals, we cover various disciplines including art and humanities, engineering, medical science, social sciences, biological sciences, physical sciences, and agricultural sciences. Our primary objective is to expedite the sharing of knowledge by publishing research articles of exceptional quality, while adhering to the principles of open access.</p>
      </div>
<div className="mt-4 ">
      <EthicsOfPublicationCards />
</div>
<div className="">
{window.innerWidth >= 1536 && <LatestJournalsHome width={'1400px'} />}
      {window.innerWidth >= 919 && window.innerWidth <= 1535 && <LatestJournalsHome width={'950px'} />}
      {window.innerWidth <= 919 && <LatestJournalsHome width={'350px'} />}
</div>
    <FullIssueHome />
    </div>
  )
}

export default Home