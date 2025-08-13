// Common Workout Programs for Aaron's Training
import { v4 as uuidv4 } from 'uuid';

export const commonWorkoutPrograms = [
  // ========== BEGINNER PROGRAMS ==========
  {
    id: uuidv4(),
    name: "Beginner - Full Body Foundation",
    description: "Perfect starting point for new clients. Focus on fundamental movement patterns with bodyweight and light resistance.",
    category: "Beginner",
    estimatedDuration: 45,
    tags: ["Beginner", "Full Body", "Foundation"],
    exercises: [
      {
        name: "Jumping Jacks",
        bodyPart: "Full Body",
        equipment: "Bodyweight",
        sets: [
          { setNumber: 1, reps: 30, weight: 0, weightUnit: "bw", rest: 30 }
        ]
      },
      {
        name: "Goblet Squat",
        bodyPart: "Legs",
        equipment: "Dumbbell",
        sets: [
          { setNumber: 1, reps: 12, weight: 20, weightUnit: "lb", rest: 90 },
          { setNumber: 2, reps: 10, weight: 20, weightUnit: "lb", rest: 90 },
          { setNumber: 3, reps: 8, weight: 25, weightUnit: "lb", rest: 90 }
        ]
      },
      {
        name: "Push-ups (Incline if needed)",
        bodyPart: "Chest",
        equipment: "Bodyweight",
        sets: [
          { setNumber: 1, reps: 10, weight: 0, weightUnit: "bw", rest: 60 },
          { setNumber: 2, reps: 8, weight: 0, weightUnit: "bw", rest: 60 },
          { setNumber: 3, reps: 6, weight: 0, weightUnit: "bw", rest: 60 }
        ]
      },
      {
        name: "Lat Pulldown",
        bodyPart: "Back",
        equipment: "Cable Machine",
        sets: [
          { setNumber: 1, reps: 12, weight: 60, weightUnit: "lb", rest: 60 },
          { setNumber: 2, reps: 10, weight: 70, weightUnit: "lb", rest: 60 },
          { setNumber: 3, reps: 8, weight: 80, weightUnit: "lb", rest: 60 }
        ]
      },
      {
        name: "Plank",
        bodyPart: "Core",
        equipment: "Bodyweight",
        sets: [
          { setNumber: 1, reps: 30, weight: 0, weightUnit: "seconds", rest: 45 },
          { setNumber: 2, reps: 30, weight: 0, weightUnit: "seconds", rest: 45 },
          { setNumber: 3, reps: 30, weight: 0, weightUnit: "seconds", rest: 45 }
        ]
      }
    ]
  },
  {
    id: uuidv4(),
    name: "Beginner - Machine Circuit",
    description: "Safe introduction to resistance training using guided machines. Ideal for building confidence.",
    category: "Beginner",
    estimatedDuration: 40,
    tags: ["Beginner", "Machines", "Circuit"],
    exercises: [
      {
        name: "Leg Press",
        bodyPart: "Legs",
        equipment: "Machine",
        sets: [
          { setNumber: 1, reps: 15, weight: 100, weightUnit: "lb", rest: 60 },
          { setNumber: 2, reps: 12, weight: 120, weightUnit: "lb", rest: 60 },
          { setNumber: 3, reps: 10, weight: 140, weightUnit: "lb", rest: 60 }
        ]
      },
      {
        name: "Chest Press Machine",
        bodyPart: "Chest",
        equipment: "Machine",
        sets: [
          { setNumber: 1, reps: 12, weight: 40, weightUnit: "lb", rest: 60 },
          { setNumber: 2, reps: 10, weight: 50, weightUnit: "lb", rest: 60 },
          { setNumber: 3, reps: 8, weight: 60, weightUnit: "lb", rest: 60 }
        ]
      },
      {
        name: "Seated Cable Row",
        bodyPart: "Back",
        equipment: "Cable Machine",
        sets: [
          { setNumber: 1, reps: 12, weight: 60, weightUnit: "lb", rest: 60 },
          { setNumber: 2, reps: 10, weight: 70, weightUnit: "lb", rest: 60 },
          { setNumber: 3, reps: 8, weight: 80, weightUnit: "lb", rest: 60 }
        ]
      },
      {
        name: "Leg Curl Machine",
        bodyPart: "Hamstrings",
        equipment: "Machine",
        sets: [
          { setNumber: 1, reps: 15, weight: 40, weightUnit: "lb", rest: 45 },
          { setNumber: 2, reps: 12, weight: 50, weightUnit: "lb", rest: 45 },
          { setNumber: 3, reps: 10, weight: 60, weightUnit: "lb", rest: 45 }
        ]
      }
    ]
  },

  // ========== STRENGTH PROGRAMS ==========
  {
    id: uuidv4(),
    name: "Upper Body - Push Power",
    description: "Comprehensive push workout targeting chest, shoulders, and triceps for strength development.",
    category: "Strength Training",
    estimatedDuration: 75,
    tags: ["Push", "Upper Body", "Strength", "Hypertrophy"],
    exercises: [
      {
        name: "Barbell Bench Press",
        bodyPart: "Chest",
        equipment: "Barbell",
        sets: [
          { setNumber: 1, reps: 8, weight: 135, weightUnit: "lb", rest: 180 },
          { setNumber: 2, reps: 6, weight: 155, weightUnit: "lb", rest: 180 },
          { setNumber: 3, reps: 6, weight: 165, weightUnit: "lb", rest: 180 },
          { setNumber: 4, reps: 4, weight: 175, weightUnit: "lb", rest: 180 }
        ]
      },
      {
        name: "Overhead Press",
        bodyPart: "Shoulders",
        equipment: "Barbell",
        sets: [
          { setNumber: 1, reps: 8, weight: 95, weightUnit: "lb", rest: 120 },
          { setNumber: 2, reps: 8, weight: 105, weightUnit: "lb", rest: 120 },
          { setNumber: 3, reps: 6, weight: 115, weightUnit: "lb", rest: 120 }
        ]
      },
      {
        name: "Incline Dumbbell Press",
        bodyPart: "Upper Chest",
        equipment: "Dumbbell",
        sets: [
          { setNumber: 1, reps: 10, weight: 60, weightUnit: "lb", rest: 90 },
          { setNumber: 2, reps: 8, weight: 70, weightUnit: "lb", rest: 90 },
          { setNumber: 3, reps: 6, weight: 80, weightUnit: "lb", rest: 90 }
        ]
      },
      {
        name: "Dips",
        bodyPart: "Triceps",
        equipment: "Bodyweight",
        sets: [
          { setNumber: 1, reps: 12, weight: 0, weightUnit: "bw", rest: 60 },
          { setNumber: 2, reps: 10, weight: 0, weightUnit: "bw", rest: 60 },
          { setNumber: 3, reps: 8, weight: 0, weightUnit: "bw", rest: 60 }
        ]
      },
      {
        name: "Lateral Raises",
        bodyPart: "Shoulders",
        equipment: "Dumbbell",
        sets: [
          { setNumber: 1, reps: 15, weight: 15, weightUnit: "lb", rest: 45 },
          { setNumber: 2, reps: 12, weight: 20, weightUnit: "lb", rest: 45 },
          { setNumber: 3, reps: 10, weight: 25, weightUnit: "lb", rest: 45 }
        ]
      }
    ]
  },
  {
    id: uuidv4(),
    name: "Upper Body - Pull Power",
    description: "Complete pull workout for back development, biceps, and posterior chain strength.",
    category: "Strength Training",
    estimatedDuration: 70,
    tags: ["Pull", "Back", "Biceps", "Strength"],
    exercises: [
      {
        name: "Deadlift",
        bodyPart: "Back/Full Body",
        equipment: "Barbell",
        sets: [
          { setNumber: 1, reps: 5, weight: 185, weightUnit: "lb", rest: 240 },
          { setNumber: 2, reps: 5, weight: 225, weightUnit: "lb", rest: 240 },
          { setNumber: 3, reps: 3, weight: 265, weightUnit: "lb", rest: 240 },
          { setNumber: 4, reps: 1, weight: 295, weightUnit: "lb", rest: 240 }
        ]
      },
      {
        name: "Pull-ups",
        bodyPart: "Back",
        equipment: "Bodyweight",
        sets: [
          { setNumber: 1, reps: 8, weight: 0, weightUnit: "bw", rest: 120 },
          { setNumber: 2, reps: 6, weight: 0, weightUnit: "bw", rest: 120 },
          { setNumber: 3, reps: 5, weight: 0, weightUnit: "bw", rest: 120 }
        ]
      },
      {
        name: "Barbell Row",
        bodyPart: "Back",
        equipment: "Barbell",
        sets: [
          { setNumber: 1, reps: 10, weight: 135, weightUnit: "lb", rest: 90 },
          { setNumber: 2, reps: 8, weight: 155, weightUnit: "lb", rest: 90 },
          { setNumber: 3, reps: 6, weight: 175, weightUnit: "lb", rest: 90 }
        ]
      },
      {
        name: "Face Pulls",
        bodyPart: "Rear Delts",
        equipment: "Cable",
        sets: [
          { setNumber: 1, reps: 15, weight: 60, weightUnit: "lb", rest: 60 },
          { setNumber: 2, reps: 15, weight: 70, weightUnit: "lb", rest: 60 },
          { setNumber: 3, reps: 12, weight: 80, weightUnit: "lb", rest: 60 }
        ]
      },
      {
        name: "Barbell Curls",
        bodyPart: "Biceps",
        equipment: "Barbell",
        sets: [
          { setNumber: 1, reps: 12, weight: 65, weightUnit: "lb", rest: 45 },
          { setNumber: 2, reps: 10, weight: 75, weightUnit: "lb", rest: 45 },
          { setNumber: 3, reps: 8, weight: 85, weightUnit: "lb", rest: 45 }
        ]
      }
    ]
  },
  {
    id: uuidv4(),
    name: "Lower Body - Leg Day",
    description: "Comprehensive lower body workout for quad, hamstring, glute, and calf development.",
    category: "Strength Training",
    estimatedDuration: 80,
    tags: ["Legs", "Lower Body", "Strength", "Power"],
    exercises: [
      {
        name: "Back Squat",
        bodyPart: "Legs",
        equipment: "Barbell",
        sets: [
          { setNumber: 1, reps: 8, weight: 185, weightUnit: "lb", rest: 180 },
          { setNumber: 2, reps: 6, weight: 225, weightUnit: "lb", rest: 180 },
          { setNumber: 3, reps: 6, weight: 245, weightUnit: "lb", rest: 180 },
          { setNumber: 4, reps: 4, weight: 265, weightUnit: "lb", rest: 180 }
        ]
      },
      {
        name: "Romanian Deadlift",
        bodyPart: "Hamstrings",
        equipment: "Barbell",
        sets: [
          { setNumber: 1, reps: 10, weight: 135, weightUnit: "lb", rest: 120 },
          { setNumber: 2, reps: 8, weight: 155, weightUnit: "lb", rest: 120 },
          { setNumber: 3, reps: 6, weight: 185, weightUnit: "lb", rest: 120 }
        ]
      },
      {
        name: "Walking Lunges",
        bodyPart: "Legs",
        equipment: "Dumbbell",
        sets: [
          { setNumber: 1, reps: 12, weight: 40, weightUnit: "lb", rest: 90 },
          { setNumber: 2, reps: 10, weight: 50, weightUnit: "lb", rest: 90 },
          { setNumber: 3, reps: 8, weight: 60, weightUnit: "lb", rest: 90 }
        ]
      },
      {
        name: "Leg Press",
        bodyPart: "Legs",
        equipment: "Machine",
        sets: [
          { setNumber: 1, reps: 15, weight: 360, weightUnit: "lb", rest: 90 },
          { setNumber: 2, reps: 12, weight: 450, weightUnit: "lb", rest: 90 },
          { setNumber: 3, reps: 10, weight: 540, weightUnit: "lb", rest: 90 }
        ]
      },
      {
        name: "Calf Raises",
        bodyPart: "Calves",
        equipment: "Machine",
        sets: [
          { setNumber: 1, reps: 20, weight: 135, weightUnit: "lb", rest: 45 },
          { setNumber: 2, reps: 15, weight: 155, weightUnit: "lb", rest: 45 },
          { setNumber: 3, reps: 12, weight: 185, weightUnit: "lb", rest: 45 }
        ]
      }
    ]
  },

  // ========== WEIGHT LOSS/CONDITIONING PROGRAMS ==========
  {
    id: uuidv4(),
    name: "HIIT Circuit - Fat Burner",
    description: "High-intensity interval training for maximum calorie burn and metabolic conditioning.",
    category: "Weight Loss",
    estimatedDuration: 30,
    tags: ["HIIT", "Cardio", "Fat Loss", "Circuit"],
    exercises: [
      {
        name: "Burpees",
        bodyPart: "Full Body",
        equipment: "Bodyweight",
        sets: [
          { setNumber: 1, reps: 10, weight: 0, weightUnit: "bw", rest: 30 },
          { setNumber: 2, reps: 8, weight: 0, weightUnit: "bw", rest: 30 },
          { setNumber: 3, reps: 6, weight: 0, weightUnit: "bw", rest: 30 }
        ]
      },
      {
        name: "Mountain Climbers",
        bodyPart: "Core/Cardio",
        equipment: "Bodyweight",
        sets: [
          { setNumber: 1, reps: 30, weight: 0, weightUnit: "bw", rest: 30 },
          { setNumber: 2, reps: 25, weight: 0, weightUnit: "bw", rest: 30 },
          { setNumber: 3, reps: 20, weight: 0, weightUnit: "bw", rest: 30 }
        ]
      },
      {
        name: "Kettlebell Swings",
        bodyPart: "Full Body",
        equipment: "Kettlebell",
        sets: [
          { setNumber: 1, reps: 20, weight: 35, weightUnit: "lb", rest: 45 },
          { setNumber: 2, reps: 15, weight: 35, weightUnit: "lb", rest: 45 },
          { setNumber: 3, reps: 12, weight: 35, weightUnit: "lb", rest: 45 }
        ]
      },
      {
        name: "Jumping Jacks",
        bodyPart: "Full Body",
        equipment: "Bodyweight",
        sets: [
          { setNumber: 1, reps: 40, weight: 0, weightUnit: "bw", rest: 30 },
          { setNumber: 2, reps: 35, weight: 0, weightUnit: "bw", rest: 30 },
          { setNumber: 3, reps: 30, weight: 0, weightUnit: "bw", rest: 30 }
        ]
      },
      {
        name: "Medicine Ball Slams",
        bodyPart: "Full Body",
        equipment: "Medicine Ball",
        sets: [
          { setNumber: 1, reps: 15, weight: 20, weightUnit: "lb", rest: 45 },
          { setNumber: 2, reps: 12, weight: 20, weightUnit: "lb", rest: 45 },
          { setNumber: 3, reps: 10, weight: 20, weightUnit: "lb", rest: 45 }
        ]
      }
    ]
  },
  {
    id: uuidv4(),
    name: "Metabolic Conditioning - Total Body",
    description: "Full-body metabolic workout combining strength and cardio for optimal fat loss.",
    category: "Weight Loss",
    estimatedDuration: 45,
    tags: ["MetCon", "Full Body", "Conditioning", "Fat Loss"],
    exercises: [
      {
        name: "Thrusters",
        bodyPart: "Full Body",
        equipment: "Barbell",
        supersetWith: "Rowing Machine",
        sets: [
          { setNumber: 1, reps: 12, weight: 65, weightUnit: "lb", rest: 0 },
          { setNumber: 2, reps: 10, weight: 75, weightUnit: "lb", rest: 0 },
          { setNumber: 3, reps: 8, weight: 85, weightUnit: "lb", rest: 0 }
        ]
      },
      {
        name: "Rowing Machine",
        bodyPart: "Full Body",
        equipment: "Machine",
        supersetWith: "Thrusters",
        sets: [
          { setNumber: 1, reps: 250, weight: 0, weightUnit: "meters", rest: 90 },
          { setNumber: 2, reps: 250, weight: 0, weightUnit: "meters", rest: 90 },
          { setNumber: 3, reps: 250, weight: 0, weightUnit: "meters", rest: 90 }
        ]
      },
      {
        name: "Box Jumps",
        bodyPart: "Legs",
        equipment: "Box",
        supersetWith: "Push-ups",
        sets: [
          { setNumber: 1, reps: 15, weight: 0, weightUnit: "bw", rest: 0 },
          { setNumber: 2, reps: 12, weight: 0, weightUnit: "bw", rest: 0 },
          { setNumber: 3, reps: 10, weight: 0, weightUnit: "bw", rest: 0 }
        ]
      },
      {
        name: "Push-ups",
        bodyPart: "Chest",
        equipment: "Bodyweight",
        supersetWith: "Box Jumps",
        sets: [
          { setNumber: 1, reps: 15, weight: 0, weightUnit: "bw", rest: 60 },
          { setNumber: 2, reps: 12, weight: 0, weightUnit: "bw", rest: 60 },
          { setNumber: 3, reps: 10, weight: 0, weightUnit: "bw", rest: 60 }
        ]
      }
    ]
  },

  // ========== ATHLETIC PERFORMANCE PROGRAMS ==========
  {
    id: uuidv4(),
    name: "Athletic Performance - Power Development",
    description: "Explosive movements for athletic power, speed, and performance enhancement.",
    category: "Athletic Performance",
    estimatedDuration: 60,
    tags: ["Power", "Athletic", "Explosive", "Sports"],
    exercises: [
      {
        name: "Power Clean",
        bodyPart: "Full Body",
        equipment: "Barbell",
        sets: [
          { setNumber: 1, reps: 3, weight: 135, weightUnit: "lb", rest: 180 },
          { setNumber: 2, reps: 3, weight: 155, weightUnit: "lb", rest: 180 },
          { setNumber: 3, reps: 2, weight: 175, weightUnit: "lb", rest: 180 },
          { setNumber: 4, reps: 1, weight: 185, weightUnit: "lb", rest: 180 }
        ]
      },
      {
        name: "Box Jumps",
        bodyPart: "Legs",
        equipment: "Box",
        sets: [
          { setNumber: 1, reps: 5, weight: 0, weightUnit: "bw", rest: 120 },
          { setNumber: 2, reps: 5, weight: 0, weightUnit: "bw", rest: 120 },
          { setNumber: 3, reps: 3, weight: 0, weightUnit: "bw", rest: 120 }
        ]
      },
      {
        name: "Medicine Ball Throws",
        bodyPart: "Core/Power",
        equipment: "Medicine Ball",
        sets: [
          { setNumber: 1, reps: 10, weight: 20, weightUnit: "lb", rest: 90 },
          { setNumber: 2, reps: 8, weight: 20, weightUnit: "lb", rest: 90 },
          { setNumber: 3, reps: 6, weight: 25, weightUnit: "lb", rest: 90 }
        ]
      },
      {
        name: "Jump Squats",
        bodyPart: "Legs",
        equipment: "Bodyweight",
        sets: [
          { setNumber: 1, reps: 8, weight: 0, weightUnit: "bw", rest: 90 },
          { setNumber: 2, reps: 6, weight: 0, weightUnit: "bw", rest: 90 },
          { setNumber: 3, reps: 5, weight: 0, weightUnit: "bw", rest: 90 }
        ]
      }
    ]
  },
  {
    id: uuidv4(),
    name: "Sport-Specific - Runner's Strength",
    description: "Targeted strength training for runners to improve performance and prevent injury.",
    category: "Athletic Performance",
    estimatedDuration: 50,
    tags: ["Running", "Endurance", "Injury Prevention"],
    exercises: [
      {
        name: "Single Leg Squats",
        bodyPart: "Legs",
        equipment: "Bodyweight",
        sets: [
          { setNumber: 1, reps: 10, weight: 0, weightUnit: "bw", rest: 60 },
          { setNumber: 2, reps: 8, weight: 0, weightUnit: "bw", rest: 60 },
          { setNumber: 3, reps: 6, weight: 0, weightUnit: "bw", rest: 60 }
        ]
      },
      {
        name: "Hip Thrusts",
        bodyPart: "Glutes",
        equipment: "Barbell",
        sets: [
          { setNumber: 1, reps: 15, weight: 135, weightUnit: "lb", rest: 60 },
          { setNumber: 2, reps: 12, weight: 155, weightUnit: "lb", rest: 60 },
          { setNumber: 3, reps: 10, weight: 185, weightUnit: "lb", rest: 60 }
        ]
      },
      {
        name: "Calf Raises",
        bodyPart: "Calves",
        equipment: "Bodyweight",
        sets: [
          { setNumber: 1, reps: 20, weight: 0, weightUnit: "bw", rest: 45 },
          { setNumber: 2, reps: 15, weight: 25, weightUnit: "lb", rest: 45 },
          { setNumber: 3, reps: 12, weight: 35, weightUnit: "lb", rest: 45 }
        ]
      },
      {
        name: "Plank",
        bodyPart: "Core",
        equipment: "Bodyweight",
        sets: [
          { setNumber: 1, reps: 60, weight: 0, weightUnit: "seconds", rest: 45 },
          { setNumber: 2, reps: 45, weight: 0, weightUnit: "seconds", rest: 45 },
          { setNumber: 3, reps: 30, weight: 0, weightUnit: "seconds", rest: 45 }
        ]
      }
    ]
  },

  // ========== MOBILITY/RECOVERY PROGRAMS ==========
  {
    id: uuidv4(),
    name: "Mobility & Recovery - Full Body",
    description: "Gentle movements for flexibility, mobility, and active recovery between intense sessions.",
    category: "Recovery",
    estimatedDuration: 30,
    tags: ["Mobility", "Recovery", "Flexibility", "Stretching"],
    exercises: [
      {
        name: "Cat-Cow Stretch",
        bodyPart: "Back/Core",
        equipment: "Bodyweight",
        sets: [
          { setNumber: 1, reps: 10, weight: 0, weightUnit: "bw", rest: 30 }
        ]
      },
      {
        name: "Bird Dog",
        bodyPart: "Core",
        equipment: "Bodyweight",
        sets: [
          { setNumber: 1, reps: 10, weight: 0, weightUnit: "bw", rest: 30 },
          { setNumber: 2, reps: 10, weight: 0, weightUnit: "bw", rest: 30 }
        ]
      },
      {
        name: "Hip Circles",
        bodyPart: "Hips",
        equipment: "Bodyweight",
        sets: [
          { setNumber: 1, reps: 10, weight: 0, weightUnit: "bw", rest: 30 },
          { setNumber: 2, reps: 10, weight: 0, weightUnit: "bw", rest: 30 }
        ]
      },
      {
        name: "Shoulder Rolls",
        bodyPart: "Shoulders",
        equipment: "Bodyweight",
        sets: [
          { setNumber: 1, reps: 10, weight: 0, weightUnit: "bw", rest: 30 }
        ]
      }
    ]
  },
  {
    id: uuidv4(),
    name: "Rehabilitation - Lower Back Focus",
    description: "Therapeutic exercises for lower back pain relief and core stabilization.",
    category: "Rehabilitation",
    estimatedDuration: 35,
    tags: ["Rehab", "Lower Back", "Core", "Therapeutic"],
    exercises: [
      {
        name: "Dead Bug",
        bodyPart: "Core",
        equipment: "Bodyweight",
        sets: [
          { setNumber: 1, reps: 10, weight: 0, weightUnit: "bw", rest: 45 },
          { setNumber: 2, reps: 8, weight: 0, weightUnit: "bw", rest: 45 }
        ]
      },
      {
        name: "Glute Bridge",
        bodyPart: "Glutes",
        equipment: "Bodyweight",
        sets: [
          { setNumber: 1, reps: 15, weight: 0, weightUnit: "bw", rest: 45 },
          { setNumber: 2, reps: 12, weight: 0, weightUnit: "bw", rest: 45 },
          { setNumber: 3, reps: 10, weight: 0, weightUnit: "bw", rest: 45 }
        ]
      },
      {
        name: "Clamshells",
        bodyPart: "Hips",
        equipment: "Bodyweight",
        sets: [
          { setNumber: 1, reps: 15, weight: 0, weightUnit: "bw", rest: 30 },
          { setNumber: 2, reps: 12, weight: 0, weightUnit: "bw", rest: 30 }
        ]
      },
      {
        name: "Wall Sits",
        bodyPart: "Legs",
        equipment: "Bodyweight",
        sets: [
          { setNumber: 1, reps: 30, weight: 0, weightUnit: "seconds", rest: 60 },
          { setNumber: 2, reps: 30, weight: 0, weightUnit: "seconds", rest: 60 }
        ]
      }
    ]
  },

  // ========== SPECIALIZED PROGRAMS ==========
  {
    id: uuidv4(),
    name: "Senior Fitness - Functional Movement",
    description: "Safe, low-impact exercises for older adults focusing on balance, strength, and daily activities.",
    category: "Specialized",
    estimatedDuration: 40,
    tags: ["Senior", "Low Impact", "Balance", "Functional"],
    exercises: [
      {
        name: "Chair Squats",
        bodyPart: "Legs",
        equipment: "Bodyweight",
        sets: [
          { setNumber: 1, reps: 10, weight: 0, weightUnit: "bw", rest: 60 },
          { setNumber: 2, reps: 8, weight: 0, weightUnit: "bw", rest: 60 }
        ]
      },
      {
        name: "Wall Push-ups",
        bodyPart: "Chest",
        equipment: "Bodyweight",
        sets: [
          { setNumber: 1, reps: 10, weight: 0, weightUnit: "bw", rest: 60 },
          { setNumber: 2, reps: 8, weight: 0, weightUnit: "bw", rest: 60 }
        ]
      },
      {
        name: "Marching in Place",
        bodyPart: "Full Body",
        equipment: "Bodyweight",
        sets: [
          { setNumber: 1, reps: 20, weight: 0, weightUnit: "bw", rest: 45 }
        ]
      },
      {
        name: "Heel Raises",
        bodyPart: "Calves",
        equipment: "Bodyweight",
        sets: [
          { setNumber: 1, reps: 15, weight: 0, weightUnit: "bw", rest: 45 },
          { setNumber: 2, reps: 12, weight: 0, weightUnit: "bw", rest: 45 }
        ]
      }
    ]
  },
  {
    id: uuidv4(),
    name: "Prenatal/Postnatal - Safe Strengthening",
    description: "Modified exercises safe for pregnancy and postpartum recovery with core and pelvic floor focus.",
    category: "Specialized",
    estimatedDuration: 35,
    tags: ["Prenatal", "Postnatal", "Core", "Pelvic Floor"],
    exercises: [
      {
        name: "Modified Goblet Squat",
        bodyPart: "Legs",
        equipment: "Dumbbell",
        sets: [
          { setNumber: 1, reps: 12, weight: 15, weightUnit: "lb", rest: 60 },
          { setNumber: 2, reps: 10, weight: 15, weightUnit: "lb", rest: 60 }
        ]
      },
      {
        name: "Side Plank (Modified)",
        bodyPart: "Core",
        equipment: "Bodyweight",
        sets: [
          { setNumber: 1, reps: 20, weight: 0, weightUnit: "seconds", rest: 45 },
          { setNumber: 2, reps: 15, weight: 0, weightUnit: "seconds", rest: 45 }
        ]
      },
      {
        name: "Clamshells",
        bodyPart: "Hips",
        equipment: "Bodyweight",
        sets: [
          { setNumber: 1, reps: 15, weight: 0, weightUnit: "bw", rest: 30 },
          { setNumber: 2, reps: 15, weight: 0, weightUnit: "bw", rest: 30 }
        ]
      },
      {
        name: "Cat-Cow Stretch",
        bodyPart: "Back/Core",
        equipment: "Bodyweight",
        sets: [
          { setNumber: 1, reps: 10, weight: 0, weightUnit: "bw", rest: 30 },
          { setNumber: 2, reps: 10, weight: 0, weightUnit: "bw", rest: 30 }
        ]
      }
    ]
  },
  {
    id: uuidv4(),
    name: "Core Specialization - 6-Pack Builder",
    description: "Intensive core workout targeting all abdominal muscles for strength and definition.",
    category: "Specialized",
    estimatedDuration: 25,
    tags: ["Core", "Abs", "Six Pack", "Definition"],
    exercises: [
      {
        name: "Hanging Leg Raises",
        bodyPart: "Core",
        equipment: "Pull-up Bar",
        sets: [
          { setNumber: 1, reps: 12, weight: 0, weightUnit: "bw", rest: 60 },
          { setNumber: 2, reps: 10, weight: 0, weightUnit: "bw", rest: 60 },
          { setNumber: 3, reps: 8, weight: 0, weightUnit: "bw", rest: 60 }
        ]
      },
      {
        name: "Russian Twists",
        bodyPart: "Core",
        equipment: "Dumbbell",
        sets: [
          { setNumber: 1, reps: 20, weight: 25, weightUnit: "lb", rest: 45 },
          { setNumber: 2, reps: 15, weight: 35, weightUnit: "lb", rest: 45 },
          { setNumber: 3, reps: 12, weight: 45, weightUnit: "lb", rest: 45 }
        ]
      },
      {
        name: "Plank",
        bodyPart: "Core",
        equipment: "Bodyweight",
        sets: [
          { setNumber: 1, reps: 60, weight: 0, weightUnit: "seconds", rest: 45 },
          { setNumber: 2, reps: 45, weight: 0, weightUnit: "seconds", rest: 45 },
          { setNumber: 3, reps: 30, weight: 0, weightUnit: "seconds", rest: 45 }
        ]
      },
      {
        name: "Bicycle Crunches",
        bodyPart: "Core",
        equipment: "Bodyweight",
        sets: [
          { setNumber: 1, reps: 30, weight: 0, weightUnit: "bw", rest: 30 },
          { setNumber: 2, reps: 25, weight: 0, weightUnit: "bw", rest: 30 },
          { setNumber: 3, reps: 20, weight: 0, weightUnit: "bw", rest: 30 }
        ]
      }
    ]
  }
];