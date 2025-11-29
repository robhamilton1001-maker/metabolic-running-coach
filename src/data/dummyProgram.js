// src/data/dummyProgram.js

export const PROGRAM_SCHEDULE = [
  {
    weekId: 1,
    title: "Week 1: Aerobic Foundation",
    phase: "Base Building",
    status: "Complete",
    days: [
      { id: 'w1d1', day: 'Mon', date: 18, type: 'Rest', title: 'Recovery', duration: '0 min', status: 'Complete' },
      { id: 'w1d2', day: 'Tue', date: 19, type: 'Run', title: '5k Zone 2', duration: '35 min', status: 'Complete' },
      { id: 'w1d3', day: 'Wed', date: 20, type: 'Cross', title: 'Mobility', duration: '20 min', status: 'Complete' },
      { id: 'w1d4', day: 'Thu', date: 21, type: 'Run', title: '4x400m Intervals', duration: '45 min', status: 'Complete' },
      { id: 'w1d5', day: 'Fri', date: 22, type: 'Rest', title: 'Recovery', duration: '0 min', status: 'Complete' },
      { id: 'w1d6', day: 'Sat', date: 23, type: 'Run', title: '8k Long Run', duration: '60 min', status: 'Complete' },
      { id: 'w1d7', day: 'Sun', date: 24, type: 'Rest', title: 'Recovery', duration: '0 min', status: 'Complete' },
    ]
  },
  {
    weekId: 2,
    title: "Week 2: Aerobic Foundation",
    phase: "Base Building",
    status: "Active", // This is the current week
    days: [
      { id: 'w2d1', day: 'Mon', date: 25, type: 'Rest', title: 'Recovery', duration: '0 min', status: 'Complete' },
      { id: 'w2d2', day: 'Tue', date: 26, type: 'Run', title: '5k Zone 2', duration: '35 min', status: 'Complete' },
      { id: 'w2d3', day: 'Wed', date: 27, type: 'Run', title: 'Recovery Run', duration: '30 min', status: 'Pending' }, // Today?
      { id: 'w2d4', day: 'Thu', date: 28, type: 'Run', title: 'Tempo Run', duration: '50 min', status: 'Pending' },
      { id: 'w2d5', day: 'Fri', date: 29, type: 'Rest', title: 'Mobility', duration: '20 min', status: 'Pending' },
      { id: 'w2d6', day: 'Sat', date: 30, type: 'Run', title: '10k Long Run', duration: '75 min', status: 'Pending' },
      { id: 'w2d7', day: 'Sun', date: 1,  type: 'Rest', title: 'Recovery', duration: '0 min', status: 'Pending' },
    ]
  },
  {
    weekId: 3,
    title: "Week 3: Increasing Load",
    phase: "Build",
    status: "Locked",
    days: [] // Placeholder for future data
  },
  {
    weekId: 4,
    title: "Week 4: Recovery Week",
    phase: "Recovery",
    status: "Locked",
    days: []
  }
];

// Helper to get the "Active" week for the Dashboard
export const getCurrentWeek = () => {
  return PROGRAM_SCHEDULE.find(week => week.status === "Active");
};