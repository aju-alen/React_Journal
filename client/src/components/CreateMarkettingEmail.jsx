import React, { useState } from 'react';
import { 
  Box, 
  Stack, 
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel
} from '@mui/material';
import axios from 'axios';
import { httpRoute } from '../helperFunctions';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const CreateMarketingEmail = () => {
  const [emailType, setEmailType] = useState('marketing');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [alertStatus, setAlertStatus] = useState('success');
  const [alertText, setAlertText] = useState('');

  const handleSubmit = async(event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const form = event.currentTarget;
      
      const registerForm = {
        subject: form.subject.value,
        emailContent: form.emailContent.value,
        emailType: emailType,
        recipientEmail: emailType === 'specific' ? form.recipientEmail?.value : undefined,
      };

      const endpoint = `${httpRoute}/api/auth/send-marketing-email`;

      const resp = await axios.post(endpoint, registerForm);
      console.log(resp.data);
      setLoading(false);
      setAlertStatus('success');
      setAlertText('Email Sent');
      setOpen(true);
    } catch (err) {
      console.log(err);
      setLoading(false);
      setAlertStatus('error');
      setAlertText('Email not sent, Please try again.');
      setOpen(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <div>
      <Box 
        component="form" 
        noValidate 
        onSubmit={handleSubmit} 
        sx={{ minWidth: "auto" }} 
        className='md:p-20'
      >
        <Stack spacing={2}>
          <FormControl>
            <FormLabel>Email Type</FormLabel>
            <RadioGroup
              row
              value={emailType}
              onChange={(e) => setEmailType(e.target.value)}
            >
              <FormControlLabel 
                value="marketing" 
                control={<Radio />} 
                label="Marketing Email (All Subscribers)" 
              />
              <FormControlLabel 
                value="specific" 
                control={<Radio />} 
                label="Specific Person" 
              />
            </RadioGroup>
          </FormControl>

          {emailType === 'specific' && (
            <TextField
              fullWidth
              label="Recipient Email"
              variant="outlined"
              name="recipientEmail"
              type="email"
            />
          )}

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Subject"
            variant="outlined"
            name="subject"
            inputProps={{
              style: { whiteSpace: 'pre-wrap' }
            }}
          />
          <TextField
            fullWidth
            multiline
            rows={8}
            label="Email Content"
            variant="outlined"
            name="emailContent"
            inputProps={{
              style: { whiteSpace: 'pre-wrap' }
            }}
          />
          <Button 
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? 'Sending...' : 'Send Email'}
          </Button>
        </Stack>
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
  );
};

export default CreateMarketingEmail;