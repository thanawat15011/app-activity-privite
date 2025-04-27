import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  useWindowDimensions,
} from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useEffect, useState, useRef, useCallback } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  createTable,
  insertExampleActivity,
  fetchActivities,
  deleteActivity,
  fetchActivitiesByID,
  fetchActivitiesByDateMonth,
} from "../database/database";
export default function CalendarScreen() {
  const { date, month, year } = useLocalSearchParams();
  const today = new Date();
  const currentYear = parseInt(year);
  const currentMonth = month-1;
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { height: windowHeight } = useWindowDimensions();
  const [contentHeight, setContentHeight] = useState(0);
  const [spacerHeight, setSpacerHeight] = useState(0);
  const contentRef = useRef(null);
  interface ActivityItem {
    activity_id: string;
    activity_name: string;
    datetime: string;
  }
  interface CardProps {
    id: string;
    title: string;
    time: string;
    done: boolean;
  }
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const monthNamesThai = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  const weekDaysShort = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

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

  useEffect(() => {
    if (contentRef.current) {
      // Use setTimeout to ensure content has been rendered and measured
      setTimeout(() => {
        contentRef.current.measure((x, y, width, height, pageX, pageY) => {
          // Calculate how much space is needed to fill the screen
          // Subtract some extra space for the header and padding
          const headerHeight = 100;
          const calculatedSpacerHeight = windowHeight - height - headerHeight;

          // Set the spacer height to fill the remaining space
          setSpacerHeight(Math.max(calculatedSpacerHeight, 0));
        });
      }, 300);
    }
  }, [windowHeight]);

  useEffect(() => {
    loadActivities();
  }, [date, month, year]);

  const addActivity = () => {
    navigation.navigate("ActivityScreen");
  };

  const loadActivities = async () => {
    try {
      const paddedMonth = month.toString().padStart(2, "0");
      let dataFromat = `${year}-${paddedMonth}-${date}`;
      const result: any = await fetchActivitiesByDateMonth(dataFromat);
      setActivity(result);
      setLoading(false);
      dataFromat = "";
    } catch (error) {
      console.error("Error fetching activities:", error);
      setLoading(false);
    }
  };

  const Card: React.FC<CardProps> = ({ id, title, time }) => {
    const timeData = new Date(time);
    return (
      <View style={[styles.card]}>
        <View style={styles.cardContent}>
          <View style={styles.leftSection}>
            <Text style={[styles.title]}>{title}</Text>
          </View>

          <Text style={styles.timeText}>
            {timeData
              .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              .replace(":", " : ")}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      >
        <View
          ref={contentRef}
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            setContentHeight(height);
          }}
        >
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">ปฏิทิน</ThemedText>
            <ThemedText type="title">
              {monthNamesThai[currentMonth]} {parseInt(currentYear+543)}
            </ThemedText>
          </ThemedView>
        </View>
        <ThemedView style={styles.calendarContainer}>
          {activity.length > 0 ? (
            (activity as ActivityItem[]).map((item, index) => (
              <Card
                key={item.activity_id}
                id={item.activity_id}
                title={item.activity_name}
                time={item.datetime}
              />
            ))
          ) : (
            <View style={styles.centeredContainer}>
              <Text style={styles.fadedText}>ไม่มีการแจ้งเตือน</Text>
            </View>
          )}
          <ThemedText>{/* sadsad */}</ThemedText>
        </ThemedView>
        <View style={{ height: spacerHeight }} />
        {/* <View style={{ height: spacerHeight }} /> */}
      </ParallaxScrollView>
      <TouchableOpacity style={styles.fab} onPress={addActivity}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  fadedText: {
    opacity: 0.5,
    color: "black",
    fontSize: 18,
  },
  container: {
    flex: 1,
    position: "relative",
  },
  titleContainer: {
    flexDirection: "column",
    marginBottom: 16,
    backgroundColor: "#FFFAF2",
    marginTop: 20,
  },

  calendarContainer: {
    flex: 1,
    // justifyContent: "center",
    marginTop: 10,
    alignItems: "center",
    backgroundColor: "#FFFAF2",
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 8,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 250,
    backgroundColor: "#FFFAF2",
  },
  dayContainer: {
    width: 45,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#D2A77F",
    marginHorizontal: 3,
    flexDirection: "column",
  },
  dayAbbr: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  highlighted: {
    backgroundColor: "#5A6B52",
  },
  highlightedText: {
    color: "white",
  },
  fade: {
    backgroundColor: "#D6E4E5",
    color: "white",
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  fab: {
    position: "absolute",
    width: 60,
    height: 60,
    backgroundColor: "#6B6B4E",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    bottom: 20,
    right: 20,
  },
  card: {
    width: 350,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardDone: {
    backgroundColor: "#ddd",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: "#333",
  },
  titleDone: {
    textDecorationLine: "line-through",
    color: "#222",
  },
  timeText: {
    fontSize: 14,
    color: "#333",
    marginHorizontal: 10,
  },
});
