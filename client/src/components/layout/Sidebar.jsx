import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Typography, Divider,
  Avatar, Chip
} from '@mui/material';
import {
  TableChart, Dashboard, TrendingUp,
  AddCircleOutline, Logout
} from '@mui/icons-material';
import { signOut } from '../../store/slices/authSlice';

const DRAWER_WIDTH = 240;

const navItems = [
  { label: 'Dashboard',     icon: <Dashboard />,          path: '/dashboard' },
  { label: 'Trade Journal', icon: <TableChart />,          path: '/trades' },
  { label: 'Add Trade',     icon: <AddCircleOutline />,    path: '/trades/new' },
  { label: 'Portfolio',     icon: <TrendingUp />,          path: '/portfolio' }
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const handleSignOut = () => {
    dispatch(signOut());
    navigate('/login');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: 'background.paper',
          borderRight: '1px solid #1E293B'
        }
      }}
    >
      {/* Logo */}
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 36, height: 36,
            borderRadius: 1.5,
            backgroundColor: 'primary.main',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <TrendingUp sx={{ color: 'white', fontSize: 20 }} />
        </Box>
        <Box>
          <Typography variant="subtitle1" fontWeight={700} lineHeight={1}>
            Naik Org
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Trade Journal
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: '#1E293B' }} />

      {/* Navigation */}
      <List sx={{ px: 1, pt: 1, flexGrow: 1 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 1.5,
                  backgroundColor: isActive ? 'primary.main' : 'transparent',
                  '&:hover': {
                    backgroundColor: isActive ? 'primary.dark' : '#1E293B'
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: isActive ? 'white' : 'text.secondary'
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'white' : 'text.primary'
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: '#1E293B' }} />

      {/* User Info + Sign Out */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.dark', fontSize: '0.8rem' }}>
            {user?.username?.[0]?.toUpperCase()}
          </Avatar>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="body2" fontWeight={500} noWrap>
              {user?.username}
            </Typography>
            <Chip
              label="Trader"
              size="small"
              color="primary"
              variant="outlined"
              sx={{ height: 16, fontSize: '0.65rem' }}
            />
          </Box>
        </Box>
        <ListItemButton
          onClick={handleSignOut}
          sx={{ borderRadius: 1.5, color: 'error.main', px: 1 }}
        >
          <ListItemIcon sx={{ minWidth: 32, color: 'error.main' }}>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Sign Out"
            primaryTypographyProps={{ fontSize: '0.875rem' }}
          />
        </ListItemButton>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
