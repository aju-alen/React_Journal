import React, { useEffect, useState } from 'react';
import TableBody from '@mui/material/TableBody';
import Button from '@mui/material/Button';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { Link, useNavigate } from 'react-router-dom';
import { getPdfName, httpRoute, axiosTokenHeader } from '../helperFunctions';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import DashboardTable from './dashboard/DashboardTable';
import StatusChip from './dashboard/StatusChip';
import { SECTIONS } from './dashboard/dashboardSections';
import { dashboardColors } from '../utils/theme';

const FileLink = ({ url }) => {
  if (!url) return null;
  return (
    <Button
      component={Link}
      to={url}
      target="_blank"
      rel="noopener noreferrer"
      size="small"
      startIcon={<DescriptionOutlinedIcon sx={{ fontSize: 16 }} />}
      sx={{
        justifyContent: 'flex-start',
        color: dashboardColors.ink,
        backgroundColor: dashboardColors.peach,
        px: 1,
        py: 0.25,
        fontSize: '0.75rem',
        fontWeight: 500,
        '&:hover': { backgroundColor: '#e8d5cc' },
      }}
    >
      {getPdfName(url)}
    </Button>
  );
};

const MyManuscriptsDashboard = ({ user, onNavigate }) => {
  const navigate = useNavigate();
  const [tick, setTick] = useState(0);
  const [userId, setUserId] = useState('');
  const [emailId, setEmailId] = useState('');
  const [articleId, setArticleId] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentArticleId, setCurrentArticleId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [localArticles, setLocalArticles] = useState(user?.articles || []);

  useEffect(() => {
    setLocalArticles(user?.articles || []);
  }, [user, tick]);

  useEffect(() => {
    const getUser = JSON.parse(localStorage.getItem('currentUser'));
    setUserId(getUser?.user?.id);
    setEmailId(getUser?.user?.email);
    setIsAdmin(getUser?.user?.isAdmin);
  }, []);

  const handleDownloadCertificate = async (
    articleIdArg,
    articleTitle,
    articleIssue,
    articleVolume,
    awsId,
    articleUserId,
    authorGivenName,
    journalAbbreviation,
    journalISSN,
    publishedDate,
    authorLastName
  ) => {
    try {
      setCurrentArticleId(articleIdArg);
      setLoading(true);
      axios.defaults.headers.common['Authorization'] = axiosTokenHeader();
      const response = await axios.post(`${httpRoute}/api/journalArticle/generate`, {
        articleId: articleIdArg,
        articleTitle,
        articleIssue,
        articleVolume,
        awsId,
        userId: articleUserId,
        authorGivenName,
        journalAbbreviation,
        journalISSN,
        publishedDate,
        authorLastName,
      });
      if (response.data.url) {
        window.open(response.data.url, '_blank');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClickOpen = (id) => {
    setOpen(true);
    setArticleId(id);
  };

  const handleClose = () => setOpen(false);

  const handleSupportArticle = () => {
    navigate('/contact/new');
  };

  const handleDeleteArticle = async () => {
    try {
      const response = await axios.delete(
        `${httpRoute}/api/journalArticle/delete-article/${articleId}/${userId}`,
        { headers: { Authorization: axiosTokenHeader() } }
      );
      if (response.status === 200) {
        const updatedUserResp = await axios.get(`${httpRoute}/api/users/${userId}`);
        setLocalArticles(updatedUserResp.data.articles || []);
        handleClose();
        setTick((t) => t + 1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const articles = localArticles;
  const isEmpty = !articles || articles.length === 0;

  return (
    <Box>
      <Typography
        variant="h5"
        component="h2"
        sx={{ fontWeight: 600, color: dashboardColors.ink, mb: 2 }}
      >
        My manuscripts
      </Typography>

      <DashboardTable
        empty={isEmpty}
        emptyTitle="No manuscripts yet"
        emptyHint="Submit a new manuscript to get started."
        emptyActionLabel="Submit manuscript"
        onEmptyAction={() => onNavigate?.(SECTIONS.SUBMIT)}
        ariaLabel="manuscripts table"
        minWidth={900}
      >
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Title</TableCell>
            <TableCell align="center">Messages</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Edit</TableCell>
            <TableCell align="center">Corrections</TableCell>
            <TableCell align="center">PDF</TableCell>
            <TableCell align="center">Certificate</TableCell>
            <TableCell align="center">Payment</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {articles.map((row) => (
            <TableRow key={row.id}>
              <TableCell
                component="th"
                scope="row"
                sx={{
                  fontVariantNumeric: 'tabular-nums',
                  fontSize: '0.75rem',
                  maxWidth: 80,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {row.id?.slice?.(0, 8) || row.id}
              </TableCell>
              <TableCell
                sx={{
                  maxWidth: 200,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontWeight: 500,
                }}
              >
                {row.articleTitle}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  color: row.rejectionText ? 'error.main' : 'text.secondary',
                  maxWidth: 140,
                  fontSize: '0.8rem',
                }}
              >
                {row.rejectionText || '—'}
              </TableCell>
              <TableCell align="center">
                <StatusChip status={row.articleStatus} />
              </TableCell>
              <TableCell align="center">
                {!row.isReview && !row.isPublished ? (
                  <Button
                    component={Link}
                    to={`/editManuscript/${row.userId}/${row.id}`}
                    variant="contained"
                    size="small"
                  >
                    Edit
                  </Button>
                ) : (
                  '—'
                )}
              </TableCell>
              <TableCell align="center">
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'center' }}>
                  {(row.rejectionFilesURL || []).map(
                    (url, index) => url && <FileLink key={index} url={url} />
                  )}
                  {(!row.rejectionFilesURL || row.rejectionFilesURL.length === 0) && '—'}
                </Box>
              </TableCell>
              <TableCell align="center">
                {row.isPublished && row.filesURL?.[0] ? (
                  <FileLink url={row.filesURL[0]} />
                ) : (
                  '—'
                )}
              </TableCell>
              <TableCell align="center">
                <Button
                  variant="outlined"
                  color="success"
                  size="small"
                  disabled={!row.isPublished || (loading && currentArticleId === row.id)}
                  onClick={() =>
                    handleDownloadCertificate(
                      row.id,
                      row.articleTitle,
                      row.articleIssue,
                      row.articleVolume,
                      row.awsId,
                      row.userId,
                      row.articleAuthors?.[0]?.authorGivenName,
                      row.articlePublishedJournal?.journalAbbreviation,
                      row.articlePublishedJournal?.journalISSN,
                      row.publishedDate,
                      row.articleAuthors?.[0]?.authorLastName
                    )
                  }
                  startIcon={
                    loading && currentArticleId === row.id ? (
                      <CircularProgress size={14} color="inherit" />
                    ) : null
                  }
                >
                  {loading && currentArticleId === row.id
                    ? 'Generating…'
                    : 'Certificate'}
                </Button>
              </TableCell>
              <TableCell align="center">
                {!row.paymentStatus ? (
                  <Button
                    component={Link}
                    to={`/checkout/${row.id}/publisharticle/${userId}/${emailId}/manuscript_payment_7875`}
                    variant="contained"
                    size="small"
                  >
                    Pay now
                  </Button>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.75 }}>
                    <StatusChip status="published" label="Paid" />
                    {row.invoiceUrl && (
                      <Button
                        variant="outlined"
                        color="success"
                        size="small"
                        href={row.invoiceUrl}
                        target="_blank"
                        rel="noreferrer"
                        startIcon={<ReceiptLongIcon sx={{ fontSize: 16 }} />}
                      >
                        Invoice
                      </Button>
                    )}
                  </Box>
                )}
              </TableCell>
              <TableCell align="center">
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => handleClickOpen(row.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </DashboardTable>

      <Dialog open={open} onClose={handleClose} aria-labelledby="delete-dialog-title">
        <DialogTitle id="delete-dialog-title">Delete this manuscript?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isAdmin
              ? 'Are you sure you want to delete this manuscript? This cannot be undone.'
              : 'Deleting a manuscript requires support assistance. Contact the support team for help.'}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          {!isAdmin ? (
            <Button onClick={handleSupportArticle} variant="contained" autoFocus>
              Contact support
            </Button>
          ) : (
            <Button onClick={handleDeleteArticle} variant="contained" color="error" autoFocus>
              Delete
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyManuscriptsDashboard;
