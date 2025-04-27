import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Image  } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: '#FFFAF2', 
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
          },
          default: {
            backgroundColor: '#FFFAF2',
            elevation: 8,
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <Image 
              source={require('@/assets/images/home-agreement2.png')} 
              style={{ 
                width: 28, 
                height: 28,
                tintColor: focused ? Colors[colorScheme ?? 'light'].tint : '#888'
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <Image 
              source={require('@/assets/images/calendar2.png')} 
              style={{ 
                width: 28, 
                height: 28,
                tintColor: focused ? Colors[colorScheme ?? 'light'].tint : '#888'
              }}
            />
          ),
        }}
      />  
      <Tabs.Screen
        name="nontify"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <Image 
              source={require('@/assets/images/notification-bell2.png')} 
              style={{ 
                width: 28, 
                height: 28,
                tintColor: focused ? Colors[colorScheme ?? 'light'].tint : '#888'
              }}
            />
          ),
        }}
      />   
      <Tabs.Screen
        name="ActivityScreen"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
          href: null, 
        }}
      />
      <Tabs.Screen
        name="CalendarScreen"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
          href: null, 
        }}
      />  
 
    </Tabs>
  );
}
