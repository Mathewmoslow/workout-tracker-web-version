// Sample Clients for Aaron's Training
import { v4 as uuidv4 } from 'uuid';

export const sampleClients = [
  // Client 1: Sarah Johnson - Weight Loss Goal
  {
    id: uuidv4(),
    name: "Sarah Johnson",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: new Date(1992, 3, 15), // April 15, 1992 (32 years old)
    age: 32,
    gender: "Female",
    height: 165.0, // 5'5" in cm
    currentWeight: 72.0, // 159 lbs in kg
    targetWeight: 65.0, // 143 lbs in kg
    primaryGoal: "Weight Loss",
    secondaryGoals: ["General Fitness", "Endurance"],
    
    // Body Composition
    bodyFatPercentage: 28.5,
    muscleMass: 22.3,
    waterPercentage: 52.1,
    boneMass: 2.4,
    visceralFatLevel: 6,
    metabolicAge: 35,
    bmr: 1420,
    
    // Body Measurements (in cm)
    measurements: {
      chest: 89.0,
      waist: 78.0,
      hips: 98.0,
      thighs: 58.0,
      arms: 28.0,
      calves: 36.0
    },
    
    // Health Information
    medicalConditions: ["Mild hypertension"],
    currentMedications: "Lisinopril 10mg daily",
    allergies: ["Shellfish", "Peanuts"],
    
    // Training Preferences
    preferredTrainingDays: ["Monday", "Wednesday", "Friday"],
    activityLevel: "Lightly Active",
    
    // Lifestyle
    stressLevel: 7, // 1-10 scale
    averageSleepHours: 6.5,
    nutritionQuality: "Fair",
    smokingStatus: "Never",
    alcoholConsumption: "Occasional",
    
    // Emergency Contact
    emergencyContact: {
      name: "Michael Johnson",
      relationship: "Spouse",
      phone: "+1 (555) 123-4568",
      email: "michael.johnson@email.com"
    },
    
    // Training History
    injuryHistory: [
      {
        type: "Lower back strain",
        severity: "Mild",
        notes: "Occurred 6 months ago, fully recovered",
        isActive: false,
        date: new Date(2024, 1, 1)
      }
    ],
    
    painPoints: [
      {
        location: "Lower back",
        painLevel: 3, // 1-10 scale
        frequency: "Occasional",
        notes: "Mild discomfort after long sitting"
      }
    ],
    
    subscriptionType: "Monthly",
    joinDate: new Date(2024, 6, 1), // July 1, 2024
    isActive: true,
    notes: "New to structured fitness. Prefers morning workouts. Has desk job. Very motivated but needs encouragement with consistency.",
    
    // Goals and Tracking
    goals: [
      {
        type: "Weight Loss",
        target: "Lose 7kg (15lbs)",
        deadline: new Date(2025, 0, 1), // January 1, 2025
        progress: 15 // percentage
      },
      {
        type: "Fitness",
        target: "Complete 5K run without stopping",
        deadline: new Date(2024, 11, 31), // December 31, 2024
        progress: 30
      }
    ]
  },

  // Client 2: Marcus Rodriguez - Muscle Gain Goal  
  {
    id: uuidv4(),
    name: "Marcus Rodriguez",
    firstName: "Marcus",
    lastName: "Rodriguez",
    email: "marcus.rodriguez@email.com",
    phone: "+1 (555) 234-5678",
    dateOfBirth: new Date(1998, 7, 22), // August 22, 1998 (26 years old)
    age: 26,
    gender: "Male",
    height: 178.0, // 5'10" in cm
    currentWeight: 75.0, // 165 lbs in kg
    targetWeight: 82.0, // 181 lbs in kg
    primaryGoal: "Muscle Gain",
    secondaryGoals: ["Strength Gain", "Athletic Performance"],
    
    // Body Composition
    bodyFatPercentage: 12.8,
    muscleMass: 35.2,
    waterPercentage: 58.7,
    boneMass: 3.2,
    visceralFatLevel: 3,
    metabolicAge: 23,
    bmr: 1850,
    
    // Body Measurements (in cm)
    measurements: {
      chest: 102.0,
      waist: 81.0,
      hips: 95.0,
      thighs: 61.0,
      arms: 35.0,
      calves: 38.0
    },
    
    // Health Information
    medicalConditions: [],
    currentMedications: "",
    allergies: [],
    
    // Training Preferences  
    preferredTrainingDays: ["Monday", "Tuesday", "Thursday", "Saturday"],
    activityLevel: "Very Active",
    
    // Lifestyle
    stressLevel: 4,
    averageSleepHours: 8.0,
    nutritionQuality: "Excellent",
    smokingStatus: "Never",
    alcoholConsumption: "Moderate",
    
    // Emergency Contact
    emergencyContact: {
      name: "Elena Rodriguez",
      relationship: "Mother", 
      phone: "+1 (555) 234-5679",
      email: "elena.rodriguez@email.com"
    },
    
    // Training History
    injuryHistory: [
      {
        type: "Right shoulder impingement",
        severity: "Moderate",
        notes: "Resolved with physical therapy", 
        isActive: false,
        date: new Date(2023, 5, 15)
      }
    ],
    
    painPoints: [],
    
    subscriptionType: "Quarterly",
    joinDate: new Date(2024, 3, 15), // April 15, 2024
    isActive: true,
    notes: "Experienced lifter looking to add lean mass. Focuses on compound movements. Very disciplined with nutrition and training. Goal is to compete in physique competition next year.",
    
    // Goals and Tracking
    goals: [
      {
        type: "Muscle Gain",
        target: "Gain 7kg lean muscle mass",
        deadline: new Date(2025, 3, 15), // April 15, 2025
        progress: 35
      },
      {
        type: "Strength",
        target: "Bench press 100kg (225lbs)",
        deadline: new Date(2024, 11, 31),
        progress: 80
      }
    ]
  },

  // Client 3: Emma Chen - Athletic Performance Goal
  {
    id: uuidv4(),
    name: "Emma Chen",
    firstName: "Emma", 
    lastName: "Chen",
    email: "emma.chen@email.com",
    phone: "+1 (555) 345-6789",
    dateOfBirth: new Date(1995, 11, 3), // December 3, 1995 (29 years old)
    age: 29,
    gender: "Female",
    height: 170.0, // 5'7" in cm
    currentWeight: 68.0, // 150 lbs in kg
    targetWeight: 70.0, // 154 lbs in kg
    primaryGoal: "Athletic Performance",
    secondaryGoals: ["Strength Gain", "Endurance"],
    
    // Body Composition
    bodyFatPercentage: 18.2,
    muscleMass: 28.9,
    waterPercentage: 56.3,
    boneMass: 2.8,
    visceralFatLevel: 2,
    metabolicAge: 25,
    bmr: 1620,
    
    // Body Measurements (in cm)
    measurements: {
      chest: 86.0,
      waist: 71.0,
      hips: 94.0,
      thighs: 55.0,
      arms: 26.0,
      calves: 35.0
    },
    
    // Health Information
    medicalConditions: ["Exercise-induced asthma"],
    currentMedications: "Albuterol inhaler as needed",
    allergies: ["Latex"],
    
    // Training Preferences
    preferredTrainingDays: ["Sunday", "Tuesday", "Thursday", "Saturday"],
    activityLevel: "Extremely Active",
    
    // Lifestyle
    stressLevel: 6,
    averageSleepHours: 7.5,
    nutritionQuality: "Good",
    smokingStatus: "Never",
    alcoholConsumption: "None",
    
    // Emergency Contact
    emergencyContact: {
      name: "David Chen",
      relationship: "Brother",
      phone: "+1 (555) 345-6790",
      email: "david.chen@email.com"
    },
    
    // Training History
    injuryHistory: [
      {
        type: "IT band syndrome",
        severity: "Moderate",
        notes: "Recurring issue, managed with stretching",
        isActive: true,
        date: new Date(2024, 2, 1)
      },
      {
        type: "Ankle sprain",
        severity: "Mild",
        notes: "Fully healed",
        isActive: false,
        date: new Date(2023, 9, 20)
      }
    ],
    
    painPoints: [
      {
        location: "Right IT band",
        painLevel: 4,
        frequency: "During Exercise",
        notes: "Tightness during long runs"
      },
      {
        location: "Left knee", 
        painLevel: 2,
        frequency: "After Exercise",
        notes: "Minor soreness after high mileage"
      }
    ],
    
    subscriptionType: "Annual",
    joinDate: new Date(2024, 0, 10), // January 10, 2024
    isActive: true,
    notes: "Competitive runner training for marathon. Needs sport-specific conditioning. Very dedicated but sometimes pushes too hard. Focus on injury prevention and performance optimization.",
    
    // Goals and Tracking
    goals: [
      {
        type: "Performance",
        target: "Sub-3:30 marathon time",
        deadline: new Date(2024, 9, 15), // October 15, 2024 (Chicago Marathon)
        progress: 70
      },
      {
        type: "Strength",
        target: "Improve single-leg squat form and reps",
        deadline: new Date(2024, 11, 31),
        progress: 50
      }
    ]
  },

  // Client 4: Robert Thompson - Senior Fitness Goal
  {
    id: uuidv4(),
    name: "Robert Thompson",
    firstName: "Robert",
    lastName: "Thompson", 
    email: "robert.thompson@email.com",
    phone: "+1 (555) 456-7890",
    dateOfBirth: new Date(1958, 4, 10), // May 10, 1958 (66 years old)
    age: 66,
    gender: "Male",
    height: 175.0, // 5'9" in cm
    currentWeight: 82.0, // 181 lbs in kg
    targetWeight: 78.0, // 172 lbs in kg
    primaryGoal: "General Fitness",
    secondaryGoals: ["Weight Loss", "Mobility"],
    
    // Body Composition
    bodyFatPercentage: 22.0,
    muscleMass: 28.5,
    waterPercentage: 55.2,
    boneMass: 3.1,
    visceralFatLevel: 8,
    metabolicAge: 70,
    bmr: 1650,
    
    // Body Measurements (in cm) 
    measurements: {
      chest: 98.0,
      waist: 92.0,
      hips: 96.0,
      thighs: 58.0,
      arms: 32.0,
      calves: 37.0
    },
    
    // Health Information
    medicalConditions: ["Mild arthritis in knees", "Controlled diabetes type 2"],
    currentMedications: "Metformin 500mg twice daily, Glucosamine supplements",
    allergies: ["Penicillin"],
    
    // Training Preferences
    preferredTrainingDays: ["Monday", "Wednesday", "Friday"],
    activityLevel: "Lightly Active",
    
    // Lifestyle
    stressLevel: 3,
    averageSleepHours: 7.0,
    nutritionQuality: "Good",
    smokingStatus: "Former (quit 10 years ago)",
    alcoholConsumption: "Light",
    
    // Emergency Contact
    emergencyContact: {
      name: "Margaret Thompson",
      relationship: "Wife",
      phone: "+1 (555) 456-7891",
      email: "margaret.thompson@email.com"
    },
    
    // Training History
    injuryHistory: [
      {
        type: "Lower back stiffness",
        severity: "Mild",
        notes: "Chronic condition, manageable with exercise",
        isActive: true,
        date: new Date(2020, 1, 1)
      }
    ],
    
    painPoints: [
      {
        location: "Both knees",
        painLevel: 3,
        frequency: "Occasional",
        notes: "Stiffness in the morning, improves with movement"
      },
      {
        location: "Lower back",
        painLevel: 2,
        frequency: "After prolonged sitting",
        notes: "Mild stiffness"
      }
    ],
    
    subscriptionType: "Monthly",
    joinDate: new Date(2024, 5, 1), // June 1, 2024
    isActive: true,
    notes: "Recently retired, wants to stay active and healthy. Doctor recommended strength training for bone health. Very pleasant and motivated. Needs modifications for joint issues.",
    
    // Goals and Tracking
    goals: [
      {
        type: "Fitness",
        target: "Improve balance and stability",
        deadline: new Date(2024, 11, 31),
        progress: 45
      },
      {
        type: "Health",
        target: "Reduce HbA1c levels through exercise",
        deadline: new Date(2025, 2, 1), // March 1, 2025
        progress: 25
      }
    ]
  },

  // Client 5: Ashley Martinez - Postnatal Fitness Goal
  {
    id: uuidv4(),
    name: "Ashley Martinez", 
    firstName: "Ashley",
    lastName: "Martinez",
    email: "ashley.martinez@email.com",
    phone: "+1 (555) 567-8901",
    dateOfBirth: new Date(1988, 8, 18), // September 18, 1988 (36 years old)
    age: 36,
    gender: "Female",
    height: 162.0, // 5'4" in cm
    currentWeight: 69.0, // 152 lbs in kg
    targetWeight: 62.0, // 137 lbs in kg
    primaryGoal: "Weight Loss",
    secondaryGoals: ["Core Strength", "General Fitness"],
    
    // Body Composition
    bodyFatPercentage: 32.0,
    muscleMass: 21.8,
    waterPercentage: 50.5,
    boneMass: 2.3,
    visceralFatLevel: 7,
    metabolicAge: 40,
    bmr: 1380,
    
    // Body Measurements (in cm)
    measurements: {
      chest: 92.0,
      waist: 82.0,
      hips: 102.0,
      thighs: 60.0,
      arms: 29.0,
      calves: 36.0
    },
    
    // Health Information
    medicalConditions: ["Diastasis recti (post-pregnancy)"],
    currentMedications: "Prenatal vitamins",
    allergies: [],
    
    // Training Preferences
    preferredTrainingDays: ["Tuesday", "Thursday", "Saturday"],
    activityLevel: "Sedentary (caring for newborn)",
    
    // Lifestyle
    stressLevel: 8, // High due to new baby
    averageSleepHours: 5.5, // Interrupted sleep
    nutritionQuality: "Fair",
    smokingStatus: "Never",
    alcoholConsumption: "None (breastfeeding)",
    
    // Emergency Contact
    emergencyContact: {
      name: "Carlos Martinez",
      relationship: "Spouse",
      phone: "+1 (555) 567-8902", 
      email: "carlos.martinez@email.com"
    },
    
    // Training History
    injuryHistory: [],
    
    painPoints: [
      {
        location: "Lower back",
        painLevel: 4,
        frequency: "Daily",
        notes: "From carrying baby and poor posture while breastfeeding"
      },
      {
        location: "Neck and shoulders",
        painLevel: 3,
        frequency: "Daily",
        notes: "Tension from nursing positions"
      }
    ],
    
    subscriptionType: "Monthly",
    joinDate: new Date(2024, 7, 15), // August 15, 2024
    isActive: true,
    notes: "New mom (baby is 4 months old). Cleared for exercise by doctor. Very motivated but limited time and energy. Needs postnatal-specific modifications and core rehabilitation focus.",
    
    // Goals and Tracking
    goals: [
      {
        type: "Core Recovery",
        target: "Heal diastasis recti and rebuild core strength",
        deadline: new Date(2025, 1, 15), // February 15, 2025
        progress: 20
      },
      {
        type: "Weight Loss",
        target: "Return to pre-pregnancy weight",
        deadline: new Date(2025, 5, 1), // June 1, 2025
        progress: 10
      }
    ]
  }
];

// Helper function to calculate BMI
export function calculateBMI(weightKg, heightCm) {
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

// Helper function to get BMI category
export function getBMICategory(bmi) {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

// Add calculated BMI to each client
sampleClients.forEach(client => {
  client.bmi = calculateBMI(client.currentWeight, client.height);
  client.bmiCategory = getBMICategory(client.bmi);
});