import React from 'react'
import ServicesHome from '../components/ServicesHome'
import LatestJournalComponent from '../components/LatestJournalComponent'
import ImageHeader from '../components/ImageHeader'

const FeeForPublication = () => {
    return (
        <div>
         <ImageHeader />
 
         <ServicesHome />

         <div>
            <h2 className='font-bold text-3xl text-center my-4'>
            Fee for Manuscript Handling
            </h2>
            <p className='text-justify mx-10'>
            Scientific Journals Portal operates as an autonomous entity, devoid of any financial assistance from institutions or governments. Consequently, the administration of the Journals is exclusively sustained through the fees imposed on authors for the processing of their manuscripts. These fees are indispensable for covering various operational costs, including employee salaries, internet services, web hosting, application development and support, and electricity. As an Open Access Publisher, Scientific Journals Portal does not generate revenue from subscriptions, as the journals are readily available online without charge.

Authors are obligated to remunerate a reasonable fee for the handling of their manuscripts. Nevertheless, there are no charges for submitting articles. Authors are only required to make payment once their manuscripts have been approved for publication. Please refer to the Fee for Manuscripts Handling section for each journal listed. 

Scientific Journals Portal may also provide exemptions to certain corresponding authors. Please consult the Waiver Policy to determine if you meet the criteria for a waiver.

            </p>
         </div>
  
       <LatestJournalComponent />
     </div>
   )
}

export default FeeForPublication