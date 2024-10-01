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
import { Link as ReactLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

const EthicsOfPublicationContent = () => {
  const { ethicalSlug } = useParams()
  console.log(ethicalSlug, 'ethicalSlug');
  return (
    <div>

      {/* -------------------------------------------Ethical Practice Content ----------- */}
      {ethicalSlug === 'ethicalpractice' &&
        <Container maxWidth='lg'>
          <Stack>
            <Typography
              gutterBottom
              variant="h2"
              component="div"
              sx={{ fontWeight: 'bold', color: 'primary.black', textAlign: 'center' }}
            >
              Ethical Practice
            </Typography>
          </Stack>
          <Container >
          <Card sx={{ mt: 2, p: 2, boxShadow: 3 }}>
      <CardActionArea>
        <CardContent>
            <Box mb={2} mt={10}>
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
              refer to the <Link href='https://publicationethics.org/' target="_blank" underline="hover">Committee on Publication Ethics (COPE) </Link>
              for further guidelines on ethical practice in academic publishing. Interested parties are directed to pay special attention
              to the Principles of Transparency and Best Practices in Scholarly Publishing as outlined by
              COPE. To safeguard knowledge and ensure perpetual access to knowledge outputs in
              the case an SJP journal ceases publication, SJP has an arrangement with <Link href='https://clockss.org/' target="_blank" underline="hover">CLOCKS </Link>
              to preserve scholarship for posterity. SJP reiterates the importance of ethics in scholarly
              publication and reaffirms that it subscribes to the ethical guidelines outlined by COPE,
              encouraging any party to review the guidelines in case they have concerns about an ethical
              issue related to any of its journals. Users are also encouraged to reach out to SJP editors
              via <Link href="mailto:talktous@scientificjournalsportal.com" underline="hover">EMAIL</Link> at any time.
            </Typography>

           

            {/* Commitments */}
            <Box mt={3}>
              <Typography
                variant="h6"
                sx={{ color: 'primary.main', fontWeight: 'bold', mb: 2 }}
              >
                Scientific Journals Portal makes the following commitments:
              </Typography>

              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      maxWidth: 345,
                      height: 'auto',
                      borderRadius: 4,
                      boxShadow: 3,
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.03)',
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardActionArea>
                      <CardContent>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Ensure and maintain the editorial freedom of editors
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      maxWidth: 345,
                      height: 100,
                      borderRadius: 4,
                      boxShadow: 3,
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.03)',
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardActionArea>
                      <CardContent>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Providing support to specific journal editors to run their journals ethically, independently, and transparently
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      maxWidth: 345,
                      height: 100,
                      borderRadius: 4,
                      boxShadow: 3,
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.03)',
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardActionArea>
                      <CardContent>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Promoting accuracy of publishing records, including academic records, identity records, publishing, corrections, and retractions
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              </Grid>
            </Box>
            </CardContent>
            </CardActionArea>
            </Card>
          </Container>

          <Container>
          <Card sx={{ mt: 2, p: 2, boxShadow: 3 }}>
      <CardActionArea>
        <CardContent>

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
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6, marginTop: 2 }}>
                The overall responsibility of the author is transparency where in s/he should make
                plain to the editors any concerns regarding their submitted manuscript in order to
                aid the process of ethical integrity of academic publishing.
              </Typography>
            </Box>
            </CardContent>
            </CardActionArea>
            </Card>

          </Container>

          <Container>
          <Card sx={{ mt: 2, p: 2, boxShadow: 3 }}>
      <CardActionArea>
        <CardContent>
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
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6, marginTop: 2 }}>
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
            </CardContent>
            </CardActionArea>
            </Card>
          </Container>

          <Container>
          <Card sx={{ mt: 2, p: 2, boxShadow: 3 }}>
      <CardActionArea>
        <CardContent>
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

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6, marginTop: 2 }}>
                SJP editors are the line leaders that ensure the integrity of the journals through
                adherence to conventional ethical practice codes and guidelines. Their role in
                setting and implementing the ethical guidelines for each journal is crucial, as well as
                setting the publication guidelines thereof. SJP therefore encourages all editors to

                take up their positions with honor understanding that they are shaping the future of
                knowledge through their work and therefore quality is critical.
              </Typography>
            </Box>
                    </CardContent>
                    </CardActionArea>
                    </Card>
          </Container>

          <Container>
          <Card sx={{ mt: 2, p: 2, boxShadow: 3 }}>
      <CardActionArea>
        <CardContent>
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
            </CardContent>
                    </CardActionArea>
                    </Card>
          </Container>
                    
                    

        </Container>
      }


      {ethicalSlug === 'authorship' && authorship.map(data => (
        <div key={data.title} className=' flex flex-col'>
          <h2 className='  h2-class'>{data.title}</h2>
          <p className='p-class'>{data.content}</p>
        </div>
      ))}

      {/* -------------------------------------------Submit Manuscript Content ----------- */}
      {ethicalSlug === 'submission' &&
        <Container maxWidth='lg'>
          <Stack>

            <Typography
              gutterBottom
              variant="h2"
              component="div"
              sx={{ fontWeight: 'bold', color: 'primary.black', textAlign: 'center' }}
            >
              Submission of Manuscripts
            </Typography>
          </Stack>
        
          <Container >
          <Card sx={{ mt: 2, p: 2, boxShadow: 3 }}>
      <CardActionArea>
        <CardContent>
        <Box mb={2} >
              <Typography
                gutterBottom
                variant="h6"
                component="div"
                sx={{ fontWeight: 'bold', color: 'primary.main' }}
              >
                Submitting your Research to SJP
              </Typography>
            </Box>

            {/* First Paragraph */}
            <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
              Scientific Journals Portal (SJP) publishes high quality journals globally in a ballpark of
              disciplines and subject areas. SJP is a champion of engaged scholarship globally and
              pledges zero discrimination to authors and reviewers holding closely the need for and
              importance of diversity and inclusion in scholarly research. We therefore promote
              submissions and peer review from varied authors and reviewers globally.
            </Typography>

            {/* Second Paragraph */}
            <Typography variant="body1" sx={{ color: 'text.secondary', mt: 2, lineHeight: 1.6 }}>
              As part of our commitment to upholding and promoting integrity in academic research,
              we encourage all prospective authors, reviewers and editors to read the COPE
              guidelines on the <Link href='https://publicationethics.org/resources/resources-and-further-reading/international-standards-editors-and-authors'>International Standards for Authors and Editors.</Link> Authors, reviewers
              and editors are also encouraged to familiarize themselves with their specific ethical
              responsibilities, the editorial and the publication ethics policies.
            </Typography>

            <Typography variant="body1" sx={{ color: 'text.secondary', mt: 2, lineHeight: 1.6 }}>
              The choice of journal is also very important to consider during publishing. SJP
              disseminates research through a number of journals, and it is essential that you identify
              the right journal for your research project. You can always reach out to the SJP editorial
              team with your journal query for guidance on the right journal for your submission or
              information on any ongoing special issue and/or conferences. It is advisable that you
              read and review your chosen journal’s submission guidelines and whenever in
              confusion, reach out to the journal editor via email. The details of the editor contacts
              will be found on the journal landing page.
            </Typography>

            <Typography variant="body1" sx={{ color: 'text.secondary', mt: 2, lineHeight: 1.6 }}>
              As part of the submission process, it will be required of you to make declarations on the
              originality of the work submitted, that you have unencumbered rights to make the
              submission under your name, whether the submission is for first publication to the
              journal, or make lucid if it has been published somewhere else, obtain and provide proof
              for republishing rights of the work, if not, make declaration that the manuscript is not
              under review for publication consideration anywhere else, finally, that you have obtained
              and can provide use and reproduction approval for any works or information not owned
              by you.
            </Typography>
        </CardContent>
      </CardActionArea>
    </Card>

    <Card sx={{ mt: 2, p: 2, boxShadow: 3 }}>
      <CardActionArea>
        <CardContent>
        <Box mt={3}>
              <Typography
                variant="h6"
                sx={{ color: 'primary.main', fontWeight: 'bold', mb: 2 }}
              >
                Publishing Options
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
              SJP offers a hybrid publishing model with a range of open access and subscription-based journals. As such, an article processing charge may be levied by specific journals
              which offer open access distribution, while on the other hand, authors can make their
              article available for readership via the open choice plan wherein in, they publish their
              articles for free and readers have to pay a set subscription fee to access their articles.
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
              Whether the author chooses open access or the open choice option, all articles are
              rigorously peer-reviewed to ensure they maintain all the hallmarks of ethics and quality
              in academic publications. The payments for article processing or publication fees are
              made by the researcher, institution, or the research funders on the acceptance of the
              manuscript. This means that the article will be made immediately available online for
              download and use under the specific creative commons license.
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
              During the process of submission, the author will have the opportunity to select whether
              they want their articles to be open access or open choice. Once the peer-review is done
              and the article is accepted for publication, the author will then be asked for a last time
              the mode of publication that s/he prefers for their accepted manuscript. Depending on
              the choice the system will request the author for payment or proceed to disseminate
              his/her research as an open choice.
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
              Authors are encouraged to check the individual journals policies on open access
              publishing as part of their decision making on the right journal for their body of work.
              Instructive to note is that corresponding authors residing in countries that are third
              world or research work promoting knowledge and understanding as well as problem
              resolution of problems in countries that are third world, qualify for article processing
              charge waiver on their manuscripts post acceptance and these manuscripts qualify for
              immediate open access across any of the select journals.
            </Typography>
          </CardContent>
      </CardActionArea>
    </Card>
       

            {/* Commitments */}
           
            <Card sx={{ mt: 2, p: 2, boxShadow: 3 }}>
      <CardActionArea>
        <CardContent>
            <Box mt={3}>
              <Typography
                variant="h6"
                sx={{ color: 'primary.main', fontWeight: 'bold', mb: 2 }}
              >
                Preparing your Manuscript
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: 'primary.main', fontWeight: 'bold', mb: 2 }}
              >
                What is the nature of your submission?
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
              SJP shares knowledge through the distribution of varied types of articles ranging from
              original research to commentaries, opinion pieces and review articles. It is advisable to
              review the identified journal article guidelines on the nature of articles that are
              publishable including the individual requirements for each and any of the articles
              published that are of interest to you. In this section, a detailed guideline of the article
              preparation process for original research is provided.
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
              A key factor of consideration during the preparation of your manuscript for submission is
              the importance of language. SJP is committed to promoting equity and inclusivity
              throughout our publishing program and as such, inclusive language that can effectively
              communicate without offending, welcome without discriminating, and inform without
              denigrating is especially considered. This especially touches on topics of potential
              conflict including age, gender, religion, ethnicity, disability, appearance, gender identity,
              race, socio-economic status, weight and emigration status. Authors are encouraged to
              frame their language in an inclusive way and the peer review process or the editorial
              process in SJP will make it a point to identify areas of language correction and
              communicate to prospective authors promptly regarding such requirements. SJP
              recognizes that language is a dynamic field subject to constant evolution and therefore,
              commits to continually advise authors on proper language touching on sensitive topics
              as well as review all manuscripts accepted for publication for any lingual flaws that may
              offend a subset of the global population which we aim to disseminate knowledge to.
            </Typography>
            </CardContent>
            </CardActionArea>
            </Card>

            <Card sx={{ mt: 2, p: 2, boxShadow: 3 }}>
      <CardActionArea>
        <CardContent>
            <Typography
                variant="h6"
                sx={{ color: 'primary.main', fontWeight: 'bold', mb: 2 }}
              >
                The main manuscript document
              </Typography>

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
              Authors are encouraged to familiarize themselves with the journals in which they seek to 
submit for guidelines on the submission requirements in terms of the nature of the 
manuscript as well as the accepted structure. Generally, however, as far as the 
structure is concerned, all manuscripts submitted to SJP journals would have an 
Abstract, Introduction, Methodology, Results, Discussion, and Conclusions. These 
would then be usually followed by Acknowledgements, Statements and Declarations, 
then a Reference section. As all journals have double-anonymized peer-review process,
authors are advised to ensure they remove all identifying information – such as names, 
from the submitted manuscript as these will be captured in a separate form during the 
submission process, for later use after the manuscript has been accepted. 
            </Typography>

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
            <strong>Title:</strong> The title of your manuscript should succinctly, accurately and precisely capture 
the contents of your manuscript. A proper title will enhance the articles findability in 
search engines. 
            </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
              <strong>Abstract:</strong> The abstract of your manuscript is supposed to succinctly distill the research 
purpose, major findings and conclusions. Your chosen journal will have specific 
guidelines of how to structure your manuscript abstract. Please be sure to refer to these 
guidelines to avoid rejections. 
            </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
             <strong>Keywords:</strong>  It is conventional to list a specific set of keywords that are pertinent to your
topic. Unless otherwise stated in the journal submission guidelines, a total of five 
keywords that are pertinent to the subject matter of study are allowed for most of the 
journals.
</Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
             <strong>Acknowledgments:</strong>  In cases where you need to acknowledge non-author qualified 
people who have participated in your research, you need to clearly mention this in your 
cover letter and attach a signed consent of their agreement to be acknowledged in the 
manuscript for publishing as non-authors. Further if you have received assistance in the 
preparation or editing of your document from a third party, for instance a specialist 
communications agency, this must also be clearly stated in the cover letter and in the 
acknowledgment although it is not necessary to include the name of the part in the 
latter. The foregoing also goes for submissions being made on your behalf by a third 
party, for instance a writing/editing assistant or company – this must be clearly stated in 
the cover letter and in the acknowledgement.<strong>Please note that the journal editor 
reserves the right not to consider submissions made by a third party especially 
where there is no sufficient disclosure.</strong> 
</Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
             <strong>Author contributions:</strong>To enhance fair distribution and safeguarding of rights, the exact 
contributions of all authors listed in the manuscript have to be identified and detailed as 
part of the submission process. This should be included as a table after the 
acknowledgement and will be applied later on the approval of the manuscript under the 
Author Contributions section of the manuscript to ensure fair identification of copyright 
and effort for all authors. 
</Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
             <strong>Statements and declarations:</strong>Respective journals will require that certain statements 
be filed, and declarations made to support the publishing of the manuscript. As these 
requirements are likely to vary from one journal to another, it is advisable that authors 
review the statements and declarations requirements of the journal that they are 
submitting to. The statement and declarations section should be included as a heading 
after the acknowledgments section and the authors contribution section at the end of 
the manuscript prior to the listing of the references used. The headings of the 
statements and declarations are listed below and your section in the document should 
contain them in their specific taxonomy. If a particular statement is not applicable to 
your journal, you list its heading and indicate clearly not applicable. It is important to 
note that as part of the rigor in the peer review process, the editorial office of your 
submitting journal may require you to justify why a particular statement is not applicable
to your specific manuscript. 
</Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
              <strong>Ethical considerations:</strong> You are required to include your ethical approvals and 
permissions in this section, this is without prejudice of having included the same 
in your methodology section in the body of the research. If ethical approvals 
were not required, you need to clearly state this.
</Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
              <strong>Participants’ consent:</strong> You are required to include any participants’ consent 
information in this section and clearly stipulate whether informed consent was 
verbal or written. It is mandatory to clearly stipulate whether the requirement for 
informed consent has been waived by the Institutional Review Board (IRB). If 
informed consent to participate is not applicable for your manuscript, please 
state it is not applicable. 
</Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
             <strong>Publication consent:</strong>  If your manuscript contains any data for individuals, it is 
essential to provide consent for publication authorized by the individuals in 
question or their legal representatives. Too much non-essential information 
pertaining to consent should be withheld as this is contrary to the purpose of 
confidentiality – for instance, it is not required for you to upload actual signed 
consents from participants, just stating their availability and your readiness to 
provide them upon request suffices. If these is not applicable to your 
manuscript, please state it is not applicable in this section. Feel free to request a 
template for participant consent form from your journal editorial team prior to 
submission or while in the review process
</Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
              <strong>Conflict of interest:</strong> A conflict-of-interest statement is required by all SJP 
journals, and it is therefore imperative to include this statement in your 
manuscript. This statement helps clarify that the authors’ work is not in any way 
influenced by any conflicting interests. If you believe that there is no conflict of 
interest, then you should use the following statement: -‘The author(s) declare 
that there is no potential conflicting interest pertinent to the research, 
authorship and/or publication of the presented manuscript.’
</Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
             <strong>Funding statement:</strong>  This statement too, is required by all SJP journals under its 
own distinct title. Whether or not the author(s) received funding towards the 
research and authorship, they should state lucidly the position. If no funding was 
received the authors should state that: -‘The authors depone that, no funding 
was received for the research, authorship of publication of the presented 
manuscript. 
</Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
             <strong>Data availability statement:</strong>  In the spirit of openness, transparency and 
accountability, authors are required to make clear the availability of the data 
used in the manuscript. An independent statement should be availed indicating 
where the data is hosted or indicating that the data used in the manuscript is 
available upon request.
</Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
            <strong>Artworks, figures and graphics:</strong>In order to enable SJP to publish your manuscript in 
the best way, artworks, illustrations and any figures should be provided in electronic 
formats like JPEG and TIFF and bear the highest quality possible. Figures prepared in 
Word should be included in text, while those prepared in other software including Excel 
among others, should be attached at the end in the appendix and only referred to in the 
text. A resolution of at least 300dpi (dots per inch) is required for all images/figures in 
JPEG or TIFF formats. The dimensions of the images and figures should not distort the 
arrangement of the document or cause the formatting of the document to vary too far. 
Figures will be reflected online in color but in black and white in print. 
It is important that authors obtain necessary copyright permissions or inspect the 
creative commons license of figures that they use in their works. SJP cannot be held 
responsible for copyright oversight in such cases.

</Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
              <strong>References:</strong> Every in-text citation must have a corresponding citation in the reference 
list and vice versa. Corresponding citations must have identical spelling and 
year. Information about what reference style to use can be found in your chosen 
journal’s guidelines. As a standard however, SJP accepts submission that are standardly 
formatted in Havard or APA referencing formats.
Authors should update any references to preprints when a peer reviewed version is 
made available, to cite the published research. Citations to preprints are otherwise 
discouraged.
</Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
             <strong>Supplemental materials:</strong>  SJP data base can host supplemental materials from authors 
including datasets, videos and images, together with the full text of the manuscript.
</Typography>
</CardContent>
      </CardActionArea>
    </Card>


    <Card sx={{ mt: 2, p: 2, boxShadow: 3 }}>
      <CardActionArea>
        <CardContent>
<Typography
                variant="h6"
                sx={{ color: 'primary.main', fontWeight: 'bold', mb: 2 }}
              >
                The title page
              </Typography>

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
              As part of your submission, make a point to prepare a title page entailing all the 
identifying details retracted from the manuscript for purposes of anonymity. This title 
page will not be sent to the reviewers rather, will be held for use on the acceptance of 
the manuscript. Your title page should include the following details: -
</Typography>

<Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>•Title of the article</Typography>
<Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>•Full name list of authors and their affiliations</Typography>
<Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>•The affiliation refers to the institution which the research was conducted</Typography>
<Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>•Contact information for the corresponding author including phone and/or institutional email address</Typography>
<Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>•Any other identifying information that might have been withheld in the interest of anonymity for peer review purposes.</Typography>
</CardContent>
</CardActionArea>
</Card>


<Card sx={{ mt: 2, p: 2, boxShadow: 3 }}>
      <CardActionArea>
        <CardContent>
<Typography
                variant="h6"
                sx={{ color: 'primary.main', fontWeight: 'bold', mb: 2 }}
              >
                How do I format my article
              </Typography>

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>The preferred submission format is using Word document. SJP prescribes no strict formatting protocol for the text, however, it is instructive to note that your sections are clearly distinguished, and the heading levels are clear too.</Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>In terms of reference, please confirm with the submitting journal on the type of 
referencing that you should apply. As a standard however, SJP accepts submission that 
are standardly formatted in Havard or APA referencing formats. Feel free to request a 
template for Harvard or APA from the journal editorial team via the contact us button.</Typography>
</CardContent>
</CardActionArea>
</Card>


<Card sx={{
  mt:2
}} >
      <CardActionArea>
        <CardContent>
<Typography
                variant="h6"
                sx={{ color: 'primary.main', fontWeight: 'bold', mb: 2 }}
              >
                SJP author services
              </Typography>

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>Authors who need support in English language writing and editing services, translation with editing, or manuscript formatting to adhere to the SJP journals requirements for 
fast-tracked publication should reach out to <ReactLink to='/contact/sjp' className=' text-blue-600 underline'>SJP Author Services.</ReactLink></Typography>

</CardContent>
</CardActionArea>
</Card>



          </Container>

        </Container>
      }

      {ethicalSlug === 'authorship' && (
        <div>

          <AuthorFaqComponent />
        </div>
      )}
    </div>
  )
}

export default EthicsOfPublicationContent