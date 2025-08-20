import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import axios from 'axios';

const Absentlist = ({ route, navigation }) => {
  // Destructure all parameters from route.params
  const {
  absentRecords = [], 
  onDutyRecords = [],
  presentRecords = [],
  info = {},
  dayor = {},
  curhour,
  regno,
  stream = '', // ✅ Add this
} = route.params || {};


  // console.log('Staff ID:', info.staffId);
  // console.log('Absent Records:', absentRecords);
  // console.log('On Duty Records:', onDutyRecords);  // Log the onDutyRecords
  // console.log('Present Records:', presentRecords);
  // console.log('Day Order:', dayor);
  // console.log('Current Hour:', curhour);
  // console.log('Present:--------', regno);

  // Handle the confirm button click
const handleConfirm = async () => {
  const Asb_rollList = absentRecords.join(',').trim();
  const onDutyList = onDutyRecords.join(',').trim();
  const presentList = presentRecords.join(',').trim();
  const dayOrder = dayor.dayOrder || 'Not Available';
  const hour = curhour.hour || 'Not Available';
  const fid = info.staffId;
  const attendance = '';
  const date = new Date().toISOString().split('T')[0];


  const url = `https://facultyerp.hcctrichy.ac.in/APITEST/faculty_records_test.jsp?Asb_List=${encodeURIComponent(Asb_rollList)}&onDutyList=${encodeURIComponent(onDutyList)}&dayOrder=${encodeURIComponent(dayor)}&hour=${encodeURIComponent(curhour)}&fid=${encodeURIComponent(fid)}&attendance=${encodeURIComponent(attendance)}&date=${encodeURIComponent(date)}&Present=${encodeURIComponent(regno)}&stream=${encodeURIComponent(stream)}`;

    //console.log("----url---", url);

    

    try {
      const response = await axios.get(url);
      //console.log('Response:--------', response);
      //console.log('Response data:--------', response.data);
  
      if (response.data.data === 'Updated' || response.data.data === 'Added') {
        Alert.alert(
          'Records confirmed!',
          'Data successfully posted',
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate back to the StaffCode page after confirmation
                navigation.navigate('HCC Trichy');
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to confirm records. Please try again later.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred while posting the data.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          source={require('../assets/hccimg.png')}
          style={styles.profileImage}
        />
        <Text style={styles.nameText}>{info.sname || 'No Name Provided'}</Text>
        <Text style={styles.nameText}>{info.staffId || 'No Name Provided'}</Text>
        <Text style={styles.dayOrderText}>
          {dayor ? `Day Order: ${dayor}` : 'Day Order: Not available'}
        </Text>
        <Text style={styles.dayOrderText}>
          {curhour ? `Current Hour: ${curhour}` : 'Current Hour: Not available'}
        </Text>
      </View>

      {/* Absent Records Section */}
      <Text style={styles.title}>Absent Records</Text>
      {absentRecords.length > 0 ? (
        <View style={styles.tableContainer}>
          {absentRecords.map((regNum, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.regNumText}>{regNum}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.noDataText}>No students were marked absent.</Text>
      )}

      {/* On Duty Records Section */}
      <Text style={styles.title}>On Duty Records</Text>
      {onDutyRecords.length > 0 ? (
        <View style={styles.tableContainer}>
          {onDutyRecords.map((regNum, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.regNumText}>{regNum}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.noDataText}>No students were marked on duty.</Text>
      )}

      {/* Confirm Button */}
      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.confirmButtonText}>Confirm</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF', // Changed to white background
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#F5F5F5', // Light gray for header background
  },
  profileImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A8A', // Darker blue for text
    textAlign: 'center',
    marginBottom: 5,
  },
  dayOrderText: {
    fontSize: 16,
    color: '#FFFFFF',
    backgroundColor: '#2563EB', // Brighter blue for day order
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    textAlign: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#15803D', // Green for titles
    textAlign: 'center',
    marginVertical: 20,
  },
  tableContainer: {
    backgroundColor: '#F5F5F5', // Light gray for table background
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB', // Light gray border
  },
  tableRow: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#D1D5DB',
  },
  regNumText: {
    fontSize: 18,
    color: '#1E3A8A', // Darker blue for text
    textAlign: 'center',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#EF4444', // Red for no data text
  },
  confirmButton: {
    backgroundColor: '#2563EB', // Brighter blue for button
    paddingVertical: 15,
    borderRadius: 30,
    width: '60%',
    alignSelf: 'center',
    marginTop: 30,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    textAlign: 'center',
  },
});

export default Absentlist;
