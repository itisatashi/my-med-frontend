import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Avatar, 
  Card, 
  CardContent,
  Button,
  Divider,
  Chip,
  IconButton,
  Tab,
  Tabs,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme
} from '@mui/material';
import { 
  Edit as EditIcon,
  Settings as SettingsIcon,
  Check as CheckIcon,
  Event as EventIcon,
  Timeline as TimelineIcon,
  HealthAndSafety as HealthIcon,
  Analytics as AnalyticsIcon,
  History as HistoryIcon,
  Favorite as FavoriteIcon,
  Notifications as NotificationsIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

/**
 * Enhanced user profile component for hackathon
 */
const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  
  // Mock consultation history
  const consultations = [
    { id: 1, date: '12 мая 2025', issue: 'Головная боль', status: 'Завершено', severity: 2 },
    { id: 2, date: '5 мая 2025', issue: 'Аллергическая реакция', status: 'Завершено', severity: 3 },
    { id: 3, date: '28 апреля 2025', issue: 'Боль в спине', status: 'Завершено', severity: 2 },
  ];
  
  // Mock health indicators
  const healthIndicators = [
    { name: 'Общее состояние', value: 85 },
    { name: 'Иммунитет', value: 72 },
    { name: 'Сердечно-сосудистая система', value: 90 },
    { name: 'Дыхательная система', value: 88 },
  ];
  
  // Handle tab change
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  return (
    <Container sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ 
        pt: { xs: 4, sm: 6, md: 8 }, 
        pb: { xs: 4, sm: 2, md: 0 },
        px: { xs: 1, sm: 2, md: 0 }
      }}>
        {/* Header with background gradient */}
        <Box sx={{ 
          position: 'relative',
          mb: 12,
          height: { xs: 200, sm: 220, md: 250 },
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
        }}>
          {/* Background patterns */}
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            background: `radial-gradient(circle at 20% 50%, white, transparent 25%), 
                         radial-gradient(circle at 80% 80%, white, transparent 25%)`
          }} />
          
          {/* Profile avatar and actions - positioned to overlap the header */}
          <Box sx={{ 
            position: 'absolute', 
            bottom: { xs: 20, sm: 25, md: 45 },
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'center', md: 'flex-end' },
            justifyContent: 'space-between',
            px: { xs: 2, md: 4 }
          }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              mb: { xs: 2, sm: 2.5, md: 0 },
              mt: { xs: -1, sm: 0, md: 0 }
            }}>
              <Avatar 
                sx={{ 
                  width: { xs: 90, sm: 120, md: 140 }, 
                  height: { xs: 90, sm: 120, md: 140 }, 
                  bgcolor: 'background.paper',
                  color: 'primary.main',
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 'bold',
                  border: '4px solid white',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}
              >
                {user?.first_name?.[0] || user?.email?.[0] || 'U'}
              </Avatar>
              
              <Box sx={{ 
                ml: { xs: 0, md: 3.5 }, 
                mt: { xs: 2, sm: 2.5, md: 0 },
                mb: { xs: 2, sm: 1, md: 0 },
                textAlign: { xs: 'center', md: 'left' } 
              }}>
                <Typography variant="h4" fontWeight="bold" color="white" sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}>
                  {user?.first_name || 'Пользователь'} {user?.last_name || ''}
                </Typography>
                <Typography variant="body1" color="white" sx={{ opacity: 0.8, mb: 1, fontSize: { xs: '0.875rem', md: '1rem' } }}>
                  {user?.email}
                </Typography>
                <Chip 
                  icon={<CheckIcon sx={{ color: 'white !important' }} />}
                  label={user?.role === 'doctor' ? 'Врач' : 
                         user?.role === 'admin' ? 'Администратор' : 
                         user?.role === 'patient' ? 'Пациент' : 'Пользователь'}
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    fontWeight: 'medium',
                    '& .MuiChip-icon': { color: 'white' }
                  }}
                />
              </Box>
            </Box>
            
            <Box sx={{
              display: 'flex',
              gap: 2,
              mt: { xs: 0, md: 0 },
              mb: { xs: 3, sm: 2, md: 0 },
              flexDirection: { xs: 'row', md: 'row' },
              justifyContent: { xs: 'center', md: 'flex-start' },
              width: { xs: '100%', md: 'auto' }
            }}>
              <Button 
                variant="contained" 
                color="secondary"
                startIcon={<EditIcon />}
                sx={{ 
                  borderRadius: 2,
                  bgcolor: 'white', 
                  color: 'primary.main',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                }}
              >
                Редактировать
              </Button>
              
              <IconButton sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
              }}>
                <SettingsIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
        
        {/* Profile Content Tabs */}
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            mt: { xs: 10, sm: 8, md: 4 },
            pt: { xs: 2, sm: 1, md: 0 },
            mb: 3,
            borderBottom: 1, 
            borderColor: 'divider',
            '& .MuiTab-root': {
              minWidth: 'auto',
              px: 3,
              py: 2,
              fontWeight: 'medium',
              textTransform: 'none',
              fontSize: '1rem',
            }
          }}
        >
          <Tab icon={<TimelineIcon />} iconPosition="start" label="Обзор" />
          <Tab icon={<HistoryIcon />} iconPosition="start" label="История консультаций" />
          <Tab icon={<AnalyticsIcon />} iconPosition="start" label="Показатели здоровья" />
          <Tab icon={<NotificationsIcon />} iconPosition="start" label="Уведомления" />
        </Tabs>
        
        {/* Dashboard Overview Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -2 }}>
            {/* Welcome Card */}
            <Box sx={{ width: { xs: '100%', lg: '66.67%' }, px: 2, mb: 4 }}>
              <Card elevation={0} sx={{ 
                borderRadius: 3, 
                border: '1px solid',
                borderColor: 'divider',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <HealthIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                    <Typography variant="h5" fontWeight="bold">Добро пожаловать в MedAssyst!</Typography>
                  </Box>
                  
                  <Typography variant="body1" paragraph>
                    Ваш личный кабинет предоставляет доступ к персонализированным медицинским консультациям и истории обращений. Отслеживайте свои показатели здоровья и получайте рекомендации, основанные на искусственном интеллекте.
                  </Typography>
                  
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Информация профиля:
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1 }}>
                    <Box sx={{ width: { xs: '100%', sm: '50%' }, px: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>Email:</Typography>
                        <Typography variant="body2" fontWeight="medium">{user?.email || 'Не указан'}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>Роль:</Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {user?.role === 'doctor' ? 'Врач' : 
                           user?.role === 'admin' ? 'Администратор' : 
                           user?.role === 'patient' ? 'Пациент' : 'Пользователь'}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ width: { xs: '100%', sm: '50%' }, px: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>Последний вход:</Typography>
                        <Typography variant="body2" fontWeight="medium">{new Date().toLocaleString('ru-RU')}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>Статус:</Typography>
                        <Chip 
                          size="small" 
                          label="Активен" 
                          color="success" 
                          sx={{ height: 24, fontSize: '0.75rem' }} 
                        />
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
            
            {/* Quick Stats */}
            <Box sx={{ width: { xs: '100%', lg: '33.33%' }, px: 2 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1.5 }}>
                {/* Consultations Count */}
                <Box sx={{ width: { xs: '100%', sm: '50%', lg: '100%' }, px: 1.5, mb: 3 }}>
                  <Card elevation={1} sx={{ 
                    borderRadius: 3, 
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'primary.main',
                    color: 'white',
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1" fontWeight="medium" sx={{ color: 'white' }}>
                          Консультации
                        </Typography>
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 40, height: 40, color: 'white' }}>
                          <EventIcon fontSize="small" />
                        </Avatar>
                      </Box>
                      <Typography variant="h3" fontWeight="bold" sx={{ my: 1, color: 'white' }}>
                        {consultations.length}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        Всего консультаций за последние 30 дней
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
                
                {/* Health Score */}
                <Box sx={{ width: { xs: '100%', sm: '50%', lg: '100%' }, px: 1.5, mb: 3 }}>
                  <Card elevation={0} sx={{ 
                    borderRadius: 3, 
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1" fontWeight="medium" color="text.primary">
                          Индекс здоровья
                        </Typography>
                        <Avatar sx={{ bgcolor: '#4caf50', width: 40, height: 40 }}>
                          <FavoriteIcon fontSize="small" />
                        </Avatar>
                      </Box>
                      <Typography variant="h3" fontWeight="bold" sx={{ my: 1, color: '#4caf50' }}>
                        87
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={87} 
                          sx={{ 
                            flex: 1, 
                            mr: 1,
                            height: 8,
                            borderRadius: 4,
                            bgcolor: 'rgba(76, 175, 80, 0.2)',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: '#4caf50'
                            }
                          }} 
                        />
                        <Typography variant="body2" color="#4caf50" fontWeight="bold">
                          87%
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            </Box>
            
            {/* Recent Consultations */}
            <Box sx={{ width: '100%', mt: 2 }}>
              <Card elevation={0} sx={{ 
                borderRadius: 3, 
                border: '1px solid',
                borderColor: 'divider',
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold">Недавние консультации</Typography>
                    <Button 
                      variant="text" 
                      endIcon={<HistoryIcon />}
                      onClick={() => setTabValue(1)}
                    >
                      Просмотреть все
                    </Button>
                  </Box>
                  
                  <Box sx={{ 
                    '& > *:not(:last-child)': {
                      borderBottom: '1px solid',
                      borderColor: 'divider'
                    }
                  }}>
                    {consultations.map((consultation) => (
                      <Box key={consultation.id} sx={{ py: 2, display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ 
                          bgcolor: consultation.severity === 3 ? '#f44336' : 
                                   consultation.severity === 2 ? '#ff9800' : '#4caf50',
                          width: 40,
                          height: 40,
                          mr: 2
                        }}>
                          <HealthIcon fontSize="small" />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2">{consultation.issue}</Typography>
                          <Typography variant="body2" color="text.secondary">{consultation.date}</Typography>
                        </Box>
                        <Chip 
                          size="small" 
                          label={consultation.status} 
                          color="primary" 
                          sx={{ height: 24, fontSize: '0.75rem' }} 
                        />
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </TabPanel>
        
        {/* Consultation History Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1.5 }}>
            <Box sx={{ width: '100%', px: 1.5, mb: 3 }}>
              <Card elevation={0} sx={{ 
                borderRadius: 3, 
                border: '1px solid',
                borderColor: 'divider',
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    История консультаций
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Все ваши медицинские консультации и диагнозы сохраняются здесь для удобного доступа.
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1 }}>
                    {[
                      ...consultations,
                      { id: 4, date: '15 апреля 2025', issue: 'Боль в горле', status: 'Завершено', severity: 1 },
                      { id: 5, date: '2 апреля 2025', issue: 'Кашель', status: 'Завершено', severity: 1 },
                      { id: 6, date: '20 марта 2025', issue: 'Головная боль', status: 'Завершено', severity: 2 },
                    ].map((consultation) => (
                      <Box key={consultation.id} sx={{ width: '100%', px: 1, mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ 
                              bgcolor: consultation.severity === 3 ? '#f44336' : 
                                       consultation.severity === 2 ? '#ff9800' : '#4caf50',
                            }}>
                              <HealthIcon />
                            </Avatar>
                            <Typography variant="subtitle2" sx={{ ml: 1 }}>{consultation.issue}</Typography>
                          </Box>
                          <Chip 
                            size="small" 
                            label={consultation.status} 
                            color="primary" 
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">{consultation.date}</Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </TabPanel>
        
        {/* Health Indicators Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1.5 }}>
            {/* Health Overview Card */}
            <Box sx={{ width: '100%', px: 1.5, mb: 3 }}>
              <Card elevation={0} sx={{ 
                borderRadius: 3, 
                border: '1px solid',
                borderColor: 'divider',
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Показатели здоровья
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Обзор ваших текущих показателей здоровья, основанных на истории консультаций и диагнозов.
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1 }}>
                    {healthIndicators.map((indicator, index) => (
                      <Box key={index} sx={{ width: { xs: '100%', md: '50%' }, px: 1, mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="subtitle2">{indicator.name}</Typography>
                          <Typography variant="subtitle2" color="primary" fontWeight="bold">
                            {indicator.value}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={indicator.value} 
                          sx={{ 
                            height: 10,
                            borderRadius: 5,
                            bgcolor: 'rgba(0, 127, 255, 0.1)',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 5,
                              bgcolor: indicator.value > 80 ? '#4caf50' : 
                                       indicator.value > 60 ? '#ff9800' : '#f44336',
                            }
                          }} 
                        />
                      </Box>
                    ))}
                  </Box>
                  
                  <Box sx={{ mt: 4, p: 3, bgcolor: 'primary.light', borderRadius: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary.main" gutterBottom>
                      Рекомендации для улучшения
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Основываясь на ваших показателях, рекомендуем уделить больше внимания иммунитету. 
                      Регулярные физические нагрузки, правильное питание и полноценный сон помогут 
                      укрепить вашу иммунную систему и улучшить общее самочувствие.
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </TabPanel>
        
        {/* Notifications Tab */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1.5 }}>
            <Box sx={{ width: '100%', px: 1.5, mb: 3 }}>
              <Card elevation={0} sx={{ 
                borderRadius: 3, 
                border: '1px solid',
                borderColor: 'divider',
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Уведомления и напоминания
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Управляйте уведомлениями и настройте напоминания о консультациях и приеме лекарств.
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1 }}>
                    {[
                      { id: 1, type: 'reminder', title: 'Напоминание о приеме лекарств', message: 'Не забудьте принять лекарство от давления сегодня в 18:00', time: '2 часа назад' },
                      { id: 2, type: 'system', title: 'Обновление системы', message: 'Мы обновили алгоритмы медицинских рекомендаций для повышения точности', time: '1 день назад' },
                      { id: 3, type: 'alert', title: 'Медицинское предупреждение', message: 'Обратите внимание на прогноз погоды - высокая влажность может обострить ваши аллергические реакции', time: '3 дня назад' }
                    ].map(notification => (
                      <Box sx={{ width: { xs: '100%', md: '50%' }, px: 1, mb: 2 }} key={notification.id}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ 
                              bgcolor: notification.type === 'reminder' ? '#2196f3' : 
                                       notification.type === 'system' ? '#4caf50' : '#f44336',
                            }}>
                              {notification.type === 'reminder' ? <EventIcon /> : 
                               notification.type === 'system' ? <CheckIcon /> : <WarningIcon />}
                            </Avatar>
                            <Typography variant="subtitle2" sx={{ ml: 1 }}>{notification.title}</Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">{notification.time}</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">{notification.message}</Typography>
                      </Box>
                    ))}
                  </Box>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Настройки уведомлений
                  </Typography>
                  
                  <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Вы можете настроить типы уведомлений, которые хотите получать, а также способы их доставки.
                    </Typography>
                    
                    <Button variant="outlined" color="primary" startIcon={<SettingsIcon />}>
                      Настроить уведомления
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </TabPanel>
        
        {/* Notifications Tab Content */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1.5 }}>
            <Box sx={{ width: '100%', px: 1.5, mb: 3 }}>
              <Card elevation={0} sx={{ 
                borderRadius: 3, 
                border: '1px solid',
                borderColor: 'divider',
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Уведомления и напоминания
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Управляйте уведомлениями и настройте напоминания о консультациях и приеме лекарств.
                  </Typography>
                  
                  <List>
                    {[  
                      { id: 1, type: 'reminder', title: 'Напоминание о приеме', description: 'Не забудьте принять лекарство', time: '2 часа назад' },
                      { id: 2, type: 'update', title: 'Обновление системы', description: 'Новые функции доступны', time: '1 день назад' },
                      { id: 3, type: 'success', title: 'Успешное действие', description: 'Ваши данные обновлены', time: '3 дня назад' }
                    ].map((item) => (
                      <ListItem key={item.id} alignItems="flex-start">
                        <ListItemIcon>
                      <Avatar sx={{ 
                        bgcolor: item.type === 'reminder' ? '#2196f3' : 
                                 item.type === 'update' ? '#ff9800' : '#4caf50',
                      }}>
                        {item.type === 'reminder' ? <EventIcon /> : 
                         item.type === 'update' ? <EditIcon /> : <CheckIcon />}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.title}
                      secondary={`${item.description} • ${item.time}`}
                      primaryTypographyProps={{ fontWeight: 'medium' }}
                    />
                  </ListItem>
                ))}
              </List>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Настройки уведомлений
              </Typography>
              
              <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Вы можете настроить типы уведомлений, которые хотите получать, а также способы их доставки.
                </Typography>
                
                <Button variant="outlined" color="primary" startIcon={<SettingsIcon />}>
                  Настроить уведомления
                </Button>
              </Box>
            </CardContent>
              </Card>
            </Box>
          </Box>
        </TabPanel>
      </Box>
    </Container>
  );
};

/**
 * Main Dashboard component is a simple wrapper around UserProfile
 * 
 * Note: The app routing is handled in App.tsx, and the AppLayout is used there
 * with proper Outlet routing. This Dashboard component is just for legacy compatibility.
 */
const Dashboard: React.FC = () => {
  return <UserProfile />;
};

export default Dashboard;
