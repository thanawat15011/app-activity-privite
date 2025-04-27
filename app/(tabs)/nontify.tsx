import {
  Image,
  StyleSheet,
  Platform,
  View,
  Text,
  ScrollView,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Calendar } from "react-native-calendars";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  createTable,
  insertExampleActivity,
  fetchActivities,
  deleteActivity,
  fetchActivitiesByID,
  fetchActivitiesByDateMonth,
} from "../database/database";
export default function Nontify() {
  interface ActivityItem {
    activity_id: string;
    activity_name: string;
    activity_detail: string;
    datetime: string;
  }
  interface CardProps {
    id: string;
    title: string;
    detail: string;
    time: string;
    done: boolean;
  }

  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
    useEffect(() => {
      loadActivities();
    }, []);
  
    useFocusEffect(
      useCallback(() => {
        loadActivities();
      }, [])  
    );
  
    const loadActivities = async () => {
      try {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth()+1;
        const currentDate = today.getDate()
        const paddedMonth = currentMonth.toString().padStart(2, "0");
        let dataFromat = `${currentYear}-${paddedMonth}-${currentDate}`;
        const result: any = await fetchActivitiesByDateMonth(dataFromat);
        setActivity(result);
        setLoading(false);
        dataFromat = "";
      } catch (error) {
        console.error("Error fetching activities:", error);
        setLoading(false);
      }
    };

    const Card: React.FC<CardProps> = ({ id, title, detail, time }) => {
      const timeData = new Date(time);
      return (
        <View style={[styles.card]}>
          <View style={styles.cardContent}>
            <View style={styles.leftSection}>
              <Text style={[styles.title]}>{title}</Text>
              <Text style={[styles.detail]}>{detail}</Text>

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
    <ThemedView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      style={styles.container}
    >
      <View style={styles.titleContainer}>
        <Text style={[styles.highlightedText]}>การแจ้งเตือน.</Text>
      </View>
      <ThemedView style={styles.mainContainer}>
        {activity.length > 0 ? (
          (activity as ActivityItem[]).map((item, index) => (
            <Card
              key={item.activity_id}
              id={item.activity_id}
              title={item.activity_name}
              detail={item.activity_detail}
              time={item.datetime}
            />
          ))
        ) : (
          <View style={styles.centeredContainer}>
            <Text style={styles.fadedText}>ไม่มีการแจ้งเตือน</Text>
          </View>
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fadedText: {
    opacity: 0.5,
    color: "black",
    fontSize: 18,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 8,
    color: "white",
    backgroundColor: "#707464",
    height: 130,
    padding: 10,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fffcf4",
  },
  mainContainer: {
    flex: 1,
    // justifyContent: "center",
    marginTop:10,
    alignItems: "center",
    backgroundColor: "#fffcf4",
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
    position: "absolute",
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
    fontSize: 28,
  },

  card: {
    width: 350,
    height:70,
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
    flexDirection: "column",
    // alignItems: "center",
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: "#333",
  },
  detail: {
    fontSize: 14,
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
