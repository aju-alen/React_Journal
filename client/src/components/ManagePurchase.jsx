import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Button from '@mui/material/Button';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link } from 'react-router-dom';
import { getPdfName, httpRoute } from '../helperFunctions';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useNavigate } from 'react-router-dom';

const ManagePurchase = ({ user }) => {
  const navigate = useNavigate()
  const [articles, setArticles] = useState(false);
  const [userId, setUserId] = useState('');
  const [emailId, setEmailId] = useState('');
  const [articleId, setArticleId] = useState('');
  const [open, setOpen] = React.useState(false);


  const [fullIssues, setFullIssues] = useState([]);

  const getAllPurchasedIssues = async () => {
    try {
      const res = await axios.get(`${httpRoute}/api/user-fullissue/getfullissue`);
        console.log(res.data, 'fullIssues');
      setFullIssues(res.data.fullIssuePurchasedUser);
    }
    catch (err) {
      console.log(err);
    }

  }
  useEffect(() => {
    getAllPurchasedIssues()
  }, []);

  const handleClickOpen = (id) => {
    setOpen(true);
    setArticleId(id)
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setArticles(prev => !prev)
  }, [user]);

  useEffect(() => {
    const getUser = JSON.parse(localStorage.getItem('currentUser'))
    setUserId(getUser?.user?.id)
    setEmailId(getUser?.user?.email)
  }, []);

  const handleDeleteArticle = async () => {
 //There exist a delete article route in the backend which is not implemented in the frontend
    try{
      navigate('/contact/new')
    }
    catch(err){
      console.log(err)
    }
  }

  console.log(fullIssues, 'user details');
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Payment intent</TableCell>
            <TableCell align="center">Full Issue Vol</TableCell>
            <TableCell align="center">Full Issue Number</TableCell>
            <TableCell align="center">Full Issue Pdf</TableCell>
            <TableCell align="center">Full Issue Purchase invoice</TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
          {fullIssues?.map((row) => {
            console.log(row, 'rowData');
            return (
              <TableRow
                key={row.payment_intent}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.payment_intent}
                </TableCell>
                <TableCell align="center">{row.fullIssue["issueVolume"]}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">{row.fullIssue["issueNumber"]}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">
                    <a href={row.fullIssue["issueDoccumentURL"]} target="_blank" rel="noreferrer">
                    📄 Download Pdf
                    </a>
                    </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">
                    <a href={row.invoice_url} target="_blank" rel="noreferrer">
                    🧾 Download Invoice
                    </a>
                    </TableCell>


              

              </TableRow>

            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export default ManagePurchase