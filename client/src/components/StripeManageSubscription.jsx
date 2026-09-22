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
import { dashboardColors } from '../utils/theme';

const StripeManageSubscription = () => {
  const billingPortalUrl =
    'https://billing.stripe.com/p/login/28E8wPgxx6UNcE38LX14400';

  const features = [
    {
      icon: <PaymentIcon sx={{ color: dashboardColors.ink, mr: 2, mt: 0.5 }} />,
      title: 'Update payment methods',
      body: 'Add, remove, or update your payment methods securely',
    },
    {
      icon: <ReceiptIcon sx={{ color: dashboardColors.ink, mr: 2, mt: 0.5 }} />,
      title: 'View billing history',
      body: 'Access all your past invoices and payment receipts',
    },
    {
      icon: <CancelIcon sx={{ color: dashboardColors.ink, mr: 2, mt: 0.5 }} />,
      title: 'Cancel subscription',
      body: 'Cancel at any time — access continues until the end of your billing period',
    },
    {
      icon: (
        <SubscriptionIcon sx={{ color: dashboardColors.ink, mr: 2, mt: 0.5 }} />
      ),
      title: 'Manage subscription',
      body: 'Change your plan or update subscription settings',
    },
  ];

  return (
    <Box sx={{ width: '100%', maxWidth: 640 }}>
      <Typography
        variant="h5"
        component="h2"
        sx={{ fontWeight: 600, color: dashboardColors.ink, mb: 2 }}
      >
        Manage subscription
      </Typography>
      <Card
        elevation={0}
        sx={{
          border: `1px solid ${dashboardColors.peach}`,
          backgroundColor: dashboardColors.paper,
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SubscriptionIcon
              sx={{ fontSize: 36, color: dashboardColors.ink, mr: 1.5 }}
            />
            <Typography
              variant="h6"
              component="h3"
              sx={{ fontWeight: 600, color: dashboardColors.ink }}
            >
              Subscription portal
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
            Take control of your subscription: payment methods, invoices, plan
            changes, and cancellation — all in Stripe&apos;s secure billing portal.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
            {features.map((f) => (
              <Box key={f.title} sx={{ display: 'flex', alignItems: 'flex-start' }}>
                {f.icon}
                <Typography variant="body2" color="text.secondary">
                  <strong style={{ color: dashboardColors.ink }}>{f.title}:</strong>{' '}
                  {f.body}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-start', px: 2, pb: 3 }}>
          <Button
            variant="contained"
            href={billingPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            endIcon={<OpenInNewIcon />}
          >
            Open subscription portal
          </Button>
        </CardActions>
        <Typography
          variant="caption"
          sx={{ display: 'block', px: 2, pb: 2, color: 'text.secondary' }}
        >
          You will be redirected to Stripe&apos;s secure billing portal.
        </Typography>
      </Card>
    </Box>
  );
};

export default StripeManageSubscription;
