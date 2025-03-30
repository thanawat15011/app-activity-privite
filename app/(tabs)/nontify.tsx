import {
    Image,
    StyleSheet,
    Platform,
    View,
    Text,
    ScrollView,
  } from "react-native";
  
  import { HelloWave } from "@/components/HelloWave";
  import ParallaxScrollView from "@/components/ParallaxScrollView";
  import { ThemedText } from "@/components/ThemedText";
  import { ThemedView } from "@/components/ThemedView";
  import { Calendar } from "react-native-calendars";
  
  export default function Nontify() {
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
      <ThemedView
        headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
        style={styles.container}
      >
        <View style={styles.titleContainer}>
          <Text style={[styles.highlightedText]}>การแจ้งเตือน.</Text>
        </View>
        <View style={styles.centeredContainer}>
            <Text style={styles.fadedText}>ไม่มีการแจ้งเตือน</Text>
        </View>
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
      backgroundColor: '#fffcf4'
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
  });
  