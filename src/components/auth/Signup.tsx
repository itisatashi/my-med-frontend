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
  useTheme,
  Fade,
  Slide,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  HealthAndSafety as HealthIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  ArrowBack,
  ArrowForward as ArrowForwardIcon,
  Check as CheckIcon
} from '@mui/icons-material';

interface SignupProps {
  onSignupSuccess: () => void;
  onNavigateToLogin: () => void;
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

const Signup: React.FC<SignupProps> = ({ onSignupSuccess, onNavigateToLogin }) => {
  const theme = useTheme();
  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  
  // UI states
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form validation
  const validatePersonalInfo = () => {
    if (!firstName.trim()) {
      setError('Пожалуйста, введите имя');
      return false;
    }
    if (!lastName.trim()) {
      setError('Пожалуйста, введите фамилию');
      return false;
    }
    if (!email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      setError('Пожалуйста, введите корректный email');
      return false;
    }
    return true;
  };

  const validateCredentials = () => {
    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return false;
    }
    if (!agreeToTerms) {
      setError('Для продолжения необходимо принять условия использования');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError('');
    if (activeStep === 0 && validatePersonalInfo()) {
      setActiveStep(1);
    } else if (activeStep === 1 && validateCredentials()) {
      handleSubmit();
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(0, prev - 1));
    setError('');
  };

  const handleSubmit = () => {
    // We already validated in handleNext
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSignupSuccess();
    }, 800);
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
        background: `radial-gradient(circle at 80% 20%, ${theme.palette.primary.light}22, transparent 25%), 
                     radial-gradient(circle at 20% 80%, ${theme.palette.secondary.light}22, transparent 25%)`,
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
          minHeight: '70vh'
        }}>
          {/* Left side - Content */}
          <Box sx={{ 
            width: { xs: '100%', md: '50%' },
            p: 5, 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <AnimatedItem delay={100}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <HealthIcon sx={{ fontSize: 32, color: 'primary.main', mr: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Med<span style={{ color: theme.palette.primary.main }}>Assyst</span>
                </Typography>
              </Box>
            </AnimatedItem>

            <AnimatedItem delay={200}>
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                Создайте аккаунт
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Зарегистрируйтесь, чтобы получать персонализированные медицинские консультации и рекомендации
              </Typography>
            </AnimatedItem>

            <AnimatedItem delay={300}>
              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                <Step>
                  <StepLabel>Личная информация</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Учетные данные</StepLabel>
                </Step>
              </Stepper>
            </AnimatedItem>

            {error && (
              <AnimatedItem delay={0}>
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              </AnimatedItem>
            )}

            <Box component="form" noValidate autoComplete="off">
              {activeStep === 0 ? (
                // Step 1: Personal Information
                <>
                  <AnimatedItem delay={400}>
                    <TextField
                      label="Имя"
                      fullWidth
                      required
                      margin="normal"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="primary" />
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

                  <AnimatedItem delay={500}>
                    <TextField
                      label="Фамилия"
                      fullWidth
                      required
                      margin="normal"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="primary" />
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

                  <AnimatedItem delay={600}>
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

                  <AnimatedItem delay={700}>
                    <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                      <InputLabel id="role-label">Я регистрируюсь как</InputLabel>
                      <Select
                        labelId="role-label"
                        value={role}
                        label="Я регистрируюсь как"
                        onChange={(e) => setRole(e.target.value)}
                        sx={{ borderRadius: 2 }}
                      >
                        <MenuItem value="patient">Пациент</MenuItem>
                        <MenuItem value="doctor">Врач</MenuItem>
                      </Select>
                      <FormHelperText>
                        Выберите вашу роль в системе
                      </FormHelperText>
                    </FormControl>
                  </AnimatedItem>
                </>
              ) : (
                // Step 2: Credentials
                <>
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
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </AnimatedItem>

                  <AnimatedItem delay={500}>
                    <TextField
                      label="Подтвердите пароль"
                      type={showPassword ? 'text' : 'password'}
                      fullWidth
                      required
                      margin="normal"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ 
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </AnimatedItem>

                  <AnimatedItem delay={600}>
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={agreeToTerms} 
                          onChange={(e) => setAgreeToTerms(e.target.checked)}
                          color="primary"
                        />
                      }
                      label={
                        <Typography variant="body2">
                          Я согласен с {' '}
                          <Typography 
                            component="span" 
                            variant="body2" 
                            color="primary"
                            sx={{ 
                              cursor: 'pointer', 
                              '&:hover': { textDecoration: 'underline' }
                            }}
                          >
                            Условиями использования
                          </Typography>{' '}
                          и{' '}
                          <Typography 
                            component="span" 
                            variant="body2" 
                            color="primary"
                            sx={{ 
                              cursor: 'pointer', 
                              '&:hover': { textDecoration: 'underline' }
                            }}
                          >
                            Политикой конфиденциальности
                          </Typography>
                        </Typography>
                      }
                      sx={{ mb: 3 }}
                    />
                  </AnimatedItem>
                </>
              )}

              <AnimatedItem delay={800}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  {activeStep > 0 && (
                    <Button
                      onClick={handleBack}
                      sx={{ 
                        borderRadius: 2,
                        px: 3
                      }}
                    >
                      Назад
                    </Button>
                  )}
                  <Box sx={{ flex: '1 1 auto' }} />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    disabled={loading}
                    endIcon={activeStep < 1 ? <ArrowForwardIcon /> : <CheckIcon />}
                    sx={{ 
                      py: 1.5, 
                      px: 4,
                      borderRadius: 2,
                      boxShadow: '0 4px 10px rgba(0, 127, 255, 0.2)',
                      '&:hover': {
                        boxShadow: '0 6px 15px rgba(0, 127, 255, 0.3)',
                      }
                    }}
                  >
                    {activeStep < 1 ? 'Далее' : (loading ? 'Создание...' : 'Создать аккаунт')}
                  </Button>
                </Box>
              </AnimatedItem>

              <AnimatedItem delay={900}>
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Уже есть аккаунт?{' '}
                    <Typography 
                      component="span" 
                      variant="body2" 
                      color="primary" 
                      fontWeight="bold"
                      onClick={onNavigateToLogin}
                      sx={{ 
                        cursor: 'pointer', 
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      Войти
                    </Typography>
                  </Typography>
                </Box>
              </AnimatedItem>
            </Box>
          </Box>

          {/* Right side - Image and info */}
          <Box sx={{
            width: { xs: '100%', md: '50%' },
            bgcolor: theme.palette.primary.main,
            color: 'white',
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            p: 0
          }}>
            <Box sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundImage: 'url(/doctor-signup.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.3
            }} />

            <Box sx={{ p: 5, position: 'relative', zIndex: 1 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Преимущества MedAssyst
              </Typography>
              
              {[
                'Мгновенная медицинская консультация 24/7',
                'Персонализированные рекомендации на основе ИИ',
                'Конфиденциальность и безопасность данных',
                'Доступ к истории консультаций в любое время'
              ].map((benefit, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%',
                    bgcolor: 'white',
                    color: 'primary.main',
                    mr: 2
                  }}>
                    <CheckIcon fontSize="small" />
                  </Box>
                  <Typography variant="body1">{benefit}</Typography>
                </Box>
              ))}
              
              <Typography variant="body2" sx={{ mt: 4, opacity: 0.8 }}>
                "MedAssyst использует передовые алгоритмы искусственного интеллекта для предоставления точных и быстрых медицинских консультаций. Наша система постоянно обучается, чтобы предоставлять вам самую актуальную информацию."
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Signup;
