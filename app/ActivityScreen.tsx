import React, { useState } from "react";
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

export default function ActivityScreen() {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [selectedActivityType, setSelectedActivityType] = useState(null);
  const [urgent, setUrgent] = useState(false);
  const [scheduled, setScheduled] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);

  // Activity type options matching the image
  const activityTypes = [
    { id: "exercise", label: "ออกกำลัง", bgColor: "#D6E5C0" },
    { id: "medication", label: "ยา", bgColor: "#FFF0A3" },
    { id: "appointment", label: "พบหมอ", bgColor: "#F9BBCB" },
    { id: "social", label: "สุขภาพ", bgColor: "#FFB775" },
    { id: "other", label: "เรียน", bgColor: "#B5D0D2" },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header with back button and title */}
      <View style={styles.header}>
        <View style={styles.topHeader}>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backText}>{"<"}</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>เพิ่มกิจกรรม</Text>
        </View>
        
        {/* Title input */}
        <View style={styles.titleContainer}>
          {/* <Text style={styles.titleLabel}>เพิ่มหัวข้อ</Text> */}
          <TextInput
            style={styles.titleInput}
            placeholder="เพิ่มหัวข้อ"
            value={title}
            onChangeText={setTitle}
          />
        <Text style={styles.sectionLabel}>รายละเอียด</Text>
        <TextInput
          style={styles.detailsInput}
          placeholder=""
          multiline
          value={details}
          onChangeText={setDetails}
        />
        </View>
      </View>

      {/* Main content */}
      <View style={styles.mainContent}>
        {/* Details input */}


        {/* Activity types */}
        <Text style={styles.sectionLabel}>ประเภทกิจกรรม</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.activityTypesScroll}>
          <View style={styles.activityTypesContainer}>
            {activityTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.activityTypeButton,
                  { backgroundColor: type.bgColor },
                  selectedActivityType === type.id && styles.selectedActivityType,
                ]}
                onPress={() => setSelectedActivityType(type.id)}
              >
                <View style={styles.radioCircle}>
                  {selectedActivityType === type.id && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.activityTypeText}>{type.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Priority and Schedule checkboxes */}
        <View style={styles.checkboxRowTop}>
          <Text style={styles.checkboxLabel}>สำคัญ</Text>
          <TouchableOpacity 
            style={styles.checkbox} 
            onPress={() => setUrgent(!urgent)}
          >
            {urgent && <View style={styles.checkboxInner} />}
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />
        <View style={styles.checkboxRow }>
          <Text style={styles.checkboxLabel}>เร่งด่วน</Text>
          <TouchableOpacity 
            style={styles.checkbox} 
            onPress={() => setScheduled(!scheduled)}
          >
            {scheduled && <View style={styles.checkboxInner} />}
          </TouchableOpacity>
        </View>

        {/* Time and Date */}
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>13 : 30 น.</Text>
          <TouchableOpacity style={styles.timeButton}>
            <Text style={styles.buttonTextSmall}>เวลา</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.timeRow}>
          <Text style={styles.timeText}>01 / 11 / 2567</Text>
          <TouchableOpacity style={styles.timeButton}>
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
            value={notificationEnabled}
            onValueChange={setNotificationEnabled}
            trackColor={{ false: "#D9D9D9", true: "#6D8A6D" }}
            thumbColor={notificationEnabled ? "#FFFFFF" : "#F4F4F4"}
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>การสั่น</Text>
          <Switch 
            value={smsEnabled}
            onValueChange={setSmsEnabled}
            trackColor={{ false: "#D9D9D9", true: "#6D8A6D" }}
            thumbColor={smsEnabled ? "#FFFFFF" : "#F4F4F4"}
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>แสดงข้อมูลเพิ่มเติม</Text>
          <Switch 
            value={emailEnabled}
            onValueChange={setEmailEnabled}
            trackColor={{ false: "#D9D9D9", true: "#6D8A6D" }}
            thumbColor={emailEnabled ? "#FFFFFF" : "#F4F4F4"}
          />
        </View>

        {/* Save button */}
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>บันทึก</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

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