import React from 'react'
import HeaderImage from '../components/HeaderImage'
import ServicesHome from '../components/ServicesHome'
import LatestJournalComponent from '../components/LatestJournalComponent'

const PolicyWaiver = () => {
    return (
        <div>
         <HeaderImage />
 
         <ServicesHome />

         <div>
         <h2 className='font-bold text-3xl text-center my-4'>Policy on Waivers</h2>
         <p className='text-justify mx-8'>
            At Scientific Journals Portal, we recognise that some institutions may face financial limitations when conducting their research endeavours. As a result, we have implemented a compassionate waiver system that can alleviate the burden of the fee for handling manuscripts for researchers who opt to publish their manuscripts in any of our journals. Our primary objective, as stated in our mission, is to expedite the dissemination of knowledge through the publication of research articles of exceptional quality. We are consistently striving to achieve this objective without imposing excessive financial strain on researchers or their institutions. As a result, we have established the following policy regarding waivers. Authors originating from countries with a low income may be eligible for a waiver of up to 75%. Authors originating from countries with lower middle-income may be eligible for a waiver of up to 40%. To request a waiver, please submit an application to accounts@scientificjournalsportal.com. The waiver application should include the manuscript number and provide a justification for the request.
            </p>

         </div>
  
        <LatestJournalComponent />
     </div>
   )
}

export default PolicyWaiver