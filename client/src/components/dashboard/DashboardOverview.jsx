import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { dashboardColors } from '../../utils/theme';
import { SECTIONS } from './dashboardSections';

/**
 * Role-specific next-action cards for retention.
 * @param {{
 *   isAdmin: boolean,
 *   isReviewer: boolean,
 *   counts: { regularVerify?: number, specialVerify?: number, manuscripts?: number },
 *   onNavigate: (sectionId: string) => void,
 * }} props
 */
const DashboardOverview = ({ isAdmin, isReviewer, counts = {}, onNavigate }) => {
  const cards = buildCards({ isAdmin, isReviewer, counts });

  return (
    <Box>
      <Typography
        variant="h5"
        component="h2"
        sx={{ fontWeight: 600, color: dashboardColors.ink, mb: 0.5 }}
      >
        Your workspace
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Pick up where you left off — your next actions are below.
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          },
          gap: 2,
        }}
      >
        {cards.map((card) => (
          <Paper
            key={card.id}
            elevation={0}
            sx={{
              p: 2.5,
              border: `1px solid ${dashboardColors.peach}`,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              transition: 'border-color 180ms ease-out, box-shadow 180ms ease-out',
              '&:hover': {
                borderColor: dashboardColors.ink,
                boxShadow: '0 4px 12px rgba(84, 58, 49, 0.1)',
              },
            }}
          >
            <Box>
              {typeof card.count === 'number' && (
                <Typography
                  sx={{
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    color: dashboardColors.ink,
                    lineHeight: 1.2,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {card.count}
                </Typography>
              )}
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, color: dashboardColors.ink }}
              >
                {card.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {card.description}
              </Typography>
            </Box>
            <Button
              variant={card.primary ? 'contained' : 'outlined'}
              onClick={() => onNavigate(card.section)}
              sx={{ alignSelf: 'flex-start', mt: 'auto' }}
            >
              {card.cta}
            </Button>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

function buildCards({ isAdmin, isReviewer, counts }) {
  const regular = counts.regularVerify || 0;
  const special = counts.specialVerify || 0;
  const manuscripts = counts.manuscripts;

  if (isAdmin) {
    const cards = [
      {
        id: 'verify',
        title: 'Verification queue',
        description: `${regular} regular and ${special} special issue manuscripts awaiting review.`,
        count: regular + special,
        section: SECTIONS.VERIFY,
        cta: 'Review queue',
        primary: true,
      },
      {
        id: 'issue',
        title: 'Publish an issue',
        description: 'Upload and publish a full journal issue.',
        section: SECTIONS.SUBMIT_ISSUE,
        cta: 'Submit issue',
        primary: false,
      },
      {
        id: 'people',
        title: 'Reviewer management',
        description: 'Approve, reject, or revoke reviewer access.',
        section: SECTIONS.REVIEWER_MGMT,
        cta: 'Manage reviewers',
        primary: false,
      },
      {
        id: 'submit',
        title: 'Submit a manuscript',
        description: 'Start a new regular or special issue submission.',
        section: SECTIONS.SUBMIT,
        cta: 'Submit manuscript',
        primary: false,
      },
    ];
    if (isReviewer) {
      cards.splice(1, 0, {
        id: 'reviews',
        title: 'Articles for review',
        description: 'Accept or continue reviewing assigned articles.',
        section: SECTIONS.REVIEWS,
        cta: 'Open reviews',
        primary: false,
      });
    }
    return cards;
  }

  if (isReviewer) {
    return [
      {
        id: 'verify',
        title: 'Verification queue',
        description: `${regular + special} manuscripts need verification.`,
        count: regular + special,
        section: SECTIONS.VERIFY,
        cta: 'Open queue',
        primary: true,
      },
      {
        id: 'reviews',
        title: 'Articles for review',
        description: 'Accept or continue reviewing assigned articles.',
        section: SECTIONS.REVIEWS,
        cta: 'Open reviews',
        primary: false,
      },
      {
        id: 'billing',
        title: 'Billing',
        description: 'View purchases and manage your subscription.',
        section: SECTIONS.BILLING,
        cta: 'Manage billing',
        primary: false,
      },
    ];
  }

  // Author
  return [
    {
      id: 'manuscripts',
      title: 'My manuscripts',
      description:
        typeof manuscripts === 'number'
          ? `You have ${manuscripts} manuscript${manuscripts === 1 ? '' : 's'} in progress or published.`
          : 'Track status, download PDFs, and manage payments.',
      count: typeof manuscripts === 'number' ? manuscripts : undefined,
      section: SECTIONS.MANUSCRIPTS,
      cta: 'View manuscripts',
      primary: false,
    },
    {
      id: 'submit',
      title: 'Submit a manuscript',
      description: 'Choose regular or special issue and start the submission wizard.',
      section: SECTIONS.SUBMIT,
      cta: 'Start submission',
      primary: true,
    },
    {
      id: 'billing',
      title: 'Billing',
      description: 'Invoices, purchases, and subscription portal.',
      section: SECTIONS.BILLING,
      cta: 'Manage billing',
      primary: false,
    },
  ];
}

export default DashboardOverview;
