import React, { useRef, useState,useEffect} from 'react';
import { View, Text, StyleSheet, TextInput, Animated, TouchableOpacity,Image } from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icon from "react-native-vector-icons/MaterialIcons";
// import { useNavigation } from 'expo-router';
import axios from "axios";
  import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';

const Login = () => {
  const usernameAnimated = useRef(new Animated.Value(0)).current;
  const passwordAnimated = useRef(new Animated.Value(0)).current;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  const navigation = useNavigation();

  useEffect(() => {
    const checkToken = async () => {
      console.log("useEffect called");  // Track if useEffect runs
      try {
        const token = await AsyncStorage.getItem("permit");
        console.log("Token retrieved:", token);
        if (token) {
          console.log("Token exists, navigating to Dashboard");
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          navigation.navigate('Dashboardpage');
        }
      } catch (error) {
        console.error("Error retrieving token:", error);
      }
    };
  
    checkToken();
  }, []);

  const handleFocus = (animatedValue) => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = (animatedValue) => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const translateY = (animatedValue) => {
    return animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [12, -17],
    });
  };

  const handleLoginPress = async () => {
    if (!username || !password) {
        alert("Please enter both username and password");
        return;
    }

    try {
        const response = await axios.post(
            'https://dev-ninecreationapi.devxportal.com/api/sub-contractor/api-login', {
              USER_NAME: username,
            PASSWORD: password,
        });

        console.log(response, "response");

        if (response.data.status === "true") {
            // Save token and user data using AsyncStorage
            const token = response.data.Token;

            // Store the token and user info in AsyncStorage
            await AsyncStorage.setItem('permit', token);
            await AsyncStorage.setItem('userInfo', JSON.stringify(response.data));
            // await AsyncStorage.setItem('userInfo', JSON.stringify(response.data));

            // navigation.navigate('Terms');
            // Set Authorization header for all axios requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            if(response.data.IsCreated =="0"){
              navigation.navigate('Terms');
            }else{
              navigation.navigate('Dashboardpage');
            }

            // Navigate to Dashboard
           
        } else {
            alert(response.data.response);
        }
    } catch (error) {
        alert("An error occurred: " + error);
    }
};

  return (
    <View style={styles.MainContainer}>
        <Image
          source={require("../assets/logo.jpg")}
          style={{
            width: responsiveWidth(38),
            height: responsiveHeight(18),
            alignSelf: "center",
            marginTop: responsiveHeight(7),
            borderRadius: responsiveWidth(4),
          }}
        />
      
      <View style={{marginTop:responsiveHeight(5)}}> 
        <Animated.Text
          style={[styles.InputLabel, { transform: [{ translateY: translateY(usernameAnimated) }] }]}
        >
          UserName
        </Animated.Text>
        <TextInput
          style={styles.InputStyle}
          value={username}
          onChangeText={setUsername}
          onFocus={() => handleFocus(usernameAnimated)}
          onBlur={() => handleBlur(usernameAnimated)}
        />
      </View>

      <View style={styles.passwordContainer}>
        <Animated.Text
          style={[styles.InputLabel, { transform: [{ translateY: translateY(passwordAnimated) }] }]}
        >
          Password
        </Animated.Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          style={styles.InputStyle}
          secureTextEntry={!showPassword}
          onFocus={() => handleFocus(passwordAnimated)}
          onBlur={() => handleBlur(passwordAnimated)}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
          <Icon name={showPassword ? "visibility" : "visibility-off"} size={25} color="#000" />
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity style={styles.button} onPress={handleLoginPress}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.box}></View>

    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  MainContainer: {
    marginVertical: responsiveHeight(1.5),
  },
 
  InputLabel: {
    position: 'absolute',
    left: responsiveWidth(3),
    color: '#0066ff',
    fontSize: responsiveFontSize(2),
    fontWeight: '600',
    paddingLeft: responsiveWidth(6),
  },
  InputStyle: {
    borderBottomWidth: 1,
    borderColor: '#000',
    marginVertical: responsiveHeight(3.5),
    fontSize: responsiveFontSize(2),
    width: responsiveWidth(90),
    alignSelf: 'center',
    fontWeight: 'bold',
    paddingLeft:responsiveWidth(4)
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: responsiveWidth(8),
    top: responsiveHeight(1.5),
  },
  button: {
    borderWidth: responsiveWidth(0.3),
    borderColor: '#fff',
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1.5),
    width: responsiveWidth(90),
    borderRadius: responsiveWidth(3),
    alignSelf: 'center',
    backgroundColor: '#4d8f91'
  },
  buttonText: {
    fontSize: responsiveFontSize(3),
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  boxstyl:{
    borderWidth:1,
    borderColor:' #4db0bf',
    height:responsiveHeight(10),
    backgroundColor:'#4d8f91',
    marginTop:responsiveHeight(5),
  },
  box:{
    borderWidth: 1,
    borderColor: '#4db0bf',
    height: '100%',
    backgroundColor: '#4d8f91',
    marginTop: 5,
    // Clip-path equivalent workaround
    // overflow: 'hidden',
  }
});
