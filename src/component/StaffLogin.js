import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Alert, Modal, Animated } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const StaffLogin = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { info, dayor, facttt, selectedCode, regno, curhour, stream } = route.params || {};
  const [selectedStudent, setSelectedStudent] = useState('');
  

  const [attendance, setAttendance] = useState({});
  const [timeLimitReached, setTimeLimitReached] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const [timeOver, setTimeOver] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRegNum, setSelectedRegNum] = useState(null);
  const [buttonScale, setButtonScale] = useState(new Animated.Value(1));

  const timerRef = useRef(null);

  const handleAttendanceChange = (regNum) => {
    setSelectedRegNum(regNum);
    setModalVisible(true);
  };

  const handleAttendanceSelection = (status) => {
    if (timeLimitReached) {
      Alert.alert('Time Limit Exceeded', "Can't mark absentees after the 15-minute limit.");
      return;
    }

    setAttendance((prev) => ({
      ...prev,
      [selectedRegNum]: status,
    }));
    setModalVisible(false);
  };

  const handleRemoveSelection = () => {
    setAttendance((prev) => {
      const updated = { ...prev };
      delete updated[selectedRegNum];
      return updated;
    });
    setModalVisible(false);
  };

  const handleSave = () => {
    if (timeLimitReached) {
      Alert.alert('Time Limit Exceeded', "Can't save absentees after the 15-minute limit.");
      return;
    }

    const absentRecords = Object.entries(attendance)
      .filter(([_, status]) => status === 'Absent')
      .map(([regNum]) => regNum);

    const onDutyRecords = Object.entries(attendance)
      .filter(([_, status]) => status === 'On Duty')
      .map(([regNum]) => regNum);

    const presentRecords = facttt.regno;
    const selectedCourse = filteredData[0];

    navigation.navigate('Absent', {
      info,
      dayor,
      absentRecords,
      onDutyRecords,
      presentRecords,
      curhour,
      regno,
      facttt,
      stream: selectedCourse?.stream || '',
    });
  };

  const filteredData = facttt?.filter((item) => item.pcode === selectedCode) || [];

  const getRegNumbers = (regno) => {
    if (Array.isArray(regno)) return regno;
    if (typeof regno === 'string') return regno.split(',').map((reg) => reg.trim());
    return [];
  };

  // ✅ FIXED: No merge with specialMatchedStudents to avoid duplication
  const getMergedRegNumbers = () => {
    return getRegNumbers(facttt[0]?.regno || '');
  };

  const renderRegNumbersInTwoColumns = (regNumbers) => {
    const half = Math.ceil(regNumbers.length / 2);
    const firstColumn = regNumbers.slice(0, half);
    const secondColumn = regNumbers.slice(half);

    return (
      <View style={styles.twoColumnContainer}>
        <View style={styles.column}>
          {firstColumn.map((regNum, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.attendanceButton,
                attendance[regNum] === 'Absent' ? styles.absent : attendance[regNum] === 'On Duty' ? styles.onDuty : styles.present
              ]}
              onPressIn={() => handleHoverIn()}
              onPressOut={() => handleHoverOut()}
              onPress={() => handleAttendanceChange(regNum)}
            >
              <Text style={styles.buttonText}>{regNum}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.column}>
          {secondColumn.map((regNum, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.attendanceButton,
                attendance[regNum] === 'Absent' ? styles.absent : attendance[regNum] === 'On Duty' ? styles.onDuty : styles.present
              ]}
              onPressIn={() => handleHoverIn()}
              onPressOut={() => handleHoverOut()}
              onPress={() => handleAttendanceChange(regNum)}
            >
              <Text style={styles.buttonText}>{regNum}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const handleHoverIn = () => {
    Animated.spring(buttonScale, {
      toValue: 1.1,
      useNativeDriver: true,
    }).start();
  };

  const handleHoverOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <Image source={require('../assets/hccimg.png')} style={styles.profileImage} />
          <Text style={styles.nameText}>{info?.sname || 'No Name Provided'}</Text>
          <Text style={styles.nameText}>{info.staffId || 'No Name Provided'}</Text>
        </View>
        <Text style={styles.dayOrderText}>
          {dayor ? `Day Order: ${dayor}` : 'Day Order: Not available'}
        </Text>
        <Text style={styles.dayOrderText}>
          {curhour ? `Current Hour: ${curhour}` : 'Current Hour: Not available'}
        </Text>
      </View>

      {/* ✅ Section A Students */}
      {filteredData.length > 0 ? (
        filteredData.map((item, index) => (
          <View key={index} style={styles.courseContainer}>
            <Text style={styles.courseName}>{item.pname || 'Course Name Not Available'}</Text>
            <Text style={styles.courseCode}>{item.pcode}</Text>
            {renderRegNumbersInTwoColumns(getMergedRegNumbers())}
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>No data available for the selected course.</Text>
      )}

      {/* ✅ Section B Students - Special Matched Groups */}
      

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Attendance</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}> {selectedRegNum}</Text>
            <TouchableOpacity
              style={[styles.modalButton, attendance[selectedRegNum] === 'Absent' && styles.absentButton]}
              onPress={() => handleAttendanceSelection('Absent')}
            >
              <Text style={styles.buttonText}>Absent</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, attendance[selectedRegNum] === 'On Duty' && styles.onDutyButton]}
              onPress={() => handleAttendanceSelection('On Duty')}
            >
              <Text style={styles.buttonText}>On Duty</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={handleRemoveSelection}>
              <Text style={styles.buttonText}>Remove</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};


// Styles for modal and other components
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF', // White background
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  specialSection: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#F5F5F5', // Light gray for special section
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  specialHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#F5F5F5', // Light gray header
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  profileImage: {
    width: 80,
    height: 80,
    marginBottom: 12,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  nameText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333', // Darker text for better contrast
  },
  dayOrderText: {
    fontSize: 16,
    color: '#FFFFFF',
    backgroundColor: '#2563EB', // Blue for day order
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 8,
  },
  timerText: {
    fontSize: 16,
    color: '#DC2626', // Red for timer
    fontWeight: '600',
    marginTop: 8,
  },
  courseContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#F5F5F5', // Light gray for course section
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  courseName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#15803D', // Green for course name
    textAlign: 'center',
    marginBottom: 8,
  },
  courseCode: {
    fontSize: 16,
    color: '#2563EB', // Blue for course code
    textAlign: 'center',
    marginBottom: 16,
  },
  twoColumnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    paddingHorizontal: 8,
  },
  attendanceButton: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    width: '100%',
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  absent: {
    backgroundColor: '#FECACA', // Light red for absent
    borderColor: '#EF4444',
  },
  present: {
    backgroundColor: '#DBEAFE', // Light blue for present
    borderColor: '#3B82F6',
  },
  onDuty: {
    backgroundColor: '#BBF7D0', // Light green for on duty
    borderColor: '#22C55E',
  },
  buttonText: {
    color: '#333333', // Darker text for buttons
    fontWeight: '600',
    fontSize: 16,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#DC2626', // Red for no data
    marginTop: 24,
  },
  saveButton: {
    backgroundColor: '#2563EB', // Blue save button
    paddingVertical: 12,
    borderRadius: 12,
    width: '60%',
    alignSelf: 'center',
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#1E40AF',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Slightly lighter overlay
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  modalButton: {
    padding: 12,
    backgroundColor: '#DBEAFE', // Light blue for modal buttons
    borderRadius: 8,
    marginVertical: 8,
    width: '80%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  absentButton: {
    backgroundColor: '#FECACA', // Light red for absent
    borderColor: '#EF4444',
  },
  onDutyButton: {
    backgroundColor: '#BBF7D0', // Light green for on duty
    borderColor: '#22C55E',
  },
});

export default StaffLogin;
