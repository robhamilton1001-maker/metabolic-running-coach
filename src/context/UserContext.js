import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Store basic settings (kept minimal for now)
  const [userSettings, setUserSettings] = useState({
    preferred_unit: 'metric',
  });

  // The Peak Oxygen Analytics imported data states
  const [athleteMetadata, setAthleteMetadata] = useState(null);
  const [rawSchedule, setRawSchedule] = useState(null);
  const [startDate, setStartDate] = useState(null); // ISO string
  const [mappedPlan, setMappedPlan] = useState(null); // Dictionary: { "YYYY-MM-DD": workoutObject }

  // 1. The Core Ingestion & Mapping Engine
  const importPlan = (jsonData, selectedStartDateStr) => {
    // Sanity check the JSON structure
    if (!jsonData || !jsonData.schedule || !jsonData.metadata) {
      throw new Error("Invalid plan file format. Must be a Peak Oxygen JSON.");
    }

    const start = new Date(selectedStartDateStr);
    
    // Ensure start date is a Monday (0 = Sunday, 1 = Monday)
    if (start.getDay() !== 1) {
      throw new Error("Start date must be a Monday");
    }

    const newMappedPlan = {};

    // 2. Map the 112-day array to specific calendar dates
    jsonData.schedule.forEach(dayInfo => {
      const currentDayDate = new Date(start);
      // dayNumber starts at 1, so offset by dayNumber - 1
      const dayOffset = dayInfo.dayNumber - 1; 
      currentDayDate.setDate(start.getDate() + dayOffset);

      // Create a clean "YYYY-MM-DD" key for easy dictionary lookup later
      const dateKey = currentDayDate.toISOString().split('T')[0];
      
      newMappedPlan[dateKey] = {
        ...dayInfo, // Spreads in phase, dayOfWeek, category, sessionText, etc.
        dateStr: dateKey,
        dateObject: currentDayDate,
        status: 'Pending', // Default status for UI completion tracking
        proofImage: null
      };
    });

    // 3. Save to Global State
    setAthleteMetadata(jsonData.metadata);
    setRawSchedule(jsonData.schedule);
    setStartDate(start.toISOString());
    setMappedPlan(newMappedPlan);
  };

  // Helper to mark a specific calendar date's session as complete
  const markSessionComplete = (dateKey, imageUri) => {
    setMappedPlan(prev => {
      if (!prev[dateKey]) return prev;
      return {
        ...prev,
        [dateKey]: {
          ...prev[dateKey],
          status: 'Complete',
          proofImage: imageUri
        }
      };
    });
  };

  // Helper to clear the plan (e.g., for uploading a new one)
  const clearPlan = () => {
    setAthleteMetadata(null);
    setRawSchedule(null);
    setStartDate(null);
    setMappedPlan(null);
  };

  return (
    <UserContext.Provider value={{ 
      userSettings,
      athleteMetadata, 
      rawSchedule, 
      startDate, 
      mappedPlan, 
      importPlan,
      markSessionComplete,
      clearPlan
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);