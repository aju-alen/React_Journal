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
  Box,
  Typography,
} from '@mui/material';
import { axiosTokenHeader, httpRoute } from '../helperFunctions';
import DashboardTable from './dashboard/DashboardTable';
import StatusChip from './dashboard/StatusChip';
import { dashboardColors } from '../utils/theme';

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
    } catch (err) {
      console.error('Error fetching reviewers:', err);
      showAlert('Error fetching reviewers', 'error');
    } finally {
      setLoading(false);
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

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Box>
      <Typography
        variant="h5"
        component="h2"
        sx={{ fontWeight: 600, color: dashboardColors.ink, mb: 2 }}
      >
        Reviewer management
      </Typography>

      <DashboardTable
        loading={loading}
        empty={!loading && reviewers.length === 0}
        emptyTitle="No reviewers found"
        emptyHint="Registered reviewer applications will appear here."
        ariaLabel="reviewer management"
        minWidth={800}
      >
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Affiliation</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">CV</TableCell>
            <TableCell align="center">Registered</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reviewers.map((reviewer) => (
            <TableRow key={reviewer.id}>
              <TableCell sx={{ fontWeight: 500 }}>
                {reviewer.title} {reviewer.surname} {reviewer.otherName}
              </TableCell>
              <TableCell>{reviewer.email}</TableCell>
              <TableCell>{reviewer.title || '—'}</TableCell>
              <TableCell>{reviewer.affiliation || '—'}</TableCell>
              <TableCell align="center">
                {reviewer.reviewerApproved ? (
                  <StatusChip status="accepted" label="Approved" />
                ) : (
                  <StatusChip status="pending" />
                )}
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
              <TableCell align="center" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                {formatDate(reviewer.createdAt)}
              </TableCell>
              <TableCell align="center">
                {!reviewer.reviewerApproved ? (
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => handleApprove(reviewer.id)}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleReject(reviewer.id)}
                    >
                      Reject
                    </Button>
                  </Box>
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
      </DashboardTable>

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

export default ReviewerManagement;
