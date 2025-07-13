const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

// Read and process the megagym dataset
const csvContent = fs.readFileSync('megaGymDataset.csv', 'utf-8');
const records = parse(csvContent, {
  columns: true,
  skip_empty_lines: true,
  trim: true
});

// Clean and process all exercises
const cleanExercises = records
  .filter(exercise => {
    return exercise.Title && 
           exercise.Desc && 
           exercise.Type && 
           exercise.BodyPart && 
           exercise.Equipment && 
           exercise.Level;
  })
  .map((exercise, index) => ({
    id: index + 1,
    title: exercise.Title.trim(),
    desc: exercise.Desc.trim(),
    type: exercise.Type.trim(),
    bodyPart: exercise.BodyPart.trim(),
    equipment: exercise.Equipment.trim(),
    level: exercise.Level.trim(),
    rating: parseFloat(exercise.Rating) || 0,
    ratingDesc: exercise.RatingDesc?.trim() || 'Not Rated'
  }));

// Write to JSON file
const outputPath = path.join('src', 'data', 'exercises.json');
fs.writeFileSync(outputPath, JSON.stringify(cleanExercises, null, 2));

console.log(`Successfully processed ${cleanExercises.length} exercises`);
console.log(`Output saved to: ${outputPath}`);

