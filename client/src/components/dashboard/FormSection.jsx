import React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { dashboardColors } from '../../utils/theme';

/**
 * Titled card wrapper for long forms inside the dashboard.
 * @param {{ title?: string, subtitle?: string, children: React.ReactNode, maxWidth?: number|string }} props
 */
const FormSection = ({ title, subtitle, children, maxWidth = 720 }) => {
  return (
    <Box sx={{ width: '100%', maxWidth, mx: 'auto' }}>
      {(title || subtitle) && (
        <Box sx={{ mb: 2.5 }}>
          {title && (
            <Typography
              variant="h5"
              component="h2"
              sx={{ fontWeight: 600, color: dashboardColors.ink, mb: subtitle ? 0.5 : 0 }}
            >
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      )}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          border: `1px solid ${dashboardColors.peach}`,
          backgroundColor: dashboardColors.paper,
        }}
      >
        {children}
      </Paper>
    </Box>
  );
};

export default FormSection;
