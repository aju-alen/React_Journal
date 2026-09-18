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
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

const formatPaymentAmount = (amount, currency) => {
  if (amount == null) {
    return '—';
  }
  const formattedAmount = (amount / 100).toFixed(2);
  const formattedCurrency = currency ? currency.toUpperCase() : '';
  return formattedCurrency ? `${formattedCurrency} ${formattedAmount}` : formattedAmount;
};

const formatPaymentDate = (paymentDate) => {
  if (!paymentDate) {
    return '—';
  }
  return new Date(paymentDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const ManagePurchase = ({ user }) => {
  const navigate = useNavigate()
  const [articles, setArticles] = useState(false);
  const [userId, setUserId] = useState('');
  const [emailId, setEmailId] = useState('');
  const [articleId, setArticleId] = useState('');
  const [open, setOpen] = React.useState(false);


  const [fullIssues, setFullIssues] = useState([]);
  const [manuscriptPayments, setManuscriptPayments] = useState([]);

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

  useEffect(() => {
    const getManuscriptPayments = async () => {
      if (!userId) {
        return;
      }
      try {
        const res = await axios.get(`${httpRoute}/api/users/${userId}`);
        const paidArticles = (res.data?.articles || []).filter((article) => article.paymentStatus);
        setManuscriptPayments(paidArticles);
      }
      catch (err) {
        console.log(err);
      }
    };

    getManuscriptPayments();
  }, [userId]);

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
    <div>
      <h2 style={{ margin: '0 0 12px 0' }}>Manuscript payments</h2>
      <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
        <Table sx={{ minWidth: 650 }} aria-label="manuscript payments table">
          <TableHead>
            <TableRow>
              <TableCell>Payment id</TableCell>
              <TableCell align="center">Article title</TableCell>
              <TableCell align="center">Amount</TableCell>
              <TableCell align="center">Purchase date</TableCell>
              <TableCell align="center">Invoice</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {manuscriptPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">No manuscript payments yet</TableCell>
              </TableRow>
            ) : manuscriptPayments.map((row) => (
              <TableRow
                key={row.paymentIntent || row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.paymentIntent || '—'}
                </TableCell>
                <TableCell align="center">{row.articleTitle}</TableCell>
                <TableCell align="center">{formatPaymentAmount(row.paymentAmount, row.paymentCurrency)}</TableCell>
                <TableCell align="center">{formatPaymentDate(row.paymentDate)}</TableCell>
                <TableCell align="center">
                  {row.invoiceUrl ? (
                    <Button
                      variant="outlined"
                      color="success"
                      size="small"
                      href={row.invoiceUrl}
                      target="_blank"
                      rel="noreferrer"
                      startIcon={<ReceiptLongIcon sx={{ fontSize: 16 }} />}
                      sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 1.5,
                        minHeight: 32,
                        borderColor: '#2e7d32',
                        color: '#1b5e20',
                        '&:hover': {
                          backgroundColor: '#e8f5e9',
                          borderColor: '#1b5e20',
                        },
                      }}
                    >
                      Invoice
                    </Button>
                  ) : (
                    '—'
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <h2 style={{ margin: '0 0 12px 0' }}>Full issue purchases</h2>
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
                    {row.invoice_url ? (
                      <Button
                        variant="outlined"
                        color="success"
                        size="small"
                        href={row.invoice_url}
                        target="_blank"
                        rel="noreferrer"
                        startIcon={<ReceiptLongIcon sx={{ fontSize: 16 }} />}
                        sx={{
                          borderRadius: '8px',
                          textTransform: 'none',
                          fontWeight: 600,
                          px: 1.5,
                          minHeight: 32,
                          borderColor: '#2e7d32',
                          color: '#1b5e20',
                          '&:hover': {
                            backgroundColor: '#e8f5e9',
                            borderColor: '#1b5e20',
                          },
                        }}
                      >
                        Invoice
                      </Button>
                    ) : (
                      '—'
                    )}
                  </TableCell>


                

                </TableRow>

              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
export default ManagePurchase
