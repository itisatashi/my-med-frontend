// Sample doctors data for Uzbekistan regions
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

// Medical specialization mapping to common symptoms
export interface SpecializationSymptoms {
  specialization: string;
  symptoms: string[];
  russianName: string;
  uzbekName: string;
}

// Map symptoms to doctor specializations
export const specializationBySymptoms: SpecializationSymptoms[] = [
  {
    specialization: 'cardiologist',
    russianName: 'Кардиолог',
    uzbekName: 'Kardiolog',
    symptoms: ['боль в груди', 'сердцебиение', 'одышка', 'высокое давление', 'низкое давление', 'аритмия', 'учащенное сердцебиение']
  },
  {
    specialization: 'neurologist',
    russianName: 'Невролог',
    uzbekName: 'Nevrolog',
    symptoms: ['головная боль', 'мигрень', 'головокружение', 'онемение', 'тремор', 'судороги', 'потеря сознания']
  },
  {
    specialization: 'gastroenterologist',
    russianName: 'Гастроэнтеролог',
    uzbekName: 'Gastroenterolog',
    symptoms: ['боль в животе', 'тошнота', 'рвота', 'диарея', 'запор', 'изжога', 'метеоризм']
  },
  {
    specialization: 'dermatologist',
    russianName: 'Дерматолог',
    uzbekName: 'Dermatolog',
    symptoms: ['сыпь', 'зуд', 'покраснение кожи', 'акне', 'экзема', 'псориаз', 'крапивница']
  },
  {
    specialization: 'orthopedist',
    russianName: 'Ортопед',
    uzbekName: 'Ortoped',
    symptoms: ['боль в суставах', 'боль в спине', 'травма', 'опухоль сустава', 'растяжение', 'вывих', 'перелом']
  },
  {
    specialization: 'ophthalmologist',
    russianName: 'Офтальмолог',
    uzbekName: 'Oftalmolog',
    symptoms: ['боль в глазах', 'снижение зрения', 'покраснение глаз', 'слезотечение', 'сухость глаз', 'двоение']
  },
  {
    specialization: 'otolaryngologist',
    russianName: 'Отоларинголог (ЛОР)',
    uzbekName: 'Otorinolaringolog',
    symptoms: ['боль в горле', 'боль в ухе', 'насморк', 'потеря слуха', 'заложенность носа', 'синусит', 'тонзиллит']
  },
  {
    specialization: 'pulmonologist',
    russianName: 'Пульмонолог',
    uzbekName: 'Pulmonolog',
    symptoms: ['кашель', 'одышка', 'боль в груди при дыхании', 'свистящее дыхание', 'затрудненное дыхание', 'астма']
  }
];

// Sample doctors data for MedAssyst
export const doctors: Doctor[] = [
  {
    id: 1,
    name: 'Асрор Максудов',
    specialization: 'cardiologist',
    experience: 15,
    city: 'Ташкент',
    hospital: 'Республиканский специализированный научно-практический медицинский центр кардиологии',
    phone: '+998 71 237 33 96',
    telegram: '@asror_cardio',
    languages: ['Русский', 'Узбекский', 'Английский'],
    rating: 4.9,
    availableSlots: 3,
    photo: 'https://randomuser.me/api/portraits/men/34.jpg'
  },
  {
    id: 2,
    name: 'Нодира Рахимова',
    specialization: 'neurologist',
    experience: 12,
    city: 'Ташкент',
    hospital: 'Республиканский научный центр неврологии и инсульта',
    phone: '+998 71 234 89 63',
    telegram: '@nodira_neuro',
    languages: ['Русский', 'Узбекский'],
    rating: 4.8,
    availableSlots: 2,
    photo: 'https://randomuser.me/api/portraits/women/28.jpg'
  },
  {
    id: 3,
    name: 'Бахром Юлдашев',
    specialization: 'gastroenterologist',
    experience: 10,
    city: 'Самарканд',
    hospital: 'Самаркандский государственный медицинский институт',
    phone: '+998 66 233 17 28',
    languages: ['Русский', 'Узбекский'],
    rating: 4.7,
    availableSlots: 5,
    photo: 'https://randomuser.me/api/portraits/men/43.jpg'
  },
  {
    id: 4,
    name: 'Дилноза Каримова',
    specialization: 'dermatologist',
    experience: 8,
    city: 'Ташкент',
    hospital: 'Республиканский специализированный научно-практический медицинский центр дерматологии и венерологии',
    phone: '+998 71 214 50 98',
    telegram: '@dilnoza_derma',
    languages: ['Русский', 'Узбекский', 'Английский'],
    rating: 4.9,
    availableSlots: 1,
    photo: 'https://randomuser.me/api/portraits/women/37.jpg'
  },
  {
    id: 5,
    name: 'Тимур Расулов',
    specialization: 'orthopedist',
    experience: 20,
    city: 'Бухара',
    hospital: 'Бухарский областной травматологический центр',
    phone: '+998 65 224 17 36',
    languages: ['Русский', 'Узбекский'],
    rating: 4.8,
    availableSlots: 4,
    photo: 'https://randomuser.me/api/portraits/men/56.jpg'
  },
  {
    id: 6,
    name: 'Зарина Ахмедова',
    specialization: 'ophthalmologist',
    experience: 14,
    city: 'Ташкент',
    hospital: 'Республиканская специализированная офтальмологическая клиника',
    phone: '+998 71 246 28 73',
    telegram: '@zarina_ophthalm',
    languages: ['Русский', 'Узбекский', 'Английский'],
    rating: 4.9,
    availableSlots: 2,
    photo: 'https://randomuser.me/api/portraits/women/42.jpg'
  },
  {
    id: 7,
    name: 'Фархад Шарипов',
    specialization: 'otolaryngologist',
    experience: 11,
    city: 'Наманган',
    hospital: 'Наманганская областная больница',
    phone: '+998 69 234 12 56',
    languages: ['Русский', 'Узбекский'],
    rating: 4.7,
    availableSlots: 6,
    photo: 'https://randomuser.me/api/portraits/men/65.jpg'
  },
  {
    id: 8,
    name: 'Малика Исмаилова',
    specialization: 'pulmonologist',
    experience: 13,
    city: 'Фергана',
    hospital: 'Ферганский филиал Республиканского специализированного научно-практического медицинского центра терапии',
    phone: '+998 73 244 36 98',
    telegram: '@malika_pulmo',
    languages: ['Русский', 'Узбекский'],
    rating: 4.8,
    availableSlots: 3,
    photo: 'https://randomuser.me/api/portraits/women/53.jpg'
  },
  {
    id: 9,
    name: 'Шухрат Рахимов',
    specialization: 'cardiologist',
    experience: 18,
    city: 'Андижан',
    hospital: 'Андижанский государственный медицинский институт',
    phone: '+998 74 223 45 67',
    languages: ['Русский', 'Узбекский'],
    rating: 4.9,
    availableSlots: 2,
    photo: 'https://randomuser.me/api/portraits/men/72.jpg'
  },
  {
    id: 10,
    name: 'Гузаль Мирзаева',
    specialization: 'neurologist',
    experience: 9,
    city: 'Нукус',
    hospital: 'Республиканский многопрофильный медицинский центр Каракалпакстана',
    phone: '+998 61 222 34 56',
    telegram: '@guzal_neuro',
    languages: ['Русский', 'Узбекский', 'Каракалпакский'],
    rating: 4.7,
    availableSlots: 5,
    photo: 'https://randomuser.me/api/portraits/women/68.jpg'
  },
  {
    id: 11,
    name: 'Иброхим Каримов',
    specialization: 'gastroenterologist',
    experience: 16,
    city: 'Ташкент',
    hospital: 'Республиканский специализированный научно-практический медицинский центр терапии и реабилитации',
    phone: '+998 71 256 35 78',
    telegram: '@ibrohim_gastro',
    languages: ['Русский', 'Узбекский', 'Английский'],
    rating: 4.9,
    availableSlots: 1,
    photo: 'https://randomuser.me/api/portraits/men/77.jpg'
  },
  {
    id: 12,
    name: 'Сайёра Хамидова',
    specialization: 'dermatologist',
    experience: 10,
    city: 'Карши',
    hospital: 'Кашкадарьинский областной кожно-венерологический диспансер',
    phone: '+998 75 224 17 89',
    languages: ['Русский', 'Узбекский'],
    rating: 4.8,
    availableSlots: 4,
    photo: 'https://randomuser.me/api/portraits/women/75.jpg'
  }
];

// Helper function to get doctor specialization by symptom
export const getDoctorSpecialization = (symptom: string): string | null => {
  // Convert to lowercase for case-insensitive matching
  const lowerSymptom = symptom.toLowerCase();
  
  // Find a matching specialization
  for (const item of specializationBySymptoms) {
    if (item.symptoms.some(s => lowerSymptom.includes(s.toLowerCase()))) {
      return item.specialization;
    }
  }
  
  return null;
};

// Helper function to get russian name of specialization
export const getSpecializationRussianName = (specialization: string): string => {
  const found = specializationBySymptoms.find(s => s.specialization === specialization);
  return found ? found.russianName : specialization;
};

// Helper function to get uzbek name of specialization
export const getSpecializationUzbekName = (specialization: string): string => {
  const found = specializationBySymptoms.find(s => s.specialization === specialization);
  return found ? found.uzbekName : specialization;
};

// Helper function to get doctors by specialization
export const getDoctorsBySpecialization = (specialization: string): Doctor[] => {
  return doctors.filter(doctor => doctor.specialization === specialization);
};
