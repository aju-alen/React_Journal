import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { InputLabel, MenuItem, Select } from '@mui/material'
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import PublishIcon from '@mui/icons-material/Publish';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { httpRoute } from '../helperFunctions';


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
  const [formData, setFormData] = useState({
    issueVolume: '',
    journalId: '',
    issuePrice: '',
    issueNumber: '',
    stripeName: '',
    stripeDescription: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target
    console.log(name, value, 'name and value');
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleChangeIssue = (event) => {
    setFiles(prev => [...prev, event.target.files]);
  }

  const handleFormChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
  }

  const handleSubmit = async () => {
    console.log(files);
    try {
      const awsId = uuidv4();
      const fileData = new FormData();
      console.log(files, 'finalfiles');
      for (const file of files) {
        console.log(file[0], 'file in submit');
        fileData.append('s3FullIssue', file[0])
        console.log(fileData, 'file data inside');
      }
      console.log(fileData, 'file data');
      const fileResp = await axios.post(`${httpRoute}/api/s3/fullIssue/${awsId}`, fileData)
      console.log(fileResp, 'file response');
      const getUrlFromAWS = await axios.get(`${httpRoute}/api/s3/fullIssue/get/${awsId}`)
      console.log(getUrlFromAWS, 'file get data');
      const filesUrl = getUrlFromAWS.data.files

      let issueDoccumentURL;
      let issueImageURL;

      filesUrl.forEach(url => {
        if (url.includes('.pdf')) {
          issueDoccumentURL = url;
        } else {
          issueImageURL = url;
        }
      });
      const mergeForm = Object.assign({}, formData, { issueDoccumentURL, issueImageURL })
      console.log(mergeForm, 'merge form');
      const resp = await axios.post(`${httpRoute}/api/fullIssue/create`, mergeForm)
      console.log(resp, 'response');
    }
    catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const getJournalCategory = async () => {
      const resp = await axios.get(`${httpRoute}/api/journal/categories`)
      setJournalCategory(resp.data)
    }
    getJournalCategory();
  }, [])
  console.log(formData, 'formdata');

  return (
    <div className="">
      <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
      >
        <InputLabel id="demo-simple-select-label">Select A Journal</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={formData.journalId}
          name='journalId'
          label="Select A Journal"
          onChange={handleChange}
        >
          {journalCategory.map(data => (
            <MenuItem key={data.id} value={data.id}>{data.journalTitle}</MenuItem>
          ))}
        </Select>
        <TextField
          id="outlined-basic"
          type='number'
          value={formData.issueVolume}
          name='issueVolume'
          label="Issue Volume"
          variant="outlined"
          onChange={handleFormChange} />
        <TextField
          id="outlined-basic"
          type='number'
          value={formData.issueNumber}
          name='issueNumber'
          label="Issue Number"
          variant="outlined"
          onChange={handleFormChange} />
        <TextField
          id="outlined-basic"
          type='number'
          value={formData.issuePrice}
          name='issuePrice'
          label="Issue Price"
          variant="outlined"
          onChange={handleFormChange} />

        <TextField
          id="outlined-basic"
          value={formData.stripeName}
          name='stripeName'
          label="Product Name"
          variant="outlined"
          onChange={handleFormChange} />

        <TextField
          id="outlined-basic"
          value={formData.stripeDescription}
          name='stripeDescription'
          label="Write a description"
          variant="outlined"
          onChange={handleFormChange} />

      </Box>
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
        onChange={handleChangeIssue}
      >
        Upload Doccument
        <VisuallyHiddenInput type="file" />
      </Button>
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<InsertPhotoIcon />}
        onChange={handleChangeIssue}
      >
        Upload Image
        <VisuallyHiddenInput type="file" />
      </Button>

      <Stack spacing={2} direction="row" className='p-10' >
        <Button variant="contained" startIcon={<PublishIcon />} onClick={handleSubmit}>Upload Full Issue</Button>
      </Stack>
    </div>
  );
}