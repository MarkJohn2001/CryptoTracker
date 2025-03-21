import { Tabs } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { theme } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function TabLayout() {
  const { isDarkMode } = useTheme();

  const getTabBarIcon = (name, focused) => {
    return (
      <Ionicons
        name={name}
        size={24}
        color={focused ? theme.dark.primary : theme.dark.textSecondary}
      />
    );
  };

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.dark.surface,
          borderTopColor: theme.dark.border,
          borderTopWidth: 1,
          elevation: 0,
          height: 60,
        },
        tabBarActiveTintColor: theme.dark.primary,
        tabBarInactiveTintColor: theme.dark.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 8,
        },
        headerStyle: {
          backgroundColor: theme.dark.surface,
          borderBottomWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          color: theme.dark.primary,
          fontSize: 20,
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Portfolio',
          tabBarIcon: ({ focused }) => getTabBarIcon('wallet-outline', focused),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="add-coin"
        options={{
          title: 'Add Coin',
          tabBarIcon: ({ focused }) => getTabBarIcon('add-circle-outline', focused),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="price-history"
        options={{
          title: 'History',
          tabBarIcon: ({ focused }) => getTabBarIcon('time-outline', focused),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
