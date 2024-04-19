
import  { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ImageHeader from '../components/ImageHeader';  
import { httpRoute } from '../helperFunctions.js';
import axios from 'axios';


const tiers = [
  {
    title: 'Weekly plan',
    price: '20.00',
    description: [
      'Week long access to all articles',
    ],
    buttonText: 'Sign up for free',
    buttonVariant: 'outlined',
  },
];


const ProductDisplayy = () => {
  const [userId, setUserId] = useState('')
  const [emailId, setEmailId] = useState('')
  useEffect(() => {
    const getUser = JSON.parse(localStorage.getItem('currentUser'))?.user
    setUserId(getUser.id)
    setEmailId(getUser.email)

    console.log(userId,emailId, 'getuser');
  }, []);
  
  return (
    <div className="h-auto w-auto bg-slate-200 ">
    <ImageHeader/>
    

  <Container
      id="pricing"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 6 },
      }}
    >
      <Box
        sx={{
          width: { sm: '100%', md: '60%' },
          textAlign: { sm: 'left', md: 'center' },
        }}
      >
        <Typography component="h2" variant="h4" color="text.primary">
          Pricing
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {/* Quickly build an effective pricing table for your potential customers with
          this layout. <br />
          It&apos;s built with default Material UI components with little
          customization. */}
        </Typography>
      </Box>
      <Grid container spacing={3} alignItems="center" justifyContent="center">
        {tiers.map((tier) => (
          <Grid
            item
            key={tier.title}
            xs={12}
            sm={tier.title === 'Enterprise' ? 12 : 6}
            md={4}
          >
            <Card
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                border: tier.title === '' ? '1px solid' : undefined,
                borderColor:
                  tier.title === '' ? 'primary.main' : undefined,
                background:
                  tier.title === ''
                    ? 'linear-gradient(#f4dea7, #000000)'
                    : undefined,
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    mb: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: tier.title === '' ? 'grey.100' : '',
                  }}
                >
                  <Typography component="h3" variant="h6">
                    {tier.title}
                  </Typography>
                  {tier.title === '' && (
                    <Chip
                      icon={<AutoAwesomeIcon />}
                      label={tier.subheader}
                      size="small"
                      sx={{
                        background: (theme) =>
                          theme.palette.mode === 'light' ? '' : 'none',
                        backgroundColor: 'primary.contrastText',
                        '& .MuiChip-label': {
                          color: 'primary.dark',
                        },
                        '& .MuiChip-icon': {
                          color: 'primary.dark',
                        },
                      }}
                    />
                  )}
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'baseline',
                    color: tier.title === '' ? 'grey.50' : undefined,
                  }}
                >
                  <Typography component="h3" variant="h2">
                    AED{tier.price}
                  </Typography>
                  <Typography component="h3" variant="h6">
                    &nbsp; per month
                  </Typography>
                </Box>
                <Divider
                  sx={{
                    my: 2,
                    opacity: 0.2,
                    borderColor: 'grey.500',
                  }}
                />
                {tier.description.map((line) => (
                  <Box
                    key={line}
                    sx={{
                      py: 1,
                      display: 'flex',
                      gap: 1.5,
                      alignItems: 'center',
                    }}
                  >
                    <CheckCircleRoundedIcon
                      sx={{
                        width: 20,
                        color:
                          tier.title === 'Professional'
                            ? 'primary.light'
                            : 'primary.main',
                      }}
                    />
                    <Typography
                      component="text"
                      variant="subtitle2"
                      sx={{
                        color:
                          tier.title === '' ? 'grey.200' : undefined,
                      }}
                    >
                      {line}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
              <CardActions>
              <form action="https://react-journal1.onrender.com/api/stripe/create-checkout-sessions" method="POST">
      {/* Add a hidden field with the lookup_key of your Price */}
      <input type="hidden" name="lookup_key" value="weekaccess" />
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="emailId" value={emailId} />
      <Button id="checkout-and-portal-button" type="submit">
        Pay now
      </Button>
    </form>
    </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
    </div>

    
)
}

// const SuccessDisplay = ({ sessionId }) => {

//     const handleSubmit = async (event) => {
//         event.preventDefault();
//         const resp = await axios.post(`${httpRoute}/api/stripe/create-portal-session`,{sessionId} )
//         console.log(resp.data, 'resp in success');
//     }
//   return (
//     <div className="h-auto w-auto bg-slate-200 ">
//     <ImageHeader/>
//     <section>
//       <div className="product Box-root">
//         <Logo />
//         <div className="description Box-root">
//           <h3>Subscription to starter plan successful!</h3>
//         </div>
//       </div>
//       <form onSubmit={handleSubmit}>
        
//         <button id="checkout-and-portal-button" type="submit">
//           Manage your billing information
//         </button>
//       </form>
//     </section>
//     </div>
//   );
// };


const SuccessDisplay = ({ sessionId }) => {
  return (
    <div className="h-auto w-auto bg-slate-200 ">
    <ImageHeader/>
    <section>
      <div className="product Box-root">
        <div className="description Box-root">
          <h3>Subscription to starter plan successful!</h3>
        </div>
      </div>
      <form action="https://react-journal1.onrender.com/api/stripe/create-portal-session" method="POST">
      <input type="hidden" name="sessionId" value={sessionId} />
      <button id="checkout-and-portal-button" type="submit">
        Manage your billing information
      </button>
    </form>
    </section>
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

