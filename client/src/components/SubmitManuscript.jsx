import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Snackbar from '@mui/material/Snackbar';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';
import { v4 as uuidv4 } from 'uuid';
import { calculateIssue, httpRoute } from '../helperFunctions.js';

const SubmitManuscript = ({ user, checked }) => {
    const [open, setOpen] = useState(false);
    const [alertStatus, setAlertStatus] = useState('success');
    const [alertText, setAlertText] = useState('');
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const navigate = useNavigate()
    const [authors, setAuthors] = useState([]) //collection of authors
    const [journalCategory, setJournalCategory] = useState([]);
    // const [checked, setChecked] = useState(true);
    const [userEmail, setUserEmail] = useState('')
    const [userAdmin, setUserAdmin] = useState()
    const [userId, setUserId] = useState('')
    console.log(user, 'user in submit manuscript');
    console.log(userId, 'userId in submit manuscript');


    console.log(authors, 'total author data');


    const [authorData, setAuthorData] = useState({
        authorTitle: '',
        authorGivenName: '',
        authorLastName: '',
        authorEmail: '',
        authorAffiliation: ''
    })
    const [formData, setFormData] = React.useState({
        journalId: '',
        articleTitle: '',
        articleAbstract: '',
        articleKeywords: '',
    })

    const [files, setFiles] = useState([])

    const handleAuthorChange = (event) => {
        const { name, value } = event.target
        setAuthorData((prevData) => ({ ...prevData, [name]: value }));
    }


    const publicPdfName = useRef('');
    const handleFileChange = (event, id) => {
        console.log(event);

        const duplicate = files.filter(file => file.id !== id)
        setFiles([...duplicate, { id, file: event.target.files[0] }])


        if (id === 1) {
            publicPdfName.current = event.target.files[0].name
        }
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('currentUser'))
        setUserAdmin(user?.user?.isAdmin)
        setUserId(user?.user?.id)
    }, [])
    console.log(publicPdfName, 'public pdf name');
    console.log(userAdmin, 'user admin in submit manuscript');

    const handleChange = (event) => {
        const { name, value } = event.target
        console.log(name, value, 'name and value');
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // const handleCheckBoxChange = (event) => {
    //     console.log(event, 'checkbox event');
    //     setChecked(event.target.checked);
    // }

    const handleAddMoreAuthor = () => {

        try {
            if (authorData.authorTitle === '' || authorData.authorGivenName === '' || authorData.authorLastName === '' || (!userAdmin && authorData.authorEmail === '') || authorData.authorAffiliation === '') {
                setAlertStatus('error')
                setAlertText('Please fill all the fields to add an author')
                setOpen(true);
                return
            }
            setAuthors([...authors, authorData])
            setAuthorData({
                authorTitle: '',
                authorGivenName: '',
                authorLastName: '',
                authorEmail: '',
                authorAffiliation: ''
            })
            setAlertStatus('success')
            setAlertText('Author Added, If you want to add more authors, please fill the form again')
            setOpen(true);
        }
        catch (err) {
            console.log(err);
            setAlertStatus('error')
            setAlertText('Author could not be added, please check the form and try again')
            setOpen(true);
        }


    }
    const handleSubmit = async () => {
        console.log(files.length, 'files length in submit');
        if (files.length === 0) {
            console.log('Please upload the Manuscript file. It is mandatory to proceed.')
            setAlertStatus('error')
            setAlertText('Please upload the Manuscript file. It is mandatory to proceed.')
            setOpen(true);

            return
        }
        if (authors.length === 0) {
            console.log('Please add author data. It is mandatory to proceed.')
            setAlertStatus('error')
            setAlertText('Please add author data. It is mandatory to proceed.')
            setOpen(true);

            return
        }
        try {
            setSubmitButtonDisabled(true)
            const awsId = uuidv4();
            const fileData = new FormData();
            for (const file of files) {
                console.log(file, 'file in submit');
                fileData.append('s3Files', file.file)
            }
            console.log(fileData, 'file data');

            const fileResp = await axios.post(`${httpRoute}/api/s3/upload/${awsId}`, fileData)
            console.log(fileResp, 'file response');
            const fileGet = await axios.get(`${httpRoute}/api/s3/${awsId}`)
            console.log(fileGet, 'file get data');
            const filesUrl = fileGet.data.files
            console.log(filesUrl, 'files url after submitting manu');


            console.log(formData, 'formData');
            const journalDate = journalCategory.find(data => data.id === formData.journalId);
            const journalYear = journalDate.journalStartYear;
            const journalMonth = journalDate.journalStartMonth;
            const articleDate = Date.now();
            const articleYear = new Date(articleDate).getFullYear();
            const articleMonth = new Date(articleDate).getMonth() + 1;
            const issue = calculateIssue(journalYear, journalMonth, articleYear, articleMonth)
            console.log(issue, 'issue');
            const volume = articleYear - journalYear + 1;


            const mergeForm = Object.assign({}, formData, { authors: authors }, { specialReview: checked }, { filesUrl }, { awsId }, { publicPdfName: publicPdfName.current }, { articleIssue: issue }, { articleVolume: volume }, { userId: userId })
            console.log(mergeForm, 'final form data');

            //create publicPdfurl deets
            const resp = await axios.post(`${httpRoute}/api/journalArticle/create`, mergeForm)


            setOpen(true);
            setAlertStatus('success')
            setAlertText('Manuscript Submitted Successfully. Redirecting to your dashboard')
            setTimeout(() => {
                navigate(`/dashboard/${userId}?tab=0`)
            }, 3000)
            setSubmitButtonDisabled(false)
        }
        catch (err) {
            console.log(err);
            setAlertStatus('error')
            setAlertText('Error submitting manuscript. Please see if all fields are filled')
            setSubmitButtonDisabled(false)
            setOpen(true);

        }

    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };
    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('currentUser')).token
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        const getJournalCategory = async () => {
            const resp = await axios.get(`${httpRoute}/api/journal/categories`)
            setJournalCategory(resp.data)
        }
        getJournalCategory()
        setAuthorData({ ...authorData, authorEmail: user.email })
    }, [])
    console.log(files, 'files');
    console.log(user, 'userId');
    return (
        <Box sx={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: 3,

          }}>
            <Box sx={{ width: '100%', md: { width: '75%' }, margin: '0 auto' }}>
              {/* Manuscript Details Section */}
              <StyledSection>
                <h2 className="text-2xl font-bold text-center mb-6">Manuscript Details</h2>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Select A Journal</InputLabel>
                  <Select
                    value={formData.journalId}
                    name='journalId'
                    label="Select A Journal"
                    onChange={handleChange}
                  >
                    {journalCategory.map(data => (
                      <MenuItem key={data.id} value={data.id}>{data.journalTitle}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
      
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <span>Is this a special review?</span>
                  <Checkbox
                    checked={checked}
                    inputProps={{ 'aria-label': 'controlled', readOnly: true }}
                  />
                </Box>
      
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Enter Your Article Title"
                    value={formData.articleTitle}
                    name='articleTitle'
                    onChange={handleChange}
                    multiline
                  />
                  <TextField
                    fullWidth
                    label="Add Key Words"
                    value={formData.articleKeywords}
                    name='articleKeywords'
                    onChange={handleChange}
                  />
                </Box>
      
                <TextField
                  fullWidth
                  label="Abstract"
                  multiline
                  rows={4}
                  value={formData.articleAbstract}
                  name='articleAbstract'
                  onChange={handleChange}
                />
              </StyledSection>
      
              {/* Author Details Section */}
              <StyledSection>
                <h2 className="text-2xl font-bold text-center mb-6">Author Details</h2>
                <FormControl fullWidth>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Select
                      value={authorData.authorTitle}
                      name='authorTitle'
                      label="Title"
                      onChange={handleAuthorChange}
                      displayEmpty
                    >
                      <MenuItem value="" disabled>Select Title</MenuItem>
                      {['Dr.', 'Mr.', 'Mrs.', 'Ms.', 'Prof'].map(title => (
                        <MenuItem key={title} value={title}>{title}</MenuItem>
                      ))}
                    </Select>
      
                    <TextField
                      label="Given Name"
                      value={authorData.authorGivenName}
                      name='authorGivenName'
                      onChange={handleAuthorChange}
                    />
      
                    <TextField
                      label="Last Name"
                      value={authorData.authorLastName}
                      name='authorLastName'
                      onChange={handleAuthorChange}
                    />
      
                    <TextField
                      label="Email Address"
                      type="email"
                      value={authorData.authorEmail}
                      name='authorEmail'
                      onChange={handleAuthorChange}
                    />
      
                    <TextField
                      label="Affiliation"
                      value={authorData.authorAffiliation}
                      name='authorAffiliation'
                      onChange={handleAuthorChange}
                    />
      
                    <Button 
                      variant="contained" 
                      onClick={handleAddMoreAuthor}
                      startIcon={<CheckIcon />}
                      sx={{ mt: 2 }}
                    >
                      Add Author
                    </Button>
                  </Box>
                </FormControl>
      
                {authors.length > 0 && (
                  <Box sx={{ mt: 4, overflowX: 'auto' }}>
                    <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-3 text-left">Title</th>
                          <th className="p-3 text-left">Given Name</th>
                          <th className="p-3 text-left">Last Name</th>
                          <th className="p-3 text-left">Email</th>
                          <th className="p-3 text-left">Affiliation</th>
                          <th className="p-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {authors.map((author, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="p-3">{author.authorTitle}</td>
                            <td className="p-3">{author.authorGivenName}</td>
                            <td className="p-3">{author.authorLastName}</td>
                            <td className="p-3">{author.authorEmail}</td>
                            <td className="p-3">{author.authorAffiliation}</td>
                            <td className="p-3 text-center">
                              <Button 
                                size="small"
                                onClick={() => setAuthors(authors.filter((_, i) => i !== index))}
                              >
                                <CloseIcon color="error" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Box>
                )}
              </StyledSection>
      
              {/* File Upload Section */}
              <StyledSection>
                <h2 className="text-2xl font-bold text-center mb-6">Upload Files</h2>
                
                <Box sx={{ maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {[
                    { label: 'Cover Letter', index: 0 },
                    { label: 'Manuscript File', index: 1, mandatory: true },
                    { label: 'Supplementary File', index: 2 }
                  ].map((file) => (
                    <Box key={file.index} sx={{ textAlign: 'center' }}>
                      <h3 className="text-lg font-medium mb-2">
                        Upload Your {file.label}
                        {file.mandatory && <span className="text-red-500 ml-2">*(Mandatory)</span>}
                      </h3>
                      <Button
                        component="label"
                        variant="contained"
                        fullWidth
                        sx={{ 
                          height: '56px',
                          backgroundColor: file.mandatory ? '#1976d2' : '#666',
                          '&:hover': {
                            backgroundColor: file.mandatory ? '#1565c0' : '#555'
                          }
                        }}
                        startIcon={<CloudUploadIcon />}
                      >
                        {file.label}
                        <VisuallyHiddenInput 
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(event) => handleFileChange(event, file.index)}
                        />
                      </Button>
                    </Box>
                  ))}
                </Box>
              </StyledSection>
      
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSubmit}
                  disabled={submitButtonDisabled}
                  sx={{ 
                    minWidth: '250px',
                    height: '56px',
                    fontSize: '1.1rem'
                  }}
                >
                  Submit Manuscript For Verification
                </Button>
              </Box>
      
              <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert
                  onClose={handleClose}
                  severity={alertStatus}
                  variant="filled"
                  sx={{ width: '100%' }}
                >
                  {alertText}
                </Alert>
              </Snackbar>
            </Box>
          </Box>
    )
}

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
  const StyledSection = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(4),
    backgroundColor: '#fff',
    borderRadius: theme.shape.borderRadius,
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
    '&:hover': {
      boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
    },
  }));


export default SubmitManuscript