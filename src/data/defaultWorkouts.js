// Default workout templates for immediate use
export const defaultWorkouts = [
  {
    id: 'default-upper-body',
    name: 'Upper Body Strength',
    description: 'Complete upper body workout focusing on major muscle groups',
    exercises: [
      {
        id: 1,
        name: 'Barbell Bench Press',
        bodyPart: 'Chest',
        equipment: 'Barbell',
        sets: [
          { reps: 12, weight: 135, rest: 90, effort: 7 },
          { reps: 10, weight: 155, rest: 90, effort: 8 },
          { reps: 8, weight: 175, rest: 120, effort: 9 },
          { reps: 6, weight: 185, rest: 120, effort: 9 }
        ],
        notes: 'Focus on controlled descent, explosive push'
      },
      {
        id: 2,
        name: 'Pull-ups',
        bodyPart: 'Back',
        equipment: 'Bodyweight',
        sets: [
          { reps: 10, weight: 0, rest: 90, effort: 8 },
          { reps: 8, weight: 0, rest: 90, effort: 8 },
          { reps: 6, weight: 0, rest: 90, effort: 9 }
        ],
        notes: 'Can add weight belt if needed'
      },
      {
        id: 3,
        name: 'Dumbbell Shoulder Press',
        bodyPart: 'Shoulders',
        equipment: 'Dumbbells',
        sets: [
          { reps: 12, weight: 40, rest: 75, effort: 7 },
          { reps: 10, weight: 45, rest: 75, effort: 8 },
          { reps: 10, weight: 45, rest: 90, effort: 8 }
        ],
        notes: 'Keep core tight, don\'t arch back'
      },
      {
        id: 4,
        name: 'Barbell Rows',
        bodyPart: 'Back',
        equipment: 'Barbell',
        sets: [
          { reps: 12, weight: 95, rest: 75, effort: 7 },
          { reps: 10, weight: 115, rest: 75, effort: 8 },
          { reps: 10, weight: 115, rest: 90, effort: 8 }
        ],
        notes: 'Pull to lower chest, squeeze shoulder blades'
      },
      {
        id: 5,
        name: 'Dumbbell Bicep Curls',
        bodyPart: 'Arms',
        equipment: 'Dumbbells',
        sets: [
          { reps: 15, weight: 25, rest: 60, effort: 7 },
          { reps: 12, weight: 30, rest: 60, effort: 8 },
          { reps: 10, weight: 30, rest: 60, effort: 9 }
        ],
        notes: 'Control the negative, no swinging'
      },
      {
        id: 6,
        name: 'Tricep Dips',
        bodyPart: 'Arms',
        equipment: 'Parallel Bars',
        sets: [
          { reps: 12, weight: 0, rest: 60, effort: 7 },
          { reps: 10, weight: 0, rest: 60, effort: 8 },
          { reps: 8, weight: 0, rest: 60, effort: 9 }
        ],
        notes: 'Lean forward slightly for chest emphasis'
      }
    ],
    createdAt: new Date().toISOString(),
    category: 'Strength',
    duration: 60
  },
  {
    id: 'default-lower-body',
    name: 'Lower Body Power',
    description: 'Leg day focusing on strength and power development',
    exercises: [
      {
        id: 1,
        name: 'Barbell Back Squat',
        bodyPart: 'Legs',
        equipment: 'Barbell',
        sets: [
          { reps: 10, weight: 135, rest: 120, effort: 7 },
          { reps: 8, weight: 185, rest: 120, effort: 8 },
          { reps: 6, weight: 225, rest: 150, effort: 9 },
          { reps: 6, weight: 225, rest: 150, effort: 9 }
        ],
        notes: 'Depth below parallel, drive through heels'
      },
      {
        id: 2,
        name: 'Romanian Deadlifts',
        bodyPart: 'Legs',
        equipment: 'Barbell',
        sets: [
          { reps: 12, weight: 135, rest: 90, effort: 7 },
          { reps: 10, weight: 155, rest: 90, effort: 8 },
          { reps: 10, weight: 155, rest: 90, effort: 8 }
        ],
        notes: 'Keep bar close to body, feel hamstring stretch'
      },
      {
        id: 3,
        name: 'Leg Press',
        bodyPart: 'Legs',
        equipment: 'Machine',
        sets: [
          { reps: 15, weight: 270, rest: 90, effort: 7 },
          { reps: 12, weight: 360, rest: 90, effort: 8 },
          { reps: 10, weight: 450, rest: 120, effort: 9 }
        ],
        notes: 'Full range of motion, don\'t lock knees'
      },
      {
        id: 4,
        name: 'Walking Lunges',
        bodyPart: 'Legs',
        equipment: 'Dumbbells',
        sets: [
          { reps: 20, weight: 30, rest: 90, effort: 7 },
          { reps: 20, weight: 35, rest: 90, effort: 8 },
          { reps: 20, weight: 35, rest: 90, effort: 8 }
        ],
        notes: '10 reps each leg, focus on balance'
      },
      {
        id: 5,
        name: 'Leg Curls',
        bodyPart: 'Legs',
        equipment: 'Machine',
        sets: [
          { reps: 15, weight: 70, rest: 60, effort: 7 },
          { reps: 12, weight: 80, rest: 60, effort: 8 },
          { reps: 10, weight: 90, rest: 60, effort: 9 }
        ],
        notes: 'Squeeze at top, control descent'
      },
      {
        id: 6,
        name: 'Calf Raises',
        bodyPart: 'Legs',
        equipment: 'Machine',
        sets: [
          { reps: 20, weight: 90, rest: 45, effort: 7 },
          { reps: 15, weight: 110, rest: 45, effort: 8 },
          { reps: 15, weight: 110, rest: 45, effort: 8 }
        ],
        notes: 'Full range, pause at top'
      }
    ],
    createdAt: new Date().toISOString(),
    category: 'Strength',
    duration: 65
  },
  {
    id: 'default-full-body',
    name: 'Full Body Circuit',
    description: 'High-intensity full body workout for overall conditioning',
    exercises: [
      {
        id: 1,
        name: 'Deadlifts',
        bodyPart: 'Full Body',
        equipment: 'Barbell',
        sets: [
          { reps: 8, weight: 185, rest: 120, effort: 8 },
          { reps: 6, weight: 225, rest: 120, effort: 9 },
          { reps: 5, weight: 245, rest: 150, effort: 9 }
        ],
        notes: 'Complete hip drive, maintain neutral spine'
      },
      {
        id: 2,
        name: 'Box Jumps',
        bodyPart: 'Legs',
        equipment: 'Box',
        sets: [
          { reps: 10, weight: 0, rest: 60, effort: 7 },
          { reps: 10, weight: 0, rest: 60, effort: 8 },
          { reps: 8, weight: 0, rest: 60, effort: 9 }
        ],
        notes: '24-30 inch box, land softly'
      },
      {
        id: 3,
        name: 'Dumbbell Clean and Press',
        bodyPart: 'Full Body',
        equipment: 'Dumbbells',
        sets: [
          { reps: 10, weight: 35, rest: 90, effort: 8 },
          { reps: 8, weight: 40, rest: 90, effort: 8 },
          { reps: 8, weight: 40, rest: 90, effort: 9 }
        ],
        notes: 'Explosive movement, full extension'
      },
      {
        id: 4,
        name: 'Battle Ropes',
        bodyPart: 'Full Body',
        equipment: 'Ropes',
        sets: [
          { reps: 30, weight: 0, rest: 60, effort: 8 },
          { reps: 30, weight: 0, rest: 60, effort: 9 },
          { reps: 30, weight: 0, rest: 60, effort: 9 }
        ],
        notes: '30 seconds alternating waves'
      },
      {
        id: 5,
        name: 'Burpees',
        bodyPart: 'Full Body',
        equipment: 'Bodyweight',
        sets: [
          { reps: 15, weight: 0, rest: 60, effort: 8 },
          { reps: 12, weight: 0, rest: 60, effort: 9 },
          { reps: 10, weight: 0, rest: 60, effort: 9 }
        ],
        notes: 'Chest to floor, full jump at top'
      },
      {
        id: 6,
        name: 'Plank to Push-up',
        bodyPart: 'Core',
        equipment: 'Bodyweight',
        sets: [
          { reps: 10, weight: 0, rest: 60, effort: 7 },
          { reps: 10, weight: 0, rest: 60, effort: 8 },
          { reps: 10, weight: 0, rest: 60, effort: 9 }
        ],
        notes: 'Maintain tight core throughout'
      }
    ],
    createdAt: new Date().toISOString(),
    category: 'HIIT',
    duration: 45
  },
  {
    id: 'default-beginner',
    name: 'Beginner Basics',
    description: 'Foundation workout for new gym members',
    exercises: [
      {
        id: 1,
        name: 'Goblet Squats',
        bodyPart: 'Legs',
        equipment: 'Dumbbell',
        sets: [
          { reps: 12, weight: 25, rest: 90, effort: 6 },
          { reps: 12, weight: 25, rest: 90, effort: 7 },
          { reps: 10, weight: 30, rest: 90, effort: 7 }
        ],
        notes: 'Hold dumbbell at chest, squat to comfortable depth'
      },
      {
        id: 2,
        name: 'Push-ups',
        bodyPart: 'Chest',
        equipment: 'Bodyweight',
        sets: [
          { reps: 10, weight: 0, rest: 60, effort: 7 },
          { reps: 8, weight: 0, rest: 60, effort: 7 },
          { reps: 8, weight: 0, rest: 60, effort: 8 }
        ],
        notes: 'Can modify on knees if needed'
      },
      {
        id: 3,
        name: 'Lat Pulldowns',
        bodyPart: 'Back',
        equipment: 'Cable',
        sets: [
          { reps: 12, weight: 60, rest: 75, effort: 6 },
          { reps: 12, weight: 70, rest: 75, effort: 7 },
          { reps: 10, weight: 70, rest: 75, effort: 7 }
        ],
        notes: 'Pull to upper chest, squeeze shoulder blades'
      },
      {
        id: 4,
        name: 'Dumbbell Lunges',
        bodyPart: 'Legs',
        equipment: 'Dumbbells',
        sets: [
          { reps: 10, weight: 15, rest: 75, effort: 6 },
          { reps: 10, weight: 15, rest: 75, effort: 7 },
          { reps: 10, weight: 20, rest: 75, effort: 7 }
        ],
        notes: '10 total (5 each leg), stationary position'
      },
      {
        id: 5,
        name: 'Plank Hold',
        bodyPart: 'Core',
        equipment: 'Bodyweight',
        sets: [
          { reps: 30, weight: 0, rest: 60, effort: 7 },
          { reps: 30, weight: 0, rest: 60, effort: 8 },
          { reps: 30, weight: 0, rest: 60, effort: 8 }
        ],
        notes: '30 seconds hold, maintain straight line'
      }
    ],
    createdAt: new Date().toISOString(),
    category: 'Beginner',
    duration: 40
  }
];

export default defaultWorkouts;