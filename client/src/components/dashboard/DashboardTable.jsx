import React from 'react';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { dashboardColors } from '../../utils/theme';
import EmptyState from './EmptyState';

/**
 * Shared table chrome: sticky header surface, empty/loading states.
 * Children should be TableHead + TableBody (or custom content when empty/loading).
 *
 * @param {{
 *   children?: React.ReactNode,
 *   loading?: boolean,
 *   empty?: boolean,
 *   emptyTitle?: string,
 *   emptyHint?: string,
 *   emptyActionLabel?: string,
 *   onEmptyAction?: () => void,
 *   ariaLabel?: string,
 *   minWidth?: number,
 * }} props
 */
const DashboardTable = ({
  children,
  loading = false,
  empty = false,
  emptyTitle = 'Nothing here yet',
  emptyHint,
  emptyActionLabel,
  onEmptyAction,
  ariaLabel = 'data table',
  minWidth = 650,
}) => {
  if (loading) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          border: `1px solid ${dashboardColors.peach}`,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Skeleton variant="rounded" height={40} />
          <Skeleton variant="rounded" height={48} />
          <Skeleton variant="rounded" height={48} />
          <Skeleton variant="rounded" height={48} />
        </Box>
      </Paper>
    );
  }

  if (empty) {
    return (
      <Paper
        elevation={0}
        sx={{ border: `1px solid ${dashboardColors.peach}` }}
      >
        <EmptyState
          title={emptyTitle}
          hint={emptyHint}
          actionLabel={emptyActionLabel}
          onAction={onEmptyAction}
        />
      </Paper>
    );
  }

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border: `1px solid ${dashboardColors.peach}`,
        overflowX: 'auto',
        '& .MuiTableHead-root .MuiTableCell-head': {
          position: 'sticky',
          top: 0,
          zIndex: 1,
        },
      }}
    >
      <Table sx={{ minWidth }} aria-label={ariaLabel} size="medium">
        {children}
      </Table>
    </TableContainer>
  );
};

export default DashboardTable;
