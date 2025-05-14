import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  BottomNavigation, 
  BottomNavigationAction, 
  Drawer, 
  List, 
  ListItemIcon, 
  ListItemText,
  Box,
  useMediaQuery,
  useTheme,
  Fab,
  Zoom,
  Badge,
} from '@mui/material';
import { 
  Home as HomeIcon, 
  Medication as MedicineIcon, 
  Analytics as AnalyticsIcon, 
  Person as ProfileIcon, 
  Chat as ChatIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Главная', value: '/', icon: <HomeIcon /> },
  { label: 'Консультации', value: '/consult', icon: <MedicineIcon /> },
  { label: 'Аналитика', value: '/analytics', icon: <AnalyticsIcon /> },
  { label: 'Чат', value: '/chat', icon: <ChatIcon /> },
  { label: 'Профиль', value: '/profile', icon: <ProfileIcon /> },
];

const ResponsiveBottomNavigation: React.FC = () => {
  const [value, setValue] = useState('/');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [newMessages] = useState(3); // Demo notification count
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const navigate = useNavigate();
  const location = useLocation();

  // Sync navigation value with current route
  useEffect(() => {
    // Find the closest matching route
    const matchingRoute = navItems.find(item => 
      location.pathname.startsWith(item.value) && item.value !== '/'
    ) || navItems.find(item => item.value === location.pathname);
    
    if (matchingRoute) {
      setValue(matchingRoute.value);
    }
  }, [location]);

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    navigate(newValue);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Drawer content for desktop
  const drawer = (
    <Box sx={{ width: 240, pt: 8 }}>
      <List>
        {navItems.map((item) => (
          <Box 
            key={item.value} 
            onClick={() => {
              navigate(item.value);
              if (!isDesktop) setDrawerOpen(false);
            }}
            sx={{
              cursor: 'pointer',
              borderRadius: '0 50px 50px 0',
              my: 1,
              mx: 1,
              py: 1,
              px: 2,
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.3s',
              bgcolor: value === item.value ? 'primary.light' : 'transparent',
              color: value === item.value ? 'primary.main' : 'inherit',
              '& .MuiSvgIcon-root': {
                color: value === item.value ? 'primary.main' : 'inherit',
                mr: 2
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: '36px' }}>
              {item.label === 'Чат' ? (
                <Badge badgeContent={newMessages} color="error">
                  {item.icon}
                </Badge>
              ) : (
                item.icon
              )}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </Box>
        ))}
      </List>
    </Box>
  );

  if (isDesktop) {
    return (
      <>
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 240,
              boxSizing: 'border-box',
              borderRight: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.05)',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
        
        {/* Floating Action Button for quick consultation */}
        <Box
          sx={{
            position: 'fixed',
            bottom: 30,
            right: 30,
            zIndex: 1000,
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        >
          <Fab 
            color="primary" 
            aria-label="Новая консультация"
            onClick={() => navigate('/consult/new')}
            sx={{ 
              boxShadow: 3
            }}
          >
            <AddIcon />
          </Fab>
        </Box>
      </>
    );
  }

  return (
    <>
      {/* Temporary drawer for mobile */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
      >
        {drawer}
      </Drawer>
      
      {/* Floating Action Button appears when scrolling down */}
      <Zoom in={true}>
        <Box
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 16,
            zIndex: 1000
          }}
        >
          <Fab 
            color="primary" 
            aria-label="Новая консультация"
            onClick={() => navigate('/consult/new')}
          >
            <AddIcon />
          </Fab>
        </Box>
      </Zoom>
      
      {/* Bottom navigation for mobile */}
      <Paper 
        sx={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0,
          zIndex: 1000,
          borderRadius: '16px 16px 0 0',
          overflow: 'hidden',
          boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
        }} 
        elevation={3}
      >
        <BottomNavigation
          value={value}
          onChange={handleChange}
          showLabels
          sx={{ 
            height: 60,
            '& .MuiBottomNavigationAction-root': {
              padding: '6px 12px 8px',
              minWidth: 0,
              maxWidth: '92px'
            },
            '& .MuiBottomNavigationAction-label': {
              marginTop: '4px'
            },
            '& .Mui-selected': {
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.75rem',
                transition: 'font-size 0.2s',
              }
            }
          }}
        >
          {navItems.map((item) => (
            <BottomNavigationAction 
              key={item.value}
              label={item.label} 
              value={item.value} 
              icon={item.label === 'Чат' ? (
                <Badge badgeContent={newMessages} color="error">
                  {item.icon}
                </Badge>
              ) : (
                item.icon
              )}
              sx={{
                '& .MuiBottomNavigationAction-label': {
                  transition: 'font-size 0.2s, opacity 0.2s',
                  opacity: 0.7,
                },
                '&.Mui-selected': {
                  '& .MuiBottomNavigationAction-label': {
                    opacity: 1,
                  }
                }
              }}
            />
          ))}
        </BottomNavigation>
      </Paper>
    </>
  );
};

export default ResponsiveBottomNavigation;
