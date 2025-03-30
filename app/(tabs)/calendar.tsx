import { StyleSheet, View, Text } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";

export default function CalendarScreen() {
  const today = new Date(); 
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); 
  const navigation = useNavigation();

  const monthNamesThai = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];

  const weekDaysShort = ["อ", "พ", "พฤ", "ศ", "ส", "อ", "จ"];

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

  return (
    <ParallaxScrollView headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}>
      <ThemedView style={styles.titleContainer} style={{ flex: 1 }}>
        <ThemedText type="title">ปฏิทิน.</ThemedText>
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
                <Text style={styles.dayAbbr && day.highlight && styles.highlightedText}>
                  {weekDaysShort[(firstDayOfMonth + dayIndex) % 7]}
                </Text>
                <Text style={[styles.dayNumber, day.highlight && styles.highlightedText]}>
                  {day.date}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </ThemedView>
      <View style={styles.fabContainer}>
      <TouchableOpacity style={styles.fab} onPress={() => addActivity()}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
    </ParallaxScrollView>

  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'column',
    marginBottom: 16,
  },
  calendarContainer: {
    paddingHorizontal: 10,
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
  fabContainer: {
    flex: 1,
    justifyContent: 'flex-end', 
    alignItems: 'flex-end',     
    marginBottom: 20,          
  },
  
  fab: {
    position: 'relative', 
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
    marginRight: 20, 
  },
  
});
