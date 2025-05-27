import {
  Image,
  StyleSheet,
  Platform,
  View,
  Text,
  ScrollView,
  useWindowDimensions,
  FlatList,
  Alert,
  Modal,
} from "react-native";
import { Vibration, Button } from 'react-native';
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { TouchableOpacity } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState, useRef, useCallback } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import * as Permissions from "expo-permissions";
import { startOfWeek, addDays, isToday, format } from "date-fns";
import { th } from "date-fns/locale";
import * as Notifications from 'expo-notifications';
import {
  createTable,
  insertExampleActivity,
  fetchActivities,
  deleteActivity,
  fetchActivitiesByID,
  fetchActivitiesByDateMonth,
  fetchActivitiesByDateTime,
  updateActivityActive
} from "../database/database";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [urgent, setUrgent] = useState([]);
  const [done, setDone] = useState<boolean>(false);
  const [doneStates, setDoneStates] = useState<{ [id: number]: boolean }>({});
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
    onTick: () => void;
    active: number;
  }
  interface ActivityItem {
    activity_id: string;
    activity_name: string;
    datetime: string;
    active: number;
  }
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [nameDelete, setNameDelete] = useState<string | null>(null);
  const today = new Date();
  const startWeek = startOfWeek(today, { weekStartsOn: 1 });

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startWeek, i);
    return {
      label: dayLabels[i],
      date: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
      highlight: isToday(date),
    };
  });

  const addActivity = () => {
    navigation.navigate("ActivityScreen");
  };

  const updateActivity = (id: string) => {
    console.log("id:", id);
    navigation.navigate("ActivityScreen", { id: id });
  };

  useEffect(() => {
    createTable();
    if (contentRef.current) {
      contentRef.current.measure(
        (
          x: number,
          y: number,
          width: number,
          height: number,
          pageX: number,
          pageY: number
        ) => {
          const headerHeight = 100;
          const calculatedSpacerHeight = windowHeight - height - headerHeight;
          setSpacerHeight(Math.max(calculatedSpacerHeight, 0));
        }
      );
    }
  }, [windowHeight]);

  useFocusEffect(
    useCallback(() => {
      loadActivities();
      requestPermissions()
      scheduleNotification()
    }, [])
  );

      // const requestPermissions = async () => {
      //   const { status } = await Notifications.requestPermissionsAsync();
      //   if (status !== 'granted') {
      //     alert('Permission for notifications not granted');
      //   }
      // };


const scheduleNotification = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
  const result: any[] = await fetchActivitiesByDateTime();
  
  const immediateNotifications = [];
  
  for (const activity of result) {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: activity.notification_sound == 1 ? true : false,
        shouldSetBadge: true,
        vibrationPattern: [] 
      }),
    });
    const activityDate = new Date(activity.datetime);
    const now = new Date();
    const differenceInMs = activityDate.getTime() - now.getTime();
    
    try {
      if (differenceInMs > 0) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'แจ้งเตือน!',
            body: `${activity.activity_name}${activity.show_more == 1 ? '\n' + activity.activity_detail : ''}`,
            sound: activity.notification_sound ? true : false,
            vibrate: [0, 250, 250, 250],
            priority: 'min', 
            data: { activityId: activity.id },
          },
          trigger: activityDate,
        });
        console.log(`📅 ตั้งแจ้งเตือนสำหรับ: ${activity.activity_name} ที่ ${activityDate.toLocaleString()}`);
      } 
      else if (differenceInMs > -60000) {
        immediateNotifications.push({
          title: 'แจ้งเตือน!',
          body: `${activity.activity_name}${activity.show_more == 1 ? '\n' + activity.activity_detail : ''}`,
          sound: activity.notification_sound,
          vibrate: [0, 250, 250, 250],
          activityId: activity.id
        });
      } else {
        console.log(`⏰ ข้ามกิจกรรม: ${activity.activity_name} เพราะเลยเวลาไปแล้ว ${Math.abs(Math.floor(differenceInMs/1000))} วินาที`);
      }
    } catch (error) {
      console.error(`❌ เกิดข้อผิดพลาดในการตั้งแจ้งเตือนสำหรับ: ${activity.activity_name}`, error);
    }
  }
  
  for (const notification of immediateNotifications) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          sound: notification.sound ? true : false,
          vibrate: notification.vibrate ? [0, 250, 250, 250] : null,
          data: { activityId: notification.activityId },
        },
        trigger: null,
      });
      console.log(`🔔 แสดงการแจ้งเตือนทันทีสำหรับ: ${notification.body.split('\n')[0]}`);
    } catch (error) {
      console.error('❌ เกิดข้อผิดพลาดในการแสดงการแจ้งเตือนทันที', error);
    }
  }
};

const requestPermissions = async () =>{
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission not granted!');
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.HIGH,  
      vibrationPattern: [0, 250, 250, 250],
      enableVibrate: true,
    });
  }
}
  const loadActivities = async () => {
    try {
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1;
      const currentDate = today.getDate();
      const paddedMonth = currentMonth.toString().padStart(2, "0");
      let dataFromat = `${currentYear}-${paddedMonth}-${currentDate}`;
      const result: any = await fetchActivitiesByDateMonth(dataFromat);
      setActivity(result);
      const initialDoneStates = {};
      result.forEach(item => {
        initialDoneStates[item.activity_id] = item.active === 0;
      });
      setDoneStates(initialDoneStates);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching activities:", error);
      setLoading(false);
    }
  };

  const deleteActivities = async (id: any) => {
    let dataDelete = await fetchActivitiesByID(id);
    setNameDelete(dataDelete[0].activity_name);
    setDeleteItemId(id);
    setDeleteDialogVisible(true);
  };

  const confirmDelete = async () => {
    if (deleteItemId) {
      await deleteActivity(deleteItemId);
      await loadActivities();
    }
    setDeleteDialogVisible(false);
  };

  const formatThaiDate = (date: Date) => {
    const formatted = format(date, "d MMMM yyyy", { locale: th });
    const yearBE = date.getFullYear() + 543;
    return formatted.replace(`${date.getFullYear()}`,`${yearBE}`);
  };

  const getCalendar = (date: any) => {
    navigation.navigate("CalendarScreen", {
      date: date.date,
      month: date.month + 1,
      year: date.year,
    });
  };

  const Card: React.FC<CardProps> = ({
    id,
    title,
    time,
    done,
    setDone,
    onEdit,
    onDelete,
    onTick,
    active
  }) => {
    const timeData = new Date(time);
    return (
      <View style={[styles.card, done && styles.cardDone]}>
        <View style={styles.cardContent}>
        <View style={styles.leftSection}>
          <TouchableOpacity
            style={[styles.checkbox, done && styles.checkboxDone]}
            onPress={() => { setDone(!done); }}
          >
            {done && <Text style={styles.checkmark}>✔️</Text>}
          </TouchableOpacity>

          <Text style={[styles.title, done && styles.titleDone]}>
            {title}
          </Text>
        </View>



          <Text style={styles.timeText}>
            {timeData
              .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              .replace(":", " : ")}
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
            <ThemedText type="title" style={styles.titleText}>{formatThaiDate(new Date())}</ThemedText>
          </ThemedView>

          <ThemedView style={styles.titleContainer}>
            {days.map((day, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => getCalendar(day)}
                style={[
                  styles.dayContainer,
                  day.highlight && styles.highlighted,
                ]}
              >
                {/* {day.highlight && <View style={styles.innerHighlight} />} */}
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
                    day.highlight &&
                      styles.highlightedText &&
                      styles.dayNumberHighlighted,
                  ]}
                >
                  {day.date}
                </Text>
              </TouchableOpacity>
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
               key={item.activity_id}
              id={item.activity_id}
              title={item.activity_name}
              time={item.datetime}
              done={!!doneStates[item.activity_id]}
              setDone={(newDone) => {
                setDoneStates((prev) => ({
                  ...prev,
                  [item.activity_id]: newDone,
                }));

                updateActivityActive({ activity_id: item.activity_id, active: !item.active})
                  .then(() => console.log('อัปเดตสำเร็จ'))
                  .catch(err => console.error('อัปเดตไม่สำเร็จ:', err));
              }}
              onEdit={() => updateActivity(item.activity_id)}
              onDelete={() => deleteActivities(item.activity_id)}
              active={item.active}
            />

            ))
          ) : (
            <View style={styles.centeredNull}>
              <Text style={styles.fadedText}>ไม่มีการกิจกรรม</Text>
            </View>
          )}
        </View>
        <View style={{ height: spacerHeight }} />
      </ParallaxScrollView>

      <TouchableOpacity style={styles.fab} onPress={addActivity}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
      <View>
        <Modal
          transparent={true}
          visible={deleteDialogVisible}
          animationType="fade"
          onRequestClose={() => setDeleteDialogVisible(false)}
        >
          <View style={dialogStyles.overlay}>
            <View style={dialogStyles.dialogContainer}>
              <Text style={dialogStyles.dialogTitle}>คุณต้องการลบกิจกรรม</Text>
              <Text style={dialogStyles.dialogMessage}>"{nameDelete}"</Text>
              <Text style={dialogStyles.dialogMessage}>ใช่หรือไม่</Text>
              <View style={dialogStyles.buttonContainer}>
                <TouchableOpacity
                  style={dialogStyles.confirmButton}
                  onPress={confirmDelete}
                >
                  <Text style={dialogStyles.buttonText}>ใช่</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={dialogStyles.cancelButton}
                  onPress={() => setDeleteDialogVisible(false)}
                >
                  <Text style={dialogStyles.buttonText}>ไม่ใช่</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
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
    gap: 2,
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
    backgroundColor: "#FFFAF2",
  },
  centeredNull: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 250,
    backgroundColor: "#FFFAF2",
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
    backgroundColor: "#6A7463",
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
  dayNumberHighlighted: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    // position: 'absolute',
    padding: 1,
    borderRadius: 18,
    backgroundColor: "#FFFAF2",
    // zIndex: -1,
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
    backgroundColor: "#ddd", // เทาอ่อนเมื่อเสร็จ
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
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#888",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  checkboxDone: {
    backgroundColor: "#ddd",
    borderColor: "back",
  },

  checkmark: {
    fontSize: 16,
    color: "#2e7d32", // สีเขียวเข้ม
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: "#fff",
    borderRadius: 2,
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
  iconGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  innerHighlight: {
    position: "absolute",
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: "#F5F6E8",
    top: 5,
    left: 5,
    zIndex: -1,
  },
  titleText:{
    lineHeight: 35,  
    letterSpacing: -1
  }
});

const dialogStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dialogContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "black",
    textAlign: "center",
  },
  dialogMessage: {
    fontSize: 16,
    marginBottom: 20,
    color: "black",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  confirmButton: {
    backgroundColor: "#E57373",
    padding: 10,
    borderRadius: 5,
    width: "28%",
    alignItems: "center",
    marginLeft: 40,
  },
  cancelButton: {
    backgroundColor: "#424242",
    padding: 10,
    borderRadius: 5,
    width: "28%",
    alignItems: "center",
    marginRight: 40,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },

});
