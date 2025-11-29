// src/utils/programGenerator.js

const WORKOUT_TYPES = [
  { type: 'Run', title: 'Aerobic Base', duration: '45 min' },
  { type: 'Run', title: 'Tempo Run', duration: '30 min' },
  { type: 'Run', title: 'Intervals', duration: '40 min' },
  { type: 'Run', title: 'Recovery Run', duration: '25 min' },
  { type: 'Run', title: 'Long Run', duration: '60 min' },
];

const getDayName = (num) => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][num - 1];

// Default to 12 weeks if nothing is passed
export const generateProgram = (durationWeeks = 12, daysPerWeek = 5) => {
  const program = [];

  for (let w = 1; w <= durationWeeks; w++) {
    // 1. Determine Phase
    let phase = 'Base Phase';
    if (w > durationWeeks / 3) phase = 'Build Phase';
    if (w > (durationWeeks * 2) / 3) phase = 'Peak Phase';

    // 2. Determine Status
    // FIX: Week 1 is 'Active'. All others 'Locked'. 
    // It will ONLY be 'Complete' if all days inside are complete (handled in Context later).
    let status = w === 1 ? 'Active' : 'Locked';

    // 3. Generate Days
    const days = [];
    let runCount = 0;

    for (let d = 1; d <= 7; d++) {
      // Logic: Distribute runs based on availability
      const isRestDay = (runCount >= daysPerWeek) || (d === 1) || (d === 5 && daysPerWeek < 6);

      if (isRestDay) {
        days.push({
          id: `w${w}d${d}`,
          day: getDayName(d),
          date: `Day ${d}`,
          type: 'Rest',
          title: 'Rest & Recovery',
          duration: '0 min',
          status: 'Complete' // Rest days are complete by default
        });
      } else {
        const workout = WORKOUT_TYPES[(w + d) % WORKOUT_TYPES.length];
        days.push({
          id: `w${w}d${d}`,
          day: getDayName(d),
          date: `Day ${d}`,
          type: 'Run',
          title: workout.title,
          duration: workout.duration,
          status: 'Pending' // Runs MUST start as Pending
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