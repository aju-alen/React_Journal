import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { httpRoute, axiosTokenHeader } from '../helperFunctions'
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import { useNavigate } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Link } from 'react-router-dom';



const FullIssueSearch = ({ purchase }) => {
  const [getFullIssueData, setGetFullIssueData] = useState([])
  const [userId, setUserId] = useState('')
  const [emailId, setEmailId] = useState('')
  const [fullIssueId, setFullIssueId] = useState('')
  const [purchasedFullIssue, setPurchasedFullIssue] = useState([])
  const [stripeLookupId, setStripeLookupId] = useState('')
  const [getSearchIssue, setGetSearchIssue] = useState([])
  const [imageUrl, setImageUrl] = useState('')
  const [pdfUrl, setPdfUrl] = useState('')

  const [volume, setVolume] = useState('1');
  const [issue, setIssue] = useState('2');

  const [state, setState] = React.useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  });
  const { vertical, horizontal, open } = state;

  const handleClick = (newState) => () => {
    setState({ ...newState, open: true });
    navigate('/login')
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const handleVolumeChange = (event) => {
    setVolume(event.target.value);
  };
  const handleIssueChange = (event) => {
    setIssue(event.target.value);
  };


  useEffect(() => {
    try {
      const getLatestFullIssue = async () => {

        const getFullissueResp = await axios.get(`${httpRoute}/api/fullIssue/getIssue`)

        setGetFullIssueData(getFullissueResp.data.getIssue)


        const getUser = JSON.parse(localStorage.getItem('currentUser'))
        setUserId(getUser?.user?.id)
        setEmailId(getUser?.user?.email)
        console.log(getUser, 'getuser');

        if (getUser !== undefined) {
          axios.defaults.headers.common['Authorization'] = axiosTokenHeader();
          const getFullissuePaymentResp = await axios.get(`${httpRoute}/api/user-fullissue/getfullissue`)
          console.log(getFullissuePaymentResp.data, 'getFullIssue');
          setPurchasedFullIssue(getFullissuePaymentResp.data?.fullIssuePurchasedUser)
        }
      }
      getLatestFullIssue()

    }
    catch (err) {
      console.log(err)
    }

  }, [])

  useEffect(() => {
    const getSearchIssue = async () => {
      const getSearchFullIssue = await axios.get(`${httpRoute}/api/fullIssue/find-issue/${volume}/${issue}`)
      console.log(
        getSearchFullIssue.data.getIssue[0]?.stripe_lookupId
      );
      
      setGetSearchIssue(getSearchFullIssue.data.getIssue[0])
      setImageUrl(getSearchFullIssue.data.getIssue[0]?.issueImageURL)
      setPdfUrl(getSearchFullIssue.data.getIssue[0]?.issueDoccumentURL)
      setFullIssueId(getSearchFullIssue.data.getIssue[0]?.id)
      setStripeLookupId(getSearchFullIssue.data.getIssue[0]?.stripe_lookupId)
    }
    getSearchIssue()

  }, [volume, issue])

  const uniqueIssues = [...new Set(getFullIssueData.map(issue => issue.issueVolume))];

  console.log(getSearchIssue, 'getSearchIssue-api');

  // const ifUserPurchasedFullIssue = purchasedFullIssue?.filter((item) => item.userId === userId && item.fullIssueId === fullIssueId)

  const ifUserPurchasedFullIssue = false

  return (
    <>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Volume</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={volume}
          label="Volume"
          onChange={handleVolumeChange}
        >
          {
            uniqueIssues.map((issueVolume, index) => {
              return (
                <MenuItem key={index} value={issueVolume}>
                  {issueVolume}
                </MenuItem>
              );
            })
          }
        </Select>


      </FormControl>
      <FormControl fullWidth sx={{
        marginTop: '1rem'
      }}>
        <InputLabel id="demo-simple-select-label">Issue</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={issue}
          label="Issue"
          onChange={handleIssueChange}
        >
          {
            getFullIssueData.map((issue, index) => {
              return (
                <MenuItem key={index} value={issue.issueNumber}>
                  {issue.issueNumber}
                </MenuItem>
              )
            })

          }
        </Select>


      </FormControl>

      {(imageUrl && pdfUrl) && (
        <div className=" flex flex-col items-center justify-center">
          {purchase && <h1 className="text-center text-3xl font-bold p-4 ">Purchase Full Issue</h1>}
          {userId === undefined ? (

            <img src={imageUrl} alt="cloud" className='w-64 h-64' onClick={handleClick({ vertical: 'top', horizontal: 'center' })} />

          ) : (
            ifUserPurchasedFullIssue.length === 1 ? (
              <Link to={pdfUrl}>
                <img src={imageUrl} alt="cloud" className='w-64 h-64' />
              </Link>
            ) : (
              <Link to={`/checkout/${fullIssueId}/fullIssue/${userId}/${emailId}/${stripeLookupId}`}>
                <img src={imageUrl} alt="cloud" className='w-64 h-64' />
              </Link>
            )
          )}
        </div>
      )}
      <Box sx={{ width: 500 }}>

        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          onClose={handleClose}
          message="Please Login to Purchase Full Issue"
          key={vertical + horizontal}
        />
      </Box>
    </>
  )
}

export default FullIssueSearch