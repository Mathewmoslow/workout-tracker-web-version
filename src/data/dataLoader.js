// Data Loader for Common Workout Programs and Sample Clients
import { commonWorkoutPrograms } from './commonWorkoutPrograms';
import { sampleClients } from './sampleClients';

// Load common workout programs and sample clients if storage is empty
export const loadInitialData = () => {
  // Check if we already have data
  const existingWorkouts = JSON.parse(localStorage.getItem('workouts') || '[]');
  const existingClients = JSON.parse(localStorage.getItem('clients') || '[]');
  
  let dataLoaded = false;

  // Load workout programs if we have fewer than 5 workouts
  if (existingWorkouts.length < 5) {
    console.log('Loading common workout programs...');
    
    // Convert common programs to the format expected by the app
    const formattedPrograms = commonWorkoutPrograms.map(program => ({
      id: program.id,
      name: program.name,
      description: program.description,
      category: program.category,
      estimatedDuration: program.estimatedDuration,
      tags: program.tags,
      exercises: program.exercises.map((exercise, index) => ({
        id: `${program.id}_exercise_${index}`,
        name: exercise.name,
        bodyPart: exercise.bodyPart,
        equipment: exercise.equipment,
        sets: exercise.sets.map(set => ({
          ...set,
          id: `${program.id}_exercise_${index}_set_${set.setNumber}`,
          completed: false,
          actualReps: set.reps,
          actualWeight: set.weight,
          actualEffort: '',
          notes: ''
        })),
        notes: exercise.notes || '',
        supersetWith: exercise.supersetWith || null
      })),
      createdDate: new Date().toISOString(),
      isTemplate: true
    }));

    // Merge with existing workouts and save
    const allWorkouts = [...existingWorkouts, ...formattedPrograms];
    localStorage.setItem('workouts', JSON.stringify(allWorkouts));
    console.log(`Loaded ${formattedPrograms.length} workout programs`);
    dataLoaded = true;
  }

  // Load sample clients if we have fewer than 3 clients  
  if (existingClients.length < 3) {
    console.log('Loading sample clients...');
    
    // Convert sample clients to the format expected by the app
    const formattedClients = sampleClients.map(client => ({
      id: client.id,
      name: client.name,
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phone: client.phone,
      dateOfBirth: client.dateOfBirth ? client.dateOfBirth.toISOString().split('T')[0] : '',
      age: client.age,
      gender: client.gender,
      height: client.height,
      weight: client.currentWeight,
      targetWeight: client.targetWeight,
      primaryGoal: client.primaryGoal,
      secondaryGoals: Array.isArray(client.secondaryGoals) ? client.secondaryGoals.join(', ') : client.secondaryGoals || '',
      
      // Body composition data
      bodyComposition: {
        bodyFatPercentage: client.bodyFatPercentage,
        muscleMass: client.muscleMass,
        waterPercentage: client.waterPercentage,
        boneMass: client.boneMass,
        visceralFatLevel: client.visceralFatLevel,
        metabolicAge: client.metabolicAge,
        bmr: client.bmr,
        bmi: client.bmi,
        bmiCategory: client.bmiCategory
      },
      
      // Measurements - convert object to array format expected by UI
      measurements: Array.isArray(client.measurements) ? client.measurements : [],
      
      // Health information
      medicalConditions: Array.isArray(client.medicalConditions) ? client.medicalConditions.join(', ') : client.medicalConditions || '',
      currentMedications: client.currentMedications,
      allergies: Array.isArray(client.allergies) ? client.allergies.join(', ') : client.allergies || '',
      injuryHistory: client.injuryHistory,
      painPoints: client.painPoints,
      
      // Training preferences
      preferredTrainingDays: Array.isArray(client.preferredTrainingDays) ? client.preferredTrainingDays.join(', ') : client.preferredTrainingDays || '',
      activityLevel: client.activityLevel,
      
      // Lifestyle factors
      stressLevel: client.stressLevel,
      averageSleepHours: client.averageSleepHours,
      nutritionQuality: client.nutritionQuality,
      smokingStatus: client.smokingStatus,
      alcoholConsumption: client.alcoholConsumption,
      
      // Contact information
      emergencyContact: client.emergencyContact,
      
      // Subscription and status
      subscriptionType: client.subscriptionType,
      joinDate: client.joinDate.toISOString(),
      isActive: client.isActive,
      
      // Goals and tracking - convert to string for simple display, keep array for detailed view
      goals: client.goals.map(goal => (goal.target || goal.type)).join(', '),
      detailedGoals: client.goals.map(goal => ({
        ...goal,
        deadline: goal.deadline.toISOString().split('T')[0]
      })),
      
      // Notes
      notes: client.notes,
      
      // Calculated fields
      status: client.isActive ? 'Active' : 'Inactive',
      createdDate: client.joinDate.toISOString(),
      lastUpdated: new Date().toISOString()
    }));

    // Merge with existing clients and save
    const allClients = [...existingClients, ...formattedClients];
    localStorage.setItem('clients', JSON.stringify(allClients));
    console.log(`Loaded ${formattedClients.length} sample clients`);
    dataLoaded = true;
  }

  if (dataLoaded) {
    console.log('Initial data loading complete!');
    return {
      workoutsLoaded: existingWorkouts.length < 5,
      clientsLoaded: existingClients.length < 3,
      message: 'Aaron\'s workout programs and sample clients have been loaded successfully!'
    };
  } else {
    console.log('Data already exists, skipping initial load');
    return {
      workoutsLoaded: false,
      clientsLoaded: false,
      message: 'Data already exists'
    };
  }
};

// Function to reset all data (for testing purposes)
export const resetAllData = () => {
  localStorage.removeItem('workouts');
  localStorage.removeItem('clients');
  localStorage.removeItem('sessions');
  localStorage.removeItem('workoutHistory');
  console.log('All data has been reset');
  return loadInitialData();
};

// Function to get workout program categories
export const getWorkoutCategories = () => {
  return [
    'Beginner',
    'Strength Training', 
    'Weight Loss',
    'Athletic Performance',
    'Recovery',
    'Rehabilitation',
    'Specialized'
  ];
};

// Function to get common equipment types
export const getEquipmentTypes = () => {
  return [
    'Barbell',
    'Dumbbell', 
    'Cable Machine',
    'Machine',
    'Bodyweight',
    'Kettlebell',
    'Medicine Ball',
    'Box',
    'Pull-up Bar'
  ];
};

// Function to get body parts
export const getBodyParts = () => {
  return [
    'Chest',
    'Back', 
    'Shoulders',
    'Arms',
    'Legs',
    'Core',
    'Full Body',
    'Cardio'
  ];
};