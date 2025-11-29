import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';

// Import Components
import AppLoading from './src/components/AppLoading';

// Import Screens
import DashboardScreen from './src/screens/DashboardScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import PdfViewerScreen from './src/screens/PdfViewerScreen';
import PlaceholderScreen from './src/screens/PlaceholderScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SessionDetailScreen from './src/screens/SessionDetailScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import StatisticsScreen from './src/screens/StatisticsScreen';
import TrainingPlanScreen from './src/screens/TrainingPlanScreen';
import WeekDetailScreen from './src/screens/WeekDetailScreen';

// Import Theme
import Colors from './src/constants/colors';
import { UserProvider } from './src/context/UserContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 2. UPDATED THEME: Extend DarkTheme
const NavTheme = {
  ...DarkTheme, // Use DarkTheme as the base
  colors: {
    ...DarkTheme.colors,
    background: Colors.background, // #050505
    card: Colors.surface,          // #121212 (Used for headers/tab bars)
    text: Colors.textPrimary,      // #FFFFFF
    border: Colors.border,         // #333333
    primary: Colors.primary,       // #00E0FF
  },
};

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
          tabBarIcon: ({ color }) => <MaterialIcons name="home" size={28} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Workout" 
        component={TrainingPlanScreen}
        options={{
          tabBarIcon: ({ color }) => <MaterialIcons name="directions-run" size={28} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <MaterialIcons name="person" size={28} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <AppLoading />;
  }

  return (
    <UserProvider>
      {/* 3. Pass the Dark Theme */}
      <NavigationContainer theme={NavTheme}>
        <StatusBar style="light" />
        <Stack.Navigator 
          screenOptions={{ 
            headerStyle: { backgroundColor: Colors.background },
            headerTintColor: Colors.primary,
            contentStyle: { backgroundColor: Colors.background },
            headerShown: false 
          }}
        >
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Dashboard" component={MainTabs} /> 
          
          <Stack.Screen 
            name="WeekDetail" 
            component={WeekDetailScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="SessionDetail" 
            component={SessionDetailScreen} 
            options={{ headerShown: false, presentation: 'modal' }} 
          />

          {/* Modals */}
          <Stack.Screen 
            name="Placeholder" 
            component={PlaceholderScreen} 
            options={{ headerShown: false, presentation: 'modal' }} 
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen} 
            options={{ headerShown: false, presentation: 'modal' }} 
          />
          <Stack.Screen 
            name="Statistics" 
            component={StatisticsScreen} 
            options={{ headerShown: false, presentation: 'modal' }} 
          />
          <Stack.Screen 
  name="PdfViewer" 
  component={PdfViewerScreen} 
  options={{ headerShown: false, presentation: 'modal' }} 
/>
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}