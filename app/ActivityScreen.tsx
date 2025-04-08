import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  StyleSheet,
  Pressable,
} from "react-native";
import { useNavigation, RouteProp } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  createTable,
  insertExampleActivity,
  fetchActivities,
  deleteActivity,
  fetchActivitiesByID,
  updateActivity
} from "./database/database";
import { useLocalSearchParams } from 'expo-router';

type RootStackParamList = {
  ActivityScreen: { id: string };
};

type ActivityScreenRouteProp = RouteProp<RootStackParamList, 'ActivityScreen'>;

interface ActivityScreenProps {
  route: ActivityScreenRouteProp;
}
const ActivityScreen: React.FC<ActivityScreenProps> = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [data, setData] = useState<{
    activity_id: number;
    activity_name: string;
    activity_detail: string;
    activity_type: number;
    importance: boolean;
    urgent: boolean;
    datetime: Date;
    notification_sound: boolean;
    shaking: boolean;
    show_more: boolean;
  }>({
    activity_id: 0,
    activity_name: "", 
    activity_detail: "",
    activity_type: 0,
    importance: false,
    urgent: false,
    datetime: new Date(),
    notification_sound: false,
    shaking: false,
    show_more: false
  });
  useEffect(() => {
    if (id) {
      getDataByID();
    }
  }, [id]);

  const getDataByID = async () => {
    try {
      const activityId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
      const result = await fetchActivitiesByID(activityId);
  
      if (result.length > 0) {
        const raw = result[0];
  
        const transformed = {
          activity_id: raw.activity_id,
          activity_name: raw.activity_name,
          activity_detail: raw.activity_detail,
          activity_type: raw.activity_type,
          importance: raw.importance === 1,
          urgent: raw.urgent === 1,
          datetime: new Date(raw.datetime),
          notification_sound: raw.notification_sound === 1,
          shaking: raw.shaking === 1,
          show_more: raw.show_more === 1,
        };
  
        setData(transformed);
        console.log('Transformed Result:', transformed);
      }
    } catch (error) {
      console.error('Error fetching activity:', error);
    }
  };

  const activityTypes = [
    { id: 1, label: "ออกกำลัง", bgColor: "#D6E5C0" },
    { id: 2, label: "ยา", bgColor: "#FFF0A3" },
    { id: 3, label: "พบหมอ", bgColor: "#F9BBCB" },
    { id: 4, label: "สุขภาพ", bgColor: "#FFB775" },
    { id: 5, label: "เรียน", bgColor: "#B5D0D2" },
  ];

  const handleTimeChange = (event: any, selectedTime: any) => {
    const currentTime = selectedTime || data.datetime;
    setShowTimePicker(false);
    setData({
      ...data,
      datetime: currentTime,
    });
  };

  const handleDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || data.datetime;
    setShowDatePicker(false);
    setData({
      ...data,
      datetime: currentDate,
    });
  };

  const convertToBuddhistYear = (date: Date) => {
    const year = date.getFullYear() + 543;
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const day = date.getDate().toString().padStart(2, '0');
    return `${day} / ${month} / ${year}`;
  };
  
  const handleGoBack = () => {
    navigation.goBack();
  };


  const addActivity = async () => {
    if(!id){
      try {
        // ตรวจสอบว่า datetime เป็นอ็อบเจกต์ Date หรือไม่
        if (data.datetime && !(data.datetime instanceof Date)) {
          data.datetime = new Date(data.datetime); 
        }
    
        const formattedDatetime = (data.datetime as Date).toISOString(); // แปลงแค่ตรงนี้

        await insertExampleActivity({
          ...data,
          datetime: formattedDatetime, 
        });
        navigation.goBack();
      } catch (error) {
        console.error("Error adding activity:", error);
      }
    }else if(id){
      try {
        // ตรวจสอบว่า datetime เป็นอ็อบเจกต์ Date หรือไม่
        if (data.datetime && !(data.datetime instanceof Date)) {
          data.datetime = new Date(data.datetime); 
        }
      
        const formattedDatetime = (data.datetime as Date).toISOString(); // แปลงแค่ตรงนี้

        await updateActivity({
          ...data,
          datetime: formattedDatetime, 
        });
      
        navigation.goBack(); // ⬅️ กลับหน้าก่อนหน้า
      } catch (error) {
        console.error("Error updating activity:", error);
      }      
    }

  };
  


//   const date = new Date('2025-04-06T19:35:00.000Z');

// // แปลงเป็นเวลาไทย (UTC+7)
// const thaiDate = new Date(date.setHours(date.getHours() + 7));

// // แสดงผลวันที่และเวลา
// const convertedDate = convertToBuddhistYear(thaiDate);
// console.log(convertedDate);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header with back button and title */}
      <View style={styles.header}>
        <View style={styles.topHeader}>
          <TouchableOpacity style={styles.backButton}  onPress={handleGoBack}>
            <Text style={styles.backText}>{"<"}</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>{id ? 'แก้ไขกิจกรรม' : 'เพิ่มกิจกรรม'}</Text>
        </View>
        
        <View style={styles.titleContainer}>
          <TextInput
            style={styles.titleInput}
            placeholder="เพิ่มหัวข้อ"
            value={data.activity_name}
            onChangeText={(text) => setData({
              ...data,
              activity_name: text
            })}
          />
        <Text style={styles.sectionLabel}>รายละเอียด</Text>
        <TextInput
          style={styles.detailsInput}
          placeholder=""
          multiline
          value={data.activity_detail}
          onChangeText={(text) => setData({
            ...data,
            activity_detail: text
          })}
        />
        </View>
      </View>

      <View style={styles.mainContent}>
        <Text style={styles.sectionLabel}>ประเภทกิจกรรม</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.activityTypesScroll}>
          <View style={styles.activityTypesContainer}>
            {activityTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.activityTypeButton,
                  { backgroundColor: type.bgColor },
                  data.activity_type === type.id && styles.selectedActivityType,
                ]}
                onPress={() => {
                  setData({
                    ...data,
                    activity_type: type.id
                  })
                }}
              >
                <View style={styles.radioCircle}>
                  {data.activity_type === type.id && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.activityTypeText}>{type.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.checkboxRowTop}>
          <Text style={styles.checkboxLabel}>สำคัญ</Text>
          <TouchableOpacity 
            style={styles.checkbox} 
            onPress={() => setData({
              ...data,
              importance: !data.importance
            })}
          >
            {data.importance && <View style={styles.checkboxInner} />}
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />
        <View style={styles.checkboxRow }>
          <Text style={styles.checkboxLabel}>เร่งด่วน</Text>
          <TouchableOpacity 
            style={styles.checkbox} 
            onPress={() => setData({
              ...data,
              urgent: !data.urgent
            })}
          >
            {data.urgent && <View style={styles.checkboxInner} />}
          </TouchableOpacity>
        </View>

        <View style={styles.timeRow}>
        <Text style={styles.timeText}> {data.datetime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).replace(":", " : ")} น.</Text>
        <TouchableOpacity style={styles.timeButton} onPress={() => setShowTimePicker(true)}>
          <Text style={styles.buttonTextSmall}>เวลา</Text>
        </TouchableOpacity>
      </View>

      {/* เลือกวันที่ */}
      <View style={styles.timeRow}>
        <Text style={styles.timeText}>{convertToBuddhistYear(data.datetime)}</Text>
        <TouchableOpacity style={styles.timeButton} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.buttonTextSmall}>วันที่</Text>
        </TouchableOpacity>
      </View>

        <View style={styles.divider}>
          <Text style={styles.dividerText}>การแจ้งเตือน</Text>
        </View>

        {/* Notification settings */}
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>เสียงแจ้งเตือน</Text>
          <Switch 
            value={data.notification_sound}
            onValueChange={(e) => setData({
              ...data,
              notification_sound: e
            })}
            trackColor={{ false: "#D9D9D9", true: "#6D8A6D" }}
            thumbColor={data.notification_sound ? "#FFFFFF" : "#F4F4F4"}
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>การสั่น</Text>
          <Switch 
            value={data.shaking}
            onValueChange={(e) => setData({
              ...data,
              shaking: e
            })}
            trackColor={{ false: "#D9D9D9", true: "#6D8A6D" }}
            thumbColor={data.shaking ? "#FFFFFF" : "#F4F4F4"}
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>แสดงข้อมูลเพิ่มเติม</Text>
          <Switch 
            value={data.show_more}
            onValueChange={(e) => setData({
              ...data,
              show_more: e
            })}
            trackColor={{ false: "#D9D9D9", true: "#6D8A6D" }}
            thumbColor={data.show_more ? "#FFFFFF" : "#F4F4F4"}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={addActivity}>
          <Text style={styles.saveButtonText}>บันทึก</Text>
        </TouchableOpacity>
      </View>

      {showTimePicker && (
        <DateTimePicker
          value={data.datetime}
          mode="time"
          is24Hour={true}
          onChange={handleTimeChange}
        />
      )}

      {/* แสดง DateTimePicker สำหรับวันที่ */}
      {showDatePicker && (
        <DateTimePicker
          value={data.datetime}
          mode="date"
          onChange={handleDateChange}
        />
      )}
    </ScrollView>
  );
}
export default ActivityScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFFAF2",
    
  },
  header: {
    backgroundColor: "#B5D0D2",
    padding: 20,
    paddingBottom: 30,
  
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    marginTop:20
  },
  backButton: {
    position: "absolute",
    left: 0,
  },
  backText: {
    fontSize: 24,
    fontWeight: "500",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "500",
    textAlign: "center",
  },
  titleContainer: {
    marginTop: 10,
  },
  titleLabel: {
    textAlign: "center",
    marginBottom: 5,
    fontSize: 16,
  },
  titleInput: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 5,
    fontSize: 16,
    textAlign: "center",
  },
  mainContent: {
    padding: 20,
  },
  sectionLabel: {
    fontSize: 16,
    marginBottom: 10,
    marginTop: 15,
  },
  detailsInput: {
    backgroundColor: "#FFFAF2",
    borderRadius: 20,
    padding: 10,
    height: 90,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 15,
  },
  activityTypesScroll: {
    marginBottom: 15,
  },
  activityTypesContainer: {
    flexDirection: "row",
  },
  activityTypeButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },
  selectedActivityType: {
    borderWidth: 1,
    borderColor: "#000",
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginRight: 5,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#000",
  },
  activityTypeText: {
    fontSize: 14,
  },
  checkboxRowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  checkboxRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  checkboxLabel: {
    fontSize: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: "#000",
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: '#F3F6F7',
    padding: 5,
    borderRadius: 20,
  },
  timeText: {
    fontSize: 16,
  },
  timeButton: {
    backgroundColor: "#D9D9D9",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  buttonTextSmall: {
    fontSize: 14,
  },
  dividerTop: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginVertical: 15,
    paddingBottom: 5,
  },
  dividerText: {
    fontSize: 16,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: '#F3F6F7',
    padding: 5,
    borderRadius: 20,
  },
  switchLabel: {
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#6D8A6D",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 15,
    marginBottom: 30,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "500",
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
    width: "100%",
  },
});