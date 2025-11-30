// src/utils/programGenerator.js

const WORKOUT_TYPES = [
  { type: 'Run', title: 'Aerobic Base', duration: '45 min' },
  { type: 'Run', title: 'Tempo Run', duration: '30 min' },
  { type: 'Run', title: 'Intervals', duration: '40 min' },
  { type: 'Run', title: 'Recovery Run', duration: '25 min' },
  { type: 'Run', title: 'Long Run', duration: '60 min' },
];

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Helper to format date like "18 Nov"
const formatDate = (dateObj) => {
  const day = dateObj.getDate();
  const month = MONTHS[dateObj.getMonth()];
  return `${day} ${month}`;
};

export const generateProgram = (durationWeeks = 12, daysPerWeek = 5, startDate = new Date()) => {
  const program = [];
  
  // Ensure startDate is a Date object (in case a string is passed)
  const start = new Date(startDate);

  for (let w = 1; w <= durationWeeks; w++) {
    // 1. Determine Phase
    let phase = 'Base Phase';
    if (w > durationWeeks / 3) phase = 'Build Phase';
    if (w > (durationWeeks * 2) / 3) phase = 'Peak Phase';

    // 2. Determine Status
    // Week 1 is 'Active', others 'Locked' by default
    let status = 'Active'; // ALL weeks are open

    // 3. Generate Days
    const days = [];
    let runCount = 0;

    for (let d = 1; d <= 7; d++) {
      // Calculate the specific date for this day
      // Formula: StartDate + ((Week - 1) * 7) + (Day - 1)
      const currentDayDate = new Date(start);
      const dayOffset = ((w - 1) * 7) + (d - 1);
      currentDayDate.setDate(start.getDate() + dayOffset);

      // Logic: Distribute runs based on availability
      // Simple algorithm: Rest on Mon (1), Fri (5) if days < 6
      const isRestDay = (runCount >= daysPerWeek) || (d === 1) || (d === 5 && daysPerWeek < 6);

      const dayId = `w${w}d${d}`;
      const dayLabel = WEEKDAYS[d - 1]; // Mon, Tue...
      const dateLabel = formatDate(currentDayDate); // "12 Nov"

      if (isRestDay) {
        days.push({
          id: dayId,
          day: dayLabel,
          date: dateLabel,
          type: 'Rest',
          title: 'Rest & Recovery',
          duration: '0 min',
          status: 'Complete' // Rest days default to Complete
        });
      } else {
        // Rotate through workout types to create variety
        const workout = WORKOUT_TYPES[(w + d) % WORKOUT_TYPES.length];
        
        days.push({
          id: dayId,
          day: dayLabel,
          date: dateLabel,
          type: 'Run',
          title: workout.title,
          duration: workout.duration,
          status: 'Pending', // Runs start Pending
          proofImage: null   // Placeholder for user photo
        });
        runCount++;
      }
    }

    program.push({
      weekId: w,
      title: `Week ${w}`,
      phase: phase,
      status: status,
      days: days
    });
  }

  return program;
};