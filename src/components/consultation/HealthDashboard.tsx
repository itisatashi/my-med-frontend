import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  LinearProgress,
  Tooltip,
  Card,
  CardContent,
} from '@mui/material';
import { 
  MonitorHeartOutlined,
  QueryStatsOutlined,
  TrendingUpOutlined,
  HealthAndSafetyOutlined,
  InfoOutlined,
} from '@mui/icons-material';

interface HealthMetricProps {
  title: string;
  value: number;
  max: number;
  unit: string;
  description: string;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'error';
  icon: React.ReactNode;
}

interface HealthScoreProps {
  score: number;
  lastChange: number;
  trends: {
    period: string;
    change: number;
  }[];
}

/**
 * Component for displaying personalized health dashboard
 */
const HealthDashboard = () => {
  // In a real app, this would come from the backend based on actual analysis
  const healthScore: HealthScoreProps = {
    score: 87,
    lastChange: 3,
    trends: [
      { period: 'За неделю', change: 3 },
      { period: 'За месяц', change: 5 },
      { period: 'За квартал', change: 8 },
    ]
  };

  // Health metrics - would be calculated from real data
  const healthMetrics: HealthMetricProps[] = [
    {
      title: 'Частота консультаций',
      value: 2.5,
      max: 10,
      unit: 'в месяц',
      description: 'Средняя частота обращений за консультацией',
      color: 'info',
      icon: <QueryStatsOutlined />,
    },
    {
      title: 'Срочные случаи',
      value: 1,
      max: 10,
      unit: 'в месяц',
      description: 'Количество срочных консультаций',
      color: 'warning',
      icon: <MonitorHeartOutlined />,
    },
    {
      title: 'Улучшение состояния',
      value: 12,
      max: 30,
      unit: 'дней',
      description: 'Среднее время до улучшения симптомов',
      color: 'success',
      icon: <TrendingUpOutlined />,
    },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Персональная панель здоровья
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Индивидуальная аналитика на основе ваших консультаций и симптомов
        </Typography>
      </Box>

      {/* Health Score Card */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <HealthAndSafetyOutlined color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">
            Индекс здоровья
          </Typography>
          <Tooltip title="Комплексный показатель, рассчитанный на основе ваших симптомов, их тяжести и частоты консультаций">
            <InfoOutlined fontSize="small" color="action" sx={{ ml: 1 }} />
          </Tooltip>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
          <Typography variant="h3" fontWeight="bold" color="primary">
            {healthScore.score}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>
            / 100
          </Typography>
          <Box 
            sx={{ 
              ml: 2, 
              bgcolor: healthScore.lastChange > 0 ? 'success.light' : 'error.light',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Typography 
              variant="body2" 
              fontWeight="medium"
              color={healthScore.lastChange > 0 ? 'success.dark' : 'error.dark'}
            >
              {healthScore.lastChange > 0 ? '+' : ''}{healthScore.lastChange} пунктов
            </Typography>
          </Box>
        </Box>

        <LinearProgress 
          variant="determinate" 
          value={healthScore.score} 
          sx={{ 
            mt: 2, mb: 3, 
            height: 10,
            borderRadius: 5,
            bgcolor: 'rgba(0,0,0,0.05)',
            '& .MuiLinearProgress-bar': {
              borderRadius: 5,
            }
          }} 
        />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {healthScore.trends.map((trend, index) => (
            <Box key={index} sx={{ flex: '1 1 30%', textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {trend.period}
              </Typography>
              <Typography 
                variant="h6" 
                fontWeight="medium"
                color={trend.change >= 0 ? 'success.main' : 'error.main'}
              >
                {trend.change > 0 ? '+' : ''}{trend.change}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Health Metrics */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {healthMetrics.map((metric, index) => (
          <Box key={index} sx={{ flex: '1 1 30%', minWidth: '250px' }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ color: `${metric.color}.main`, mr: 1 }}>
                    {metric.icon}
                  </Box>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {metric.title}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                  <Typography variant="h4" fontWeight="bold" color={`${metric.color}.main`}>
                    {metric.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    {metric.unit}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary">
                  {metric.description}
                </Typography>
                
                <LinearProgress 
                  variant="determinate" 
                  color={metric.color}
                  value={(metric.value / metric.max) * 100} 
                  sx={{ 
                    mt: 2,
                    height: 6,
                    borderRadius: 3,
                    bgcolor: 'rgba(0,0,0,0.05)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 3,
                    }
                  }} 
                />
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default HealthDashboard;
