import React from 'react'
import HeaderImage from '../components/HeaderImage'
import ServicesHome from '../components/ServicesHome'
import LatestJournalsHome from '../components/LatestJournalsHome'

const FeeForPublication = () => {
    return (
        <div>
         <HeaderImage />
 
         <ServicesHome />

         <div>
            <h2>
            Fee for Manuscript Handling
            </h2>
            <p>
            Scientific Journals Portal operates as an autonomous entity, devoid of any financial assistance from institutions or governments. Consequently, the administration of the Journals is exclusively sustained through the fees imposed on authors for the processing of their manuscripts. These fees are indispensable for covering various operational costs, including employee salaries, internet services, web hosting, application development and support, and electricity. As an Open Access Publisher, Scientific Journals Portal does not generate revenue from subscriptions, as the journals are readily available online without charge.

Authors are obligated to remunerate a reasonable fee for the handling of their manuscripts. Nevertheless, there are no charges for submitting articles. Authors are only required to make payment once their manuscripts have been approved for publication. Please refer to the Fee for Manuscripts Handling section for each journal listed. 

Scientific Journals Portal may also provide exemptions to certain corresponding authors. Please consult the Waiver Policy to determine if you meet the criteria for a waiver.

            </p>
         </div>
  
         {window.innerWidth >= 919 && <LatestJournalsHome />}
     </div>
   )
}

export default FeeForPublication