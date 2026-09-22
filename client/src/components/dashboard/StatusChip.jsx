import React from 'react';
import Chip from '@mui/material/Chip';

const STATUS_MAP = {
  published: { label: 'Published', color: 'success' },
  rejected: { label: 'Rejected', color: 'error' },
  'under review': { label: 'Under review', color: 'warning' },
  under_review: { label: 'Under review', color: 'warning' },
  'in review': { label: 'In review', color: 'warning' },
  accepted: { label: 'Accepted', color: 'success' },
  pending: { label: 'Pending', color: 'default' },
};

/**
 * Semantic status chip — never uses brand brown for status.
 * @param {{ status?: string, label?: string, color?: 'default'|'success'|'warning'|'error'|'info'|'primary' }} props
 */
const StatusChip = ({ status, label, color, size = 'small' }) => {
  const key = (status || '').toLowerCase().trim();
  const mapped = STATUS_MAP[key];
  const displayLabel = label || mapped?.label || status || 'Unknown';
  const displayColor = color || mapped?.color || 'default';

  return (
    <Chip
      label={displayLabel}
      color={displayColor}
      size={size}
      sx={{ fontWeight: 500 }}
    />
  );
};

export default StatusChip;
