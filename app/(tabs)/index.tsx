import { Image, StyleSheet, Platform, View, Text, ScrollView } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Calendar } from "react-native-calendars";
export default function HomeScreen() {
  const days = [
    { label: "จ", date: 28 },
    { label: "อ", date: 29 },
    { label: "พ", date: 30 },
    { label: "พฤ", date: 31 },
    { label: "ศ", date: 1, highlight: true },
    { label: "ส", date: 2 },
    { label: "อา", date: 3 },
  ];
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">1 พฤศจิกายน 2567</ThemedText> 
      </ThemedView>

      <ThemedView style={styles.titleContainer}>
      
        {days.map((day, index) => (
          <View key={index} style={[styles.dayContainer, day.highlight && styles.highlighted]}>
            <Text style={[styles.dayLabel, day.highlight && styles.highlightedText]}>{day.label}</Text>
            <Text style={[styles.dayNumber, day.highlight && styles.highlightedText]}>{day.date}</Text>
          </View>
        ))}
    
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">กิจกรรม</ThemedText>
        
      </ThemedView>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  calendarContainer: {
    flexDirection: "row",
  },
  dayContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 20,
  },
  highlighted: {
    backgroundColor: "#A4A4A4",
    borderRadius: 20,
    padding: 10,
  },
  dayLabel: {
    fontSize: 16,
    color: "black",
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  highlightedText: {
    color: "white",
  },
});
