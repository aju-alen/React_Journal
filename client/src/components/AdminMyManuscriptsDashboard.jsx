import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { Button, Stack } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { axiosTokenHeader, getPdfName, httpRoute } from '../helperFunctions';
import DashboardTable from './dashboard/DashboardTable';
import StatusChip from './dashboard/StatusChip';
import { dashboardColors } from '../utils/theme';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const TITLE_MAX = 40;
const ABSTRACT_MAX = 50;
const KEYWORDS_MAX = 30;

const truncate = (text, max) => {
  if (!text) return '—';
  if (text.length <= max) return text;
  return `${text.substring(0, max)}…`;
};

const needsReadMore = (text, max) => Boolean(text && text.length > max);

const formatDate = (dateString) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const FileLink = ({ url }) => {
  if (!url) return null;
  return (
    <Button
      component={Link}
      to={url}
      target="_blank"
      rel="noopener noreferrer"
      size="small"
      startIcon={<DescriptionOutlinedIcon sx={{ fontSize: 14 }} />}
      sx={{
        justifyContent: 'flex-start',
        color: dashboardColors.ink,
        backgroundColor: dashboardColors.peach,
        px: 1,
        py: 0.25,
        fontSize: '0.7rem',
        fontWeight: 500,
        mb: 0.5,
        '&:hover': { backgroundColor: '#e8d5cc' },
      }}
    >
      {getPdfName(url)}
    </Button>
  );
};

const AdminMyManuscriptsDashboard = ({ user, onDelete }) => {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [acceptOpen, setAcceptOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [emailId, setEmailId] = useState('');
  const [files, setFiles] = useState([]);
  const [rejectionText, setRejectionText] = useState('');
  const [loading, setLoading] = useState(false);
  const [acceptError, setAcceptError] = useState('');
  const [detailDialog, setDetailDialog] = useState(null);

  const handleOpenReject = (row) => {
    setSelected(row);
    setEmailId(row.articleAuthors?.[0]?.authorEmail || '');
    setFiles([]);
    setRejectionText('');
    setRejectOpen(true);
  };

  const handleOpenAccept = (row) => {
    setSelected(row);
    setEmailId(row.articleAuthors?.[0]?.authorEmail || '');
    setAcceptError('');
    setAcceptOpen(true);
  };

  const handleCloseReject = () => {
    setRejectOpen(false);
    setSelected(null);
    setFiles([]);
  };

  const handleCloseAccept = () => {
    setAcceptOpen(false);
    setSelected(null);
    setAcceptError('');
  };

  const handleFileChange = (event) => {
    if (event.target.files?.[0]) {
      setFiles((prev) => [...prev, event.target.files[0]]);
    }
  };

  const handleAcceptManuscript = async () => {
    if (!selected) return;
    try {
      setLoading(true);
      setAcceptError('');
      axios.defaults.headers.common['Authorization'] = axiosTokenHeader();
      await axios.put(
        `${httpRoute}/api/journalArticle/verifyArticles/acceptManuscript`,
        { articleId: selected.id }
      );
      onDelete?.();
      handleCloseAccept();
    } catch (err) {
      console.error(err);
      setAcceptError(err.response?.data?.message || 'Error accepting manuscript');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectSubmit = async (event) => {
    event.preventDefault();
    if (!selected) return;
    try {
      setLoading(true);
      const fileData = new FormData();
      for (const file of files) {
        fileData.append('s3Files', file);
      }

      await axios.post(
        `${httpRoute}/api/s3/rejection/upload/${selected.awsId}/${selected.userId}`,
        fileData
      );
      const fileGet = await axios.get(
        `${httpRoute}/api/s3/rejection/${selected.awsId}/${selected.userId}`
      );
      const filesUrl = fileGet.data.files;

      axios.defaults.headers.common['Authorization'] = axiosTokenHeader();
      await axios.post(
        `${httpRoute}/api/journalArticle/verifyArticles/sendRejectionText`,
        {
          rejectionText,
          articleId: selected.id,
          filesUrl,
          emailId,
        }
      );
      onDelete?.();
      handleCloseReject();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isEmpty = !Array.isArray(user) || user.length === 0;

  return (
    <>
      <DashboardTable
        empty={isEmpty}
        emptyTitle="No manuscripts to verify"
        emptyHint="When new submissions arrive, they will appear in this queue."
        ariaLabel="verification queue"
        minWidth={1000}
      >
        <TableHead>
          <TableRow>
            <TableCell>Author</TableCell>
            <TableCell>Updated</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Abstract</TableCell>
            <TableCell>Keywords</TableCell>
            <TableCell align="center">Files</TableCell>
            <TableCell align="center">Payment</TableCell>
            <TableCell align="center">Reviewer</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {user?.map((row) => (
            <TableRow key={row.id}>
              <TableCell sx={{ fontSize: '0.85rem' }}>
                {row.articleAuthors?.[0]?.authorEmail || '—'}
              </TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                {formatDate(row.updatedAt)}
              </TableCell>
              <TableCell sx={{ fontWeight: 500, maxWidth: 160 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {truncate(row.articleTitle, TITLE_MAX)}
                </Typography>
                {needsReadMore(row.articleTitle, TITLE_MAX) && (
                  <Button
                    size="small"
                    onClick={() => setDetailDialog(row)}
                    sx={{ mt: 0.25, p: 0, minWidth: 0, fontSize: '0.75rem' }}
                  >
                    Read more
                  </Button>
                )}
              </TableCell>
              <TableCell sx={{ maxWidth: 180 }}>
                <Typography variant="body2" color="text.secondary">
                  {truncate(row.articleAbstract, ABSTRACT_MAX)}
                </Typography>
                {needsReadMore(row.articleAbstract, ABSTRACT_MAX) && (
                  <Button
                    size="small"
                    onClick={() => setDetailDialog(row)}
                    sx={{ mt: 0.25, p: 0, minWidth: 0, fontSize: '0.75rem' }}
                  >
                    Read more
                  </Button>
                )}
              </TableCell>
              <TableCell sx={{ maxWidth: 120, fontSize: '0.8rem' }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  {truncate(row.articleKeywords, KEYWORDS_MAX)}
                </Typography>
                {needsReadMore(row.articleKeywords, KEYWORDS_MAX) && (
                  <Button
                    size="small"
                    onClick={() => setDetailDialog(row)}
                    sx={{ mt: 0.25, p: 0, minWidth: 0, fontSize: '0.75rem' }}
                  >
                    Read more
                  </Button>
                )}
              </TableCell>
              <TableCell align="center">
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  {(row.filesURL || []).filter(Boolean).map((url, i) => (
                    <FileLink key={i} url={url} />
                  ))}
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.75,
                  }}
                >
                  {row.paymentStatus ? (
                    <StatusChip status="published" label="Paid" />
                  ) : (
                    <StatusChip status="pending" label="Unpaid" color="warning" />
                  )}
                  {row.paymentStatus && row.invoiceUrl && (
                    <Button
                      size="small"
                      href={row.invoiceUrl}
                      target="_blank"
                      rel="noreferrer"
                      sx={{ fontSize: '0.7rem', minWidth: 0, p: 0 }}
                    >
                      Invoice
                    </Button>
                  )}
                </Box>
              </TableCell>
              <TableCell align="center">
                {row.isAccepted ? (
                  <Box>
                    <StatusChip status="accepted" />
                    {row.reviewerAcceptedBy && (
                      <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                        {row.reviewerAcceptedBy.title} {row.reviewerAcceptedBy.surname}
                      </Typography>
                    )}
                  </Box>
                ) : (
                  <StatusChip status="pending" label="Pending review" color="warning" />
                )}
              </TableCell>
              <TableCell align="center">
                <Stack direction="row" spacing={1} justifyContent="center">
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    startIcon={<CheckCircleOutlineIcon />}
                    onClick={() => handleOpenAccept(row)}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<CancelOutlinedIcon />}
                    onClick={() => handleOpenReject(row)}
                  >
                    Reject
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </DashboardTable>

      {/* Accept dialog — single instance */}
      <Dialog open={acceptOpen} onClose={handleCloseAccept} aria-labelledby="accept-title">
        <DialogTitle id="accept-title">Accept this manuscript?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selected?.isAccepted && selected?.reviewerAcceptedBy ? (
              <>
                Accepted by reviewer:{' '}
                <strong>
                  {`${selected.reviewerAcceptedBy.title || ''} ${selected.reviewerAcceptedBy.surname || ''} ${selected.reviewerAcceptedBy.otherName || ''}`.trim()}
                </strong>{' '}
                ({selected.reviewerAcceptedBy.email}).
                <br /><br />
                Publishing will make it available to the public. This cannot be undone.
              </>
            ) : (
              'Publishing will make this manuscript available to the public. This cannot be undone.'
            )}
          </DialogContentText>
          {acceptError && (
            <DialogContentText sx={{ color: 'error.main', mt: 2 }}>
              {acceptError}
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseAccept} disabled={loading} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleAcceptManuscript}
            disabled={loading}
            variant="contained"
            color="success"
          >
            {loading ? 'Publishing…' : 'Accept manuscript'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject dialog — single instance */}
      <Dialog
        open={rejectOpen}
        onClose={handleCloseReject}
        PaperProps={{ component: 'form', onSubmit: handleRejectSubmit }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Rejection message</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Explain why this article was rejected. Optional correction files can be attached.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            name="text"
            label="Rejection message"
            type="text"
            fullWidth
            multiline
            minRows={3}
            variant="outlined"
            value={rejectionText}
            onChange={(e) => setRejectionText(e.target.value)}
          />
          <Stack spacing={1} sx={{ mt: 2 }}>
            {['Cover letter', 'Manuscript file', 'Supplementary file'].map((label) => (
              <Button
                key={label}
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
              >
                {label}
                <VisuallyHiddenInput
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
              </Button>
            ))}
            {files.length > 0 && (
              <Typography variant="caption" color="text.secondary">
                {files.length} file{files.length === 1 ? '' : 's'} selected
              </Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseReject} disabled={loading} variant="outlined">
            Cancel
          </Button>
          <Button type="submit" disabled={loading} variant="contained" color="error">
            {loading ? 'Sending…' : 'Send rejection'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Title / abstract / keywords expand */}
      <Dialog
        open={Boolean(detailDialog)}
        onClose={() => setDetailDialog(null)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{ color: dashboardColors.ink, fontWeight: 600 }}>
          Manuscript details
        </DialogTitle>
        <DialogContent dividers>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, color: dashboardColors.ink, mb: 0.5 }}
          >
            Title
          </Typography>
          <DialogContentText sx={{ whiteSpace: 'pre-wrap', mb: 2.5, color: 'text.primary' }}>
            {detailDialog?.articleTitle || '—'}
          </DialogContentText>

          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, color: dashboardColors.ink, mb: 0.5 }}
          >
            Abstract
          </Typography>
          <DialogContentText sx={{ whiteSpace: 'pre-wrap', mb: 2.5, color: 'text.primary' }}>
            {detailDialog?.articleAbstract || '—'}
          </DialogContentText>

          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, color: dashboardColors.ink, mb: 0.5 }}
          >
            Keywords
          </Typography>
          <DialogContentText sx={{ whiteSpace: 'pre-wrap', color: 'text.primary' }}>
            {detailDialog?.articleKeywords || '—'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialog(null)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminMyManuscriptsDashboard;
