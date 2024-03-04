import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';



import axios from 'axios';
const SubmitManuscript = ({ user }) => {
    const navigate = useNavigate()
    const [authors, setAuthors] = useState([]) //collection of authors
    const [journalCategory, setJournalCategory] = useState([]);
    const [checked, setChecked] = useState(true);
    const [alert, setAlert] = useState('');
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

    let publicPdfName =''
    const handleFileChange = (event,id) => {
        console.log(event);
      
        const duplicate = files.filter(file => file.id !== id)
        setFiles([...duplicate,{id,file:event.target.files[0]}])

       
        if(id === 1 ){
            publicPdfName = event.target.files[0].name
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target
        console.log(name, value, 'name and value');
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleCheckBoxChange = (event) => {
        console.log(event, 'checkbox event');
        setChecked(event.target.checked);
    }

    const handleAddMoreAuthor = () => {
        try {
            setAuthors([...authors, authorData])
            setAuthorData({
                authorTitle: '',
                authorGivenName: '',
                authorLastName: '',
                authorEmail: '',
                authorAffiliation: ''
            })
            setAlert('success')
            setTimeout(() => {
                setAlert('')
            }, 3000)
        }
        catch (err) {
            console.log(err);
        }


    }
    const handleSubmit = async () => {
        if (files.length !== 3) {
            console.log('Please add all the required files before uploading the manuscript.')
            return
        }
        try {
            const awsId = uuidv4();
            const fileData = new FormData();
            for (const file of files.file) {
                console.log(file, 'file in submit');
                fileData.append('s3Files', file)
            }
            console.log(fileData, 'file data');

            const fileResp = await axios.post(`http://localhost:3001/api/s3/upload/${awsId}`, fileData)
            console.log(fileResp, 'file response');
            const fileGet = await axios.get(`http://localhost:3001/api/s3/${awsId}`)
            console.log(fileGet, 'file get data');
            const filesUrl = fileGet.data.files


            const mergeForm = Object.assign({}, formData, { authors: authors }, { specialReview: checked }, { userId: user.id }, { filesUrl }, { awsId })
            console.log(mergeForm, 'final form data');
            const resp = await axios.post('http://localhost:3001/api/journalArticle/create', mergeForm)
            navigate(`/dashboard/${user.id}?tab=0`)
        }
        catch (err) {
            console.log(err);
        }

    }
    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('currentUser')).token
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        const getJournalCategory = async () => {
            const resp = await axios.get('http://localhost:3001/api/journal/categories')
            setJournalCategory(resp.data)
        }
        getJournalCategory()
    }, [])
    console.log(files, 'files');
    console.log(user, 'userId');
    return (
        <div className='h-auto w-full'>
            {/* Step 1 */}
            <div>
                <h2 className="flex justify-center font-bold text-xl mb-5 ">Manuscript Details</h2>

                <div className="flex flex-col">
                    <div className="">
                        <Box sx={{ minWidth: 300 }}>
                            <FormControl fullWidth>
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

                            </FormControl>
                            <div className='flex justify-center md:justify-start items-center'>
                                <div>Is this a special review?</div>
                                <Checkbox
                                    checked={checked}
                                    onChange={handleCheckBoxChange}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            </div>
                            <div className='flex flex-col md:flex-row justify-around items-center mb-5'>
                                <TextField fullWidth
                                    id="outlined-controlled"
                                    label="Enter Your Article Title"
                                    value={formData.articleTitle}
                                    name='articleTitle'
                                    onChange={handleChange}
                                />
                                <TextField id="outlined-basic"
                                    label="Add Key Words"
                                    variant="outlined"
                                    value={formData.articleKeywords}
                                    name='articleKeywords'
                                    onChange={handleChange}
                                    fullWidth
                                />

                            </div>
                            <TextField fullWidth

                                id="outlined-multiline-flexible"
                                label="Abstract"
                                multiline
                                maxRows={4}
                                value={formData.articleAbstract}
                                name='articleAbstract'
                                onChange={handleChange}
                            />
                        </Box>
                    </div>
                </div>
            </div>
            {/* Step 2 */}
            <div>
                <h2 className="flex justify-center font-bold text-xl mb-5 ">Author Details</h2>
                <Box sx={{ minWidth: 300 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Title</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            name='authorTitle'
                            value={authorData.authorTitle}
                            label="Title"
                            onChange={handleAuthorChange}
                        >
                            <MenuItem value={'Dr.'}>Dr.</MenuItem>
                            <MenuItem value={'Mr.'}>Mr.</MenuItem>
                            <MenuItem value={'Mrs.'}>Mrs.</MenuItem>
                            <MenuItem value={'Ms.'}>Ms.</MenuItem>
                            <MenuItem value={'Prof'}>Prof</MenuItem>
                        </Select>
                        <div className="mt-5">
                            <TextField fullWidth
                                id="outlined-basic"
                                label="Given Name"
                                variant="outlined"
                                name='authorGivenName'
                                value={authorData.authorGivenName}
                                onChange={handleAuthorChange} />
                        </div>
                        <div className="mt-5">
                            <TextField id="outlined-basic" fullWidth label="Last Name" variant="outlined"
                                name='authorLastName'
                                value={authorData.authorLastName}
                                onChange={handleAuthorChange}
                            />
                        </div>
                        <div className="mt-5">
                            <TextField id="outlined-basic" fullWidth label="Email Address" variant="outlined"
                                name='authorEmail'
                                value={authorData.authorEmail}
                                onChange={handleAuthorChange}
                            />
                        </div>
                        <div className="mt-5">
                            <TextField id="outlined-basic" fullWidth label="Affiliaiton" variant="outlined"
                                name='authorAffiliation'
                                value={authorData.authorAffiliation}
                                onChange={handleAuthorChange}
                            />
                        </div>
                        {alert === 'success' && <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                            Author Added Successfully. Keep Adding More..
                        </Alert>}
                        <Button variant="contained" onClick={handleAddMoreAuthor}>Add Author</Button>
                    </FormControl>
                </Box>
            </div>
            {/* Step 3 */}

            <div className="">
                <h2 className="flex justify-center font-bold text-xl mb-5 ">Upload Files</h2>
               
                    <h2 className=' text-center' >Upload Your Cover Letter</h2>
                    <div className=" md:mx-96">
                    <Button fullWidth sx={{ mb: 3 }}
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        accept=".pdf,.doc,.docx"
                        onChange={(event)=>handleFileChange(event,0)}
                        startIcon={<CloudUploadIcon />}
                    >
                        Cover Letter
                        <VisuallyHiddenInput type="file" />
                    </Button>
                    </div>
                    <h2 className=' text-center'>Upload Your Manuscript File</h2>
                    <div className=" md:mx-96">
                    <Button fullWidth sx={{ mb: 3 }}

                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    accept=".pdf,.doc,.docx"
                    onChange={(event)=>handleFileChange(event,1)}
                    startIcon={<CloudUploadIcon />}
                >
                    Manuscript File
                    <VisuallyHiddenInput type="file" />
                </Button>
                </div>
                <h2 className=' text-center'>Upload Your Supplementary File</h2>
                <div className=" md:mx-96">
                <Button fullWidth sx={{ mb: 3 }}

                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    accept=".pdf,.doc,.docx"
                    onChange={(event)=>handleFileChange(event,2)}
                    startIcon={<CloudUploadIcon />}
                >
                    Supplementary File
                    <VisuallyHiddenInput type="file" />
                </Button>
                </div>
                <div className=" flex justify-center items-center">
                <Button sx={{p:2}} variant="contained" onClick={handleSubmit}>Submit Manuscript For Verification</Button>
                </div>
            </div>
        </div>
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