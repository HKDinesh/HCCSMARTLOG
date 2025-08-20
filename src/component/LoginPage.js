import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, SafeAreaView, Image, Dimensions, TouchableOpacity, Animated } from 'react-native';
import axios from 'axios';
import { BackHandler } from 'react-native';

const { width, height } = Dimensions.get('window');

const LoginPage = ({ navigation }) => {
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  const logoOpacity = useState(new Animated.Value(0))[0];
  const logoBounce = useState(new Animated.Value(0))[0];
  const textOpacity = useState(new Animated.Value(0))[0];
  const textTranslateY = useState(new Animated.Value(20))[0];
  const formOpacity = useState(new Animated.Value(0))[0];
  const formTranslateY = useState(new Animated.Value(50))[0];

  useEffect(() => {
    const onBackPress = () => {
      BackHandler.exitApp();
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    // Splash animation: logo fades in with bounce, text slides up with fade
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(logoBounce, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 800,
          delay: 600,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 800,
          delay: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    const timer = setTimeout(() => {
      setShowSplash(false);
      Animated.parallel([
        Animated.timing(formOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(formTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }, 2000);

    return () => {
      clearTimeout(timer);
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, [logoOpacity, logoBounce, textOpacity, textTranslateY, formOpacity, formTranslateY]);

  const handleExit = () => {
    BackHandler.exitApp();
  };

  const handleLogin = async () => {
    if (!staffId || !password) {
      Alert.alert('Error', 'Please enter both Staff ID and Password.');
      return;
    }

    setIsLoading(true);

    try {
      const url = `https://facultyerp.hcctrichy.ac.in/APITEST/faculty_verification_test.jsp?staffId=${encodeURIComponent(staffId)}&pass=${encodeURIComponent(password)}`;
      const response = await axios.get(url);

      if (response.data.data === 'success') {
        navigation.navigate('StaffUser', {
          info: response.data.info,
          dayor: response.data.dayor || 'No Day Order',
          facttt: response.data.facttt,
          curhour: response.data.curhour || 'No Current Hour',
          stream: response.data.stream,
          staffList: response.data.staffList,
        });
      } else {
        Alert.alert('Login Failed', 'Invalid Staff ID or Password.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Error', error.response ? error.response.data : 'Network error');
    } finally {
      setIsLoading(false);
    }
  };

  if (showSplash) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.splashContainer}>
          <Animated.Image
            source={require('../assets/hccimg.png')}
            style={[
              styles.logo,
              {
                opacity: logoOpacity,
                transform: [{ scale: logoBounce }],
              },
            ]}
            resizeMode="contain"
          />
          <Animated.Text
            style={[
              styles.splashText,
              {
                opacity: textOpacity,
                transform: [{ translateY: textTranslateY }],
              },
            ]}
          >
            HCC SMARTLOG
          </Animated.Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <TouchableOpacity style={styles.exitButton} onPress={handleExit}>
          <Text style={styles.exitText}>Exit</Text>
        </TouchableOpacity>

        <Animated.View style={[styles.formContainer, { opacity: formOpacity, transform: [{ translateY: formTranslateY }] }]}>
          <Image
            source={require('../assets/hccimg.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.heading}>HCC SMARTLOG</Text>
          <Text style={styles.subHeading}>Staff Login</Text>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Staff ID"
              placeholderTextColor="#6B7280"
              value={staffId}
              onChangeText={setStaffId}
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#6B7280"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Logging In...' : 'Login'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>© HCC-ERP All Rights Reserved.</Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // White background
  },
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.4,
    height: 100,
    marginBottom: 20,
  },
  splashText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1E90FF', // Dark blue text to contrast with white background
    letterSpacing: 1.5,
    fontFamily: 'System',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 30,
    width: width * 0.9,
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    alignItems: 'center',
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E90FF',
    marginBottom: 8,
    letterSpacing: 1,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 30,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 15,
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  loginButton: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    backgroundColor: '#1E90FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  exitButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  exitText: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '600',
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default LoginPage;