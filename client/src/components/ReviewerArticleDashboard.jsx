import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Box,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { axiosTokenHeader, getPdfName, httpRoute } from '../helperFunctions';
import { Link } from 'react-router-dom';
import DashboardTable from './dashboard/DashboardTable';
import StatusChip from './dashboard/StatusChip';
import { dashboardColors } from '../utils/theme';

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
    } catch (err) {
      console.error('Error fetching articles:', err);
      showAlert(err.response?.data?.message || 'Error fetching articles', 'error');
    } finally {
      setLoading(false);
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
      await axios.post(
        `${httpRoute}/api/journalArticle/reviewer/accept/${selectedArticle.id}`
      );
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

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '—';
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}…`;
  };

  return (
    <Box>
      <Typography
        variant="h5"
        component="h2"
        sx={{ fontWeight: 600, color: dashboardColors.ink, mb: 2 }}
      >
        Articles for review
      </Typography>

      <DashboardTable
        loading={loading}
        empty={!loading && articles.length === 0}
        emptyTitle="No articles available for review"
        emptyHint="Assigned articles will appear here when they are ready."
        ariaLabel="reviewer articles"
        minWidth={800}
      >
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Journal</TableCell>
            <TableCell align="center">Authors</TableCell>
            <TableCell>Abstract</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Files</TableCell>
            <TableCell align="center">Received</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {articles.map((article) => (
            <TableRow key={article.id}>
              <TableCell component="th" scope="row" sx={{ fontWeight: 500, maxWidth: 180 }}>
                {article.articleTitle}
              </TableCell>
              <TableCell>
                {article.articlePublishedJournal?.journalAbbreviation || '—'}
              </TableCell>
              <TableCell align="center" sx={{ fontSize: '0.85rem' }}>
                {Array.isArray(article.articleAuthors) && article.articleAuthors.length > 0
                  ? article.articleAuthors.map((author, idx) => (
                      <div key={idx}>
                        {author.authorGivenName} {author.authorLastName}
                      </div>
                    ))
                  : '—'}
              </TableCell>
              <TableCell sx={{ maxWidth: 220, color: 'text.secondary', fontSize: '0.85rem' }}>
                {truncateText(article.articleAbstract, 120)}
              </TableCell>
              <TableCell align="center">
                {article.isAccepted ? (
                  <StatusChip
                    status="accepted"
                    label={
                      article.reviewerAcceptedBy
                        ? `Accepted by ${article.reviewerAcceptedBy.surname || 'reviewer'}`
                        : 'Accepted'
                    }
                  />
                ) : (
                  <StatusChip status="in review" />
                )}
              </TableCell>
              <TableCell align="center">
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5 }}>
                  {(article.filesURL || []).filter(Boolean).map((url, idx) => (
                    <Button
                      key={idx}
                      component={Link}
                      to={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                      startIcon={<DescriptionOutlinedIcon sx={{ fontSize: 14 }} />}
                      sx={{
                        color: dashboardColors.ink,
                        backgroundColor: dashboardColors.peach,
                        fontSize: '0.7rem',
                        px: 1,
                        py: 0.25,
                        '&:hover': { backgroundColor: '#e8d5cc' },
                      }}
                    >
                      {getPdfName(url)}
                    </Button>
                  ))}
                </Box>
              </TableCell>
              <TableCell align="center" sx={{ fontVariantNumeric: 'tabular-nums' }}>
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
      </DashboardTable>

      <Dialog
        open={acceptDialogOpen}
        onClose={handleAcceptCancel}
        aria-labelledby="accept-dialog-title"
      >
        <DialogTitle id="accept-dialog-title">Accept article</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Accepting marks this article for final admin approval before publication.
            <br /><br />
            <strong>Article:</strong> {selectedArticle?.articleTitle}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleAcceptCancel} disabled={accepting} variant="outlined">
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
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setAlertOpen(false)}
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
