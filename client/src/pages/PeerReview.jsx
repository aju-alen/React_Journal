import React from 'react'
import ImageHeader from '../components/ImageHeader'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { Container, Link, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';


const PeerReview = () => {
    return (
        <div>
            <ImageHeader />
            <Container maxWidth='lg'>
          <Stack>
            <Typography
              gutterBottom
              variant="h2"
              component="div"
              sx={{ fontWeight: 'bold', color: 'primary.black', textAlign: 'center' }}
              fontSize={30}
              mt={4}
            >
              Peer Review
            </Typography>
          </Stack>
          <Container >
          <Card sx={{ mt: 2, p: 2, boxShadow: 3 }}>
      <CardActionArea>
        <CardContent>
           

            {/* First Paragraph */}
            <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
            The peer review process of SJP and its affiliate journals is the bedrock of quality and
scientific integrity. It is therefore imperative that authors as well as other users
understand the process of peer review adopted by SJP and all its affiliate journals. The
process is influenced by a number of nuances including but not limited to the reviewers
and quality of the submission made. To this end, the process may take varied times
unique to each paper ranging from several weeks to several months. It is therefore not
possible to accurately estimate the review timeline within which an article peer review
would be completed. SJP commits to a strict peer review process to ensure that articles
that make it to publication are objective and can stand scrutiny. The following are the
steps through which a paper goes in the peer review: -
            </Typography>

           

            {/* Commitments */}
           
            </CardContent>
            </CardActionArea>
            </Card>
          </Container>

          <Container>
          <Card sx={{ mt: 2, p: 2, boxShadow: 3 }}>
      <CardActionArea>
        <CardContent>

            <Box mb={2} >
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ fontWeight: 'bold', color: 'primary.main' }}
              >
                Initial checks
              </Typography>
            </Box>

            <Box mt={3}>
              
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6, marginTop: 2 }}>
              Once an article is received for publication at any one of the SJP journals, an initial
process of screening is kickstarted wherein aspects of the article such as the scope,

language quality, plagiarism, anonymity and authorship integrity are interrogated vis-à-
vis the journal’s standards. Any concerns that arise in this stage of the review may cause

the manuscript to be desk rejected. However, in some instances, depending on the
reviewer assigned or journal editor, the manuscript may be sent back to the author for
rectification and resubmission.
Whether the decision is a desk rejection or a resubmission requirement, it is clearly
communicated to the author both in their portal or authorship dashboard as well as
their email.
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
            <Box mb={2}  >
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ fontWeight: 'bold', color: 'primary.main' }}
              >
                Double-anonymized peer review
              </Typography>
            </Box>

            <Box mt={3}>
             
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6, marginTop: 2 }}>
              If the manuscript is accepted through the initial check stage as described above, it is
now let into the peer review pipeline. At this stage, SJP and/or the affiliate journal
submitted to will extend invitation to potential reviewers who are experts in the subject
matter under study to make independent evaluation of the work presented. The journal
editor will then await receipt of at least two comprehensive and independent review and
evaluation reports on the submitted manuscript. The process is double-anonymized
meaning that the submitted manuscript bears no names of the authors to reduce any
instances of bias and on the other hand, the authors do not have the liberty to identify,
select and/or suggest reviewers to curb the integrity loophole that comes with collusion.
Depending on the subject matter of the manuscript submitted, the quality thereof and
the availability of reviewers, the duration of the peer review may vary ranging from a few
weeks to multiple months. In the event a review recuses themselves from reviewing the
manuscript, they may offer insights into their reasons for withdrawing. In many cases,
this may be due to language issues but may also be due to a raft of other issues. SJP
notes that instances of regular reviewers’rejection to review a manuscript may lead to
rejection of the manuscript especially if the review cites the abstract, the data or the
methods as being the contributing factor for their rejection. SJP therefore advises
authors that it is critical to craft compelling abstracts that invite the reviewers to
appreciate the body of the work.
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
            <Box mb={2} >
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ fontWeight: 'bold', color: 'primary.main' }}
              >
               First decision
              </Typography>
            </Box>

            <Box mt={3}>
             

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6, marginTop: 2 }}>
              The editorial team upon receipt of two comprehensive independent peer reviews, can
mark the peer review stage complete and render the first decision to the author(s). The

review team at SJP and its affiliate journals will submit its recommendations to the
Editor in Chief for ratification and communication to the author(s). You will then receive
an official letter via email informing you of the decision and the possible cause of
actions. The letter will be detailed, including clearly what may be required from your
side to move forward with the publication process.
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
            <Box mb={2} >
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ fontWeight: 'bold', color: 'primary.main' }}
              >
              Revision
              </Typography>
            </Box>

            <Box mt={3}>
             

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6, marginTop: 2 }}>
              Primarily, the spirit of peer review is to enhance rigor of the quality of work to be
published. In this sense, the peer review process would usually end with
recommendations for revision of the manuscript by the author(s). SJP therefore advises,
that the revision of the manuscript be conducted meticulously and with surgical
precision in order to ensure that the manuscript does not require multiple rounds of
review which may lead to longer time to publication and in some instances, rejection. It
is advisable also that for transparency and reference purposes, the author(s) include
with the revised submission, a report of the changes made including the sections where
these can be found in the manuscript and the comments and/or advise which the
changes attend to. Any decision from the author(s) not to implement certain
recommended changes should be buttressed by a rationale in the changes report
document. The author(s), in an effort to communicate the changes, can apply track
changes, however, in the interest of legibility and to ensure that the reviewers have a
smooth time with the resubmission, which saves times for all parties, it is instructed
that in making the resubmission, the author(s) attach the tracked and clean versions of
the revised file. Usually, there would be a deadline provided in the decision letter
sanctioning the revision, for the revision. If the author(s) require more time to be able to
sufficiently attend to the recommendations, they can request this by sending a request
to the journal editorial team citing their manuscript reference ID. Please refrain from
submitting the revised manuscript as an entirely new submission and look through your
dashboard to exclude any old versions of the manuscripts.
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
            <Box mb={2} >
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ fontWeight: 'bold', color: 'primary.main' }}
              >
              Final decision
              </Typography>
            </Box>

            <Box mt={3}>
             

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6, marginTop: 2 }}>
              When the peer review process is complete, the journal editor will render a decision to
the paper and the author of the paper will receive a notification via email on the
decision. Accepted papers are usually subjected to a further evaluation which serves to
confirm the accuracy, ethical integrity and currency of the materials and details in the
paper, including the authorship. The journal editor may run another plagiarism check on
the paper to ensure that no issues have arisen during the process of peer review to
cause the paper to be plagiarized. Additionally, the editor may at this stage request
clean copy of the manuscript from the author. Once received and all matters finalized,
the editor will send the paper to the production team which will take care of the final
proofing and publishing of the manuscript.
              </Typography>
            </Box>
                    </CardContent>
                    </CardActionArea>
                    </Card>
          </Container>

         
                    
                    

        </Container>
        </div>
    )
}

export default PeerReview