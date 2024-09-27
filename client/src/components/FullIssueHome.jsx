import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { httpRoute, axiosTokenHeader } from '../helperFunctions'
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';

const FullIssueHome = ({ purchase }) => {
    const navigate = useNavigate()
    const [imageUrl, setImageUrl] = useState('')
    const [pdfUrl, setPdfUrl] = useState('')
    const [fullIssueId, setFullIssueId] = useState('')
    const [userId, setUserId] = useState('')
    const [emailId, setEmailId] = useState('')
    const [purchasedFullIssue, setPurchasedFullIssue] = useState([])
    const [allFullIssue, setAllFullIssue] = useState([])

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

    useEffect(() => {
        try {
            const getLatestFullIssue = async () => {

                const getFullissueResp = await axios.get(`${httpRoute}/api/fullIssue/getIssue`)
                setAllFullIssue(getFullissueResp.data.getIssue)



                setImageUrl(getFullissueResp.data.getIssue[0]?.issueImageURL)
                setPdfUrl(getFullissueResp.data.getIssue[0]?.issueDoccumentURL)
                setFullIssueId(getFullissueResp.data.getIssue[0]?.id)

                const getUser = JSON.parse(localStorage.getItem('currentUser'))
                setUserId(getUser?.user?.id)
                setEmailId(getUser?.user?.email)
                console.log(getUser, 'getuser');

                if (getUser !== undefined) {
                    axios.defaults.headers.common['Authorization'] = axiosTokenHeader();
                    const getFullissuePaymentResp = await axios.get(`${httpRoute}/api/user-fullissue/getfullissue`)
                    console.log(getFullissuePaymentResp.data, 'getFullIssue--purchase');
                    setPurchasedFullIssue(getFullissuePaymentResp.data?.fullIssuePurchasedUser)
                }
            }
            getLatestFullIssue()

        }
        catch (err) {
            console.log(err)
        }

    }, [])
    // console.log(imageUrl, pdfUrl, 'urls');
    console.log(purchasedFullIssue, 'userfullissue api data');
    console.log(userId, emailId, 'userId');
    const ifUserPurchasedFullIssue = purchasedFullIssue?.filter((item) => item.userId === userId && item.fullIssueId === fullIssueId)


    console.log(allFullIssue, 'allFullIssue--all');
    
    return (
        <>
            {/* <h1 className="text-center text-3xl font-bold p-4 ">Purchase Full Issue</h1> */}
            <div className="flex justify-center align-middle">
  <Carousel
    className=""
    width="240px"
    showThumbs={false}
    showArrows={true}
    infiniteLoop={true} // Turn off infinite loop
  >
    {allFullIssue.map((issue, index) => (
      <div key={index}> {/* Ensure each element has a unique key */}
        {userId === undefined ? (
          <img
            src={issue?.issueImageURL}
            alt="cloud"
            className="w-64 h-64"
            onClick={handleClick({ vertical: 'top', horizontal: 'center' })}
          />
        ) : (
          ifUserPurchasedFullIssue.length === 1 ? (
            <Link to={issue?.issueDoccumentURL}>
              <img
                src={issue?.issueImageURL}
                alt="cloud"
                className="w-64 h-64"
              />
            </Link>
          ) : (
            <Link
              to={`/checkout/${fullIssueId}/fullIssue/${userId}/${emailId}/vol${issue.issueVolume}Issue${issue.issueNumber}`}
            >
              <img
                src={issue?.issueImageURL}
                alt="cloud"
                className="w-64 h-64"
              />
            </Link>
          )
        )}
      </div>
    ))}

    <Box sx={{ width: 500 }}>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleClose}
        message="Please Login to Purchase Full Issue"
        key={vertical + horizontal}
      />
    </Box>
  </Carousel>
</div>
        </>
    )

}

export default FullIssueHome