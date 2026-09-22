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
    <Box>
      <Typography
        variant="h5"
        component="h2"
        sx={{ fontWeight: 600, color: 'primary.main', mb: 0.5 }}
      >
        Mailing
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Send or schedule marketing and individual emails.
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr' }, gap: 3 }}>
        <Paper
          elevation={0}
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{
            p: 3,
            border: '1px solid',
            borderColor: 'secondary.main',
          }}
        >
          <Stack spacing={2}>
            <FormControl>
              <FormLabel>Email type</FormLabel>
              <RadioGroup
                row
                value={emailType}
                onChange={(e) => setEmailType(e.target.value)}
              >
                <FormControlLabel
                  value="marketing"
                  control={<Radio />}
                  label="Marketing (opted-in users)"
                />
                <FormControlLabel
                  value="specific"
                  control={<Radio />}
                  label="Individual"
                />
              </RadioGroup>
            </FormControl>

            {emailType === 'specific' && (
              <TextField
                fullWidth
                label="Recipient email"
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
              label="Schedule email"
            />

            {isScheduled && (
              <TextField
                fullWidth
                label="Schedule time"
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: getCurrentDateTime() }}
              />
            )}

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Subject"
              variant="outlined"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              multiline
              rows={8}
              label="Email content"
              variant="outlined"
              name="emailContent"
              value={formData.emailContent}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isScheduled && !scheduledTime}
            >
              {loading
                ? 'Processing…'
                : isScheduled
                  ? 'Schedule email'
                  : 'Send email'}
            </Button>
          </Stack>
        </Paper>

        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
            Email preview
          </Typography>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              minHeight: 400,
              border: '1px solid',
              borderColor: 'secondary.main',
              backgroundColor: '#fff',
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
                sx={{ whiteSpace: 'pre-line', mb: 2, minHeight: 100 }}
              >
                {formatPreviewText(formData.emailContent)}
              </Typography>
              <Typography>
                <a
                  href="https://scientificjournalsportal.com/"
                  style={{ color: '#543a31', textDecoration: 'none' }}
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