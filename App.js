import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';

// Import Components
import AppLoading from './src/components/AppLoading';

// Import Screens
import DashboardScreen from './src/screens/DashboardScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ProgramOverviewScreen from './src/screens/ProgramOverviewScreen';
import WeekDetailScreen from './src/screens/WeekDetailScreen'; // <--- New Import

// Import Theme
import Colors from './src/constants/colors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 1. Define the Bottom Tab Navigator (The Main App)
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          height: 88,
          paddingTop: 12,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Workout" 
        component={ProgramOverviewScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            // CHANGED: 'fitness-center' -> 'directions-run'
            <MaterialIcons name="directions-run" size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={28} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// 2. Define the Root Stack
export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <AppLoading />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator 
        screenOptions={{ 
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.primary,
          contentStyle: { backgroundColor: Colors.background },
          headerShown: false 
        }}
      >
        {/* Onboarding Flow */}
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        
        {/* Main App Flow (Tabs) */}
        <Stack.Screen name="Dashboard" component={MainTabs} /> 
        
        {/* Drill-Down Screens (These sit on top of the tabs) */}
        <Stack.Screen 
          name="WeekDetail" 
          component={WeekDetailScreen} 
          options={{ headerShown: false }} // We are using a custom header in the screen itself
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}