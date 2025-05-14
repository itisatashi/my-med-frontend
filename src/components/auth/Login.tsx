import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
  Container,
  Divider,
  useTheme,
  Fade,
  Slide
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  HealthAndSafety as HealthIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  LocalHospital as LocalHospitalIcon,
  CheckCircle as CheckCircleIcon,
  Facebook as FacebookIcon,
  Google as GoogleIcon,
  ArrowBack
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

interface LoginProps {
  onLoginSuccess: () => void;
  onNavigateToSignup: () => void;
}

// Animation component for staggered entrance
const AnimatedItem = ({ children, delay }: { children: React.ReactNode, delay: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <Fade in={isVisible} timeout={800}>
      <Slide direction="up" in={isVisible} timeout={800}>
        <div>{children}</div>
      </Slide>
    </Fade>
  );
};

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onNavigateToSignup }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(email, password);

    if (success) {
      onLoginSuccess();
    } else {
      setError('Неверный email или пароль. Попробуйте ещё раз.');
    }
    setLoading(false);
  };

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      bgcolor: 'background.default',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background elements */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle at 10% 10%, ${theme.palette.primary.light}22, transparent 25%), 
                      radial-gradient(circle at 90% 80%, ${theme.palette.secondary.light}22, transparent 25%)`,
        zIndex: 0
      }} />
      
      <IconButton 
        sx={{ 
          position: 'absolute', 
          top: 20, 
          left: 20, 
          bgcolor: 'background.paper',
          boxShadow: '0 3px 5px rgba(0,0,0,0.1)',
          '&:hover': { bgcolor: 'background.paper' }
        }}
        onClick={() => window.history.back()}
      >
        <ArrowBack />
      </IconButton>

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          borderRadius: 4, 
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          bgcolor: 'background.paper',
          minHeight: '60vh'
        }}>
          {/* Left side - Gradient Background with Content */}
          <Box sx={{ 
            width: { xs: '100%', md: '50%' },
            background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
            position: 'relative',
            padding: 4,
            color: 'white',
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            {/* Decorative circles */}
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1,
              background: `radial-gradient(circle at 20% 30%, white, transparent 25%), 
                           radial-gradient(circle at 80% 70%, white, transparent 25%)`
            }} />
            
            {/* App logo/icon */}
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
              <LocalHospitalIcon sx={{ fontSize: 40, mr: 2 }} />
              <Typography variant="h4" component="div" fontWeight="bold">
                МедАссист
              </Typography>
            </Box>
            
            {/* Welcome text */}
            <Typography variant="h3" component="h1" fontWeight="bold" sx={{ mb: 2 }}>
              Добро пожаловать!
            </Typography>
            
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, fontWeight: 'normal' }}>
              Управляйте своим здоровьем с помощью нашей медицинской платформы
            </Typography>
            
            {/* Feature list */}
            <Box sx={{ mt: 2 }}>
              {[
                'Консультации с врачами онлайн',
                'Напоминания о приеме лекарств',
                'Медицинская аналитика',
                'Безопасное хранение медицинских данных'
              ].map((feature, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CheckCircleIcon sx={{ mr: 1, fontSize: 20, color: 'secondary.light' }} />
                  <Typography variant="body1">{feature}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
          
          {/* Right side - Login form */}
          <Box sx={{ 
            width: { xs: '100%', md: '50%' },
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <AnimatedItem delay={100}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <HealthIcon sx={{ fontSize: 32, color: 'primary.main', mr: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Med<span style={{ color: theme.palette.primary.main }}>Assyst</span>
                </Typography>
              </Box>
            </AnimatedItem>

            <AnimatedItem delay={200}>
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                Вход в аккаунт
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Войдите, чтобы получить персонализированные медицинские консультации
              </Typography>
            </AnimatedItem>
            
            <AnimatedItem delay={250}>
              <Alert severity="info" sx={{ mb: 3, borderRadius: 2, '& .MuiAlert-message': { width: '100%' } }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Demo для презентации хакатона
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Используйте любые из этих учетных данных:
                </Typography>
                <Box sx={{ 
                  bgcolor: 'background.default', 
                  p: 1, 
                  borderRadius: 1,
                  fontSize: '0.85rem',
                  fontFamily: 'monospace',
                  mb: 1 
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box>patient@medassyst.ru</Box>
                    <Box>patient123</Box>
                  </Box>
                </Box>
                
              </Alert>
            </AnimatedItem>

            {error && (
              <AnimatedItem delay={0}>
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              </AnimatedItem>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
              <AnimatedItem delay={300}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  required
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </AnimatedItem>

              <AnimatedItem delay={400}>
                <TextField
                  label="Пароль"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  required
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword((prev) => !prev)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    mb: 1,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </AnimatedItem>

              <AnimatedItem delay={450}>
                <Typography 
                  variant="body2" 
                  color="primary" 
                  sx={{ 
                    textAlign: 'right', 
                    mb: 3, 
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Забыли пароль?
                </Typography>
              </AnimatedItem>

              <AnimatedItem delay={500}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{ 
                    py: 1.5, 
                    borderRadius: 2,
                    boxShadow: '0 4px 10px rgba(0, 127, 255, 0.2)',
                    '&:hover': {
                      boxShadow: '0 6px 15px rgba(0, 127, 255, 0.3)',
                    }
                  }}
                >
                  {loading ? 'Входим...' : 'Войти'}
                </Button>
              </AnimatedItem>

              <AnimatedItem delay={600}>
                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    или войдите через
                  </Typography>
                </Divider>
              </AnimatedItem>

              <AnimatedItem delay={700}>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                  <IconButton 
                    size="large" 
                    sx={{ 
                      bgcolor: '#4267B2', 
                      color: 'white',
                      '&:hover': { bgcolor: '#385898' }
                    }}
                  >
                    <FacebookIcon />
                  </IconButton>
                  <IconButton 
                    size="large" 
                    sx={{ 
                      bgcolor: '#DB4437', 
                      color: 'white',
                      '&:hover': { bgcolor: '#C53929' }
                    }}
                  >
                    <GoogleIcon />
                  </IconButton>
                </Box>
              </AnimatedItem>

              <AnimatedItem delay={800}>
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Нет аккаунта?{' '}
                    <Typography 
                      component="span" 
                      variant="body2" 
                      color="primary" 
                      fontWeight="bold"
                      onClick={onNavigateToSignup}
                      sx={{ 
                        cursor: 'pointer', 
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      Зарегистрироваться
                    </Typography>
                  </Typography>
                </Box>
              </AnimatedItem>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
