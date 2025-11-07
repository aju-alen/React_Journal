import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import SubscriptionIcon from '@mui/icons-material/Subscriptions';
import PaymentIcon from '@mui/icons-material/Payment';
import CancelIcon from '@mui/icons-material/Cancel';
import ReceiptIcon from '@mui/icons-material/Receipt';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const StripeManageSubscription = () => {
  const billingPortalUrl = 'https://billing.stripe.com/p/login/28E8wPgxx6UNcE38LX14400';

  return (
    <Box sx={{ width: '100%', p: { xs: 2, md: 4 } }}>
      {/* Subscription Management Section */}
      <Card elevation={3} sx={{ mb: 4, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <SubscriptionIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Typography variant="h4" component="h2" sx={{ fontWeight: 600, color: '#1a202c' }}>
              Manage Your Subscription
            </Typography>
          </Box>
          
          <Typography variant="body1" sx={{ mb: 3, color: '#4a5568', lineHeight: 1.8 }}>
            The Subscription Management portal allows you to take full control of your subscription. 
            You can view your subscription details, manage payment methods, update billing information, 
            and cancel your subscription if needed.
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#2d3748' }}>
              What you can do:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <PaymentIcon sx={{ color: 'primary.main', mr: 2, mt: 0.5 }} />
                <Typography variant="body2" sx={{ color: '#4a5568' }}>
                  <strong>Update Payment Methods:</strong> Add, remove, or update your payment methods securely
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <ReceiptIcon sx={{ color: 'primary.main', mr: 2, mt: 0.5 }} />
                <Typography variant="body2" sx={{ color: '#4a5568' }}>
                  <strong>View Billing History:</strong> Access all your past invoices and payment receipts
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <CancelIcon sx={{ color: 'primary.main', mr: 2, mt: 0.5 }} />
                <Typography variant="body2" sx={{ color: '#4a5568' }}>
                  <strong>Cancel Subscription:</strong> Cancel your subscription at any time (access continues until the end of your billing period)
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <SubscriptionIcon sx={{ color: 'primary.main', mr: 2, mt: 0.5 }} />
                <Typography variant="body2" sx={{ color: '#4a5568' }}>
                  <strong>Manage Subscription:</strong> Change your subscription plan or update subscription settings
                </Typography>
              </Box>
            </Box>
          </Box>

          <CardActions sx={{ justifyContent: 'center', pt: 2 }}>
            <Button
              variant="contained"
              size="large"
              href={billingPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              endIcon={<OpenInNewIcon />}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                boxShadow: 3,
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              Open Subscription Portal
            </Button>
          </CardActions>

          <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 2, color: '#718096' }}>
            You will be redirected to Stripe's secure billing portal to manage your subscription
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default StripeManageSubscription;

