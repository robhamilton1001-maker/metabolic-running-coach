import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext();
const STORAGE_KEY = '@peak_oxygen_plan';

export const UserProvider = ({ children }) => {
  const [userSettings, setUserSettings] = useState({ preferred_unit: 'metric' });
  const [athleteMetadata, setAthleteMetadata] = useState(null);
  const [rawSchedule, setRawSchedule] = useState(null);
  const [startDate, setStartDate] = useState(null); 
  const [mappedPlan, setMappedPlan] = useState(null); 
  
  // State to let the app know we are checking the hard drive
  const [isRestoringData, setIsRestoringData] = useState(true);

  // 1. Check Hard Drive on Startup
  useEffect(() => {
    const loadSavedPlan = async () => {
      try {
        const savedData = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedData) {
          const parsed = JSON.parse(savedData);
          setAthleteMetadata(parsed.athleteMetadata);
          setRawSchedule(parsed.rawSchedule);
          setStartDate(parsed.startDate);
          setMappedPlan(parsed.mappedPlan);
        }
      } catch (error) {
        console.error("Failed to load saved plan", error);
      } finally {
        setIsRestoringData(false);
      }
    };
    loadSavedPlan();
  }, []);

  // 2. Helper to Save to Hard Drive
  const saveToStorage = async (dataToSave) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error("Failed to save plan to storage", error);
    }
  };

  const importPlan = (jsonData, selectedStartDateStr) => {
    if (!jsonData || !jsonData.schedule || !jsonData.metadata) {
      throw new Error("Invalid plan file format. Must be a Peak Oxygen JSON.");
    }

    const start = new Date(selectedStartDateStr);
    if (start.getUTCDay() !== 1) throw new Error("Start date must be a Monday");

    const newMappedPlan = {};

    jsonData.schedule.forEach(dayInfo => {
      const currentDayDate = new Date(start);
      const dayOffset = dayInfo.dayNumber - 1; 
      currentDayDate.setDate(start.getDate() + dayOffset);
      const dateKey = currentDayDate.toISOString().split('T')[0];
      
      newMappedPlan[dateKey] = {
        ...dayInfo,
        dateStr: dateKey,
        dateObject: currentDayDate,
        status: 'Pending', 
        proofImage: null
      };
    });

    setAthleteMetadata(jsonData.metadata);
    setRawSchedule(jsonData.schedule);
    setStartDate(start.toISOString());
    setMappedPlan(newMappedPlan);

    // Save the newly imported plan to the device
    saveToStorage({
      athleteMetadata: jsonData.metadata,
      rawSchedule: jsonData.schedule,
      startDate: start.toISOString(),
      mappedPlan: newMappedPlan
    });
  };

  const markSessionComplete = (dateKey, imageUri) => {
    setMappedPlan(prev => {
      if (!prev || !prev[dateKey]) return prev;
      
      const updatedPlan = {
        ...prev,
        [dateKey]: {
          ...prev[dateKey],
          status: 'Complete',
          proofImage: imageUri
        }
      };

      // Save the updated status to the device
      saveToStorage({
        athleteMetadata,
        rawSchedule,
        startDate,
        mappedPlan: updatedPlan
      });

      return updatedPlan;
    });
  };

  const toggleSessionComplete = (dateKey) => {
    setMappedPlan(prev => {
      if (!prev || !prev[dateKey]) return prev;
      
      const isCurrentlyComplete = prev[dateKey].status === 'Complete';
      const updatedPlan = {
        ...prev,
        [dateKey]: {
          ...prev[dateKey],
          status: isCurrentlyComplete ? 'Pending' : 'Complete'
        }
      };

      // Save the toggled status to the device instantly
      saveToStorage({
        athleteMetadata,
        rawSchedule,
        startDate,
        mappedPlan: updatedPlan
      });

      return updatedPlan;
    });
  };

  const saveSessionNote = async (dateStr, noteText) => {
    try {
      const updatedPlan = { ...mappedPlan };
      
      // Check if the specific day exists in the plan
      if (updatedPlan[dateStr]) {
        // Add or update the sessionNote property for that day
        updatedPlan[dateStr].sessionNote = noteText;
        
        // Update the live state
        setMappedPlan(updatedPlan);
        
        // Save the whole updated plan back to the phone's local storage
        await AsyncStorage.setItem('peakOxygenPlan', JSON.stringify(updatedPlan));
      }
    } catch (error) {
      console.error("Error saving session note:", error);
    }
  };

  const clearPlan = async () => {
    setAthleteMetadata(null);
    setRawSchedule(null);
    setStartDate(null);
    setMappedPlan(null);
    
    // Wipe it from the hard drive
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  return (
    <UserContext.Provider value={{ 
      userSettings,
      athleteMetadata, 
      rawSchedule, 
      startDate, 
      mappedPlan, 
      isRestoringData,
      importPlan,
      markSessionComplete,
      toggleSessionComplete,
      saveSessionNote,
      clearPlan
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);