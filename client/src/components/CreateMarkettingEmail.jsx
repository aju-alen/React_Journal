import React,{useState} from 'react'
import { Box, Stack, TextField,Button } from '@mui/material'
import axios from 'axios'
import { httpRoute } from '../helperFunctions'



const CreateMarkettingEmail = () => {

    // const handleChange = (e) => {
    //     const { name, value } = e.target
    //     setEmailData(prev => ({ ...prev, [name]: value }))
    // }

    const handleSubmit = async(event) => {
        event.preventDefault();
        try {
          const data = new FormData(event.currentTarget);
          const registerForm = {
            subject: data.get('subject'),
            emailParagraph1: data.get('emailParagraph1'),
            emailParagraph2: data.get('emailParagraph2'),
            emailParagraph3: data.get('emailParagraph3'),
          };
          const resp = await axios.post(`${httpRoute}/api/auth/send-marketting-email`, registerForm)
            console.log(resp.data);
    
    
        } catch (err) {
          console.log(err);
        }
      };
    
  return (
    <div>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ minWidth:"auto" }} className='md:p-20'>
            <Stack  spacing={2}>
            <TextField fullwidth multiline rows={4} label="Subject " variant="outlined" name='subject'   />
            <TextField fullwidth multiline rows={4} label="Email Paragraph 1 " variant="outlined" name='emailParagraph1'   />
            <TextField fullwidth multiline rows={4} label="Email Paragraph 2" variant="outlined" name='emailParagraph2'   />
            <TextField fullwidth multiline rows={4} label="Email Paragraph 3" variant="outlined" name='emailParagraph3'   />
            <Button
            type="submit"
            fullwidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Send Email
          </Button>
            </Stack>
         </Box>
    </div>
  )
}

export default CreateMarkettingEmail