import React, { useEffect, useState } from 'react';
import { 
  Typography, 
  Box, 
  CircularProgress, 
  Alert,
  Paper,
  Tab,
  Tabs
} from '@mui/material';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import { getAnalyticsData } from '../../utils/api';
import HealthDashboard from './HealthDashboard';
import HealthInsightsCard from './HealthInsightsCard';
import SymptomNetwork from './SymptomNetwork';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface AnalyticsData {
  daily_counts: { date: string; count: number }[];
  weekly_counts: { week: string; count: number }[];
  top_symptoms: { symptom: string; count: number }[];
  diagnosis_distribution: { diagnosis: string; count: number }[];
  severity_distribution: { severity: string; count: number }[];
  // New fields could be added here for advanced analytics features
}

interface ChartData {
  data: any;
  options: any;
}

/**
 * Component for displaying consultation analytics
 */
const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getAnalyticsData();
        
        // Validate that data is an object with the required fields
        if (data && typeof data === 'object') {
          setAnalyticsData(data);
        } else {
          console.error('Invalid analytics data format:', data);
          setError('Получены некорректные данные аналитики');
          // Set default analytics data to prevent rendering errors
          setAnalyticsData({
            daily_counts: [],
            weekly_counts: [],
            top_symptoms: [],
            diagnosis_distribution: [],
            severity_distribution: []
          } as AnalyticsData);
        }
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
        setError('Не удалось загрузить данные аналитики');
        // Set default analytics data on error
        setAnalyticsData({
          daily_counts: [],
          weekly_counts: [],
          top_symptoms: [],
          diagnosis_distribution: [],
          severity_distribution: []
        } as AnalyticsData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Prepare all chart data
  const getDailyCountsChart = (): ChartData | null => {
    if (!analyticsData || !analyticsData.daily_counts) return null;

    const labels = analyticsData.daily_counts.map((item: { date: string }) => {
      const date = new Date(item.date);
      return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
    });

    const data = analyticsData.daily_counts.map((item: { count: number }) => item.count);

    return {
      data: {
        labels,
        datasets: [
          {
            label: 'Количество консультаций',
            data,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    };
  };

  const getTopSymptomsChart = (): ChartData | null => {
    if (!analyticsData || !analyticsData.top_symptoms) return null;

    const labels = analyticsData.top_symptoms.map((item: { symptom: string }) => item.symptom);
    const data = analyticsData.top_symptoms.map((item: { count: number }) => item.count);

    return {
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
          },
        },
      },
    };
  };

  // Add weekly counts chart data preparation
  const getWeeklyCountsChart = (): ChartData | null => {
    if (!analyticsData || !analyticsData.weekly_counts) return null;

    const labels = analyticsData.weekly_counts.map(item => item.week);
    const data = analyticsData.weekly_counts.map(item => item.count);

    return {
      data: {
        labels,
        datasets: [{
          label: 'Консультации за неделю',
          data,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        }],
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    };
  };

  // Add diagnosis distribution chart
  const getDiagnosisDistributionChart = (): ChartData | null => {
    if (!analyticsData || !analyticsData.diagnosis_distribution) return null;

    const labels = analyticsData.diagnosis_distribution.map(item => item.diagnosis);
    const data = analyticsData.diagnosis_distribution.map(item => item.count);

    // Generate colors for each diagnosis category
    const colors = [
      'rgba(255, 99, 132, 0.6)',
      'rgba(54, 162, 235, 0.6)',
      'rgba(255, 206, 86, 0.6)',
      'rgba(75, 192, 192, 0.6)',
      'rgba(153, 102, 255, 0.6)',
      'rgba(255, 159, 64, 0.6)',
      'rgba(199, 199, 199, 0.6)',
      'rgba(83, 102, 255, 0.6)',
      'rgba(78, 205, 196, 0.6)',
      'rgba(240, 98, 146, 0.6)',
    ];

    return {
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors.slice(0, labels.length),
          borderColor: colors.slice(0, labels.length).map(color => color.replace('0.6', '1')),
          borderWidth: 1,
        }],
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 15,
              padding: 15,
              font: {
                size: 11
              }
            }
          },
          title: {
            display: true,
            text: 'Распределение диагнозов',
            font: {
              size: 14
            }
          }
        },
      },
    };
  };

  // Add severity distribution chart
  const getSeverityDistributionChart = (): ChartData | null => {
    if (!analyticsData || !analyticsData.severity_distribution) return null;

    const labels = analyticsData.severity_distribution.map(item => item.severity);
    const data = analyticsData.severity_distribution.map(item => item.count);

    // Specific colors for severity levels
    const colors = [
      'rgba(2, 136, 209, 0.7)',    // Blue - Not urgent
      'rgba(237, 108, 2, 0.7)',     // Orange - Requires attention
      'rgba(211, 47, 47, 0.7)',     // Red - Urgent
      'rgba(158, 158, 158, 0.7)',   // Gray - Undefined
    ];

    return {
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors.slice(0, labels.length),
          borderColor: colors.slice(0, labels.length).map(color => color.replace('0.7', '1')),
          borderWidth: 1,
        }],
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right'
          }
        },
      },
    };
  };

  // No need to store charts in variables as we'll call the getter functions directly
  // This avoids variable redeclaration issues

  // Tab handling
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Аналитика
      </Typography>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
      ) : !analyticsData ? (
        <Alert severity="info" sx={{ my: 2 }}>
          Нет доступных аналитических данных
        </Alert>
      ) : (
        <Box>
          {/* Add the personalized health dashboard at the top - always visible */}
          <Box sx={{ mb: 4 }}>
            <HealthDashboard />
          </Box>
          
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            sx={{ mb: 3 }}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Общая статистика" />
            <Tab label="По времени" />
            <Tab label="По диагнозам" />
            <Tab label="Персональные инсайты" />
          </Tabs>

          {/* Tab 1: General Statistics */}
          {tabValue === 0 && (
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Paper sx={{ p: 3, height: 350 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Распространенные симптомы
                  </Typography>
                  {getTopSymptomsChart() && (
                    <Box sx={{ height: 280 }}>
                      <Pie 
                        data={getTopSymptomsChart()!.data} 
                        options={getTopSymptomsChart()!.options} 
                      />
                    </Box>
                  )}
                </Paper>
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <Paper sx={{ p: 3, height: 350 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Распределение по срочности
                  </Typography>
                  {getSeverityDistributionChart() && (
                    <Box sx={{ height: 280 }}>
                      <Doughnut 
                        data={getSeverityDistributionChart()!.data} 
                        options={getSeverityDistributionChart()!.options} 
                      />
                    </Box>
                  )}
                </Paper>
              </Box>
            </Box>
          )}

          {/* Tab 2: Time-based Statistics */}
          {tabValue === 1 && (
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Paper sx={{ p: 3, height: 350 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Консультации по дням
                  </Typography>
                  {getDailyCountsChart() && (
                    <Box sx={{ height: 280 }}>
                      <Bar 
                        data={getDailyCountsChart()!.data} 
                        options={getDailyCountsChart()!.options} 
                      />
                    </Box>
                  )}
                </Paper>
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <Paper sx={{ p: 3, height: 350 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Консультации по неделям
                  </Typography>
                  {getWeeklyCountsChart() && (
                    <Box sx={{ height: 280 }}>
                      <Bar 
                        data={getWeeklyCountsChart()!.data} 
                        options={getWeeklyCountsChart()!.options} 
                      />
                    </Box>
                  )}
                </Paper>
              </Box>
            </Box>
          )}

          {/* Tab 3: Diagnosis Statistics */}
          {tabValue === 2 && (
            <Box sx={{ width: '100%' }}>
              <Paper sx={{ p: 3, height: 450 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Распределение диагнозов
                </Typography>
                {getDiagnosisDistributionChart() && (
                  <Box sx={{ height: 380 }}>
                    <Doughnut 
                      data={getDiagnosisDistributionChart()!.data} 
                      options={getDiagnosisDistributionChart()!.options} 
                    />
                  </Box>
                )}
              </Paper>
            </Box>
          )}
          
          {/* Tab 4: Personal Insights and Symptom Network */}
          {tabValue === 3 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ flex: '1 1 450px', minWidth: 0 }}>
                <HealthInsightsCard />
              </Box>
              <Box sx={{ flex: '1 1 450px', minWidth: 0 }}>
                <SymptomNetwork />
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Analytics;
