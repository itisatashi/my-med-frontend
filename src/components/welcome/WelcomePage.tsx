
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Container, 
  useTheme, 
  Paper,
  Fade,
  Slide,
  IconButton
} from '@mui/material';
import { 
  ArrowForward as ArrowForwardIcon,
  HealthAndSafety as HealthIcon,
  Psychology as PsychologyIcon,
  Analytics as AnalyticsIcon,
  TouchApp as TouchAppIcon,
  ArrowDownward
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Animation for staggered entrance
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

const WelcomePage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  // Listen for scroll to animate header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to features section
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box sx={{ 
      bgcolor: 'background.default',
      minHeight: '100vh',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Background gradients */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle at 20% 20%, ${theme.palette.primary.light}22, transparent 25%), 
                     radial-gradient(circle at 80% 60%, ${theme.palette.secondary.light}22, transparent 30%)`,
        zIndex: 0
      }} />

      {/* Header */}
      <Paper 
        elevation={scrolled ? 3 : 0} 
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 70,
          display: 'flex',
          alignItems: 'center',
          px: 3,
          zIndex: 10,
          transition: 'all 0.3s ease',
          bgcolor: scrolled ? 'background.paper' : 'transparent',
          backdropFilter: scrolled ? 'blur(8px)' : 'none',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <HealthIcon sx={{ fontSize: 32, color: 'primary.main', mr: 1 }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Med<span style={{ color: theme.palette.primary.main }}>Assyst</span>
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Button 
          variant="outlined" 
          color="primary" 
          sx={{ mr: 2 }}
          onClick={() => navigate('/login')}
        >
          Войти
        </Button>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate('/signup')}
        >
          Регистрация
        </Button>
      </Paper>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ pt: 15, pb: 10, position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -2 }}>
          <Box sx={{ width: { xs: '100%', md: '50%' }, px: 2 }}>
            <AnimatedItem delay={100}>
              <Typography 
                variant="h2" 
                component="h1" 
                fontWeight="bold"
                sx={{ 
                  mb: 2,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                }}
              >
                Медицинский ассистент на базе искусственного интеллекта
              </Typography>
            </AnimatedItem>
            
            <AnimatedItem delay={300}>
              <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary', maxWidth: '90%' }}>
                Получите точные диагнозы, медицинские консультации и персонализированные рекомендации в режиме реального времени
              </Typography>
            </AnimatedItem>
            
            <AnimatedItem delay={500}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/signup')}
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    borderRadius: '28px',
                    boxShadow: '0 8px 16px rgba(0, 127, 255, 0.2)'
                  }}
                >
                  Начать бесплатно
                </Button>
                
                <Button 
                  variant="outlined" 
                  color="primary"
                  size="large"
                  onClick={scrollToFeatures}
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    borderRadius: '28px'
                  }}
                >
                  Узнать больше
                </Button>
              </Box>
            </AnimatedItem>
            
            <AnimatedItem delay={700}>
              <Typography variant="body2" sx={{ mt: 3, color: 'text.secondary' }}>
                *Не является заменой профессиональной медицинской консультации
              </Typography>
            </AnimatedItem>
          </Box>
          
          <Box sx={{ width: { xs: '100%', md: '50%' }, px: 2 }}>
            <AnimatedItem delay={400}>
              <Paper
                elevation={4}
                sx={{ 
                  width: '100%',
                  maxWidth: 600,
                  height: 380,
                  borderRadius: '16px',
                  bgcolor: 'background.paper',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  transform: 'perspective(1000px) rotateY(-5deg) rotateX(5deg)',
                  transition: 'all 0.3s ease',
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'perspective(1000px) rotateY(-2deg) rotateX(2deg) translateY(-10px)',
                  }
                }}
              >
                {/* Stylized medical interface */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <HealthIcon fontSize="large" color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h5" fontWeight="bold">MedAssyst Интерфейс</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      bgcolor: 'primary.light', 
                      color: 'primary.dark',
                      px: 2, 
                      py: 1, 
                      borderRadius: 2, 
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <PsychologyIcon sx={{ mr: 1 }} />
                    <Typography fontWeight="medium">Диагностика</Typography>
                  </Paper>
                  
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      bgcolor: 'secondary.light', 
                      color: 'secondary.dark',
                      px: 2, 
                      py: 1, 
                      borderRadius: 2, 
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <AnalyticsIcon sx={{ mr: 1 }} />
                    <Typography fontWeight="medium">Аналитика</Typography>
                  </Paper>
                </Box>
                
                {/* Health stats visualization */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="medium" gutterBottom>Показатели здоровья</Typography>
                  
                  {/* Health bars */}
                  {['Иммунитет', 'Сердце', 'Уровень стресса', 'Общее состояние'].map((item, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">{item}</Typography>
                        <Typography variant="body2" color="primary.main" fontWeight="medium">
                          {85 - index * 10}%
                        </Typography>
                      </Box>
                      <Box 
                        sx={{ 
                          height: 6, 
                          borderRadius: 3, 
                          bgcolor: 'grey.100',
                          overflow: 'hidden'
                        }}
                      >
                        <Box 
                          sx={{ 
                            height: '100%', 
                            width: `${85 - index * 10}%`, 
                            bgcolor: index < 2 ? 'primary.main' : index === 2 ? 'warning.main' : 'success.main',
                            borderRadius: 3
                          }} 
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
                
                {/* Gradient overlay for depth effect */}
                <Box sx={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  left: 0, 
                  right: 0, 
                  height: '30%', 
                  background: 'linear-gradient(to top, rgba(255,255,255,0.8), transparent)',
                  pointerEvents: 'none'
                }} />
              </Paper>
            </AnimatedItem>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <IconButton onClick={scrollToFeatures} sx={{ animation: 'bounce 2s infinite' }}>
            <ArrowDownward />
          </IconButton>
          <style>
            {`
              @keyframes bounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-20px); }
                60% { transform: translateY(-10px); }
              }
            `}
          </style>
        </Box>
      </Container>
      
      {/* Features Section */}
      <Box 
        id="features"
        sx={{ 
          bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : '#f8faff',
          py: 10,
          position: 'relative',
          zIndex: 1,
          borderRadius: '40px 40px 0 0',
          mt: -4,
          boxShadow: '0px -10px 30px rgba(0,0,0,0.03)'
        }}
      >
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            component="h2" 
            fontWeight="bold" 
            textAlign="center"
            sx={{ mb: 6 }}
          >
            Возможности <span style={{ color: theme.palette.primary.main }}>MedAssyst</span>
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -2 }}>
            {[
              {
                icon: <PsychologyIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
                title: 'AI-Диагностика',
                description: 'Получите предварительный диагноз на основе ваших симптомов с помощью передовых алгоритмов искусственного интеллекта.'
              },
              {
                icon: <HealthIcon sx={{ fontSize: 60, color: '#4caf50' }} />,
                title: 'Медицинские консультации',
                description: 'Задавайте вопросы и получайте быстрые, информативные ответы о заболеваниях, лекарствах и методах лечения.'
              },
              {
                icon: <TouchAppIcon sx={{ fontSize: 60, color: '#ff9800' }} />,
                title: 'Удобный интерфейс',
                description: 'Интуитивно понятный и простой в использовании интерфейс, доступный на различных языках и платформах.'
              },
              {
                icon: <AnalyticsIcon sx={{ fontSize: 60, color: '#e91e63' }} />,
                title: 'Аналитика здоровья',
                description: 'Отслеживайте свои консультации и получайте персонализированные рекомендации на основе истории ваших запросов.'
              }
            ].map((feature, index) => (
              <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, px: 2, mb: 3 }} key={index}>
                <AnimatedItem delay={200 * (index + 1)}>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 3, 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      textAlign: 'center',
                      borderRadius: 4,
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {feature.icon}
                    <Typography variant="h6" fontWeight="bold" sx={{ my: 2 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Paper>
                </AnimatedItem>
              </Box>
            ))}
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/signup')}
              sx={{ 
                px: 4, 
                py: 1.5,
                borderRadius: '28px'
              }}
            >
              Присоединиться сейчас
            </Button>
          </Box>
        </Container>
      </Box>
      
      {/* Footer */}
      <Box sx={{ 
        bgcolor: theme.palette.mode === 'dark' ? 'background.default' : '#f0f4fa',
        py: 4,
        position: 'relative',
        zIndex: 1
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <HealthIcon sx={{ fontSize: 24, color: 'primary.main', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  MedAssyst
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                © 2025 MedAssyst. Все права защищены.
              </Typography>
            </Box>
            <Box sx={{ mt: { xs: 2, sm: 0 } }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button size="small" onClick={() => navigate('/login')}>Войти</Button>
                <Button size="small" onClick={() => navigate('/signup')}>Регистрация</Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default WelcomePage;
