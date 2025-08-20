import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Alert, Animated, ToastAndroid  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';


const StaffCode = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { info, dayor, facttt, curhour, stream } = route.params || {};
  const [selectedStaff, setSelectedStaff] = useState('');
const [staffList, setStaffList] = useState([]);
useEffect(() => {
  if (route.params?.staffList && Array.isArray(route.params.staffList)) {
    setStaffList(route.params.staffList);
  }
}, [route.params?.staffList]);


  const [currentDateTime, setCurrentDateTime] = useState('');
  const [scaleAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      setCurrentDateTime(`${day}/${month}/${year} ${time}`);
    };
    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);

    // Animate the profile image on load
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    return () => clearInterval(intervalId);
  }, [scaleAnim]);

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'HCC Trichy' }],
    });
  };

  const handleRefresh = () => {
    // Reset states to simulate a full page refresh
    setSelectedStaff('');
    setStaffList(route.params?.staffList && Array.isArray(route.params.staffList) ? route.params.staffList : []);
    ToastAndroid.show('Page refreshed!', ToastAndroid.SHORT);
    // Reset animation
    scaleAnim.setValue(0);
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  if (!info || !facttt || !stream) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.dropdownContainer}>
  <Text style={styles.dropdownLabel}>Select Substitution Staff:</Text>
  <View style={styles.pickerWrapper}>
    <Picker
      selectedValue={selectedStaff}
      onValueChange={(itemValue) => setSelectedStaff(itemValue)}
      style={styles.picker}
    >
      <Picker.Item label="-- Select a Staff Member --" value="" />
      {staffList.map((staff, index) => (
        <Picker.Item
          key={index}
          label={`${staff.staffId} - ${staff.name}`}
          value={staff.staffId}
        />
      ))}
    </Picker>
  </View>
</View>
{selectedStaff !== '' && (
  <TouchableOpacity
    style={styles.confirmButton}
    onPress={() => {
      if (!selectedStaff || facttt.length === 0) {
        Alert.alert('Error', 'Missing staff selection or timetable info.');
        return;
      }

      const classInfo = facttt[0]; // Assuming only one substitution per hour

      fetch('https://facultyerp.hcctrichy.ac.in/APITEST/set_substitution.jsp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `fid=${selectedStaff}&deptcode=${info.deptcode}&papercode=${classInfo.pcode}&acyear=${classInfo.acyear}&degree=${classInfo.degree}&stream=${classInfo.stream}&dayorder=${dayor}&hour=${curhour}&secc=${classInfo.secc}`,
      })
        .then(response => response.json())
        .then(data => {
          if (data.status === 'Added') {
            Alert.alert('Success', 'Substitution recorded successfully.');
          } else {
            Alert.alert('Substituted!', data.message || 'This Staff has already been substituted.');
          }
        })
        .catch(error => {
          Alert.alert('Error', 'Network or server error: ' + error);
        });
    }}
  >
    <Text style={styles.confirmButtonText}>Confirm Substitution</Text>
  </TouchableOpacity>
)}


      <View style={styles.header}>
        <Animated.Image
          source={require('../assets/hccimg.png')}
          style={[styles.profileImage, { transform: [{ scale: scaleAnim }] }]}
        />
        <Text style={styles.nameText}>{info.sname || 'Name not available'}</Text>
        <Text style={styles.staffIdText}>{info.staffId || 'No ID Provided'}</Text>

        <View style={styles.statusContainer}>
          <View style={styles.statusBox}>
            <Text style={styles.statusText}>{dayor ? `Day Order: ${dayor}` : 'Day Order: Not available'}</Text>
          </View>
        </View>
        
          <View style={styles.statusBox}>
            <Text style={styles.statusText}>{curhour ? `Current Hour: ${curhour}` : 'Current Hour: Not available'}</Text>
          </View>
        

        <Text style={styles.dateTimeText}>{currentDateTime}</Text>
      </View>

      {/* The Logout button is now outside the header, placed in the top-right corner */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity
  style={styles.refreshButton}
  onPress={handleRefresh}
>
  <Text style={styles.refreshText}>Refresh</Text>
</TouchableOpacity>

      <View style={styles.itemsContainer}>
  {facttt && facttt.length > 0 && facttt.some(item => item.pname && item.pcode) ? (
    facttt.map((item, index) => (
      <TouchableOpacity
        key={index}
        style={styles.item}
        onPress={() => {
          if (item.pname && item.pcode) {
            navigation.navigate('Student', {
  ...route.params,
  selectedCode: item.pcode,
  regno: item.regno,
});

          } else {
            Alert.alert('No Hour!', `Currently, there are no hours scheduled for ${info.sname}`);
          }
        }}
      >
        <Text style={styles.itemName}>{item.pname}</Text>
        <Text style={styles.itemCode}>{item.pcode}</Text>
      </TouchableOpacity>
    ))
  ) : (
    <TouchableOpacity style={styles.item} activeOpacity={1} onPress={() => {
  Alert.alert('No Hour!', `Currently, there are no hours scheduled for ${info.sname}`);
}}>
  <Text style={[styles.itemName, { color: 'red' }]}>Currently, there are no hours scheduled for {info.sname}.</Text>
</TouchableOpacity>
  )}
</View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingTop: 90, // Added top padding to ensure the content doesn't overlap with the fixed logout button
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20, // Additional margin for spacing between header and logout button
  },
  noHourBox: {
  backgroundColor: '#FEE2E2',
  padding: 15,
  borderRadius: 8,
  borderColor: '#F87171',
  borderWidth: 1,
  alignItems: 'center',
  marginTop: 10,
},
noHourText: {
  color: '#B91C1C',
  fontSize: 16,
  fontWeight: '600',
},

  dropdownContainer: {
  marginBottom: 15,
  paddingHorizontal: 12,
  backgroundColor: '#F3F4F6', // light gray background
  borderRadius: 10,
  paddingVertical: 10,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
},

dropdownLabel: {
  fontSize: 18,
  fontWeight: '600',
  color: '#000000', // vibrant blue
  marginBottom: 2,
  paddingLeft: 5,
},

pickerWrapper: {
  backgroundColor: '#ffffff',
  borderRadius: 12,
  borderWidth: 1,
  borderColor: '#93C5FD', // light blue border
  overflow: 'hidden',
},

picker: {
  height: 50,
  width: '100%',
  color: '#111827', // dark text
  fontSize: 12,
  paddingHorizontal: 10,
},

confirmButton: {
  backgroundColor: 'green',
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 10,
  alignItems: 'center',
  marginTop: 0,
  marginBottom: 10,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 4,
},
confirmButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},


  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  nameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E90FF',
    textAlign: 'center',
  },
  staffIdText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 10,
    width: '100%',
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E90FF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 14,
  },
  dateTimeText: {
    fontSize: 14,
    color: '#fff',
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginTop: 15,
  },
  logoutButton: {
    position: 'absolute',
    top: 30, // Adjusted for a bit of space from the top of the screen
    right: 20,
    backgroundColor: '#FF4B4B',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,

  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemsContainer: {
    marginTop: 10,
  },
  item: {
    backgroundColor: '#fff',
    marginBottom: 15,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16A34A',
  },
  refreshButton: {
  position: 'absolute',
  top: 30,
  right: 120, // Adjust to sit left of Logout
  backgroundColor: '#1E90FF',
  paddingVertical: 8,
  paddingHorizontal: 12,
  borderRadius: 8,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 5,
  elevation: 5,
},
refreshText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},

  itemCode: {
    fontSize: 14,
    color: '#3B82F6',
    marginTop: 5,
  },
});

export default StaffCode;
