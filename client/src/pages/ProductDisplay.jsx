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
import axios from 'axios';
import { axiosTokenHeader, httpRoute } from '../helperFunctions';

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
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center">
          {tiers.map((tier) => (
            <Grid item xs={12} sm={10} md={6} lg={5} key={tier.title}>
              <Card
                elevation={tier.popular ? 2 : 1}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  borderRadius: { xs: 1, sm: 2 },
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
                      top: { xs: -10, sm: -12 },
                      right: { xs: 16, sm: 20 },
                      bgcolor: 'primary.main',
                      color: 'white',
                      px: { xs: 1.5, sm: 2 },
                      py: 0.5,
                      borderRadius: 1,
                    }}
                  >
                   
                  </Box>
                )}

                <CardContent sx={{ 
                  flexGrow: 1, 
                  pt: { xs: 4, sm: 6 }, 
                  px: { xs: 2, sm: 4 } 
                }}>
                  <Typography
                    component="h2"
                    variant="h5"
                    color="text.primary"
                    gutterBottom
                    fontWeight="500"
                    sx={{ 
                      mb: 2,
                      fontSize: { xs: '1.25rem', sm: '1.5rem' }
                    }}
                  >
                    {tier.title}
                  </Typography>
                  
                  <Box 
                    sx={{ 
                      my: { xs: 2, sm: 3 },
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
                      sx={{
                        fontSize: { xs: '1.75rem', sm: '2.5rem' }
                      }}
                    >
                      AED {tier.price}
                    </Typography>
                    <Typography 
                      component="span" 
                      variant="subtitle1" 
                      color="text.secondary"
                      sx={{
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      }}
                    >
                      /{tier.title.includes('Two') ? '2 days' : '7 days'}
                    </Typography>
                  </Box>

                  <Box sx={{ mt: { xs: 2, sm: 3 } }}>
                    {tier.description.map((feature) => (
                      <Box
                        key={feature}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: { xs: 1.5, sm: 2 },
                        }}
                      >
                        <CheckCircleRoundedIcon
                          sx={{ 
                            color: 'primary.main', 
                            mr: 2,
                            fontSize: { xs: '1rem', sm: '1.2rem' }
                          }}
                        />
                        <Typography 
                          variant="body1" 
                          color="text.secondary"
                          sx={{
                            fontSize: { xs: '0.875rem', sm: '1rem' }
                          }}
                        >
                          {feature}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>

                <CardActions sx={{ 
                  p: { xs: 2, sm: 4 }, 
                  pt: 0 
                }}>
                  <form
                    action="https://react-journal1.onrender.com/api/stripe/create-checkout-sessions"
                    method="POST"
                    style={{ width: '100%' }}
                  >
                    <input
                      type="hidden"
                      name="lookup_key"
                      value={tier.lookup_key}
                    />
                    <input type="hidden" name="userId" value={userId} />
                    <input type="hidden" name="emailId" value={emailId} />
                    <input type="hidden" name="purchaseType" value='subscription' />
                    <Button
                      fullWidth
                      variant={tier.popular ? "contained" : "outlined"}
                      size="large"
                      type="submit"
                      sx={{
                        py: { xs: 1, sm: 1.5 },
                        fontSize: { xs: '0.875rem', sm: '1rem' },
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
          {/* <Typography variant="body1" color="text.secondary">
            Need a custom plan? Contact us for enterprise solutions
          </Typography> */}
        </Box>
      </Container>
    </div>
  );
};

const SuccessDisplay = ({ sessionId }) => {
  const [userId, setUserId] = useState('');
  const [userSubscription, setUserSubscription] = useState(null);
  useEffect(() => {
    const getUser = JSON.parse(localStorage.getItem('currentUser'))?.user;
    setUserId(getUser.id);
    console.log(userId, 'getuser');

    const getUserSubscription = async () => {
      axios.defaults.headers.common['Authorization'] = axiosTokenHeader();
      console.log(currentUser.user.email, 'currentUser.user.email in article');
      const userSubscription = await axios.get(`${httpRoute}/api/subscription/user-details/${currentUser.user.email}`);
      setUserSubscription(userSubscription.data.getSubscription);
    }

    getUserSubscription();
  }, []);
  console.log(userSubscription, 'userSubscription');
  return (
    <div className="min-h-screen bg-gray-50">
      <ImageHeader />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircleRoundedIcon className="text-green-600 text-4xl" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Complete! 🎉</h1>
            <p className="text-gray-600">Thank you for your purchase. Your subscription is now active.</p>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-3">What's Next?</h2>
              <ul className="text-left space-y-3">
                <li className="flex items-start">
                  <CheckCircleRoundedIcon className="text-blue-600 mt-1 mr-2" />
                  <span>Access all premium articles immediately</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleRoundedIcon className="text-blue-600 mt-1 mr-2" />
                  <span>Download your invoice from the Dashboard</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleRoundedIcon className="text-blue-600 mt-1 mr-2" />
                  <span>Manage your subscription settings</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Need to Cancel?</h2>
              <p className="text-gray-600 mb-4">
                You can cancel your subscription at any time by:
              </p>
              <ol className="text-left space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="font-semibold mr-2">1.</span>
                  <span>Go to your <Link to={`/dashboard/${userId}`} className="text-blue-600 hover:text-blue-800 font-medium">Dashboard</Link></span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">2.</span>
                  <span>Click on "Manage Purchase" in the menu</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">3.</span>
                  <span>Follow the cancellation process</span>
                </li>
              </ol>
            </div>

            <Link 
              to={`/dashboard/${userId}`}
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
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

