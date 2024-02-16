import { useEffect,useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SubmitManuscript from '../components/SubmitManuscript';
import MyManuscriptsDashboard from '../components/MyManuscriptsDashboard';

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
const {profileId} = useParams()
const [user, setUser] = useState({})
const [value, setValue] = useState(0);

const handleChange = (event, newValue) => {
  setValue(newValue);
};

useEffect(() => {
 const getUser = async () => {
  try{
    const resp =await axios.get(`http://localhost:3001/api/users/${profileId}`)
    setUser(resp.data)
  }
  catch(err){
    console.log(err)
  }
 }
 
  getUser()
}, [])
  console.log(user,'zzzzzz');
  
  return (
    <div>
       <img src="./images/cloud-main-img.jpg" alt="cloud" className=' w-full md:h-auto' />
       <h1 className=' text-3xl font-semibold mb-6 text-center p-4'>Welcome {`${user?.title} ${user?.surname}`}</h1>
       <Box sx={{ width: '100%' }} >
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }} >
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Submit Manuscript" {...a11yProps(0)} />
                        <Tab label="My Manuscripts" {...a11yProps(1)} />
                        <Tab label="Item Three" {...a11yProps(2)} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>

                  <SubmitManuscript user={user}/>

                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>

                  <MyManuscriptsDashboard user={user}/>

                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                  
                    Item Three

                </CustomTabPanel>
            </Box>

    </div>
  )
}

export default ProfileDashboard