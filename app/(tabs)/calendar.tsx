import { StyleSheet, View, Text, Dimensions, useWindowDimensions } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState, useRef } from 'react';

export default function CalendarScreen() {
  const today = new Date(); 
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); 
  const navigation = useNavigation();
  const { height: windowHeight } = useWindowDimensions();
  const [contentHeight, setContentHeight] = useState(0);
  const [spacerHeight, setSpacerHeight] = useState(0);
  const contentRef = useRef(null);

  const monthNamesThai = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];

  const weekDaysShort = ["อา", "จ" , "อ", "พ", "พฤ", "ศ", "ส"];

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); 

  const lastDateOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const lastDateOfPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
  const prevMonthDays = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; 

  const nextMonthDays = (7 - ((prevMonthDays + lastDateOfMonth) % 7)) % 7;

  const days = [];

  for (let i = prevMonthDays; i > 0; i--) {
    days.push({ label: "", date: lastDateOfPrevMonth - i + 1, type: "prev" });
  }

  for (let i = 1; i <= lastDateOfMonth; i++) {
    days.push({ label: "", date: i, highlight: i === today.getDate() });
  }

  for (let i = 1; i <= nextMonthDays; i++) {
    days.push({ label: "", date: i, type: "next" });
  }

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const addActivity = () => {
    navigation.navigate('ActivityScreen'); 
  };

  // Calculate the height for the spacer
  useEffect(() => {
    if (contentRef.current) {
      // Use setTimeout to ensure content has been rendered and measured
      setTimeout(() => {
        contentRef.current.measure((x, y, width, height, pageX, pageY) => {
          // Calculate how much space is needed to fill the screen
          // Subtract some extra space for the header and padding
          const headerHeight = 100; // Adjust this based on your header height
          const calculatedSpacerHeight = windowHeight - height - headerHeight;
          
          // Set the spacer height to fill the remaining space
          setSpacerHeight(Math.max(calculatedSpacerHeight, 0));
        });
      }, 300);
    }
  }, [windowHeight]);

  return (
    <View style={styles.container}>
      <ParallaxScrollView headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}>
        <View ref={contentRef} onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          setContentHeight(height);
        }}>
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">ปฏิทิน</ThemedText>
            <ThemedText type="title">{monthNamesThai[currentMonth]} {currentYear}</ThemedText>
          </ThemedView>

          <ThemedView style={styles.calendarContainer}>
            {weeks.map((week, weekIndex) => (
              <View key={weekIndex} style={styles.weekRow}>
                {week.map((day, dayIndex) => (
                  <View
                    key={dayIndex}
                    style={[
                      styles.dayContainer,
                      day.highlight && styles.highlighted,
                      day.type === "prev" || day.type === "next" ? styles.fade : {},
                    ]}
                  >
                    <Text style={[styles.dayAbbr, day.highlight && styles.highlightedText]}>
                      {weekDaysShort[(dayIndex + 1) % 7]}
                    </Text>
                    <Text style={[styles.dayNumber, day.highlight && styles.highlightedText]}>
                      {day.date}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </ThemedView>
        </View>
        
        {/* Dynamic height spacer */}
        <View style={{ height: spacerHeight }} />
      </ParallaxScrollView>
      
      {/* FAB positioned absolutely */}
      <TouchableOpacity style={styles.fab} onPress={addActivity}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  titleContainer: {
    flexDirection: 'column',
    marginBottom: 16,
    backgroundColor: "#FFFAF2",
    marginTop:20
  },
  calendarContainer: {
    paddingHorizontal: 10,
    backgroundColor: "#FFFAF2",
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  dayContainer: {
    width: 45,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#D2A77F',
    marginHorizontal: 3,
    flexDirection: 'column', 
  },
  dayAbbr: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  highlighted: {
    backgroundColor: '#5A6B52',
  },
  highlightedText: {
    color: 'white',
  },
  fade: {
    backgroundColor: '#D6E4E5',
    color: 'white',
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    backgroundColor: '#6B6B4E',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    bottom: 20,
    right: 20,
  },
});