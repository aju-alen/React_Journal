import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SubmitManuscript from '../components/SubmitManuscript';
import MyManuscriptsDashboard from '../components/MyManuscriptsDashboard';
import AdminMyManuscriptsDashboard from '../components/AdminMyManuscriptsDashboard';
import ImageHeader from '../components/ImageHeader';
import { DNA } from 'react-loader-spinner'
import { httpRoute } from '../helperFunctions';
import EditProfile from '../components/EditProfile';
import SubmitIssue from '../components/SubmitIssue';
import CreateNewJournal from '../components/CreateNewJournal';
import CreateMarkettingEmail from '../components/CreateMarkettingEmail';
import ReviewerManagement from '../components/ReviewerManagement';
import ReviewerArticleDashboard from '../components/ReviewerArticleDashboard';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Badge from '@mui/material/Badge';
import ManagePurchase from '../components/ManagePurchase';
import StripeManageSubscription from '../components/StripeManageSubscription';


const shapeStyles = { bgcolor: 'primary.main', width: 40, height: 40 };
const shapeCircleStyles = { borderRadius: '50%' };
const rectangle = <Box component="span" sx={shapeStyles} />;
const circle = (
  <Box component="span" sx={{ ...shapeStyles, ...shapeCircleStyles }} />
);

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;




  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component={'span'}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


const ProfileDashboard = () => {
  const { profileId } = useParams()
  const [userDetails, setUserDetails] = useState({})
  const [user, setUser] = useState({})
  const [userCount, setUserCount] = useState(0)
  const [userSpecialReview, setUserSpecialReview] = useState({})
  const [userSpecialReviewCount, setUserSpecialReviewCount] = useState(0)
  const [verificationArticle, setVerificationArticle] = useState({})
  const [loading, setLoading] = useState(true)
  let [searchParams, setSearchParams] = useSearchParams();
  const value = Number(searchParams.get("tab") || 0);
  const [refreshKey, setRefreshKey] = useState(0);

  const [open, setOpen] = React.useState(false);
  const [specialIssue, setSpecialIssue] = React.useState(false);
  const [regularIssue, setRegularIssue] = React.useState(false);

  const handleSpecialIssue = async () => {
    setOpen(false);
    setSpecialIssue(true)
    setRegularIssue(false)
  }

  const handleRegularIssue = async () => {
    setOpen(false);
    setRegularIssue(true)
    setSpecialIssue(false)
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event, newValue) => {
    setSearchParams((params) => {
      params.set("tab", newValue);
      return params;
    });
  };

  const refreshVerificationArticles = () => {
    setRefreshKey((prev) => prev + 1);
};
  useEffect(() => {
    const getUser = async () => {
      const getUser = await JSON.parse(localStorage.getItem('currentUser'))
      setUserDetails(getUser)
      axios.defaults.headers.common['Authorization'] = `Bearer ${getUser.token}`
      try {

          const resp = await axios.get(`${httpRoute}/api/users/${profileId}`)
          setUser(resp.data)
          setLoading(false)

        if (resp.data.isAdmin || (resp.data.userType === 'reviewer' && resp.data.reviewerApproved)) {
          const verifyResp = await axios.get(`${httpRoute}/api/journalArticle/verifyArticles/${profileId}`)
          console.log(verifyResp.data, 'special review full log');
          setVerificationArticle(verifyResp.data.filter((item) => item.specialReview === false))
          setUserCount(verifyResp.data.filter((item) => item.specialReview === false).length)

          setUserSpecialReview(verifyResp.data.filter((item) => item.specialReview === true))
          setUserSpecialReviewCount(verifyResp.data.filter((item) => item.specialReview === true).length)

          setLoading(false)
        }
        
      }
      catch (err) {
        console.log(err)
      }
    }

    getUser()
  }, [value === 0, refreshKey])
  console.log(userDetails, 'zzzzzz');

  console.log(user, 'user not special review');
  console.log(userSpecialReview, 'user yesss special review');

  const isAdmin = userDetails?.user?.isAdmin;
  const isReviewer = userDetails?.user?.userType === 'reviewer' && userDetails?.user?.reviewerApproved;

  return (
    <div>
      {!loading ? (<div>
        <ImageHeader />
        <h1 className=' text-3xl font-medium mb-6 text-center p-4'>Welcome {`${userDetails?.user?.title} ${userDetails?.user?.surname}`}</h1>
        <Box sx={{ width: '100%' }} >
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }} >
            <Tabs value={value} onChange={handleChange}  
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
            >
              <Tab
                label={
                  (isAdmin || isReviewer) ? (
                    <div>
                      Verify Regular Issue
                      <Badge color="primary" badgeContent={userCount} overlap='circular' max={5} sx={{ mb: 5 }} >
                      </Badge>
                    </div>
                  ) : (
                    "My Manuscripts"
                  )
                }
                wrapped
                {...a11yProps(0)}
              />
              {/* START ------------ This is a tab button to check if user wants special issue or regular issue */}
              {!isReviewer && (
                <Tab
                wrapped
                label={
                  
                  (
                    <div>
                      <Button variant="text" onClick={handleClickOpen}>
                        Submit Manuscript
                      </Button>
                      <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                      >
                        <DialogTitle id="alert-dialog-title">
                          {"Submit this manuscript as a special issue?"}
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText id="alert-dialog-description">
                            Special Issue - A special issue will be published at the current issue of the journal
                          </DialogContentText>
                          <DialogContentText id="alert-dialog-description">
                            Regular Issue - A regular issue will be published at the next issue of the journal
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleRegularIssue}>Regular Issue</Button>
                          <Button onClick={handleSpecialIssue} autoFocus>
                            Special Issue
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </div>
                  )

                } {...a11yProps(1)} />
              )}
              {/* END ------------ This is a tab button to check if user wants special issue or regular issue */}

              {/* {!userDetails?.user?.isAdmin &&<Tab label=" Submit Manuscript" {...a11yProps(1)} />} */}
              <Tab wrapped label="Edit Profile" {...a11yProps(2)} />
              {isReviewer && (
                <Tab wrapped label="Review Articles" {...a11yProps(3)} />
              )}
              {!isReviewer && (
                <Tab label="Manage Purchase" {...a11yProps(3)} />
              )}
              {isReviewer && (
                <Tab label="Manage Purchase" {...a11yProps(4)} />
              )}
              {/* Admin-only tabs */}
              {isAdmin && (
                <Tab wrapped label="Create new journal" {...a11yProps(4)} />
              )}
              {isAdmin && (
                <Tab wrapped label="Mailing" {...a11yProps(5)} />
              )}
              {(isAdmin || isReviewer) && (
                <Tab wrapped
                  label={
                    <div>
                      Verify Special Issue
                      <Badge color="primary" badgeContent={userSpecialReviewCount} overlap='circular' max={5} sx={{ mb: 5 }} >
                      </Badge>
                    </div>
                  }
                  {...a11yProps(6)}
                />
              )}
              {isAdmin && (
                <Tab
                wrapped
                  label={
                    <div>
                      Submit Issue
                      <Badge color="primary" 
                      // badgeContent={userSpecialReviewCount}
                       overlap='circular' max={5} sx={{ mb: 5 }} >
                      </Badge>
                    </div>
                  }
                  {...a11yProps(7)}
                />
              )}
              {isAdmin && (
                <Tab
                wrapped
                  label={
                    <div>
                      My Manuscripts
                      <Badge color="primary" badgeContent={userSpecialReviewCount} overlap='circular' max={5} sx={{ mb: 5 }} >
                      </Badge>
                    </div>
                  }
                  {...a11yProps(8)}
                />
              )}
              {isAdmin && (
                <Tab
                  wrapped
                  label="Reviewer Management"
                  {...a11yProps(9)}
                />
              )}
              {isReviewer && (
                <Tab
                  wrapped
                  label="Manage Subscription"
                  {...a11yProps(5)}
                />
              )}
              {!isReviewer && (
                <Tab
                  wrapped
                  label="Manage Subscription"
                  {...a11yProps(isAdmin ? 10 : 4)}
                />
              )}
            </Tabs>

          </Box>
          <CustomTabPanel value={value} index={0}>
            {(isAdmin || isReviewer) && <AdminMyManuscriptsDashboard user={verificationArticle} onDelete={refreshVerificationArticles} />}
            {!isAdmin && !isReviewer && <MyManuscriptsDashboard user={user} />}
          </CustomTabPanel>
          {!isReviewer && (
            <CustomTabPanel value={value} index={1}>
              {( regularIssue) && <SubmitManuscript user={user} checked={false} />}
              {(specialIssue) && <SubmitManuscript user={user} checked={true} />}
            </CustomTabPanel>
          )}
          <CustomTabPanel value={value} index={2}>
            <EditProfile userDetails={userDetails} />
          </CustomTabPanel>
          {isReviewer && (
            <CustomTabPanel value={value} index={3}>
              <ReviewerArticleDashboard />
            </CustomTabPanel>
          )}
          {!isReviewer && (
            <CustomTabPanel value={value} index={3}>
              <ManagePurchase />
            </CustomTabPanel>
          )}
          {isReviewer && (
            <CustomTabPanel value={value} index={4}>
              <ManagePurchase />
            </CustomTabPanel>
          )}
          {/* Admin-only panels */}
          {isAdmin && (
            <CustomTabPanel value={value} index={4}>
              <CreateNewJournal />
            </CustomTabPanel>
          )}
          {isAdmin && (
            <CustomTabPanel value={value} index={5}>
              <CreateMarkettingEmail />
            </CustomTabPanel>
          )}
          {(isAdmin || isReviewer) && (
            <CustomTabPanel value={value} index={6}>
              <AdminMyManuscriptsDashboard user={userSpecialReview} />
            </CustomTabPanel>
          )}
          {isAdmin && (
            <CustomTabPanel value={value} index={7}>
              <SubmitIssue user={user} />
            </CustomTabPanel>
          )}
          {isAdmin && (
            <CustomTabPanel value={value} index={8}>
              <MyManuscriptsDashboard user={user} />
            </CustomTabPanel>
          )}
          {isAdmin && (
            <CustomTabPanel value={value} index={9}>
              <ReviewerManagement />
            </CustomTabPanel>
          )}
          {isReviewer && (
            <CustomTabPanel value={value} index={5}>
              <StripeManageSubscription />
            </CustomTabPanel>
          )}
          {!isReviewer && (
            <CustomTabPanel value={value} index={isAdmin ? 10 : 4}>
              <StripeManageSubscription />
            </CustomTabPanel>
          )}
        </Box>

      </div>) :
        (<div className='flex justify-center items-center h-96'>
          <DNA
            visible={true}
            height="80"
            width="80"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
          />
        </div>)
      }
    </div>
  )
}

export default ProfileDashboard


