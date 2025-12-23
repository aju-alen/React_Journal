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
  Typography
} from '@mui/material';
import { axiosTokenHeader, httpRoute } from '../helperFunctions';

const ReviewerManagement = () => {
  const [reviewers, setReviewers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  useEffect(() => {
    fetchReviewers();
  }, []);

  const fetchReviewers = async () => {
    try {
      setLoading(true);
      axios.defaults.headers.common['Authorization'] = axiosTokenHeader();
      const res = await axios.get(`${httpRoute}/api/reviewer/all`);
      setReviewers(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching reviewers:', err);
      setLoading(false);
      showAlert('Error fetching reviewers', 'error');
    }
  };

  const handleApprove = async (userId) => {
    try {
      axios.defaults.headers.common['Authorization'] = axiosTokenHeader();
      await axios.post(`${httpRoute}/api/reviewer/approve/${userId}`);
      showAlert('Reviewer approved successfully', 'success');
      fetchReviewers();
    } catch (err) {
      console.error('Error approving reviewer:', err);
      showAlert(err.response?.data?.message || 'Error approving reviewer', 'error');
    }
  };

  const handleReject = async (userId) => {
    try {
      axios.defaults.headers.common['Authorization'] = axiosTokenHeader();
      await axios.post(`${httpRoute}/api/reviewer/reject/${userId}`);
      showAlert('Reviewer rejected successfully', 'success');
      fetchReviewers();
    } catch (err) {
      console.error('Error rejecting reviewer:', err);
      showAlert(err.response?.data?.message || 'Error rejecting reviewer', 'error');
    }
  };

  const showAlert = (message, severity) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  const getStatusChip = (approved) => {
    if (approved) {
      return <Chip label="Approved" color="success" size="small" />;
    } else {
      return <Chip label="Pending" color="warning" size="small" />;
    }
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (reviewers.length === 0) {
    return (
      <Box p={3}>
        <Typography variant="h6" gutterBottom>
          Reviewer Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          No reviewers found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Reviewer Management
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="reviewer management table">
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Affiliation</strong></TableCell>
              <TableCell align="center"><strong>Status</strong></TableCell>
              <TableCell align="center"><strong>CV</strong></TableCell>
              <TableCell align="center"><strong>Registration Date</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviewers.map((reviewer) => (
              <TableRow key={reviewer.id} hover>
                <TableCell>
                  {reviewer.title} {reviewer.surname} {reviewer.otherName}
                </TableCell>
                <TableCell>{reviewer.email}</TableCell>
                <TableCell>{reviewer.title || 'N/A'}</TableCell>
                <TableCell>{reviewer.affiliation || 'N/A'}</TableCell>
                <TableCell align="center">
                  {getStatusChip(reviewer.reviewerApproved)}
                </TableCell>
                <TableCell align="center">
                  {reviewer.cvUrl ? (
                    <Button
                      variant="outlined"
                      size="small"
                      href={reviewer.cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View CV
                    </Button>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No CV
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="center">
                  {formatDate(reviewer.createdAt)}
                </TableCell>
                <TableCell align="center">
                  {!reviewer.reviewerApproved ? (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleApprove(reviewer.id)}
                        sx={{ mr: 1 }}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleReject(reviewer.id)}
                      >
                        Reject
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleReject(reviewer.id)}
                    >
                      Revoke
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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

export default ReviewerManagement;

