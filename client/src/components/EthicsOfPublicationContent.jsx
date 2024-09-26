import React from 'react'
import { ethicalpractice, authorship, submission } from '../../data'
import { useParams } from 'react-router-dom';
import AuthorFaqComponent from './AuthorFaqComponent';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { Container, Link, Stack } from '@mui/material';
import Box from '@mui/material/Box';

const EthicsOfPublicationContent = () => {
  const { ethicalSlug } = useParams()
  console.log(ethicalSlug, 'ethicalSlug');
  return (
    <div>

      {ethicalSlug === 'ethicalpractice' && 
        <Container maxWidth='lg'>
        <Stack>
        <Typography 
                gutterBottom 
                variant="h2"
                component="div" 
                sx={{ fontWeight: 'bold', color: 'primary.black',textAlign:'center' }}
              >
          Ethical Practice
          </Typography>
        </Stack>
          <Container >
            <Box mb={2}>
              <Typography 
                gutterBottom 
                variant="h5"
                component="div" 
                sx={{ fontWeight: 'bold', color: 'primary.main' }}
              >
                Ethical Responsibility
              </Typography>
            </Box>
  
            {/* First Paragraph */}
            <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
              The adherence to ethical standards in publishing is essential for maintaining the
              integrity and credibility of scientific articles. Consequently, Scientific Journals Portal
              requires all authors to comply with ethical guidelines when preparing and submitting
              their manuscripts for publication.
            </Typography>
  
            {/* Second Paragraph */}
            <Typography variant="body1" sx={{ color: 'text.secondary', mt: 2, lineHeight: 1.6 }}>
              The overall value of research and academic publishing is the sum total of the behaviors
              of people within the field including authors and reviewers. SJP will outline the expected
              ethical practices herein to give a broad outlook – the entity encourages all authors to
              refer to the <Link href='https://publicationethics.org/' target="_blank" underline="hover">Committee on Publication Ethics (COPE)</Link> 
              for further guidelines on ethical practice in academic publishing. Interested parties are directed to pay special attention
              to the Principles of Transparency and Best Practices in Scholarly Publishing as outlined by
              COPE. To safeguard knowledge and ensure perpetual access to knowledge outputs in
              the case an SJP journal ceases publication, SJP has an arrangement with <Link href='https://clockss.org/' target="_blank" underline="hover">CLOCKS</Link> 
              to preserve scholarship for posterity. SJP reiterates the importance of ethics in scholarly
              publication and reaffirms that it subscribes to the ethical guidelines outlined by COPE,
              encouraging any party to review the guidelines in case they have concerns about an ethical
              issue related to any of its journals. Users are also encouraged to reach out to SJP editors
              via <Link href="mailto:talktous@scientificjournalsportal.com" underline="hover">EMAIL</Link> at any time.
            </Typography>
  
            {/* Commitments */}
            <Box mt={3}>
              <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                Scientific Journals Portal makes the following commitments:
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mt: 1, lineHeight: 1.6 }}>
                <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                  <li>• Ensure and maintain the editorial freedom of editors</li>
                  <li>• Providing support to specific journal editors to run their journals ethically,
                      independently, and transparently</li>
                  <li>• Promoting accuracy of publishing records, including academic records, identity
                      records, publishing, corrections, and retractions</li>
                </ul>
              </Typography>
  
             
            </Box>
          </Container>
  
          <Container>
          <Box mb={2} mt={4}>
              <Typography 
                gutterBottom 
                variant="h5"
                component="div" 
                sx={{ fontWeight: 'bold', color: 'primary.main' }}
              >
                Authors
              </Typography>
            </Box>
  
            <Box mt={3}>
              <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              The ethical responsibilities for authors are as follows: -
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mt: 1, lineHeight: 1.6 }}>
                <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                  <li>• Ensure originality and rights ownership of submitted manuscripts</li>
                  <li>• Transparency on whether the works have been published elsewhere and/or whether
  the works have been submitted to other journal – SJP prefers journals that have not
  been submitted to other journals but may time and again consider works submitted
  and/or published to/by other journals if the author has no encumbrances</li>
                  <li>• Clear citing of material and acknowledging the rights of others where material is
  outsourced and in certain instances, where possible, proof of obtaining permission
  for use of outsourced material(s)</li>
                  <li>• Ensure that there is no infringement on other parties’ rights including intellectual
                  property rights and/or privacy rights</li>
                  <li>• Ensure that there is no manipulation of data</li>
                  <li>• Ensure that they own the rights to the data used or have secured requisite
                  permission to reproduce data which they do not own</li>
                  <li>• Clearly express any implied or explicit conflicts of interest including such as funding</li>
                  <li>• Adherence to all ethical guidelines of their research discipline, for instance where
                  animal or human subjects are used as part of their research</li>
                  <li>• Follow up with the journal editors to identify and correct any material errors pre or
                  post publication</li>
                  <li>• Consent of publication and clear statement of authorship for all who participated in
                  the authorship to ensure protection of copyright</li>
                </ul>
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6, marginTop:2 }}>
              The overall responsibility of the author is transparency where in s/he should make
  plain to the editors any concerns regarding their submitted manuscript in order to
  aid the process of ethical integrity of academic publishing.
            </Typography>
            </Box>
          
         </Container>
  
       <Container>
          <Box mb={2} mt={4} >
              <Typography 
                gutterBottom 
                variant="h5"
                component="div" 
                sx={{ fontWeight: 'bold', color: 'primary.main' }}
              >
               Reviewers
              </Typography>
            </Box>
            
            <Box mt={3}>
              <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              The ethical responsibilities of reviewers are as follows:
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mt: 1, lineHeight: 1.6 }}>
                <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                  <li>• Keep the review process as confidential as possible</li>
                  <li>• Ensure that all communication with authors is done using the official trackable
  channels and refrain from any direct communication with authors in order to
  maintain the integrity of the review process</li>
                  <li>• Be transparent and immediately bring to the attention of Senior Journal Editors any
  potential conflict of interest that may impede the partiality of their work, including
  electing not to participate in reviews where necessary</li>
                  <li>• Remain fair and dispassionate</li>
                </ul>
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6,marginTop:2 }}>
              SJP acknowledges that reviewers do not operate in a vacuum and that they would be
  inclined to particular school of thought or be passionate about particular interests.
  Notwithstanding, the journals integrity relies heavily on the impartiality and
  objectivity of reviewers and therefore, reviewers are urged to conduct themselves
  with unwavering loyalty to the codes of integrity herein, and in the wider codes
  detailed under COPE. Reviewers are encouraged to be transparent enough and seek
  guidance from journal editors about potential conflicts of interest whenever doubt
  arises.
            </Typography>
            </Box>
          
         </Container>
  
         <Container>
          <Box mb={2} mt={4}>
              <Typography 
                gutterBottom 
                variant="h5"
                component="div" 
                sx={{ fontWeight: 'bold', color: 'primary.main' }}
              >
                Editors
              </Typography>
            </Box>
            
            <Box mt={3}>
              <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              The ethical responsibilities for editors are as follows:-
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mt: 1, lineHeight: 1.6 }}>
                <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                  <li>•Oversee the consistent practice and implementation of conventional ethical
                  policies for journals</li>
                  <li>• Act to enforce ethical policies as need may arise to safeguard the ethical integrity of
                  the journals</li>
                  <li>• Maintain the confidentiality of the review process</li>
                  <li>• Exhibit highest standards of integrity and ethical conduct in their work as journal
  editors being alive to instances of conflict of interests and making necessary plans
  to mitigate the same</li>
                  <li>• Collaborate with other parties including authors and reviews, as well as the Editorial
  Board team to ensure that everyone is apprised on their work and their specific
  journal’s ethical policies including fair, timely and objective stewardship of
  publishing and ethical matters.</li>
                </ul>
              </Typography>
  
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6, marginTop:2 }}>
              SJP editors are the line leaders that ensure the integrity of the journals through
  adherence to conventional ethical practice codes and guidelines. Their role in
  setting and implementing the ethical guidelines for each journal is crucial, as well as
  setting the publication guidelines thereof. SJP therefore encourages all editors to
  
  take up their positions with honor understanding that they are shaping the future of
  knowledge through their work and therefore quality is critical.
            </Typography>
            </Box>
          
         </Container>
  
         <Container>
          <Box mb={2} mt={4}>
              <Typography 
                gutterBottom 
                variant="h5" 
                component="div" 
                sx={{ fontWeight: 'bold', color: 'primary' }}
              >
                Disclaimer
              </Typography>
            </Box>
            
            <Box mt={3}>
             
  
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
              Overall, SJP adheres to the principle of fairness, equality, zero-discrimination,
  originality and respect to copyrights, academic record sanctity, confidentiality and
  transparency on conflicts of interests and/or funding positions. The above being the
  case, SJP disclaims that content published in any of its affiliate journals represents
  the opinions of the author(s) and that it does not in any way reflect the position of
  the journal not of any of the affiliated organizations. SJP supports author, reviewer
  and editorial independence, which leaves the editors with the last call on what to
  publish. Accordingly, it is reiterated herein that SJP is committed to publishing
  content that is founded on sound scientific or theoretical principles and remains a
  great enthusiast of academic freedom.
            </Typography>
            </Box>
          
         </Container>
         </Container>
      }

      {ethicalSlug === 'authorship' && authorship.map(data => (
        <div key={data.title} className=' flex flex-col'>
          <h2 className='  h2-class'>{data.title}</h2>
          <p className='p-class'>{data.content}</p>
        </div>
      ))}
      {ethicalSlug === 'submission' && submission.map(data => (
        <div key={data.title} className=' flex flex-col'>
          <h2 className='  h2-class'>{data.title}</h2>
          <p className='p-class'>{data.content}</p>
        </div>
      ))}
      {ethicalSlug === 'authorship' && (
        <div>
        
        <AuthorFaqComponent/>
        </div>
      )}
    </div>
  )
}

export default EthicsOfPublicationContent