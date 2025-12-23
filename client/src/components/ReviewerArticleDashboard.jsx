import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Snackbar,
  Alert,
  CircularProgress,
  Box,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { axiosTokenHeader, getPdfName, httpRoute } from '../helperFunctions';
import { Link } from 'react-router-dom';

const ReviewerArticleDashboard = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      axios.defaults.headers.common['Authorization'] = axiosTokenHeader();
      const res = await axios.get(`${httpRoute}/api/journalArticle/reviewer/articles`);
      setArticles(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setLoading(false);
      showAlert(err.response?.data?.message || 'Error fetching articles', 'error');
    }
  };

  const handleAcceptClick = (article) => {
    setSelectedArticle(article);
    setAcceptDialogOpen(true);
  };

  const handleAcceptConfirm = async () => {
    if (!selectedArticle) return;

    try {
      setAccepting(true);
      axios.defaults.headers.common['Authorization'] = axiosTokenHeader();
      await axios.post(`${httpRoute}/api/journalArticle/reviewer/accept/${selectedArticle.id}`);
      setAcceptDialogOpen(false);
      setSelectedArticle(null);
      showAlert('Article accepted successfully', 'success');
      fetchArticles();
    } catch (err) {
      console.error('Error accepting article:', err);
      showAlert(err.response?.data?.message || 'Error accepting article', 'error');
    } finally {
      setAccepting(false);
    }
  };

  const handleAcceptCancel = () => {
    setAcceptDialogOpen(false);
    setSelectedArticle(null);
  };

  const showAlert = (message, severity) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  const getStatusChip = (article) => {
    if (article.isAccepted) {
      if (article.reviewerAcceptedBy) {
        const reviewerName = `${article.reviewerAcceptedBy.title || ''} ${article.reviewerAcceptedBy.surname || ''} ${article.reviewerAcceptedBy.otherName || ''}`.trim();
        return (
          <Chip 
            label={`Accepted by ${reviewerName}`} 
            color="success" 
            size="small" 
          />
        );
      }
      return <Chip label="Accepted" color="success" size="small" />;
    }
    return <Chip label="In Review" color="warning" size="small" />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return 'N/A';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (articles.length === 0) {
    return (
      <Box p={3}>
        <Typography variant="h6" gutterBottom>
          Articles for Review
        </Typography>
        <Typography variant="body1" color="text.secondary">
          No articles available for review at this time.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Articles for Review
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="reviewer articles table">
          <TableHead>
            <TableRow>
              <TableCell><strong>Article Title</strong></TableCell>
              <TableCell><strong>Journal</strong></TableCell>
              <TableCell align="center"><strong>Authors</strong></TableCell>
              <TableCell align="center"><strong>Abstract</strong></TableCell>
              <TableCell align="center"><strong>Status</strong></TableCell>
              <TableCell align="center"><strong>Files</strong></TableCell>
              <TableCell align="center"><strong>Received Date</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {articles.map((article) => (
              <TableRow key={article.id} hover>
                <TableCell component="th" scope="row">
                  {article.articleTitle}
                </TableCell>
                <TableCell>
                  {article.articlePublishedJournal?.journalAbbreviation || 'N/A'}
                </TableCell>
                <TableCell align="center">
                  {Array.isArray(article.articleAuthors) && article.articleAuthors.length > 0
                    ? article.articleAuthors.map((author, idx) => (
                        <div key={idx}>
                          {author.authorGivenName} {author.authorLastName}
                        </div>
                      ))
                    : 'N/A'}
                </TableCell>
                <TableCell align="center" sx={{ maxWidth: 300 }}>
                  {truncateText(article.articleAbstract, 150)}
                </TableCell>
                <TableCell align="center">
                  {getStatusChip(article)}
                </TableCell>
                <TableCell sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }} align="center">
                  {Array.isArray(article.filesURL) && article.filesURL.map((url, idx) => (
                    url && (
                      <Link 
                        key={idx} 
                        to={url} 
                        className='mx-2 bg-indigo-100 rounded-md' 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ fontSize: '10px', marginBottom: '4px' }}
                      >
                        📄{getPdfName(url)}
                      </Link>
                    )
                  ))}
                </TableCell>
                <TableCell align="center">
                  {formatDate(article.articleReceivedDate)}
                </TableCell>
                <TableCell align="center">
                  {!article.isAccepted ? (
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => handleAcceptClick(article)}
                    >
                      Accept
                    </Button>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Accepted
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={acceptDialogOpen}
        onClose={handleAcceptCancel}
        aria-labelledby="accept-dialog-title"
        aria-describedby="accept-dialog-description"
      >
        <DialogTitle id="accept-dialog-title">
          Accept Article
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="accept-dialog-description">
            Are you sure you want to accept this article? Once accepted, it will be marked for final admin approval before publication.
            <br /><br />
            <strong>Article:</strong> {selectedArticle?.articleTitle}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAcceptCancel} disabled={accepting}>
            Cancel
          </Button>
          <Button 
            onClick={handleAcceptConfirm} 
            variant="contained" 
            color="success"
            disabled={accepting}
          >
            {accepting ? <CircularProgress size={20} /> : 'Accept'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alertSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReviewerArticleDashboard;

