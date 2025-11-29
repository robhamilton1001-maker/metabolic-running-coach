import { createContext, useContext, useState } from 'react';

// 1. Define the initial "Schema" based on your requirements
const defaultUserData = {
  username: null, 
  profile_image_url: null,
  
  // Physiology
  vo2_max: 54,
  hr_max: 190,
  lt1_hr: 145, // Aerobic Threshold
  lt2_hr: 170, // Anaerobic Threshold
  
  // Plan Configuration
  availability_days: 5, // Range 3-7
  plan_duration_weeks: 12, // 6 or 12
  
  // Preferences
  preferred_unit: 'metric', // 'imperial' (mile) or 'metric' (km)
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

  // Helper to update specific fields
  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use this data easily in any screen
export const useUser = () => useContext(UserContext);