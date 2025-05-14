import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Chip,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  LinearProgress,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  AccessTime as TimeIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  LocalPharmacy as MedicineIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  Done as DoneIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Demo data
interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: Date[];
  daysLeft: number;
  totalDays: number;
  instructions: string;
  active: boolean;
  takenToday: boolean;
}

const demoMedications: Medication[] = [
  {
    id: '1',
    name: 'Парацетамол',
    dosage: '500мг',
    time: [new Date(2025, 4, 13, 8, 0), new Date(2025, 4, 13, 20, 0)],
    daysLeft: 7,
    totalDays: 10,
    instructions: 'Принимать после еды',
    active: true,
    takenToday: true
  },
  {
    id: '2',
    name: 'Амоксициллин',
    dosage: '250мг',
    time: [new Date(2025, 4, 13, 12, 0), new Date(2025, 4, 13, 18, 0)],
    daysLeft: 3,
    totalDays: 7,
    instructions: 'Принимать во время еды',
    active: true,
    takenToday: false
  },
  {
    id: '3',
    name: 'Витамин Д',
    dosage: '1000 МЕ',
    time: [new Date(2025, 4, 13, 9, 0)],
    daysLeft: 25,
    totalDays: 30,
    instructions: 'Принимать после завтрака',
    active: true,
    takenToday: false
  }
];

// Styled components
const MedicationCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: 12,
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
  },
  overflow: 'visible',
}));

const TimeChip = styled(Chip)(({ theme }) => ({
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1),
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.main,
  fontWeight: 500,
}));

const ProgressContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: 8,
  borderRadius: 4,
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.05)',
  overflow: 'hidden',
  margin: theme.spacing(1, 0, 2),
}));

interface MedicationReminderProps {
  // Add any props you need here
}

const MedicationReminder: React.FC<MedicationReminderProps> = () => {
  const [medications, setMedications] = useState<Medication[]>(demoMedications);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentMed, setCurrentMed] = useState<Medication | null>(null);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [sortBy, setSortBy] = useState<'name' | 'time' | 'daysLeft'>('time');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleOpenDialog = (mode: 'add' | 'edit', medication?: Medication) => {
    setDialogMode(mode);
    if (mode === 'edit' && medication) {
      setCurrentMed(medication);
    } else {
      setCurrentMed({
        id: Date.now().toString(),
        name: '',
        dosage: '',
        time: [new Date()],
        daysLeft: 0,
        totalDays: 0,
        instructions: '',
        active: true,
        takenToday: false
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentMed(null);
  };

  const handleSaveMedication = () => {
    if (!currentMed) return;
    
    if (dialogMode === 'add') {
      setMedications([...medications, currentMed]);
    } else {
      setMedications(medications.map(med => 
        med.id === currentMed.id ? currentMed : med
      ));
    }
    handleCloseDialog();
  };

  const handleDeleteMedication = (id: string) => {
    setMedications(medications.filter(med => med.id !== id));
  };

  const handleToggleTaken = (id: string) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, takenToday: !med.takenToday } : med
    ));
  };

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const changeSortBy = (value: 'name' | 'time' | 'daysLeft') => {
    if (sortBy === value) {
      toggleSortDirection();
    } else {
      setSortBy(value);
      setSortDirection('asc');
    }
  };

  const getSortedMedications = () => {
    const sorted = [...medications];
    
    sorted.sort((a, b) => {
      if (sortBy === 'name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'time') {
        const timeA = a.time.length ? a.time[0].getTime() : 0;
        const timeB = b.time.length ? b.time[0].getTime() : 0;
        return sortDirection === 'asc' ? timeA - timeB : timeB - timeA;
      } else {
        return sortDirection === 'asc' 
          ? a.daysLeft - b.daysLeft 
          : b.daysLeft - a.daysLeft;
      }
    });
    
    return sorted;
  };

  const upcomingMedication = medications.find(med => 
    !med.takenToday && med.active && med.time.some(t => t.getHours() > new Date().getHours())
  );

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Мои лекарства
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => handleOpenDialog('add')}
          sx={{ borderRadius: 20 }}
        >
          Добавить
        </Button>
      </Box>

      {/* Upcoming medication highlight */}
      {upcomingMedication && (
        <Card 
          sx={{ 
            p: 2, 
            mb: 3, 
            borderRadius: 3,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.1 }}>
            <MedicineIcon sx={{ fontSize: 120 }} />
          </Box>
          <Typography variant="subtitle2" sx={{ mb: 1, opacity: 0.9 }}>
            Ближайший прием
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
            {upcomingMedication.name} {upcomingMedication.dosage}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <TimeIcon sx={{ mr: 1, fontSize: 18, opacity: 0.8 }} />
            <Typography>
              {upcomingMedication.time[0].toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
            {upcomingMedication.instructions}
          </Typography>
          <Button 
            variant="contained" 
            color="inherit"
            sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.15)', 
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.25)' },
              borderRadius: 20,
            }}
            startIcon={<DoneIcon />}
            onClick={() => handleToggleTaken(upcomingMedication.id)}
          >
            Отметить принятым
          </Button>
        </Card>
      )}

      {/* Sort controls */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, gap: 1 }}>
        <Tooltip title="Сортировать по названию">
          <Button 
            size="small" 
            variant={sortBy === 'name' ? 'contained' : 'outlined'}
            onClick={() => changeSortBy('name')}
            startIcon={sortBy === 'name' && (sortDirection === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />)}
            sx={{ minWidth: 0, borderRadius: 20 }}
          >
            По названию
          </Button>
        </Tooltip>
        <Tooltip title="Сортировать по времени">
          <Button 
            size="small" 
            variant={sortBy === 'time' ? 'contained' : 'outlined'}
            onClick={() => changeSortBy('time')}
            startIcon={sortBy === 'time' && (sortDirection === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />)}
            sx={{ minWidth: 0, borderRadius: 20 }}
          >
            По времени
          </Button>
        </Tooltip>
        <Tooltip title="Сортировать по дням">
          <Button 
            size="small" 
            variant={sortBy === 'daysLeft' ? 'contained' : 'outlined'}
            onClick={() => changeSortBy('daysLeft')}
            startIcon={sortBy === 'daysLeft' && (sortDirection === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />)}
            sx={{ minWidth: 0, borderRadius: 20 }}
          >
            По дням
          </Button>
        </Tooltip>
      </Box>
      
      {/* Medication list */}
      {getSortedMedications().map(medication => (
        <MedicationCard key={medication.id}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  sx={{ 
                    bgcolor: medication.takenToday ? 'success.light' : 'primary.light', 
                    color: medication.takenToday ? 'success.main' : 'primary.main',
                    mr: 2
                  }}
                >
                  {medication.takenToday ? <CheckCircleIcon /> : <MedicineIcon />}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {medication.name}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {medication.dosage}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex' }}>
                <IconButton 
                  size="small" 
                  onClick={() => handleOpenDialog('edit', medication)}
                  sx={{ mr: 1 }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  size="small" 
                  color="error" 
                  onClick={() => handleDeleteMedication(medication.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Время приема:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                {medication.time.map((time, index) => (
                  <TimeChip
                    key={index}
                    icon={<TimeIcon />}
                    label={time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  />
                ))}
              </Box>
            </Box>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Прогресс курса:
              </Typography>
              <ProgressContainer>
                <LinearProgress 
                  variant="determinate" 
                  value={((medication.totalDays - medication.daysLeft) / medication.totalDays) * 100} 
                  sx={{ height: '100%' }}
                />
              </ProgressContainer>
              <Typography variant="body2" color="text.secondary">
                Осталось дней: {medication.daysLeft} из {medication.totalDays}
              </Typography>
            </Box>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Инструкция:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {medication.instructions}
              </Typography>
            </Box>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={medication.active} 
                    onChange={() => {
                      setMedications(medications.map(med => 
                        med.id === medication.id ? { ...med, active: !med.active } : med
                      ));
                    }} 
                  />
                }
                label="Активно"
              />
              
              <Button
                variant={medication.takenToday ? "outlined" : "contained"}
                color={medication.takenToday ? "success" : "primary"}
                startIcon={medication.takenToday ? <CheckCircleIcon /> : <DoneIcon />}
                onClick={() => handleToggleTaken(medication.id)}
                sx={{ borderRadius: 20 }}
              >
                {medication.takenToday ? "Принято" : "Отметить принятым"}
              </Button>
            </Box>
          </CardContent>
        </MedicationCard>
      ))}
      
      {/* Add/Edit Medication Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? 'Добавить лекарство' : 'Редактировать лекарство'}
        </DialogTitle>
        <DialogContent>
          {currentMed && (
            <Box sx={{ mt: 1 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1 }}>
                <Box sx={{ width: { xs: '100%', sm: '50%' }, p: 1 }}>
                  <TextField
                    fullWidth
                    label="Название"
                    value={currentMed.name}
                    onChange={(e) => setCurrentMed({ ...currentMed, name: e.target.value })}
                    margin="normal"
                    required
                  />
                </Box>
                <Box sx={{ width: { xs: '100%', sm: '50%' }, p: 1 }}>
                  <TextField
                    fullWidth
                    label="Дозировка"
                    value={currentMed.dosage}
                    onChange={(e) => setCurrentMed({ ...currentMed, dosage: e.target.value })}
                    margin="normal"
                  />
                </Box>
                <Box sx={{ width: '100%', p: 1 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Время приема:
                    </Typography>
                    {currentMed.time.map((time, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <TextField
                          type="time"
                          fullWidth
                          label={`Время ${index + 1}`}
                          value={`${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`}
                          onChange={(e) => {
                            if (e.target.value) {
                              const [hours, minutes] = e.target.value.split(':').map(Number);
                              const newTime = new Date();
                              newTime.setHours(hours);
                              newTime.setMinutes(minutes);
                              
                              const newTimes = [...currentMed.time];
                              newTimes[index] = newTime;
                              setCurrentMed({ ...currentMed, time: newTimes });
                            }
                          }}
                          sx={{ flex: 1, mr: 1 }}
                          InputLabelProps={{ shrink: true }}
                        />
                        {currentMed.time.length > 1 && (
                          <IconButton 
                            color="error" 
                            onClick={() => {
                              const newTimes = currentMed.time.filter((_, i) => i !== index);
                              setCurrentMed({ ...currentMed, time: newTimes });
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Box>
                    ))}
                    <Button 
                      startIcon={<AddIcon />} 
                      onClick={() => {
                        const newTime = new Date();
                        setCurrentMed({ ...currentMed, time: [...currentMed.time, newTime] });
                      }}
                      sx={{ mt: 1 }}
                    >
                      Добавить время
                    </Button>
                  </Box>
                </Box>
                <Box sx={{ width: { xs: '100%', sm: '50%' }, p: 1 }}>
                  <TextField
                    fullWidth
                    label="Длительность курса (дней)"
                    type="number"
                    value={currentMed.totalDays}
                    onChange={(e) => setCurrentMed({ ...currentMed, totalDays: Number(e.target.value) })}
                    margin="normal"
                  />
                </Box>
                <Box sx={{ width: { xs: '100%', sm: '50%' }, p: 1 }}>
                  <TextField
                    fullWidth
                    label="Осталось дней"
                    type="number"
                    value={currentMed.daysLeft}
                    onChange={(e) => setCurrentMed({ ...currentMed, daysLeft: Number(e.target.value) })}
                    margin="normal"
                  />
                </Box>
                <Box sx={{ width: '100%', p: 1 }}>
                  <TextField
                    fullWidth
                    label="Инструкция по применению"
                    value={currentMed.instructions}
                    onChange={(e) => setCurrentMed({ ...currentMed, instructions: e.target.value })}
                    margin="normal"
                    multiline
                    rows={3}
                  />
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button 
            onClick={handleSaveMedication} 
            variant="contained"
            disabled={!currentMed?.name}
          >
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MedicationReminder;
