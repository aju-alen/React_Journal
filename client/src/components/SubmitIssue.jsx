import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Alert,
} from '@mui/material';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import PublishIcon from '@mui/icons-material/Publish';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { httpRoute } from '../helperFunctions';
import FormSection from './dashboard/FormSection';

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

export default function SubmitIssue() {
  const [files, setFiles] = useState([]);
  const [journalCategory, setJournalCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [alertStatus, setAlertStatus] = useState('success');
  const [alertText, setAlertText] = useState('');
  const [formData, setFormData] = useState({
    issueVolume: '',
    journalId: '',
    issuePrice: '',
    issueNumber: '',
    stripeName: '',
    stripeDescription: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleChangeIssue = (event) => {
    setFiles((prev) => [...prev, event.target.files]);
  };

  const handleFormChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const awsId = uuidv4();
      const fileData = new FormData();
      for (const file of files) {
        fileData.append('s3FullIssue', file[0]);
      }
      await axios.post(`${httpRoute}/api/s3/fullIssue/${awsId}`, fileData);
      const getUrlFromAWS = await axios.get(
        `${httpRoute}/api/s3/fullIssue/get/${awsId}`
      );
      const filesUrl = getUrlFromAWS.data.files;

      let issueDoccumentURL;
      let issueImageURL;

      filesUrl.forEach((url) => {
        if (url.includes('.pdf')) {
          issueDoccumentURL = url;
        } else {
          issueImageURL = url;
        }
      });
      const mergeForm = Object.assign({}, formData, {
        issueDoccumentURL,
        issueImageURL,
      });
      await axios.post(`${httpRoute}/api/fullIssue/create`, mergeForm);
      setAlertStatus('success');
      setAlertText('Full issue uploaded successfully');
      setOpen(true);
      setFiles([]);
    } catch (err) {
      console.error(err);
      setAlertStatus('error');
      setAlertText('Failed to upload full issue. Please try again.');
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getJournalCategory = async () => {
      const resp = await axios.get(`${httpRoute}/api/journal/categories`);
      setJournalCategory(resp.data);
    };
    getJournalCategory();
  }, []);

  return (
    <FormSection
      title="Submit issue"
      subtitle="Upload and publish a full journal issue."
      maxWidth={560}
    >
      <Box
        component="form"
        sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
        noValidate
        autoComplete="off"
      >
        <FormControl fullWidth>
          <InputLabel id="journal-select-label">Select a journal</InputLabel>
          <Select
            labelId="journal-select-label"
            value={formData.journalId}
            name="journalId"
            label="Select a journal"
            onChange={handleChange}
          >
            {journalCategory.map((data) => (
              <MenuItem key={data.id} value={data.id}>
                {data.journalTitle}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          type="number"
          value={formData.issueVolume}
          name="issueVolume"
          label="Issue volume"
          onChange={handleFormChange}
        />
        <TextField
          fullWidth
          type="number"
          value={formData.issueNumber}
          name="issueNumber"
          label="Issue number"
          onChange={handleFormChange}
        />
        <TextField
          fullWidth
          type="number"
          value={formData.issuePrice}
          name="issuePrice"
          label="Issue price"
          onChange={handleFormChange}
        />
        <TextField
          fullWidth
          value={formData.stripeName}
          name="stripeName"
          label="Product name"
          onChange={handleFormChange}
        />
        <TextField
          fullWidth
          value={formData.stripeDescription}
          name="stripeDescription"
          label="Description"
          onChange={handleFormChange}
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
          >
            Upload document
            <VisuallyHiddenInput type="file" onChange={handleChangeIssue} />
          </Button>
          <Button
            component="label"
            variant="outlined"
            startIcon={<InsertPhotoIcon />}
          >
            Upload image
            <VisuallyHiddenInput type="file" onChange={handleChangeIssue} />
          </Button>
        </Stack>
        {files.length > 0 && (
          <Box sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
            {files.length} file{files.length === 1 ? '' : 's'} selected
          </Box>
        )}

        <Button
          variant="contained"
          startIcon={
            loading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <PublishIcon />
            )
          }
          onClick={handleSubmit}
          disabled={loading}
          sx={{ alignSelf: 'flex-start' }}
        >
          {loading ? 'Uploading…' : 'Upload full issue'}
        </Button>
      </Box>

      <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
        <Alert
          onClose={() => setOpen(false)}
          severity={alertStatus}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alertText}
        </Alert>
      </Snackbar>
    </FormSection>
  );
}
