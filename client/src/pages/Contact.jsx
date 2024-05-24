import React,{ useState} from 'react'
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import ImageHeader from '../components/ImageHeader'
import { httpRoute } from '../helperFunctions';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const Contact = () => {
  const [open, setOpen] = useState(false);
  const [alertStatus, setAlertStatus] = useState('success');
  const [alertText, setAlertText] = useState('');
  const [formData, setFormData] = React.useState({
    username: '',
    email: '',
    message: '',
    contact: '',
  });
  const handleFormChange = (event) => {
    const { name, value } = event.target
    setFormData((prevData) => ({ ...prevData, [name]: value }));
}
  const handleSubmitContact = async() => {
    try {
      const resp =await  axios.post(`${httpRoute}/api/send-email/contact-us`,formData)
      setOpen(true);
      setAlertStatus('success');
      setAlertText('Message Sent Successfully');
    } catch (error) {
      console.log(error);
      setOpen(true);
      setAlertStatus('error');
      setAlertText('Message Sent Failed, Try again later');
  }  }

console.log(formData);
const handleClose = (event, reason) => {
  if (reason === 'clickaway') {
      return;
  }

  setOpen(false);
};
  return (
    <div>
      <ImageHeader/>
      <h1 className='h2-class'>Contact</h1>
      <Box sx={{ minWidth: 300,  }} className='p-20'>
                    <FormControl fullWidth>
                      
                        <div className="mt-5">
                            <TextField fullWidth
                                id="outlined-basic"
                                label="Given Name"
                                variant="outlined"
                                name='username'
                                value={formData.username}
                                onChange={handleFormChange} />
                        </div>
                        <div className="mt-5">
                            <TextField fullWidth
                                id="outlined-basic"
                                label="Email Address"
                                variant="outlined"
                                name='email'
                                value={formData.email}
                                onChange={handleFormChange} />
                        </div>
                        <div className="mt-5">
                            <TextField fullWidth
                                id="outlined-basic"
                                label="Your Message"
                                variant="outlined"
                                name='message'
                                value={formData.message}
                                rows={4}
                                onChange={handleFormChange} />
                        </div>
                        <div className="mt-5">
                            <TextField fullWidth
                                id="outlined-basic"
                                label="Contact Number"
                                variant="outlined"
                                name='contact'
                                value={formData.contact}
                                onChange={handleFormChange} />
                        </div>
                        
                        <Button className='mt-5' variant="contained" onClick={handleSubmitContact}>Send Message</Button>
                    </FormControl>

                    
                    <Card sx={{  width: { xs:'100%',  md: 5 / 6, },
                    marginX: 'auto',
                    marginY: 2,
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Add shadow
                    borderRadius: 2, }}>
      <CardContent sx={{
        display: {xs:'', md:'flex'},
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      
      }}>
        <Typography variant='h4' color="text.secondary" gutterBottom>
        Scientific Journals Portal,
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
        201/Level 1/GA/SZ
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
        Al Mustaqbaal Street,
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
        Dubai International Financial Centre,
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
        Dubai, UAE
        </Typography>
        <Typography variant='caption' color='blue' >
        Email - talktous@scientificjournalsportal.com
          <br />
        </Typography>
      </CardContent>
    
    </Card>
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
    </div>
  )
}

export default Contact


