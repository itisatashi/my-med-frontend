import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Chip,
  Tooltip,
} from '@mui/material';
import { 
  TrendingUp, 
  InfoOutlined, 
  CheckCircleOutline,
  WarningAmber,
  Medication,
} from '@mui/icons-material';

interface HealthInsightProps {
  title: string;
  description: string;
  type: 'positive' | 'neutral' | 'warning' | 'action';
  icon?: React.ReactNode;
}

/**
 * Component for displaying AI-generated health insights
 */
const HealthInsightsCard = () => {
  // Sample insights - in a real app, these would be generated based on actual data analysis
  const insights: HealthInsightProps[] = [
    {
      title: 'Регулярные консультации',
      description: 'Вы регулярно консультируетесь по симптомам, что способствует раннему выявлению проблем.',
      type: 'positive',
      icon: <CheckCircleOutline />
    },
    {
      title: 'Общая тенденция',
      description: 'Общее состояние здоровья улучшается, исходя из характера ваших последних консультаций.',
      type: 'positive',
      icon: <TrendingUp />
    },
    {
      title: 'Сезонные паттерны',
      description: 'Респираторные симптомы чаще проявляются в весенний период, что может указывать на сезонную аллергию.',
      type: 'neutral',
      icon: <InfoOutlined />
    },
    {
      title: 'Рекомендации',
      description: 'На основе вашей истории, профилактический визит к стоматологу может быть полезен.',
      type: 'action',
      icon: <Medication />
    },
    {
      title: 'Мониторинг',
      description: 'Обратите внимание на головные боли, которые участились за последний месяц.',
      type: 'warning',
      icon: <WarningAmber />
    }
  ];

  // Get background color based on insight type
  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'positive': return 'rgba(76, 175, 80, 0.1)';
      case 'warning': return 'rgba(255, 152, 0, 0.1)';
      case 'neutral': return 'rgba(33, 150, 243, 0.1)';
      case 'action': return 'rgba(156, 39, 176, 0.1)';
      default: return 'rgba(0, 0, 0, 0.05)';
    }
  };

  // Get color based on insight type
  const getColor = (type: string) => {
    switch (type) {
      case 'positive': return 'success.main';
      case 'warning': return 'warning.main';
      case 'neutral': return 'info.main';
      case 'action': return 'secondary.main';
      default: return 'text.secondary';
    }
  };

  // Get label based on insight type
  const getLabel = (type: string) => {
    switch (type) {
      case 'positive': return 'Позитивно';
      case 'warning': return 'Требует внимания';
      case 'neutral': return 'Информация';
      case 'action': return 'Рекомендация';
      default: return 'Информация';
    }
  };

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Персональные инсайты
        </Typography>
        <Tooltip title="Инсайты генерируются на основе вашей истории консультаций и паттернов симптомов">
          <InfoOutlined fontSize="small" color="action" />
        </Tooltip>
      </Box>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        Анализ вашей истории консультаций показал следующие инсайты:
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {insights.map((insight, index) => (
          <Box
            key={index}
            sx={{
              p: 2,
              borderRadius: 1,
              bgcolor: getBackgroundColor(insight.type),
              display: 'flex',
              gap: 2,
              alignItems: 'flex-start',
            }}
          >
            <Box sx={{ color: getColor(insight.type), mt: 0.5 }}>
              {insight.icon}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="subtitle2" fontWeight="medium">
                  {insight.title}
                </Typography>
                <Chip 
                  label={getLabel(insight.type)} 
                  size="small" 
                  sx={{ 
                    bgcolor: 'background.paper',
                    color: getColor(insight.type),
                    fontWeight: 'medium',
                    fontSize: '0.7rem',
                  }} 
                />
              </Box>
              <Typography variant="body2">
                {insight.description}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default HealthInsightsCard;
