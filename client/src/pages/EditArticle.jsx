import React, { useEffect, useState,useRef } from 'react'
import { useParams } from 'react-router-dom'
import ImageHeader from '../components/ImageHeader'
import TextField from '@mui/material/TextField'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import styled from '@mui/system/styled'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'

import { axiosTokenHeader } from '../helperFunctions'
import axios from 'axios'
import { httpRoute } from '../helperFunctions'
const EditArticle = () => {
    const navigate = useNavigate()
    const { articleId, userId } = useParams()
    const [articleData, setArticleData] = useState([])
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        articleTitle: '',
        articleAbstract: '',
        articleKeywords: '',
    })
    const handleChange = (e) => {
        setFormData((prev) => {
            console.log(e.target.name, e.target.value);
            return {
                ...prev,
                [e.target.name]: e.target.value,
            }
        })
    }
    const publicPdfName = useRef('');
    const handleFileChange = (event,id) => {
        console.log(event);
      
        const duplicate = files.filter(file => file.id !== id)
        setFiles([...duplicate,{id,file:event.target.files[0]}])

       
        if(id === 1 ){
            publicPdfName.current = event.target.files[0].name
        }
    };
    useEffect(() => {
        const fetchEditableArticle = async () => {
            axios.defaults.headers.common['Authorization'] = axiosTokenHeader();
            const res = await axios.get(`${httpRoute}/api/journalArticle/singleArticle/${articleId}`)

            setArticleData(res.data)
            console.log(res.data, 'res.data[0]');
            setFormData({
                articleTitle: res.data.articleTitle,
                articleAbstract: res.data.articleAbstract,
                articleKeywords: res.data.articleKeywords,
            })

        }
        fetchEditableArticle()
    }, [])
    const handleSubmit = async () => {
        if (files.length < 1) {
            console.log('Please add minimum of one file to submit')
            return
        }
        try {
            const fileData = new FormData();
            for (const file of files) {
                console.log(file, 'file');
                fileData.append('s3Files', file.file)
                console.log(fileData, 'file data');
            }
            console.log(fileData, 'file data');

            const fileResp = await axios.post(`${httpRoute}/api/s3/upload/${articleData.awsId}`, fileData)
            console.log(fileResp, 'file response');

            const fileGet = await axios.get(`${httpRoute}/api/s3/${articleData.awsId}`)
            console.log(fileGet, 'file get data');

            const filesUrl = fileGet.data.files

            const mergeForm = Object.assign({}, formData, { filesUrl },{publicPdfName:publicPdfName.current})
            console.log(mergeForm, 'final form data');
            const resp = await axios.post(`${httpRoute}/api/journalArticle/updateArticle/${articleId}`, mergeForm)
            console.log(userId, 'userId');
            navigate(`/dashboard/${userId}?tab=0`)
        }
        catch (err) {
            console.log(err);
        }

    }
    console.log(formData, 'formData');
    console.log(files, 'files');
    console.log(articleData, 'articleData');
    return (
        <div className="h-auto w-auto bg-slate-200 ">
            <ImageHeader />
            <h2 className='h2-class' >EditArticle Your Article</h2 >
            <div>
                <Box sx={{ minWidth: 300 }}>
                    <FormControl fullwidth>
                        

                            <TextField sx={{ mb: 4 }}
                                id="outlined-basic"
                                label="Edit Your Article Title"
                                value={formData.articleTitle}
                                name='articleTitle'
                                onChange={handleChange}
                            />
                        <TextField sx={{ mb: 4 }}
                            id="outlined-textarea"
                            label="Edit Your Article Abstract"
                            value={formData.articleAbstract}
                            name='articleAbstract'
                            onChange={handleChange}
                            multiline
                        />
                        <TextField sx={{ mb: 4 }}
                            id="outlined-controlled"
                            label="Edit Your Article Keywords"
                            value={formData.articleKeywords}
                            name='articleKeywords'
                            onChange={handleChange}
                        />

<div className=" flex flex-col md:flex-row md:justify-center md:items-center">
<div className=" mx-2 ">
                        <Button sx={{ mb: 4}} 
                        fullwidth
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

                        <div className=" mx-2 ">
                        <Button sx={{ mb: 4 }}
                        fullwidth
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
                        <div className=" mx-2">
                        <Button sx={{ mb: 4 }}
                        fullwidth
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

                        </div>
                        <Button variant='contained' onClick={handleSubmit} sx={{m:3}}>Submit Manuscript For Verification</Button>
                    </FormControl>
                </Box>
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

export default EditArticle 