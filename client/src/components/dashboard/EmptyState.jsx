import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { dashboardColors } from '../../utils/theme';

/**
 * @param {{ title: string, hint?: string, actionLabel?: string, onAction?: () => void }} props
 */
const EmptyState = ({ title, hint, actionLabel, onAction }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: 6,
        px: 3,
        gap: 1.5,
      }}
    >
      <Typography variant="h6" sx={{ color: dashboardColors.ink, fontWeight: 600 }}>
        {title}
      </Typography>
      {hint && (
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
          {hint}
        </Typography>
      )}
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction} sx={{ mt: 1 }}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
