import { createContext, useContext, useState } from 'react';
import { generateProgram } from '../Utils/programGenerator';

// 1. Define the "Schema"
const defaultUserData = {
  username: "roberthamilton", 
  profile_image_url: null,
  
  // NEW: Program Start Date (Default to today)
  start_date: new Date().toISOString(),

  // PDF Report Storage
  report_pdf_uri: null,
  report_pdf_name: null,
  
  // Physiology
  vo2_max: 54,
  hr_max: 190,
  lt1_hr: 145, 
  lt2_hr: 170, 
  
  // Plan Configuration
  availability_days: 5, 
  plan_duration_weeks: 12, 
  
  // Preferences
  preferred_unit: 'metric', 
  stats_display_preferences: ["5k", "Half Marathon"],
  
  // Personal Bests (Pre/Post)
  pb_times: {
    "5k": { pre: "22:30", post: null },
    "10k": { pre: "48:00", post: null },
    "15k": { pre: null, post: null },
    "Half": { pre: "1:45:00", post: null },
    "Full": { pre: null, post: null },
  }
};

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(defaultUserData);

  // Initialize program dynamically
  // We now pass the START DATE to the generator
  const [program, setProgram] = useState(
    generateProgram(
      defaultUserData.plan_duration_weeks, 
      defaultUserData.availability_days,
      new Date(defaultUserData.start_date)
    )
  );

  // Helper to update user profile
  const updateUser = (updates) => {
    setUser(prev => {
      const newUser = { ...prev, ...updates };
      
      // Regenerate program if Duration, Days, or Start Date changes
      if (
        (updates.plan_duration_weeks && updates.plan_duration_weeks !== prev.plan_duration_weeks) ||
        (updates.availability_days && updates.availability_days !== prev.availability_days) ||
        (updates.start_date && updates.start_date !== prev.start_date)
      ) {
        setProgram(generateProgram(
          newUser.plan_duration_weeks, 
          newUser.availability_days,
          new Date(newUser.start_date) // Pass the new date object
        ));
      }
      
      return newUser;
    });
  };

  // Helper to mark a session as complete
  const markSessionComplete = (weekId, dayId, imageUri) => {
    setProgram(prevProgram => {
      return prevProgram.map(week => {
        if (week.weekId !== weekId) return week;

        const updatedDays = week.days.map(day => {
          if (day.id === dayId) {
            return { ...day, status: 'Complete', proofImage: imageUri };
          }
          return day;
        });

        const allDaysComplete = updatedDays.every(d => d.status === 'Complete');
        const newWeekStatus = allDaysComplete ? 'Complete' : week.status;

        return { ...week, days: updatedDays, status: newWeekStatus };
      });
    });
  };

  return (
    <UserContext.Provider value={{ user, updateUser, program, markSessionComplete }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);