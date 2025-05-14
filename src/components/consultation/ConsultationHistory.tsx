import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Divider,
  Card,
  CardContent,
  Button,
  Collapse
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getConsultationHistory } from '../../utils/api';

interface Consultation {
  id: string;
  symptoms: string;
  diagnosis: string;
  created_at: string;
  severity?: number;
  symptoms_preview?: string;
}

/**
 * Component for displaying consultation history
 */
const ConsultationHistory: React.FC = () => {
  const [consultationHistory, setHistory] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedItems, setExpandedItems] = useState<{[key: string]: boolean}>({});
  
  // Toggle expanded state for a consultation
  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const data = await getConsultationHistory();
        
        // Ensure data is an array
        if (Array.isArray(data)) {
          setHistory(data);
        } else {
          console.error('Consultation history is not an array:', data);
          setHistory([]);
          setError('Получены некорректные данные истории консультаций');
        }
      } catch (error) {
        console.error('Failed to fetch consultation history:', error);
        setError('Не удалось загрузить историю консультаций');
        setHistory([]); // Ensure history is always an array
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  // Helper to get severity class
  const getSeverityClass = (severity?: number) => {
    switch(severity) {
      case 3: return { color: 'error.main', label: 'Срочно', bgcolor: 'rgba(211, 47, 47, 0.1)' };
      case 2: return { color: 'warning.main', label: 'Требует внимания', bgcolor: 'rgba(237, 108, 2, 0.1)' };
      case 1: return { color: 'info.main', label: 'Не срочно', bgcolor: 'rgba(2, 136, 209, 0.1)' };
      default: return { color: 'text.secondary', label: 'Не определена', bgcolor: 'rgba(0, 0, 0, 0.05)' };
    }
  };
  
  // Truncate text if it's too long
  const truncateText = (text: string, maxLength: number = 150) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        История консультаций
      </Typography>
      
      {isLoading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2, mb: 4 }}>
          {error}
        </Alert>
      ) : consultationHistory.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2, mb: 4 }}>
          У вас пока нет истории консультаций
        </Alert>
      ) : (
        <Box mt={3}>
          {consultationHistory.map((consultation, index) => {
            const severity = getSeverityClass(consultation.severity);
            return (
              <Box key={consultation.id || index} mb={3}>
                <Card variant="outlined" sx={{ boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  <CardContent>
                    {/* Header with date and severity */}
                    <Box 
                      display="flex" 
                      justifyContent="space-between" 
                      alignItems="center" 
                      mb={1}
                    >
                      <Typography variant="subtitle1" color="text.secondary">
                        {formatDate(consultation.created_at || new Date().toISOString())}
                      </Typography>
                      <Box 
                        sx={{ 
                          bgcolor: severity.bgcolor, 
                          px: 2, 
                          py: 0.5, 
                          borderRadius: 1,
                        }}
                      >
                        <Typography 
                          variant="subtitle2" 
                          sx={{
                            color: severity.color,
                            fontWeight: 'medium'
                          }}
                        >
                          {severity.label}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    {/* Symptoms section */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom fontWeight="bold">
                        Симптомы:
                      </Typography>
                      <Typography variant="body1" sx={{ pl: 1 }}>
                        {!expandedItems[consultation.id] ? truncateText(consultation.symptoms, 100) : consultation.symptoms}
                      </Typography>
                    </Box>
                    
                    {/* Diagnosis section with ReactMarkdown */}
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom fontWeight="bold">
                        Диагноз:
                      </Typography>
                      
                      <Box sx={{ 
                        pl: 1,
                        '& h1, & h2': { color: 'primary.main', mb: 2, mt: 2, fontSize: '1.2rem' },
                        '& h3, & h4, & h5': { color: 'text.primary', mb: 1.5, mt: 1.5, fontSize: '1.1rem' },
                        '& p': { mb: 1.5 },
                        '& ul, & ol': { pl: 2, mb: 1.5 },
                        '& li': { mb: 0.5 },
                        '& strong': { fontWeight: 'bold' },
                        overflow: 'hidden',
                      }}>
                        <Collapse in={expandedItems[consultation.id] ?? false} collapsedSize={100}>
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {consultation.diagnosis}
                          </ReactMarkdown>
                        </Collapse>
                      </Box>
                      
                      {/* Read more / Read less button */}
                      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Button 
                          variant="text" 
                          size="small"
                          onClick={() => toggleExpanded(consultation.id)}
                          endIcon={expandedItems[consultation.id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        >
                          {expandedItems[consultation.id] ? 'Свернуть' : 'Читать полностью'}
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default ConsultationHistory;
