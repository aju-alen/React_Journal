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
  FormLabel,
  Paper,
  Typography,
  Divider,
  Switch,
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
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('');
  const [formData, setFormData] = useState({
    subject: '',
    emailContent: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async(event) => {
    event.preventDefault();
    try {
      setLoading(true);
      
      const registerForm = {
        subject: formData.subject,
        emailContent: formData.emailContent,
        emailType: emailType,
        recipientEmail: emailType === 'specific' ? event.currentTarget.recipientEmail?.value : undefined,
        isScheduled: isScheduled,
        scheduledTime: isScheduled ? new Date(scheduledTime).toISOString() : null
      };

      const endpoint = `${httpRoute}/api/auth/send-marketing-email`;

      const resp = await axios.post(endpoint, registerForm);
      console.log(resp.data);
      setLoading(false);
      setAlertStatus('success');
      setAlertText(isScheduled ? 'Email Scheduled Successfully' : 'Email Sent');
      setOpen(true);
    } catch (err) {
      console.log(err);
      setLoading(false);
      setAlertStatus('error');
      setAlertText(isScheduled ? 'Failed to schedule email' : 'Email not sent, Please try again.');
      setOpen(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const formatPreviewText = (text) => {
    if (!text) return '';
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  // Get current datetime string for min attribute
  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <Box className="md:p-20">
      <Typography variant="h5" gutterBottom>
        Mailing
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr' }, gap: 4 }}>
        {/* Form Section */}
        <Box 
          component="form" 
          noValidate 
          onSubmit={handleSubmit} 
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
                  label="Marketing Email (All users who opted to receive marketing emails)" 
                />
                <FormControlLabel 
                  value="specific" 
                  control={<Radio />} 
                  label="Individual Email" 
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

            <FormControlLabel
              control={
                <Switch
                  checked={isScheduled}
                  onChange={(e) => setIsScheduled(e.target.checked)}
                />
              }
              label="Schedule Email"
            />

            {isScheduled && (
              <TextField
                fullWidth
                label="Schedule Time"
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: getCurrentDateTime()
                }}
              />
            )}

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Subject"
              variant="outlined"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
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
              value={formData.emailContent}
              onChange={handleChange}
              inputProps={{
                style: { whiteSpace: 'pre-wrap' }
              }}
            />
            <Button 
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isScheduled && !scheduledTime}
            >
              {loading ? 'Processing...' : (isScheduled ? 'Schedule Email' : 'Send Email')}
            </Button>
          </Stack>
        </Box>

        {/* Preview Section */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Email Preview
          </Typography>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              minHeight: '500px',
              backgroundColor: '#fff',
              fontFamily: 'Arial, sans-serif'
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <img 
                src="https://s3-scientific-journal.s3.ap-south-1.amazonaws.com/Images/logo-removebg-preview.jpg" 
                alt="Scientific Journals" 
                style={{ width: '50%', maxWidth: '200px' }}
              />
            </Box>
            <Box sx={{ lineHeight: 1.6 }}>
              <Typography variant="h6" gutterBottom>
                {formData.subject || 'Subject'}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography paragraph>Hi there,</Typography>
              <Typography 
                component="div" 
                sx={{ 
                  whiteSpace: 'pre-line',
                  mb: 2,
                  minHeight: '100px'
                }}
              >
                {formatPreviewText(formData.emailContent)}
              </Typography>
              <Typography>
                <a 
                  href="https://scientificjournalsportal.com/" 
                  style={{ color: '#1976d2', textDecoration: 'none' }}
                >
                  Scientific Journals Team
                </a>
              </Typography>
            </Box>
          </Paper>
        </Box>
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
  );
};

export default CreateMarketingEmail;