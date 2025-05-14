import React, { useState, useEffect } from 'react';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Avatar, 
  Menu, 
  MenuItem,
  useMediaQuery,
  useTheme,
  Tooltip,
  Badge,
  Backdrop,
  CircularProgress
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  HealthAndSafety as HealthIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { Outlet, useNavigate } from 'react-router-dom';
import ResponsiveBottomNavigation from '../navigation/BottomNavigation';

interface AppLayoutProps {
  toggleDarkMode?: () => void;
  darkMode?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ toggleDarkMode, darkMode }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationsEl, setNotificationsEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<{id: number, message: string, read: boolean}[]>([
    { id: 1, message: 'Новая консультация доступна', read: false },
    { id: 2, message: 'Ваш отчет о здоровье готов', read: false },
    { id: 3, message: 'Напоминание о приеме лекарств', read: true }
  ]);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  // Simulate loading when navigating
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotifications = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsClose = () => {
    setNotificationsEl(null);
  };

  const handleNotificationRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleLogout = () => {
    // Remove auth token and return to login screen
    localStorage.removeItem('authToken');
    navigate('/login');
    handleClose();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Box sx={{ 
      display: 'flex',
      minHeight: '100vh',
      bgcolor: 'background.default'
    }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          boxShadow: isMobile ? '0 1px 3px rgba(0,0,0,0.12)' : 'none',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          ...(darkMode && {
            backgroundColor: 'rgba(18, 18, 18, 0.8)',
          }),
        }}
        color="inherit"
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              cursor: 'pointer' 
            }}
            onClick={() => navigate('/')}
          >
            <HealthIcon 
              color="primary" 
              sx={{ 
                mr: 1, 
                fontSize: 30,
                transform: 'rotate(-10deg)',
              }} 
            />
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              MedAssyst
            </Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title={darkMode ? "Светлая тема" : "Темная тема"}>
              <IconButton 
                color="inherit" 
                onClick={toggleDarkMode}
                sx={{ ml: 1 }}
              >
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Уведомления">
              <IconButton
                color="inherit"
                onClick={handleNotifications}
                sx={{ ml: 1 }}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <IconButton
              onClick={handleMenu}
              color="inherit"
              sx={{ ml: 1 }}
            >
              <Avatar 
                alt="Профиль" 
                src="/assets/avatar.png"
                sx={{ width: 32, height: 32 }}
              />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Notifications Menu */}
      <Menu
        id="notifications-menu"
        anchorEl={notificationsEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(notificationsEl)}
        onClose={handleNotificationsClose}
      >
        {notifications.length === 0 ? (
          <MenuItem>У вас нет новых уведомлений</MenuItem>
        ) : (
          notifications.map((notification) => (
            <MenuItem 
              key={notification.id}
              onClick={() => {
                handleNotificationRead(notification.id);
                handleNotificationsClose();
              }}
              sx={{
                bgcolor: notification.read ? 'transparent' : 'rgba(25, 118, 210, 0.08)',
                '&:hover': {
                  bgcolor: notification.read ? undefined : 'rgba(25, 118, 210, 0.12)',
                },
                fontWeight: notification.read ? 'normal' : 'bold'
              }}
            >
              {notification.message}
            </MenuItem>
          ))
        )}
      </Menu>
      
      {/* User Menu */}
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>Профиль</MenuItem>
        <MenuItem onClick={() => { navigate('/settings'); handleClose(); }}>Настройки</MenuItem>
        <MenuItem onClick={handleLogout}>Выйти</MenuItem>
      </Menu>
      
      {/* Loading Indicator */}
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 2,
          display: loading ? 'flex' : 'none'
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      
      {/* Main content area */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3,
          width: '100%',
          mt: 8,
          ml: isMobile ? 0 : '240px',
          mb: isMobile ? 8 : 0,
          transition: 'margin 0.3s ease',
        }}
      >
        <Outlet />
      </Box>
      
      {/* Responsive Navigation */}
      <ResponsiveBottomNavigation />
    </Box>
  );
};

export default AppLayout;
