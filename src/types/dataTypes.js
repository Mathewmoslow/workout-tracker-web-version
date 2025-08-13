// Enhanced data models based on trainer requirements

export const SessionTypes = {
  FULL_BODY: 'Full Body',
  UPPER_BODY: 'Upper Body',
  LOWER_BODY: 'Lower Body',
  LATERAL_FOCUS: 'Lateral Focus',
  CARDIO_CORE: 'Cardio/Core',
  RECOVERY: 'Recovery',
  CIRCUIT: 'Circuit',
  PARTNER_SESSION: 'Partner Session',
  HIIT: 'HIIT',
  STRENGTH: 'Strength'
};

export const WeightUnits = {
  POUNDS: 'lb',
  KILOGRAMS: 'kg',
  BODYWEIGHT: 'bw',
  SECONDS: 'seconds',
  METERS: 'meters',
  PERCENTAGE: '%'
};

export const NoteTypes = {
  FORM: 'Form',
  MEDICAL: 'Medical',
  MODIFICATION: 'Modification',
  PERFORMANCE: 'Performance',
  EQUIPMENT: 'Equipment',
  PROGRAM: 'Program',
  TECHNIQUE: 'Technique',
  PROGRESS: 'Progress'
};

export const GoalTypes = {
  STRENGTH: 'Strength',
  BALANCE: 'Balance',
  FORM: 'Form',
  ENDURANCE: 'Endurance',
  FLEXIBILITY: 'Flexibility',
  CARDIO: 'Cardio',
  WEIGHT_LOSS: 'Weight Loss',
  MUSCLE_GAIN: 'Muscle Gain'
};

export const MetricTypes = {
  PLANK_HOLD: 'Plank_Hold',
  ROW_DISTANCE: 'Row_Distance',
  ROW_TIME: 'Row_Time',
  MAX_DEADLIFT: 'Max_Deadlift',
  BALANCE_ASSESSMENT: 'Balance_Assessment',
  SKI_DISTANCE: 'Ski_Distance',
  MAX_WEIGHT: 'Max_Weight',
  TIME_TRIAL: 'Time_Trial',
  BODY_MEASUREMENT: 'Body_Measurement'
};

// Enhanced Session Model
export const createSession = ({
  session_id = null,
  client_id,
  session_date,
  session_type = SessionTypes.FULL_BODY,
  duration_minutes = null,
  focus_area = '',
  general_notes = '',
  status = 'scheduled', // scheduled, in_progress, completed, cancelled
  trainer_name = 'Aaron',
  late_minutes = 0,
  partner_client_id = null,
  created_date = new Date().toISOString()
}) => ({
  id: session_id || Date.now(),
  clientId: client_id,
  date: session_date,
  time: '09:00', // default time
  sessionType: session_type,
  duration: duration_minutes,
  focusArea: focus_area,
  notes: general_notes,
  status,
  trainerName: trainer_name,
  lateMinutes: late_minutes,
  partnerClientId: partner_client_id,
  createdDate: created_date,
  exercises: [],
  workouts: []
});

// Enhanced Exercise Set Model
export const createExerciseSet = ({
  set_number = 1,
  reps = 0,
  weight = 0,
  weight_unit = WeightUnits.POUNDS,
  tempo = '',
  rest_seconds = 90,
  equipment_notes = '',
  form_notes = '',
  effort_level = 7,
  completed = false,
  planned_reps = null,
  planned_weight = null
}) => ({
  setNumber: set_number,
  reps,
  actualReps: reps,
  plannedReps: planned_reps || reps,
  weight,
  actualWeight: weight,
  plannedWeight: planned_weight || weight,
  weightUnit: weight_unit,
  tempo,
  rest: rest_seconds,
  actualRest: rest_seconds,
  equipmentNotes: equipment_notes,
  formNotes: form_notes,
  effort: effort_level,
  actualEffort: effort_level,
  completed,
  notes: ''
});

// Enhanced Progress Metric Model
export const createProgressMetric = ({
  metric_id = null,
  client_id,
  session_id = null,
  metric_type,
  metric_value,
  unit = '',
  notes = '',
  date = new Date().toISOString()
}) => ({
  id: metric_id || Date.now(),
  clientId: client_id,
  sessionId: session_id,
  metricType: metric_type,
  value: metric_value,
  unit,
  notes,
  date
});

// Enhanced Trainer Note Model
export const createTrainerNote = ({
  note_id = null,
  client_id,
  session_id = null,
  note_type = NoteTypes.FORM,
  note_text,
  created_date = new Date().toISOString()
}) => ({
  id: note_id || Date.now(),
  clientId: client_id,
  sessionId: session_id,
  noteType: note_type,
  text: note_text,
  createdDate: created_date
});

// Enhanced Client Goal Model
export const createClientGoal = ({
  goal_id = null,
  client_id,
  goal_type = GoalTypes.STRENGTH,
  goal_description,
  target_value = null,
  target_date = null,
  status = 'Pending' // Pending, In Progress, Completed, On Hold
}) => ({
  id: goal_id || Date.now(),
  clientId: client_id,
  goalType: goal_type,
  description: goal_description,
  targetValue: target_value,
  targetDate: target_date,
  status,
  createdAt: new Date().toISOString()
});

// Enhanced Client Model
export const createClient = ({
  client_id = null,
  first_name,
  last_name = '',
  trainer_name = 'Aaron',
  status = 'Active',
  notes = '',
  created_date = new Date().toISOString(),
  email = '',
  phone = '',
  emergency_contact = '',
  medical_notes = '',
  goals = [],
  measurements = []
}) => ({
  id: client_id || Date.now(),
  name: `${first_name} ${last_name}`.trim(),
  firstName: first_name,
  lastName: last_name,
  trainerName: trainer_name,
  status,
  notes,
  email,
  phone,
  emergencyContact: emergency_contact,
  medicalNotes: medical_notes,
  goals,
  measurements,
  createdDate: created_date
});

const dataTypes = {
  SessionTypes,
  WeightUnits,
  NoteTypes,
  GoalTypes,
  MetricTypes,
  createSession,
  createExerciseSet,
  createProgressMetric,
  createTrainerNote,
  createClientGoal,
  createClient
};

export default dataTypes;