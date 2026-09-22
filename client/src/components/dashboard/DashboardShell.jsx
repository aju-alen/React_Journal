import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { dashboardColors } from '../../utils/theme';
import DashboardNav from './DashboardNav';
import { getRoleLabel, getPrimaryCta } from './dashboardSections';

const SIDEBAR_WIDTH = 260;

/**
 * @param {{
 *   userDetails: object,
 *   isAdmin: boolean,
 *   isReviewer: boolean,
 *   navGroups: Array,
 *   activeSection: string,
 *   onNavigate: (sectionId: string) => void,
 *   children: React.ReactNode,
 * }} props
 */
const DashboardShell = ({
  userDetails,
  isAdmin,
  isReviewer,
  navGroups,
  activeSection,
  onNavigate,
  children,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const title = userDetails?.user?.title || '';
  const surname = userDetails?.user?.surname || '';
  const roleLabel = getRoleLabel({ isAdmin, isReviewer });
  const primaryCta = getPrimaryCta({ isAdmin, isReviewer });

  const handleNav = (sectionId) => {
    onNavigate(sectionId);
    setDrawerOpen(false);
  };

  const sidebarContent = (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: dashboardColors.paper,
        borderRight: `1px solid ${dashboardColors.peach}`,
      }}
    >
      {isMobile && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton aria-label="Close menu" onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
      )}
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <DashboardNav
          groups={navGroups}
          activeSection={activeSection}
          onNavigate={handleNav}
        />
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 112px)',
        backgroundColor: dashboardColors.canvas,
        // Clear fixed Navbar (h-20 / sm:h-24 / md:h-28)
        pt: { xs: 10, sm: 12, md: 14 },
      }}
    >
      <Box
        sx={{
          px: { xs: 2, md: 3 },
          py: 2,
          backgroundColor: dashboardColors.paper,
          borderBottom: `1px solid ${dashboardColors.peach}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {isMobile && (
            <IconButton
              aria-label="Open menu"
              onClick={() => setDrawerOpen(true)}
              edge="start"
            >
              <MenuIcon />
            </IconButton>
          )}
          <Box>
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: 600,
                color: dashboardColors.ink,
                fontSize: { xs: '1.15rem', sm: '1.4rem' },
              }}
            >
              Welcome, {title} {surname}
            </Typography>
            <Chip
              label={roleLabel}
              size="small"
              sx={{
                mt: 0.5,
                backgroundColor: dashboardColors.peach,
                color: dashboardColors.ink,
                fontWeight: 600,
              }}
            />
          </Box>
        </Box>
        <Button
          variant="contained"
          onClick={() => handleNav(primaryCta.section)}
          sx={{ flexShrink: 0 }}
        >
          {primaryCta.label}
        </Button>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'stretch' }}>
        {!isMobile && (
          <Box
            sx={{
              width: SIDEBAR_WIDTH,
              flexShrink: 0,
              position: 'sticky',
              top: 0,
              alignSelf: 'flex-start',
              maxHeight: 'calc(100vh - 80px)',
              overflowY: 'auto',
            }}
          >
            {sidebarContent}
          </Box>
        )}

        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          ModalProps={{ keepMounted: true }}
        >
          {sidebarContent}
        </Drawer>

        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            p: { xs: 2, md: 3 },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardShell;
