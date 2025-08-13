// Import and normalize trainer CSV data into application format
import { 
  createSession, 
  createClient, 
  createExerciseSet,
  createTrainerNote,
  createClientGoal,
  createProgressMetric,
  SessionTypes,
  NoteTypes,
  GoalTypes,
  MetricTypes,
  WeightUnits
} from '../types/dataTypes';

// Trainer's actual exercise database
export const trainerExercises = [
  { id: 'EX001', name: 'Back Squat', category: 'Compound', equipment: 'Barbell', bodyPart: 'Legs' },
  { id: 'EX002', name: 'Calf Raise', category: 'Isolation', equipment: 'Bodyweight', bodyPart: 'Calves' },
  { id: 'EX003', name: 'Romanian Deadlift', category: 'Compound', equipment: 'Dumbbell', bodyPart: 'Hamstrings' },
  { id: 'EX004', name: 'Single Leg RDL', category: 'Unilateral', equipment: 'Dumbbell', bodyPart: 'Hamstrings' },
  { id: 'EX005', name: 'Halo Press', category: 'Combination', equipment: 'Kettlebell', bodyPart: 'Shoulders' },
  { id: 'EX006', name: 'Reverse Nordic Curl', category: 'Isolation', equipment: 'Bodyweight', bodyPart: 'Hamstrings' },
  { id: 'EX007', name: 'Push-up', category: 'Compound', equipment: 'Bodyweight', bodyPart: 'Chest' },
  { id: 'EX008', name: 'Superman', category: 'Isolation', equipment: 'Bodyweight', bodyPart: 'Back' },
  { id: 'EX009', name: 'Kettlebell Swing', category: 'Power', equipment: 'Kettlebell', bodyPart: 'Full Body' },
  { id: 'EX010', name: 'Bench Dip', category: 'Isolation', equipment: 'Bench', bodyPart: 'Triceps' },
  { id: 'EX011', name: 'Plank', category: 'Isometric', equipment: 'Bodyweight', bodyPart: 'Core' },
  { id: 'EX012', name: 'Penguin Reach', category: 'Isolation', equipment: 'Bodyweight', bodyPart: 'Core' },
  { id: 'EX013', name: 'Good Morning', category: 'Compound', equipment: 'Barbell', bodyPart: 'Hamstrings' },
  { id: 'EX014', name: 'TRX Reverse Nordic Curl', category: 'Isolation', equipment: 'TRX', bodyPart: 'Hamstrings' },
  { id: 'EX015', name: 'Bird Dog', category: 'Stability', equipment: 'Bodyweight', bodyPart: 'Core' },
  { id: 'EX016', name: 'Lateral Step Down', category: 'Unilateral', equipment: 'Bodyweight', bodyPart: 'Legs' },
  { id: 'EX017', name: 'Hammer Curl', category: 'Isolation', equipment: 'Dumbbell', bodyPart: 'Biceps' },
  { id: 'EX018', name: 'Hip Thrust', category: 'Compound', equipment: 'Barbell', bodyPart: 'Glutes' },
  { id: 'EX019', name: 'Glute Bridge', category: 'Isolation', equipment: 'Bodyweight', bodyPart: 'Glutes' },
  { id: 'EX020', name: 'Seated Calf Raise', category: 'Isolation', equipment: 'Machine', bodyPart: 'Calves' }
];

// Trainer's actual client data
export const trainerClient = createClient({
  client_id: 'CL001',
  first_name: 'Lindsey',
  last_name: '',
  trainer_name: 'Aaron',
  status: 'Active',
  notes: 'Focus areas: Balance issues on left side, grip strength needs improvement, form corrections needed on various exercises. Progressing well overall.',
  created_date: '2024-11-25'
});

// Trainer's actual sessions (converted from CSV data)
export const trainerSessions = [
  createSession({
    session_id: 'S001',
    client_id: 'CL001',
    session_date: '2024-11-25',
    session_type: SessionTypes.FULL_BODY,
    general_notes: 'Great session - 90% improvement. Balance issues on left side during RDL'
  }),
  createSession({
    session_id: 'S002',
    client_id: 'CL001',
    session_date: '2024-12-02',
    session_type: SessionTypes.LATERAL_FOCUS,
    focus_area: 'Lateral',
    general_notes: 'Tabata finisher. Too easy for 1st round bird dog'
  }),
  createSession({
    session_id: 'S003',
    client_id: 'CL001',
    session_date: '2024-12-09',
    session_type: SessionTypes.LOWER_BODY,
    general_notes: 'Good weight for 4 sets on squats. Hip issues during KB swings'
  }),
  createSession({
    session_id: 'S004',
    client_id: 'CL001',
    session_date: '2024-12-18',
    session_type: SessionTypes.FULL_BODY,
    general_notes: 'Grip failed before legs on deadlifts'
  }),
  createSession({
    session_id: 'S005',
    client_id: 'CL001',
    session_date: '2024-12-27',
    session_type: SessionTypes.PARTNER_SESSION,
    general_notes: 'With Patrick - 2 heads are better than 1'
  }),
  createSession({
    session_id: 'S006',
    client_id: 'CL001',
    session_date: '2024-12-30',
    session_type: SessionTypes.FULL_BODY,
    general_notes: '2 grip makes ball slams harder. Right side harder on weighted lunges'
  }),
  createSession({
    session_id: 'S007',
    client_id: 'CL001',
    session_date: '2025-01-06',
    session_type: SessionTypes.CARDIO_CORE,
    general_notes: '325m average pace. Needs to go lower on triceps'
  }),
  createSession({
    session_id: 'S008',
    client_id: 'CL001',
    session_date: '2025-01-07',
    session_type: SessionTypes.RECOVERY,
    general_notes: 'Sore lower back from carrying kid'
  })
];

// Trainer's actual goals
export const trainerGoals = [
  createClientGoal({
    goal_id: 'G001',
    client_id: 'CL001',
    goal_type: GoalTypes.STRENGTH,
    goal_description: 'Improve grip strength for deadlifts',
    target_value: 135,
    target_date: '2025-03-31',
    status: 'In Progress'
  }),
  createClientGoal({
    goal_id: 'G002',
    client_id: 'CL001',
    goal_type: GoalTypes.BALANCE,
    goal_description: 'Correct left side balance issues',
    target_value: 100,
    target_date: '2025-02-28',
    status: 'In Progress'
  }),
  createClientGoal({
    goal_id: 'G003',
    client_id: 'CL001',
    goal_type: GoalTypes.FORM,
    goal_description: 'Master pistol squat form',
    target_value: 1,
    target_date: '2025-04-30',
    status: 'In Progress'
  }),
  createClientGoal({
    goal_id: 'G004',
    client_id: 'CL001',
    goal_type: GoalTypes.ENDURANCE,
    goal_description: '2-minute plank hold',
    target_value: 120,
    target_date: '2025-03-31',
    status: 'In Progress'
  })
];

// Trainer's actual progress metrics
export const trainerMetrics = [
  createProgressMetric({
    metric_id: 'M001',
    client_id: 'CL001',
    session_id: 'S001',
    metric_type: MetricTypes.PLANK_HOLD,
    metric_value: 84,
    unit: WeightUnits.SECONDS,
    notes: 'Good form maintained'
  }),
  createProgressMetric({
    metric_id: 'M002',
    client_id: 'CL001',
    session_id: 'S006',
    metric_type: MetricTypes.ROW_DISTANCE,
    metric_value: 325,
    unit: WeightUnits.METERS,
    notes: 'Average pace'
  }),
  createProgressMetric({
    metric_id: 'M005',
    client_id: 'CL001',
    session_id: 'S004',
    metric_type: MetricTypes.MAX_DEADLIFT,
    metric_value: 115,
    unit: WeightUnits.POUNDS,
    notes: 'Grip failed before legs'
  })
];

// Trainer's actual notes
export const trainerNotes = [
  createTrainerNote({
    note_id: 'N001',
    client_id: 'CL001',
    session_id: 'S001',
    note_type: NoteTypes.FORM,
    note_text: 'Left side balance issues during single leg work',
    created_date: '2024-11-25'
  }),
  createTrainerNote({
    note_id: 'N002',
    client_id: 'CL001',
    session_id: 'S003',
    note_type: NoteTypes.MODIFICATION,
    note_text: 'Switched from KB swings to reverse lunges due to hip issues',
    created_date: '2024-12-09'
  }),
  createTrainerNote({
    note_id: 'N003',
    client_id: 'CL001',
    session_id: 'S004',
    note_type: NoteTypes.PERFORMANCE,
    note_text: 'Grip strength limiting factor on deadlifts',
    created_date: '2024-12-18'
  }),
  createTrainerNote({
    note_id: 'N004',
    client_id: 'CL001',
    session_id: 'S008',
    note_type: NoteTypes.MEDICAL,
    note_text: 'Lower back sore from carrying kid - modified workout',
    created_date: '2025-01-07'
  })
];

// Sample workout with trainer exercises and enhanced sets
export const trainerWorkout1 = {
  id: 'TW001',
  name: 'Lindsey Session #1 - Full Body',
  description: 'Balance focus with form corrections',
  exercises: [
    {
      id: 'EX001',
      name: 'Back Squat',
      bodyPart: 'Legs',
      equipment: 'Barbell',
      sets: [
        createExerciseSet({
          set_number: 1,
          reps: 10,
          weight: 75,
          weight_unit: WeightUnits.POUNDS,
          form_notes: 'Great form'
        }),
        createExerciseSet({
          set_number: 2,
          reps: 12,
          weight: 75,
          weight_unit: WeightUnits.POUNDS
        }),
        createExerciseSet({
          set_number: 3,
          reps: 12,
          weight: 75,
          weight_unit: WeightUnits.POUNDS
        })
      ]
    },
    {
      id: 'EX004',
      name: 'Single Leg RDL',
      bodyPart: 'Hamstrings',
      equipment: 'Dumbbell',
      sets: [
        createExerciseSet({
          set_number: 1,
          reps: 10,
          weight: 25,
          weight_unit: WeightUnits.POUNDS,
          form_notes: 'Left side balance issues'
        }),
        createExerciseSet({
          set_number: 2,
          reps: 10,
          weight: 25,
          weight_unit: WeightUnits.POUNDS,
          form_notes: 'Getting better'
        }),
        createExerciseSet({
          set_number: 3,
          reps: 10,
          weight: 25,
          weight_unit: WeightUnits.POUNDS,
          form_notes: '90% better by 3rd set'
        })
      ]
    },
    {
      id: 'EX011',
      name: 'Plank',
      bodyPart: 'Core',
      equipment: 'Bodyweight',
      sets: [
        createExerciseSet({
          set_number: 1,
          reps: 84,
          weight: 0,
          weight_unit: WeightUnits.SECONDS,
          form_notes: '1:24 plank hold'
        })
      ]
    }
  ],
  createdAt: '2024-11-25',
  category: 'Full Body',
  duration: 45
};

const trainerData = {
  trainerExercises,
  trainerClient,
  trainerSessions,
  trainerGoals,
  trainerMetrics,
  trainerNotes,
  trainerWorkout1
};

export default trainerData;