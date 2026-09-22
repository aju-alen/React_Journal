import React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';
import { dashboardColors } from '../../utils/theme';

/**
 * @param {{
 *   groups: Array<{ id: string, label: string|null, items: Array<{ id: string, label: string, badge?: number }> }>,
 *   activeSection: string,
 *   onNavigate: (sectionId: string) => void,
 * }} props
 */
const DashboardNav = ({ groups, activeSection, onNavigate }) => {
  return (
    <Box component="nav" aria-label="Dashboard navigation" sx={{ py: 1 }}>
      {groups.map((group, gi) => (
        <Box key={group.id} sx={{ mb: 0.5 }}>
          {group.label && (
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                px: 2,
                pt: gi === 0 ? 1 : 2,
                pb: 0.5,
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: 'text.secondary',
                fontSize: '0.7rem',
              }}
            >
              {group.label}
            </Typography>
          )}
          <List dense disablePadding>
            {group.items.map((item) => {
              const selected = activeSection === item.id;
              return (
                <ListItemButton
                  key={item.id}
                  selected={selected}
                  onClick={() => onNavigate(item.id)}
                  sx={{
                    mx: 1,
                    borderRadius: 2,
                    mb: 0.25,
                    transition: 'background-color 180ms ease-out',
                    '&.Mui-selected': {
                      backgroundColor: dashboardColors.peach,
                      color: dashboardColors.ink,
                      '&:hover': {
                        backgroundColor: dashboardColors.peach,
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(241, 222, 215, 0.5)',
                    },
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      fontWeight: selected ? 600 : 500,
                    }}
                  />
                  {item.badge > 0 && (
                    <Badge
                      badgeContent={item.badge}
                      color="primary"
                      max={99}
                      sx={{
                        '& .MuiBadge-badge': {
                          position: 'static',
                          transform: 'none',
                          fontWeight: 600,
                        },
                      }}
                    />
                  )}
                </ListItemButton>
              );
            })}
          </List>
          {gi < groups.length - 1 && (
            <Divider sx={{ mx: 2, my: 1, borderColor: dashboardColors.peach }} />
          )}
        </Box>
      ))}
    </Box>
  );
};

export default DashboardNav;
