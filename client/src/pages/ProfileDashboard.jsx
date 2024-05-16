import { useEffect, useState } from 'react';
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
  const [loading, setLoading] = useState(true)
  let [searchParams, setSearchParams] = useSearchParams();
  const value = Number(searchParams.get("tab") || 0);

  const handleChange = (event, newValue) => {
    setSearchParams((params) => {
      params.set("tab", newValue);
      return params;
    });
  };

  useEffect(() => {
    const getUser = async () => {
      const getUser = await JSON.parse(localStorage.getItem('currentUser'))
      setUserDetails(getUser)
      axios.defaults.headers.common['Authorization'] = `Bearer ${getUser.token}`
      try {

        if (!getUser.user.isAdmin) {
          const resp = await axios.get(`${httpRoute}/api/users/${profileId}`)
          setUser(resp.data)
          setLoading(false)
        }
        else {
          const resp = await axios.get(`${httpRoute}/api/journalArticle/verifyArticles/${profileId}`)
          setUser(resp.data)
          setLoading(false)
        }
      }
      catch (err) {
        console.log(err)
      }
    }

    getUser()
  }, [])
  console.log(userDetails, 'zzzzzz');

  console.log(user, 'userDetails');

  return (
    <div>
      {!loading ? (<div>
        <ImageHeader />
        <h1 className=' text-3xl font-medium mb-6 text-center p-4'>Welcome {`${userDetails?.user?.title} ${userDetails?.user?.surname}`}</h1>
        <Box sx={{ width: '100%' }} >
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }} >
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label={userDetails?.user?.isAdmin ? "Verify Manuscripts" : "My Manuscripts"} {...a11yProps(0)} />
              <Tab label={userDetails?.user?.isAdmin ? "Submit Issue" : "Submit Manuscript"} {...a11yProps(1)} />

              {/* {!userDetails?.user?.isAdmin &&<Tab label=" Submit Manuscript" {...a11yProps(1)} />} */}
              <Tab label="Edit Profile" {...a11yProps(2)} />

              <a href={import.meta.env.VITE_STRIPE_MANAGE_SUBSCRIPTION}><Tab label="Manage Payments" {...a11yProps(3)} /></a>
              <Tab label={userDetails?.user?.isAdmin && "Create new journal" } {...a11yProps(4)} />
              <Tab label={userDetails?.user?.isAdmin && "Send a marketting email" } {...a11yProps(5)} />
            </Tabs>

          </Box>
          <CustomTabPanel value={value} index={0}>
            {userDetails?.user?.isAdmin && <AdminMyManuscriptsDashboard user={user} />}
            {!userDetails?.user?.isAdmin && <MyManuscriptsDashboard user={user} />}

          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>

            {!userDetails?.user?.isAdmin && <SubmitManuscript user={user} />}
            {userDetails?.user?.isAdmin && <SubmitIssue user={user} />}


          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>

            <EditProfile userDetails={userDetails} />
          </CustomTabPanel>

          <CustomTabPanel value={value} index={3}>


          </CustomTabPanel>
          <CustomTabPanel value={value} index={4}>
            <CreateNewJournal />

          </CustomTabPanel>
          <CustomTabPanel value={value} index={5}>
            <CreateMarkettingEmail />

          </CustomTabPanel>
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