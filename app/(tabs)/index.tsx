import {
  Image,
  StyleSheet,
  Platform,
  View,
  Text,
  ScrollView,
  useWindowDimensions,
  FlatList 
} from "react-native";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { TouchableOpacity } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState, useRef, useCallback } from "react";
import { MaterialIcons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import { startOfWeek, addDays, isToday, format } from 'date-fns';
import { th } from 'date-fns/locale';
import {
  createTable,
  insertExampleActivity,
  fetchActivities,
  deleteActivity
} from "../database/database";
export default function HomeScreen() {
  const navigation = useNavigation();
  const [urgent, setUrgent] = useState([]);
  const [done, setDone] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const { height: windowHeight } = useWindowDimensions();
  const [contentHeight, setContentHeight] = useState(0);
  const [spacerHeight, setSpacerHeight] = useState(0);
  const contentRef = useRef<View | null>(null);
  const dayLabels = ["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"];
  interface CardProps {
    id: string;
    title: string;
    time: string;
    done: boolean;
    setDone: (done: boolean) => void;
    onEdit: () => void;
    onDelete: () => void;
  }
  interface ActivityItem {
    activity_id: string;
    activity_name: string;
    datetime: string;
  }
  const [activity, setActivity] = useState<ActivityItem[]>([]);

    const today = new Date();
    const startWeek = startOfWeek(today, { weekStartsOn: 1 }); 
  
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = addDays(startWeek, i);
      return {
        label: dayLabels[i],
        date: date.getDate(),
        highlight: isToday(date),
      };
    });
  
  const addActivity = () => {
    navigation.navigate("ActivityScreen");
  };

  const updateActivity = (id: string) => {
    console.log('id:', id);
    navigation.navigate("ActivityScreen", { id: id });
  };

  useEffect(() => {
    createTable();
    if (contentRef.current) {
      contentRef.current.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
        const headerHeight = 100; // Adjust this based on your header height
        const calculatedSpacerHeight = windowHeight - height - headerHeight;
        setSpacerHeight(Math.max(calculatedSpacerHeight, 0));
      });
    }
  }, [windowHeight]);

  useFocusEffect(
    useCallback(() => {
      loadActivities();
    }, [])  
  );

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log("Notification received:", notification);
    });
  
    return () => {
      // ทำการ unsubscribe เมื่อ component ถูก unmount
      subscription.remove();
    };
  }, []);

useEffect(() => {
  const requestNotificationPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== 'granted') {
        console.log('Permission to receive notifications denied');
        return;
      }
    }

   
    Notifications.scheduleNotificationAsync({
      content: {
        title: "📢 แจ้งเตือน",
        body: "มีกิจกรรมวันนี้!",
      },
      trigger: null, 
    });
    console.log("การแจ้งเตือนถูกส่ง");
  };

  requestNotificationPermission();
}, []);

  

  const loadActivities = async () => {
    try {
      // สำหรับ expo-sqlite เวอร์ชัน 15+
      const result:any = await fetchActivities();
      setActivity(result);
      setLoading(false);
      console.log('activity',  activity)
    } catch (error) {
      console.error('Error fetching activities:', error);
      setLoading(false);
    }
  };

  const deleteActivities = async (id: any) => {
    try {
      await deleteActivity(id);
      await loadActivities()
    } catch (error) {
      console.error('Error fetching activities:', error);
      setLoading(false);
    }
  };


  const formatThaiDate = (date: Date) => {
    const formatted = format(date, 'd MMMM yyyy', { locale: th });
    const yearBE = date.getFullYear() + 543;
    return formatted.replace(`${date.getFullYear()}`, `${yearBE}`);
  };
  
  const Card: React.FC<CardProps> = ({ id, title, time, done, setDone, onEdit, onDelete }) => {
    const timeData = new Date(time);
    return (
      <View style={[styles.card, done && styles.cardDone]}>
        <View style={styles.cardContent}>
          <View style={styles.leftSection}>
            <TouchableOpacity
              style={[styles.checkbox, done && styles.checkboxDone]}
              onPress={() => setDone(!done)}
            >
              {done && <Text style={styles.checkmark}>✔️</Text>}
            </TouchableOpacity>
            <Text style={[styles.title, done && styles.titleDone]}>{title}</Text>
          </View>
  
          <Text style={styles.timeText}>
            {timeData
              .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              .replace(':', ' : ')}
          </Text>
  
          <View style={styles.iconGroup}>
            <TouchableOpacity onPress={onEdit}>
              <MaterialIcons name="edit" size={20} color="#555" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete} style={{ marginLeft: 10 }}>
              <MaterialIcons name="delete" size={20} color="#b00020" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
 
  return (
    <View style={styles.container}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
        headerImage={
          <Image
            source={require("@/assets/images/partial-react-logo.png")}
            style={styles.reactLogo}
          />
        }
      >
        <View
          ref={contentRef}
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            setContentHeight(height);
          }}
        >
          <ThemedView style={styles.topContainer}>
            <ThemedText type="title">{formatThaiDate(new Date())}</ThemedText>
          </ThemedView>

          <ThemedView style={styles.titleContainer}>
            {days.map((day, index) => (
              <View
                key={index}
                style={[
                  styles.dayContainer,
                  day.highlight && styles.highlighted,
                ]}
              >
                <Text
                  style={[
                    styles.dayLabel,
                    day.highlight && styles.highlightedText,
                  ]}
                >
                  {day.label}
                </Text>
                <Text
                  style={[
                    styles.dayNumber,
                    day.highlight && styles.highlightedText,
                  ]}
                >
                  {day.date}
                </Text>
              </View>
            ))}
          </ThemedView>

    
        </View>
        
        <ThemedText type="subtitle">กิจกรรม</ThemedText>

        <View style={styles.centeredContainer}>

        {loading ? (
          <Text>กำลังโหลด...</Text>
        ) : activity.length > 0 ? (
          (activity as ActivityItem[]).map((item, index) => (
            <Card
              key={index}
              id={item.activity_id}
              title={item.activity_name}
              time={item.datetime}
              done={!!done}
              setDone={setDone}
              onEdit={() => updateActivity(item.activity_id)}
              onDelete={() => deleteActivities(item.activity_id)}
            />
          ))
        ) : (
          <Text style={styles.fadedText}>ไม่มีการแจ้งเตือน</Text>
        )}
      </View>
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
    position: "relative",
    backgroundColor: "#FFFAF2",
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 30,
    backgroundColor: "#FFFAF2",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FFFAF2",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fffcf4",
  },
  stepContainer: {
    backgroundColor: "#FFFAF2",
    flexGrow: 1,
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
  },
  fabSpacer: {
    height: 80,
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
  fadedText: {
    opacity: 0.5,
    color: "black",
    fontSize: 18,
  },

  card: {
    width: 350,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardDone: {
    backgroundColor: '#ddd', // เทาอ่อนเมื่อเสร็จ
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#888',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  
  checkboxDone: {
    backgroundColor: '#ddd',
    borderColor: 'back',
  },
  
  checkmark: {
    fontSize: 16,
    color: '#2e7d32', // สีเขียวเข้ม
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  title: {
    fontSize: 16,
    color: '#333',
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: '#222',
  },
  timeText: {
    fontSize: 14,
    color: '#333',
    marginHorizontal: 10,
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
