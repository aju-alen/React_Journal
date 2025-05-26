import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ImageHeader from '../components/ImageHeader';
import { Link } from 'react-router-dom';

const tiers = [
  {
    title: 'Two Day Access',
    price: '199.00',
    description: [
      'Unlimited access to all articles for 2 days',
    ],
    buttonText: 'Get Started',
    popular: false,
    lookup_key: 'two_day_access',
  },
  {
    title: 'One Week Access',
    price: '699.00',
    description: [
      'Unlimited access to all articles for 7 days',
    ],
    buttonText: 'Get Started',
    popular: true,
    lookup_key: 'one_week_access',
  },
];

const ProductDisplayy = () => {
  const [userId, setUserId] = useState('');
  const [emailId, setEmailId] = useState('');

  useEffect(() => {
    const getUser = JSON.parse(localStorage.getItem('currentUser'))?.user;
    setUserId(getUser.id);
    setEmailId(getUser.email);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <ImageHeader />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Header Section */}
        <Box 
          textAlign="center" 
          mb={8}
          sx={{
            p: 4,
          }}
        >
          <Typography
            component="h1"
            variant="h3"
            fontWeight="500"
            gutterBottom
            color="text.primary"
          >
            Article Pricing Plans
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              maxWidth: '600px', 
              mx: 'auto',
              color: 'text.secondary',
              mt: 2
            }}
          >
            Choose the plan that works best for you
          </Typography>
        </Box>

        {/* Pricing Cards */}
        <Grid container spacing={4} justifyContent="center">
          {tiers.map((tier) => (
            <Grid item xs={12} md={6} key={tier.title}>
              <Card
                elevation={tier.popular ? 2 : 1}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  borderRadius: 2,
                  border: tier.popular ? '1px solid' : 'none',
                  borderColor: 'primary.main',
                  '&:hover': {
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  },
                }}
              >
                {tier.popular && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -12,
                      right: 20,
                      bgcolor: 'primary.main',
                      color: 'white',
                      px: 2,
                      py: 0.5,
                      borderRadius: 1,
                    }}
                  >
                   
                  </Box>
                )}

                <CardContent sx={{ flexGrow: 1, pt: 6, px: 4 }}>
                  <Typography
                    component="h2"
                    variant="h5"
                    color="text.primary"
                    gutterBottom
                    fontWeight="500"
                    sx={{ mb: 2 }}
                  >
                    {tier.title}
                  </Typography>
                  
                  <Box 
                    sx={{ 
                      my: 3,
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: 1
                    }}
                  >
                    <Typography 
                      component="span" 
                      variant="h3" 
                      fontWeight="500" 
                      color="text.primary"
                    >
                      AED {tier.price}
                    </Typography>
                    <Typography 
                      component="span" 
                      variant="subtitle1" 
                      color="text.secondary"
                    >
                      /{tier.title.includes('Weekly') ? 'week' : 'month'}
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 3 }}>
                    {tier.description.map((feature) => (
                      <Box
                        key={feature}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 2,
                        }}
                      >
                        <CheckCircleRoundedIcon
                          sx={{ 
                            color: 'primary.main', 
                            mr: 2,
                            fontSize: '1.2rem'
                          }}
                        />
                        <Typography variant="body1" color="text.secondary">
                          {feature}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 4, pt: 0 }}>
                  <form
                    action="https://react-journal1.onrender.com/api/stripe/create-checkout-sessions"
                    method="POST"
                    style={{ width: '100%' }}
                  >
                  {/* <form
                    action="http://localhost:3001/api/stripe/create-checkout-sessions"
                    method="POST"
                    style={{ width: '100%' }}
                  > */}
                    <input
                      type="hidden"
                      name="lookup_key"
                      value={tier.lookup_key}
                    />
                    <input type="hidden" name="userId" value={userId} />
                    <input type="hidden" name="emailId" value={emailId} />
                    <Button
                      fullWidth
                      variant={tier.popular ? "contained" : "outlined"}
                      size="large"
                      type="submit"
                      sx={{
                        py: 1.5,
                        fontSize: '1rem',
                        borderRadius: 1,
                        textTransform: 'none',
                        fontWeight: 500,
                      }}
                    >
                      {tier.buttonText}
                    </Button>
                  </form>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Additional Info Section */}
        <Box 
          textAlign="center" 
          mt={8}
          sx={{
            p: 3,
          }}
        >
          <Typography variant="body1" color="text.secondary">
            Need a custom plan? Contact us for enterprise solutions
          </Typography>
        </Box>
      </Container>
    </div>
  );
};

const SuccessDisplay = ({ sessionId }) => {
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const getUser = JSON.parse(localStorage.getItem('currentUser'))?.user;
    setUserId(getUser.id);
    console.log(userId, 'getuser');
  }, []);
  return (
    <div className="h-auto w-auto  ">
      <ImageHeader />
      <div className="flex flex-col items-center justify-center md:m-20 ">
        <h1 className=' mb-8 ' >Payment Complete!✅</h1>
        < h1 className=' mx-4 text-center' > You can download the invoice or get any details regarding the payment on your
          <Link to={`/dashboard/${userId}`} className='text-blue-700'>
            <b className=' text-xl'> Dashboard </b>
          </Link>
          menu.</h1>
      </div>
    </div>
  );
};

const Message = ({ message }) => (
  <section>
    <p>{message}</p>
  </section>
);

export default function ProductDisplay() {
  let [message, setMessage] = useState('');
  let [success, setSuccess] = useState(false);
  let [sessionId, setSessionId] = useState('');

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get('success')) {
      setSuccess(true);
      setSessionId(query.get('session_id'));
    }

    if (query.get('canceled')) {
      setSuccess(false);
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }
  }, [sessionId]);

  if (!success && message === '') {
    return <ProductDisplayy />;
  } else if (success && sessionId !== '') {
    return <SuccessDisplay sessionId={sessionId} />;
  } else {
    return <Message message={message} />;
  }
}

