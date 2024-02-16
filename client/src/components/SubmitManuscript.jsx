import React, { useEffect,useState } from 'react'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';


import axios from 'axios';
const SubmitManuscript = ({user}) => {
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
    
    const handleAuthorChange = (event) => {
        const { name, value } = event.target
        setAuthorData((prevData) => ({ ...prevData, [name]: value }));
    }


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
        try{
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
            },3000)
        }
        catch(err){
            console.log(err);
        }


    }
    const handleSubmit =async  () => {
        const mergeForm = Object.assign({}, formData, { authors: authors },{specialReview:checked},{userId:user.id})
        console.log(mergeForm, 'final form data');
        const resp = await axios.post('http://localhost:3001/api/journalArticle/create', mergeForm)
    }
    useEffect(() => {
        const getJournalCategory = async () => {
            const resp = await axios('http://localhost:3001/api/journal/categories')
            setJournalCategory(resp.data)
        }
        getJournalCategory()
    }, [])
    console.log(formData, 'form data');
    console.log(authorData, 'author data');
    console.log(authors, 'final author data');
    return (
        <div className='h-auto w-full'>
            {/* Step 1 */}
            <div>
                <div className="flex justify-start font-bold text-xl mb-5">Manuscript Details</div>

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
                            <div className='flex justify-start items-center'>
                                <div>Is this a special review?</div>
                                <Checkbox
                                    checked={checked}
                                    onChange={handleCheckBoxChange}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            </div>
                            <div className='flex justify-around items-center'>
                                <TextField
                                    id="outlined-controlled"
                                    label="Enter Your Article Title"
                                    value={formData.articleTitle}
                                    name='articleTitle'
                                    onChange={handleChange}
                                />
                                <TextField

                                    id="outlined-multiline-flexible"
                                    label="Abstract"
                                    multiline
                                    maxRows={4}
                                    value={formData.articleAbstract}
                                    name='articleAbstract'
                                    onChange={handleChange}
                                />
                            </div>
                            <TextField id="outlined-basic" 
                            label="Add Key Words"
                             variant="outlined"
                             value={formData.articleKeywords}
                                    name='articleKeywords'
                                    onChange={handleChange} 
                                    />
                        </Box>
                    </div>
                </div>
            </div>
            {/* Step 2 */}
            <div>
                <div className="flex justify-start font-bold text-xl mb-5">Author Details</div>
                <Box sx={{ minWidth: 120 }}>
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
                    </FormControl>

                    <TextField id="outlined-basic" label="Given Name" variant="outlined"  name='authorGivenName'
                            value={authorData.authorGivenName}
                            onChange={handleAuthorChange}/>
                    <TextField id="outlined-basic" label="Last Name" variant="outlined" 
                    name='authorLastName'
                    value={authorData.authorLastName}
                    onChange={handleAuthorChange}
                    />
                    <TextField id="outlined-basic" label="Email Address" variant="outlined"
                    name='authorEmail'
                    value={authorData.authorEmail}
                    onChange={handleAuthorChange}
                    />
                    <TextField id="outlined-basic" label="Affiliaiton" variant="outlined"
                    name='authorAffiliation'
                    value={authorData.authorAffiliation}
                    onChange={handleAuthorChange}
                    />
                    {alert === 'success' && <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                  Author Added Successfully. Keep Adding More..
                </Alert>}
                </Box>
                <button onClick={handleAddMoreAuthor}>Add More Author</button>
            </div>
            <button onClick={handleSubmit}>Submit Manuscript For Verification</button>
        </div>
    )
}

export default SubmitManuscript