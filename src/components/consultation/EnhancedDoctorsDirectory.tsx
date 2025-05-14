import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// ReactNode type is used implicitly through React.ReactNode
import {
  Box,
  Container,
  // Grid removed as it's not used in this file
  Paper,
  Typography,
  Button,
  IconButton,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  Divider,
  useTheme,
  Backdrop,
  Modal,
  Fade,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  CircularProgress
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import BusinessIcon from '@mui/icons-material/Business';
import PhoneIcon from '@mui/icons-material/Phone';
import TelegramIcon from '@mui/icons-material/Telegram';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import LocationIcon from '@mui/icons-material/LocationOn';
import HospitalIcon from '@mui/icons-material/LocalHospital';
import { motion, AnimatePresence } from 'framer-motion';

// Type definition for Doctor
export interface Doctor {
  id: number;
  name: string;
  specialization: string;
  experience: number;
  city: string;
  hospital: string;
  phone: string;
  telegram?: string;
  photo?: string;
  languages: string[];
  rating: number;
  availableSlots?: number;
}

// Mock doctor data
const mockDoctors: Doctor[] = [
  
    {
      id: 1,
      name: 'Др. Саида Курбанова',
      specialization: 'кардиолог',
      experience: 12,
      city: 'Нукус',
      hospital: 'Центральная больница',
      phone: '+998 (91) 123-45-67',
      photo: 'https://randomuser.me/api/portraits/women/65.jpg',
      languages: ['Русский', 'Каракалпакский'],
      rating: 4.8,
      availableSlots: 3
    },
    {
      id: 2,
      name: 'Др. Тимур Исмаилов',
      specialization: 'невролог',
      experience: 9,
      city: 'Беруни',
      hospital: 'Городская клиника №1',
      phone: '+998 (91) 234-56-78',
      photo: 'https://randomuser.me/api/portraits/men/34.jpg',
      languages: ['Русский', 'Узбекский'],
      rating: 4.5,
      availableSlots: 1
    },
    {
      id: 3,
      name: 'Др. Анвар Атабеков',
      specialization: 'терапевт',
      experience: 8,
      city: 'Ходжейли',
      hospital: 'Поликлиника №3',
      phone: '+998 (91) 456-78-90',
      photo: 'https://randomuser.me/api/portraits/men/45.jpg',
      languages: ['Русский'],
      rating: 4.6,
      availableSlots: 0
    },
    {
      id: 4,
      name: 'Др. Лола Нуралиева',
      specialization: 'педиатр',
      experience: 5,
      city: 'Тахиаташ',
      hospital: 'Детская больница',
      phone: '+998 (91) 876-54-32',
      photo: 'https://randomuser.me/api/portraits/women/43.jpg',
      languages: ['Русский', 'Узбекский'],
      rating: 4.9,
      availableSlots: 2
    },
    {
      id: 5,
      name: 'Др. Ильяс Камалов',
      specialization: 'дерматолог',
      experience: 7,
      city: 'Шуманай',
      hospital: 'Поликлиника №2',
      phone: '+998 (91) 321-67-89',
      photo: 'https://randomuser.me/api/portraits/men/22.jpg',
      languages: ['Русский'],
      rating: 4.4,
      availableSlots: 4
    },
    {
      id: 6,
      name: 'Др. Амина Абдуллаева',
      specialization: 'гинеколог',
      experience: 10,
      city: 'Чимбай',
      hospital: 'Женская клиника',
      phone: '+998 (91) 998-76-54',
      photo: 'https://randomuser.me/api/portraits/women/50.jpg',
      languages: ['Русский', 'Каракалпакский'],
      rating: 4.7,
      availableSlots: 1
    },
    {
      id: 7,
      name: 'Др. Бахтиёр Рахмонов',
      specialization: 'ортопед',
      experience: 6,
      city: 'Кунград',
      hospital: 'Городская поликлиника',
      phone: '+998 (91) 765-43-21',
      photo: 'https://randomuser.me/api/portraits/men/12.jpg',
      languages: ['Русский'],
      rating: 4.3,
      availableSlots: 2
    },
    {
      id: 8,
      name: 'Др. Дильфуза Юлдашева',
      specialization: 'офтальмолог',
      experience: 11,
      city: 'Муйнак',
      hospital: 'Офтальмологический центр',
      phone: '+998 (91) 543-21-09',
      photo: 'https://randomuser.me/api/portraits/women/21.jpg',
      languages: ['Русский', 'Узбекский'],
      rating: 4.6,
      availableSlots: 0
    },
    {
      id: 9,
      name: 'Др. Самандар Юсупов',
      specialization: 'психиатр',
      experience: 13,
      city: 'Нукус',
      hospital: 'Психоневрологическая клиника',
      phone: '+998 (91) 101-22-33',
      photo: 'https://randomuser.me/api/portraits/men/77.jpg',
      languages: ['Русский'],
      rating: 4.2,
      availableSlots: 3
    },
    {
      id: 10,
      name: 'Др. Шахноза Эргашева',
      specialization: 'стоматолог',
      experience: 4,
      city: 'Караузяк',
      hospital: 'Стоматологическая клиника “Улыбка”',
      phone: '+998 (91) 888-77-66',
      photo: 'https://randomuser.me/api/portraits/women/38.jpg',
      languages: ['Русский'],
      rating: 4.9,
      availableSlots: 5
    }
];

// Specialization mapping
const specializationMap: Record<string, string> = {
  'cardiology': 'Кардиология',
  'neurology': 'Неврология',
  'general': 'Терапевт',
  'dermatology': 'Дерматология',
  'ophthalmology': 'Офтальмология'
};

// Helper function to get specialization name in Russian
const getSpecializationRussianName = (specializationKey: string): string => {
  return specializationMap[specializationKey] || specializationKey;
};

// Define motion components
const MotionCard = motion(Card);

// Available cities for filter
const availableCities = [...new Set(mockDoctors.map(doctor => doctor.city))];

// Available specializations for filter
const availableSpecializations = [...new Set(mockDoctors.map(doctor => doctor.specialization))];

interface EnhancedDoctorsDirectoryProps {
  recommendedSpecialization?: string;
}

// Custom GridItem component to fix Material UI compatibility issues
const CustomGridItem = ({ children, xs, sm, key }: { children: React.ReactNode; xs: number; sm: number; key: number }) => {
  return (
    <div style={{ padding: '12px', width: xs === 12 ? '100%' : sm === 6 ? '50%' : '33.33%', boxSizing: 'border-box' }} key={key}>
      {children}
    </div>
  );
};

// EnhancedDoctorsDirectory component
const EnhancedDoctorsDirectory: React.FC<EnhancedDoctorsDirectoryProps> = ({ recommendedSpecialization }) => {
  const theme = useTheme();
  const location = useLocation();
  
  // Extract query params
  const queryParams = new URLSearchParams(location.search);
  const querySpecialization = queryParams.get('specialization') || '';
  
  // States
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>(mockDoctors);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>(
    querySpecialization || recommendedSpecialization || ''
  );
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [favoriteDoctors, setFavoriteDoctors] = useState<number[]>([]);
  
  // Selected doctor for detail view (using mock data)
  const mockDoctor = mockDoctors[0];

  // Filter doctors
  useEffect(() => {
    setLoading(true);
    let filtered = mockDoctors;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        doctor => 
          doctor.name.toLowerCase().includes(query) ||
          getSpecializationRussianName(doctor.specialization).toLowerCase().includes(query) ||
          doctor.city.toLowerCase().includes(query) ||
          doctor.hospital.toLowerCase().includes(query)
      );
    }
    
    // Filter by specialization
    if (selectedSpecialization) {
      filtered = filtered.filter(doctor => doctor.specialization === selectedSpecialization);
    }
    
    // Filter by city
    if (selectedCity) {
      filtered = filtered.filter(doctor => doctor.city === selectedCity);
    }
    
    setFilteredDoctors(filtered);
    setLoading(false);
  }, [searchQuery, selectedSpecialization, selectedCity]);
  
  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  
  // Clear search and filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSpecialization('');
    setSelectedCity('');
    setFilteredDoctors(mockDoctors);
  };
  
  // Toggle favorite status for a doctor
  const toggleFavorite = (id: number) => {
    if (favoriteDoctors.includes(id)) {
      setFavoriteDoctors(prev => prev.filter(docId => docId !== id));
    } else {
      setFavoriteDoctors(prev => [...prev, id]);
    }
  };
  
  // Open doctor details
  const openDoctorDetails = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setDetailsOpen(true);
  };
  
  // Close doctor details
  const closeDoctorDetails = () => {
    setDetailsOpen(false);
  };
  
  // Handle specialization filter change
  const handleSpecializationChange = (event: SelectChangeEvent) => {
    setSelectedSpecialization(event.target.value);
  };
  
  // Handle city filter change
  const handleCityChange = (event: SelectChangeEvent) => {
    setSelectedCity(event.target.value);
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: 'easeOut'
      }
    }),
    hover: {
      scale: 1.03,
      boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
      transition: {
        duration: 0.3
      }
    }
  };
  
  // Doctor detail modal
  const DoctorDetailModal = () => {
    return (
      <Modal
        open={detailsOpen}
        onClose={closeDoctorDetails}
        aria-labelledby="doctor-details-title"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)'
          }
        }}
      >
        <Fade in={detailsOpen}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: '80%', md: 700 },
              maxWidth: 700,
              maxHeight: '90vh',
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 24,
              overflow: 'auto',
              p: 0,
            }}
          >
            <Box
              sx={{
                height: 140,
                bgcolor: theme.palette.primary.main,
                color: 'white',
                position: 'relative',
                display: 'flex',
                alignItems: 'flex-end',
                px: 3,
                pb: 2,
              }}
            >
              <IconButton
                onClick={closeDoctorDetails}
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  color: 'white',
                  bgcolor: 'rgba(255,255,255,0.2)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.3)',
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
              
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  transform: 'translateY(50%)',
                  zIndex: 1,
                }}
              >
                <Avatar
                  src={selectedDoctor?.photo || mockDoctor.photo}
                  alt={selectedDoctor?.name || mockDoctor.name}
                  sx={{
                    width: 100,
                    height: 100,
                    border: '4px solid white',
                    boxShadow: theme.shadows[3],
                  }}
                />
              </Box>
            </Box>
            
            <Box sx={{ pt: 6, px: 3, pb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h5" fontWeight="bold" id="doctor-details-title" gutterBottom>
                  {selectedDoctor?.name || mockDoctor.name}
                </Typography>
                
                <IconButton
                  onClick={() => toggleFavorite(selectedDoctor?.id || mockDoctor.id)}
                  color={favoriteDoctors.includes(selectedDoctor?.id || mockDoctor.id) ? 'error' : 'default'}
                >
                  {favoriteDoctors.includes(selectedDoctor?.id || mockDoctor.id) ? 
                    <FavoriteIcon /> : 
                    <FavoriteBorderIcon />}
                </IconButton>
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Chip
                  icon={<MedicalServicesIcon fontSize="small" />}
                  label={getSpecializationRussianName(selectedDoctor?.specialization || mockDoctor.specialization)}
                  color="primary"
                  sx={{
                    fontWeight: 'medium',
                    borderRadius: 8,
                    px: 1
                  }}
                />
                
                <Chip
                  icon={<AccessTimeIcon fontSize="small" />}
                  label={`${selectedDoctor?.experience || mockDoctor.experience} лет стажа`}
                  sx={{
                    fontWeight: 'medium',
                    borderRadius: 8,
                    px: 1,
                    bgcolor: theme.palette.grey[100]
                  }}
                />
                
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Rating
                  value={selectedDoctor?.rating || mockDoctor.rating}
                  precision={0.5}
                  readOnly
                  size="medium"
                  emptyIcon={<StarBorderIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                />
                <Typography variant="body1" sx={{ ml: 1, fontWeight: 'medium' }}>
                  {selectedDoctor?.rating || mockDoctor.rating}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Контактная информация
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <PhoneIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1, mt: 0.25 }} />
                  <Typography variant="body1">{selectedDoctor?.phone || mockDoctor.phone}</Typography>
                </Box>
                
                {(selectedDoctor?.telegram || mockDoctor.telegram) && (
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <TelegramIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1, mt: 0.25 }} />
                    <Box>
                      <Typography variant="body1">{selectedDoctor?.telegram || mockDoctor.telegram}</Typography>
                      <Button 
                        href={`https://t.me/${(selectedDoctor?.telegram || mockDoctor.telegram || '').replace('@', '')}`}
                        target="_blank"
                        size="small"
                        variant="outlined"
                        sx={{ mt: 0.5, fontSize: '0.8rem', borderRadius: 2 }}
                        startIcon={<TelegramIcon />}
                      >
                        Связаться
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
              
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Клиника
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                  <LocationIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1, mt: 0.25 }} />
                  <Typography variant="body1">{selectedDoctor?.city || mockDoctor.city}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <HospitalIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1, mt: 0.25 }} />
                  <Typography variant="body1">{selectedDoctor?.hospital || mockDoctor.hospital}</Typography>
                </Box>
              </Box>
              
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Языки общения
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {(selectedDoctor?.languages || mockDoctor.languages).map((lang, index) => (
                  <Chip
                    key={index}
                    label={lang}
                    sx={{
                      borderRadius: 8,
                      bgcolor: theme.palette.grey[100]
                    }}
                  />
                ))}
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={closeDoctorDetails}
                  sx={{ mr: 1 }}
                >
                  Закрыть
                </Button>
                
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
        Каталог врачей
      </Typography>
      
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 4,
          borderRadius: 2,
          boxShadow: '0 2px 12px rgba(0,0,0,0.07)'
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 2 }}>
          <TextField
            placeholder="Поиск врача по имени, специализации или клинике"
            value={searchQuery}
            onChange={handleSearchChange}
            variant="outlined"
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: searchQuery ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchQuery('')}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null
            }}
          />
          
          <Button
            variant="outlined"
            color="primary"
            startIcon={<FilterListIcon />}
            onClick={() => setShowFilters(!showFilters)}
            sx={{
              minWidth: { xs: '100%', sm: 'auto' },
              borderRadius: 2,
              whiteSpace: 'nowrap'
            }}
          >
            {showFilters ? 'Скрыть фильтры' : 'Показать фильтры'}
          </Button>
        </Box>
        
        {showFilters && (
          <Box 
            sx={{ 
              mt: 2, 
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2
            }}
          >
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel id="specialization-label">Специализация</InputLabel>
              <Select
                labelId="specialization-label"
                id="specialization-select"
                value={selectedSpecialization}
                onChange={handleSpecializationChange}
                label="Специализация"
              >
                <MenuItem value="">Все специализации</MenuItem>
                {availableSpecializations.map((spec) => (
                  <MenuItem key={spec} value={spec}>
                    {getSpecializationRussianName(spec)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel id="city-label">Город</InputLabel>
              <Select
                labelId="city-label"
                id="city-select"
                value={selectedCity}
                onChange={handleCityChange}
                label="Город"
              >
                <MenuItem value="">Все города</MenuItem>
                {availableCities.map((city) => (
                  <MenuItem key={city} value={city}>{city}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Button
              variant="text"
              color="primary"
              onClick={clearFilters}
              sx={{ alignSelf: { md: 'center' } }}
            >
              Сбросить
            </Button>
          </Box>
        )}
      </Paper>
      
      <AnimatePresence>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredDoctors.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 2,
              textAlign: 'center',
              boxShadow: '0 2px 12px rgba(0,0,0,0.07)'
            }}
          >
            <Typography variant="h6">
              Врачи не найдены
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
              Попробуйте изменить параметры поиска
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={clearFilters}
              sx={{ mt: 2, borderRadius: 2 }}
            >
              Сбросить фильтры
            </Button>
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', margin: '-12px' }}>
            {filteredDoctors.map((doctor, index) => (
              <CustomGridItem key={doctor.id} xs={12} sm={6}>
                <MotionCard
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  variants={cardVariants}
                  sx={{
                    borderRadius: 2,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    overflow: 'visible',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
                    transition: 'box-shadow 0.3s ease-in-out',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    }
                  }}
                  onClick={() => openDoctorDetails(doctor)}
                >
                  <CardContent sx={{ p: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Box sx={{ p: 2, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          src={doctor.photo} 
                          alt={doctor.name}
                          sx={{ width: 56, height: 56, mr: 2 }}
                        />
                        <Box>
                          <Typography variant="h6" fontWeight="bold" noWrap>
                            {doctor.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {getSpecializationRussianName(doctor.specialization)}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Tooltip title="Добавить в избранное">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(doctor.id);
                          }}
                          color={favoriteDoctors.includes(doctor.id) ? 'error' : 'default'}
                          sx={{ 
                            ml: 'auto',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } 
                          }}
                        >
                          {favoriteDoctors.includes(doctor.id) ? 
                            <FavoriteIcon fontSize="small" /> : 
                            <FavoriteBorderIcon fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                    </Box>
                    
                    <Divider sx={{ mx: 2 }} />
                    
                    <Box sx={{ p: 2, pt: 1.5, pb: 1.5 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 1
                        }}
                      >
                        <Rating
                          value={doctor.rating}
                          precision={0.5}
                          size="small"
                          readOnly
                        />
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ ml: 0.5 }}
                        >
                          {doctor.rating}
                        </Typography>
                      </Box>
                      
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 1
                        }}
                      >
                        <BusinessIcon
                          fontSize="small"
                          sx={{ color: 'text.secondary', mr: 1, fontSize: '0.875rem' }}
                        />
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {doctor.hospital}
                        </Typography>
                      </Box>
                      
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <LocationIcon
                          fontSize="small"
                          sx={{ color: 'text.secondary', mr: 1, fontSize: '0.875rem' }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {doctor.city}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ mt: 'auto', mx: 2, mb: 2, display: 'flex', gap: 1 }}>
                      <Chip
                        size="small"
                        icon={<AccessTimeIcon sx={{ fontSize: '0.875rem' }} />}
                        label={`${doctor.experience} лет стажа`}
                        sx={{
                          borderRadius: 8,
                          bgcolor: theme.palette.grey[100],
                          fontSize: '0.75rem'
                        }}
                      />
                     
                    </Box>
                  </CardContent>
                </MotionCard>
              </CustomGridItem>
            ))}
          </Box>
        )}
      </AnimatePresence>
      
      {/* Doctor detail modal */}
      <DoctorDetailModal />
    </Container>
  );
};

export default EnhancedDoctorsDirectory;
