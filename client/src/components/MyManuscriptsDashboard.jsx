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
import { axiosTokenHeader } from '../helperFunctions';


const MyManuscriptsDashboard = ({ user }) => {
  const navigate = useNavigate()
  const [articles, setArticles] = useState(false);
  const [userId, setUserId] = useState('');
  const [emailId, setEmailId] = useState('');
  const [articleId, setArticleId] = useState('');
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [certificateUrl, setCertificateUrl] = useState(null);
  const [currentArticleId, setCurrentArticleId] = useState(null);

  console.log(currentArticleId, 'currentArticleId');
  

  const handleDownloadCertificate = async (
    articleId,
    articleTitle,
    articleIssue,
    articleVolume,
    awsId,
    userId,
    authorGivenName,
    journalAbbreviation,
    publishedDate,
    authorLastName) => {
      console.log('123123123123123123123123');
      try {
        setCurrentArticleId(articleId);
        setLoading(true);
        const certificateData = {
          articleId,
          articleTitle,
          articleIssue,
          articleVolume,
          awsId,
          userId,
          authorGivenName,
          journalAbbreviation,
          publishedDate,
          authorLastName
        }
        axios.defaults.headers.common['Authorization'] = axiosTokenHeader();
        const response = await axios.post(`${httpRoute}/api/journalArticle/generate`,certificateData)
        console.log(response, 'response in generate certificate');
        setLoading(false);
        setCertificateUrl(response.data.url);
        
        if (response.data.url) {
          window.open(response.data.url, '_blank');
        }
        setLoading(false);
      }
      catch (err) {
        console.log(err);
        setLoading(false);
      }
      finally {
        setLoading(false);
      }
  
    }
  

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

  return (
    <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, margin: '20px 0' }}>
      <Table sx={{ minWidth: 650 }} aria-label="manuscripts table">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell sx={{ fontWeight: 'bold' }}>Manuscript ID</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Article Title</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Message History</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Status</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Edit</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Correction Files</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Download PDF</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Certificate</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Payment</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {user?.articles?.length > 0 ? (
            user.articles.map((row) => (
              <TableRow
                key={row.id}
                sx={{ 
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                  '&:hover': { backgroundColor: '#f0f7ff' },
                  transition: 'background-color 0.2s'
                }}
              >
                <TableCell component="th" scope="row" sx={{ fontWeight: 'medium' }}>
                  {row.id}
                </TableCell>
                <TableCell align="left" sx={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {row.articleTitle}
                </TableCell>
                <TableCell align="center" sx={{ color: row.rejectionText ? '#d32f2f' : 'inherit' }}>
                  {row.rejectionText}
                </TableCell>
                <TableCell align="center">
                  <span style={{ 
                    padding: '6px 12px', 
                    borderRadius: '16px', 
                    backgroundColor: row.articleStatus === 'Published' ? '#e8f5e9' : 
                                     row.articleStatus === 'Rejected' ? '#ffebee' : 
                                     row.articleStatus === 'Under Review' ? '#fff8e1' : '#e3f2fd',
                    color: row.articleStatus === 'Published' ? '#2e7d32' : 
                           row.articleStatus === 'Rejected' ? '#c62828' : 
                           row.articleStatus === 'Under Review' ? '#f57f17' : '#1565c0',
                    fontWeight: 'bold',
                    fontSize: '0.85rem'
                  }}>
                    {row.articleStatus}
                  </span>
                </TableCell>
                
                {!row.isReview && !row.isPublished ? (
                  <TableCell align="center">
                    <Link to={`/editManuscript/${row.userId}/${row.id}`} style={{ textDecoration: 'none' }}>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        size="small"
                        sx={{ borderRadius: '8px', textTransform: 'none' }}
                      >
                        Edit
                      </Button>
                    </Link>
                  </TableCell>
                ) : <TableCell></TableCell>}

                {row.rejectionFilesURL.length !== 0 ? (
                  <TableCell align="center" sx={{ padding: '8px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                      {row.rejectionFilesURL.map((url, index) => (
                        url && (
                          <Link 
                            key={index}
                            to={url} 
                            className='mx-2 bg-indigo-100 rounded-md'
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ 
                              textDecoration: 'none', 
                              color: '#1976d2',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              backgroundColor: '#e3f2fd',
                              display: 'flex',
                              alignItems: 'center',
                              fontSize: '0.85rem',
                              width: 'fit-content'
                            }}
                          >
                            📄 {getPdfName(url)}
                          </Link>
                        )
                      ))}
                    </div>
                  </TableCell>
                ) : <TableCell></TableCell>}

                <TableCell align="center">
                  {row.isPublished && row.filesURL[0] && (
                    <Link 
                      to={row.filesURL[0]} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ 
                        textDecoration: 'none', 
                        color: '#1976d2',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: '#e3f2fd',
                        display: 'inline-flex',
                        alignItems: 'center',
                        fontSize: '0.85rem'
                      }}
                    >
                      📄 {getPdfName(row.filesURL[0])}
                    </Link>
                  )}
                </TableCell>
                
                <TableCell align="center">
                  
                    <Button 
                      variant='outlined' 
                      color='success'
                      size="small"
                      sx={{ borderRadius: '8px', textTransform: 'none' }}
                      onClick={() => handleDownloadCertificate(
                        row.id, row.articleTitle, 
                        row.articleIssue,
                        row.articleVolume,
                        row.awsId,
                        row.userId,
                        row.articleAuthors[0].authorGivenName,
                        row.articlePublishedJournal.journalAbbreviation,
                        row.publishedDate,
                        row.articleAuthors[0].authorLastName
                      )}
                      disabled={!row.isPublished}
                    >
                      { currentArticleId === row.id ? 'Download Certificate' : 'Generate Certificate'}
                    </Button>
                  
                </TableCell>

                <TableCell align="center">
                  {!row.paymentStatus ? (
                    <Link to={`/checkout/${row.id}/publisharticle/${userId}/${emailId}`} style={{ textDecoration: 'none' }}>
                      <Button 
                        variant="contained" 
                        color="primary"
                        size="small"
                        sx={{ borderRadius: '8px', textTransform: 'none' }}
                      >
                        Pay Now
                      </Button>
                    </Link>
                  ) : (
                    <span style={{ 
                      padding: '6px 12px', 
                      borderRadius: '16px', 
                      backgroundColor: '#e8f5e9',
                      color: '#2e7d32',
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                      display: 'inline-block'
                    }}>
                      Paid
                    </span>
                  )}
                </TableCell>

                <TableCell align="center">
                  <Button 
                    variant="outlined" 
                    color="error"
                    size="small"
                    sx={{ borderRadius: '8px', textTransform: 'none' }}
                    onClick={() => handleClickOpen(row.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1.1rem', color: '#666' }}>No manuscripts found</span>
                  <span style={{ fontSize: '0.9rem', color: '#888' }}>Submit a new manuscript to get started</span>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      {/* Delete Manuscript Dialog Box */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: { borderRadius: 2, padding: 1 }
        }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 'bold' }}>
          {"Want to delete this manuscript?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deleting this manuscript can only be done by the support team. Contact support team for further assistance.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: '16px' }}>
          <Button onClick={handleClose} variant="outlined" sx={{ borderRadius: '8px', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteArticle} 
            autoFocus 
            variant="contained" 
            color="primary"
            sx={{ borderRadius: '8px', textTransform: 'none' }}
          >
            Contact Support
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
}
export default MyManuscriptsDashboard