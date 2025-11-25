import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { FormControl, InputLabel, MenuItem, Select, Chip, Card, CardContent, Typography, Stepper, Step, StepLabel, Paper, Divider, IconButton, Tooltip, LinearProgress, CircularProgress } from '@mui/material';
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
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DescriptionIcon from '@mui/icons-material/Description';
import ArticleIcon from '@mui/icons-material/Article';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { v4 as uuidv4 } from 'uuid';
import { calculateIssue, httpRoute } from '../helperFunctions.js';

const SubmitManuscript = ({ user, checked }) => {
    const [open, setOpen] = useState(false);
    const [alertStatus, setAlertStatus] = useState('success');
    const [alertText, setAlertText] = useState('');
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
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

    const steps = [
        'Manuscript Details',
        'Author Information', 
        'File Upload',
        'Review & Submit'
    ];

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
    const [uploadProgress, setUploadProgress] = useState({})
    const [fileStatus, setFileStatus] = useState({})

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepClick = (step) => {
        setActiveStep(step);
    };

    const handleAuthorChange = (event) => {
        const { name, value } = event.target
        setAuthorData((prevData) => ({ ...prevData, [name]: value }));
    }


    const publicPdfName = useRef('');
    const handleFileChange = (event, id) => {
        console.log(event);

        const file = event.target.files[0];
        if (!file) return;

        // Set initial progress and status
        setUploadProgress(prev => ({ ...prev, [id]: 0 }));
        setFileStatus(prev => ({ ...prev, [id]: 'uploading' }));

        // Simulate upload progress
        const simulateUpload = () => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 30;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    setFileStatus(prev => ({ ...prev, [id]: 'completed' }));
                }
                setUploadProgress(prev => ({ ...prev, [id]: progress }));
            }, 200);
        };

        simulateUpload();

        const duplicate = files.filter(file => file.id !== id)
        setFiles([...duplicate, { id, file: file }])

        if (id === 1) {
            publicPdfName.current = file.name
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
    
    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Card elevation={3} sx={{ p: 4, mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <ArticleIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
                            <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                                Manuscript Details
                            </Typography>
                        </Box>
                        
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

                        {/* <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                            <Typography variant="body1" sx={{ mr: 2 }}>
                                Is this a special review?
                            </Typography>
                            <Checkbox
                                checked={checked}
                                inputProps={{ 'aria-label': 'controlled', readOnly: true }}
                                color="primary"
                            />
                        </Box> */}

                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 3 }}>
                            <TextField
                                fullWidth
                                label="Enter Your Article Title"
                                value={formData.articleTitle}
                                name='articleTitle'
                                onChange={handleChange}
                                multiline
                                variant="outlined"
                            />
                            <TextField
                                fullWidth
                                label="Add Key Words"
                                value={formData.articleKeywords}
                                name='articleKeywords'
                                onChange={handleChange}
                                variant="outlined"
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
                            variant="outlined"
                        />
                    </Card>
                );

            case 1:
                return (
                    <Card elevation={3} sx={{ p: 4, mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <PersonAddIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
                            <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                                Author Information
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                                <FormControl sx={{ minWidth: 120 }}>
                                    <InputLabel>Title</InputLabel>
                                    <Select
                                        value={authorData.authorTitle}
                                        name='authorTitle'
                                        label="Title"
                                        onChange={handleAuthorChange}
                                        displayEmpty
                                    >
                                        <MenuItem value="" disabled> Title</MenuItem>
                                        {['Dr.', 'Mr.', 'Mrs.', 'Ms.', 'Prof'].map(title => (
                                            <MenuItem key={title} value={title}>{title}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <TextField
                                    label="Given Name"
                                    value={authorData.authorGivenName}
                                    name='authorGivenName'
                                    onChange={handleAuthorChange}
                                    variant="outlined"
                                    fullWidth
                                />

                                <TextField
                                    label="Last Name"
                                    value={authorData.authorLastName}
                                    name='authorLastName'
                                    onChange={handleAuthorChange}
                                    variant="outlined"
                                    fullWidth
                                />
                            </Box>

                            <TextField
                                label="Email Address"
                                type="email"
                                value={authorData.authorEmail}
                                name='authorEmail'
                                onChange={handleAuthorChange}
                                variant="outlined"
                                fullWidth
                            />

                            <TextField
                                label="Affiliation"
                                value={authorData.authorAffiliation}
                                name='authorAffiliation'
                                onChange={handleAuthorChange}
                                variant="outlined"
                                fullWidth
                            />

                            <Button 
                                variant="contained" 
                                onClick={handleAddMoreAuthor}
                                startIcon={<CheckIcon />}
                                sx={{ mt: 2, alignSelf: 'flex-start' }}
                                size="large"
                            >
                                Add Author
                            </Button>
                        </Box>

                        {authors.length > 0 && (
                            <Box>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                    Added Authors ({authors.length})
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {authors.map((author, index) => (
                                        <Paper key={index} elevation={1} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                    {author.authorTitle} {author.authorGivenName} {author.authorLastName}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {author.authorEmail}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {author.authorAffiliation}
                                                </Typography>
                                            </Box>
                                            <IconButton 
                                                onClick={() => setAuthors(authors.filter((_, i) => i !== index))}
                                                color="error"
                                            >
                                                <CloseIcon />
                                            </IconButton>
                                        </Paper>
                                    ))}
                                </Box>
                            </Box>
                        )}
                    </Card>
                );

            case 2:
                return (
                    <Card elevation={3} sx={{ p: 4, mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <UploadFileIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
                            <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                                File Upload
                            </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {[
                                { label: 'Cover Letter', index: 0, icon: <DescriptionIcon /> },
                                { label: 'Manuscript File', index: 1, mandatory: true, icon: <ArticleIcon /> },
                                { label: 'Supplementary File', index: 2, icon: <UploadFileIcon /> }
                            ].map((file) => {
                                const currentFile = files.find(f => f.id === file.index);
                                const progress = uploadProgress[file.index] || 0;
                                const status = fileStatus[file.index] || 'idle';
                                const isUploading = status === 'uploading';
                                const isCompleted = status === 'completed';

                                return (
                                    <Paper key={file.index} elevation={2} sx={{ 
                                        p: 3, 
                                        border: '2px dashed', 
                                        borderColor: isCompleted ? 'success.main' : isUploading ? 'primary.main' : 'grey.300',
                                        backgroundColor: isCompleted ? 'success.50' : isUploading ? 'primary.50' : 'white',
                                        '&:hover': { borderColor: 'primary.main' }
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            {file.icon}
                                            <Typography variant="h6" sx={{ ml: 1, fontWeight: 600 }}>
                                                {file.label}
                                                {file.mandatory && !isCompleted  && <Chip label="Required" color="error" size="small" sx={{ ml: 1 }} />}
                                            </Typography>
                                            {isCompleted && (
                                                <Chip 
                                                    label="Uploaded" 
                                                    color="success" 
                                                    size="small" 
                                                    sx={{ ml: 1 }}
                                                    icon={<CheckIcon />}
                                                />
                                            )}
                                        </Box>

                                        {currentFile && (
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                    Selected: {currentFile.file.name}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Size: {(currentFile.file.size / 1024 / 1024).toFixed(2)} MB
                                                </Typography>
                                            </Box>
                                        )}

                                        {isUploading && (
                                            <Box sx={{ mb: 2 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <CircularProgress size={16} sx={{ mr: 1 }} />
                                                    <Typography variant="body2" color="primary">
                                                        Uploading... {Math.round(progress)}%
                                                    </Typography>
                                                </Box>
                                                <LinearProgress 
                                                    variant="determinate" 
                                                    value={progress} 
                                                    sx={{ height: 6, borderRadius: 3 }}
                                                />
                                            </Box>
                                        )}

                                        {isCompleted && (
                                            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                                <CheckIcon color="success" sx={{ mr: 1 }} />
                                                <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                                                    Upload completed successfully!
                                                </Typography>
                                            </Box>
                                        )}

                                        <Button
                                            component="label"
                                            variant={isCompleted ? "outlined" : "outlined"}
                                            fullWidth
                                            disabled={isUploading}
                                            sx={{ 
                                                height: '56px',
                                                borderStyle: 'dashed',
                                                borderWidth: 2,
                                                borderColor: isCompleted ? 'success.main' : 'inherit',
                                                '&:hover': {
                                                    borderStyle: 'solid',
                                                    backgroundColor: isCompleted ? 'success.50' : 'primary.50'
                                                }
                                            }}
                                            startIcon={isCompleted ? <CheckIcon /> : <CloudUploadIcon />}
                                        >
                                            {isCompleted ? 'File Uploaded' : isUploading ? 'Uploading...' : 'Choose File'}
                                            <VisuallyHiddenInput 
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                onChange={(event) => handleFileChange(event, file.index)}
                                            />
                                        </Button>
                                    </Paper>
                                );
                            })}
                        </Box>
                    </Card>
                );

            case 3:
                return (
                    <Card elevation={3} sx={{ p: 4, mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <CheckIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
                            <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                                Review & Submit
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Paper elevation={1} sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Manuscript Details</Typography>
                                <Typography><strong>Journal:</strong> {journalCategory.find(j => j.id === formData.journalId)?.journalTitle || 'Not selected'}</Typography>
                                <Typography><strong>Title:</strong> {formData.articleTitle || 'Not provided'}</Typography>
                                <Typography><strong>Keywords:</strong> {formData.articleKeywords || 'Not provided'}</Typography>
                                <Typography><strong>Special Review:</strong> {checked ? 'Yes' : 'No'}</Typography>
                            </Paper>

                            <Paper elevation={1} sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Authors ({authors.length})</Typography>
                                {authors.map((author, index) => (
                                    <Typography key={index} sx={{ mb: 1 }}>
                                        {author.authorTitle} {author.authorGivenName} {author.authorLastName} - {author.authorEmail}
                                    </Typography>
                                ))}
                            </Paper>

                            <Paper elevation={1} sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Files ({files.length})</Typography>
                                {files.map((file, index) => {
                                    const status = fileStatus[file.id] || 'idle';
                                    const isCompleted = status === 'completed';
                                    return (
                                        <Box key={index} sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            mb: 2, 
                                            p: 2, 
                                            bgcolor: isCompleted ? 'success.50' : 'grey.50',
                                            borderRadius: 1,
                                            border: isCompleted ? '1px solid' : '1px solid',
                                            borderColor: isCompleted ? 'success.main' : 'grey.300'
                                        }}>
                                            {isCompleted ? (
                                                <CheckIcon color="success" sx={{ mr: 2 }} />
                                            ) : (
                                                <CloudUploadIcon color="action" sx={{ mr: 2 }} />
                                            )}
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                    {file.file?.name || 'No file selected'}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {file.file ? `${(file.file.size / 1024 / 1024).toFixed(2)} MB` : 'No file selected'}
                                                </Typography>
                                            </Box>
                                            {isCompleted && (
                                                <Chip 
                                                    label="Uploaded" 
                                                    color="success" 
                                                    size="small"
                                                    icon={<CheckIcon />}
                                                />
                                            )}
                                        </Box>
                                    );
                                })}
                            </Paper>
                        </Box>
                    </Card>
                );

            default:
                return null;
        }
    };

    return (
        <Box sx={{ 

            margin: '0 auto', 
            padding: 3,
            minHeight: '100vh',
        }}>
            <Paper elevation={8} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                {/* Header */}
                <Box sx={{ 
                    background: 'primary.main', 

                    p: 4, 
                    textAlign: 'center' 
                }}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                        Submit Manuscript
                    </Typography>
                    <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>

                    </Typography>
                </Box>

                {/* Stepper */}
                <Box sx={{ p: 3, bgcolor: 'white' }}>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label, index) => (
                            <Step key={label}>
                                <StepLabel 
                                    onClick={() => handleStepClick(index)}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    {label}
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>

                <Divider />

                {/* Content */}
                <Box sx={{ p: 3, bgcolor: 'white', minHeight: '500px' }}>
                    {renderStepContent(activeStep)}
                </Box>

                {/* Navigation */}
                <Box sx={{ 
                    p: 3, 
                    bgcolor: 'grey.50', 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ minWidth: 100 }}
                    >
                        Back
                    </Button>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {activeStep < steps.length - 1 ? (
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                sx={{ minWidth: 100 }}
                            >
                                Next
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                size="large"
                                onClick={handleSubmit}
                                disabled={submitButtonDisabled}
                                sx={{ 
                                    minWidth: '250px',
                                    height: '56px',
                                    fontSize: '1.1rem',
                                    background: 'primary.main',
                                    '&:hover': {
                                        background: 'primary.dark'
                                    }
                                }}
                            >
                                Submit Manuscript
                            </Button>
                        )}
                    </Box>
                </Box>
            </Paper>

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


export default SubmitManuscript