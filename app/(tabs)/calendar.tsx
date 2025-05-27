import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  useWindowDimensions,
  ScrollView
} from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, Modal, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState, useRef } from "react";
export default function CalendarScreen() {
  const today = new Date();
  const currentMonth = today.getMonth();
  const navigation = useNavigation();
  const { height: windowHeight } = useWindowDimensions();
  const [contentHeight, setContentHeight] = useState(0);
  const [spacerHeight, setSpacerHeight] = useState(0);
  const contentRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const currentWesternYear = today.getFullYear();
  const currentThaiYear = currentWesternYear + 543;
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentThaiYear);
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

  const firstDayOfMonth = new Date(selectedYear-543, selectedMonth, 1).getDay();

  const lastDateOfMonth = new Date(selectedYear-543, selectedMonth + 1, 0).getDate();

  const lastDateOfPrevMonth = new Date(selectedYear-543, selectedMonth, 0).getDate();
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
    navigation.navigate("ActivityScreen");
  };

  const getCalendar = (date: any) => {
    navigation.navigate("CalendarScreen", {
      date: date.date,
      month: selectedMonth + 1,
      year: selectedYear-543,
    });
  };

  useEffect(() => {
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

  const openMonthYearPicker = () => {
    setModalVisible(true)
  };

  const monthsThai = [
    "ม.ค",
    "ก.พ",
    "มี.ค",
    "เม.ย",
    "พ.ค",
    "มิ.ย",
    "ก.ค",
    "ส.ค",
    "ก.ย",
    "ต.ค",
    "พ.ย",
    "ธ.ค",
  ];

  const MonthYearModal = ({ visible, onClose, onSelect, initialYear }) => {
    const [year, setYear] = useState(initialYear);
    const [showYearDropdown, setShowYearDropdown] = useState(false);
  
    const handleMonthSelect = (monthIndex) => {
      onSelect({ year, month: monthIndex });
      onClose();
    };
  
    const yearList = Array.from({ length: 20 }, (_, i) => 2560 + i);
  
    return (
      <Modal transparent visible={visible} animationType="fade">
        <TouchableOpacity 
          activeOpacity={1} 
          style={styles.overlay} 
          onPress={onClose}
        >
          <TouchableOpacity 
            activeOpacity={1}
            style={styles.modalContent} 
            onPress={(e) => e.stopPropagation()}
          >
            <TouchableOpacity
              style={styles.dropdownHeader}
              onPress={() => setShowYearDropdown(!showYearDropdown)}
            >
              <Text style={styles.dropdownHeaderText}>{year} ▼</Text>
            </TouchableOpacity>
            {showYearDropdown && (
              <View style={styles.dropdownListContainer}>
                <ScrollView style={styles.dropdownList}>
                  {yearList.map((y) => (
                    <TouchableOpacity
                      key={y}
                      style={[
                        styles.dropdownItem,
                        y === year && styles.selectedDropdownItem
                      ]}
                      onPress={() => {
                        setYear(y);
                        setShowYearDropdown(false);
                      }}
                    >
                      <Text 
                        style={[
                          styles.dropdownItemText,
                          y === year && styles.selectedDropdownItemText
                        ]}
                      >
                        {y}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
  
            <View style={styles.monthGrid}>
              {monthsThai.map((m, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => handleMonthSelect(idx)}
                  style={styles.monthItem}
                >
                  <Text style={styles.monthText}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
            <ThemedText type="title" style={styles.titleText}>ปฏิทิน</ThemedText>
            <ThemedText type="title" style={styles.titleText}>
              {monthNamesThai[selectedMonth]} {selectedYear}
              <TouchableOpacity onPress={openMonthYearPicker}>
                <Ionicons style={styles.monthYear}  name="calendar-outline" size={24} color="black" />
              </TouchableOpacity>
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.calendarContainer}>
            {weeks.map((week, weekIndex) => (
              <View key={weekIndex} style={styles.weekRow}>
                {week.map((day, dayIndex) => (
                  <TouchableOpacity
                    key={dayIndex}
                    onPress={() => getCalendar(day)}
                    disabled={
                      day.type === "prev" || day.type === "next" ? true : false
                    }
                    style={[
                      styles.dayContainer,
                      day.highlight && currentMonth == selectedMonth && styles.highlighted,
                      day.type === "prev" || day.type === "next"
                        ? styles.fade
                        : {},
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayAbbr,
                        day.type === "prev" || day.type === "next"
                        ? styles.fade
                        : {},
                        day.highlight && currentMonth == selectedMonth && styles.highlightedText,
                      ]}
                    >
                      {weekDaysShort[(dayIndex + 1) % 7]}
                    </Text>
                    <Text
                      style={[
                        styles.dayNumber,
                        day.type === "prev" || day.type === "next"
                        ? styles.fade
                        : {},
                        day.highlight && currentMonth == selectedMonth && styles.highlightedText,
                      ]}
                    >
                      {day.date}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </ThemedView>
        </View>
        <View style={{ height: spacerHeight }} />
        <View style={{ height: spacerHeight }} />

      </ParallaxScrollView>

      <TouchableOpacity style={styles.fab} onPress={addActivity}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>


      <MonthYearModal
        visible={modalVisible}
        initialYear={selectedYear}
        onClose={() => setModalVisible(false)}
        onSelect={({ year, month }) => {
          setSelectedYear(year);
          setSelectedMonth(month);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
    paddingHorizontal: 10,
    backgroundColor: "#FFFAF2",
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 8,
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


  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fffcf4',
    padding: 15,
    borderRadius: 10,
    width: 280,
    alignItems: 'center',
  },
  dropdownHeader: {
    padding: 8,
    borderRadius: 5,
    width: '50%',
    marginBottom: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dropdownHeaderText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  dropdownListContainer: {
    maxHeight: 200,
    width: '60%',
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    position: 'absolute',
    top: 55,
    zIndex: 1000,
  },
  dropdownList: {
    paddingVertical: 5,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  selectedDropdownItem: {
    backgroundColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  selectedDropdownItemText: {
    fontWeight: 'bold',
    color: '#000',
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  monthItem: {
    width: '25%',
    padding: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '500',
  },
  monthYear: {
    marginLeft: 10
  },
  titleText:{
    lineHeight: 35,  
  }
});
