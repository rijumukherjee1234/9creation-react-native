import { View, Text, StyleSheet,Animated,TextInput,TouchableOpacity} from 'react-native'
import React, { useRef, useState,useEffect} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios"
import { API_ENDPOINTS } from '../Src/apicall';

import { useNavigation } from '@react-navigation/native';
const ChangePassword = () => {
  const navigation = useNavigation();
  const usernameAnimated = useRef(new Animated.Value(0)).current;
  const passwordAnimated = useRef(new Animated.Value(0)).current;
  const [showPassword, setShowPassword] = useState(false);
  const [showoldPassword, setShowoldPassword] = useState(false);
  const [oldpassword, setoldpassword] = useState('');
  const [newpassword, setnewPassword] = useState('');

 
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
  const HandleSave = async () => {
    if (!oldpassword || !newpassword) {
      alert("Please enter both old and new passwords.");
      return;
    }
    let id = await AsyncStorage.getItem('userInfo');
    if (id) {
      id = JSON.parse(id); // Parse the JSON string into an object
      console.log(id.UserId, "id");
    } else {
      console.log("No user info found");
    }
 
  
    try {
      // Retrieve token from AsyncStorage
      const token = await AsyncStorage.getItem("permit");
  
      if (!token) {
        alert("Unauthorized! Please log in again.");
        return;
      }
  
      const response = await axios.post(
        API_ENDPOINTS.Update_password,
        {INFO: {
          ITEM: "SUB_CONTRACTOR_CHANGE_PASSWORD",
          SUB_CONTRACTOR_SYS_ID:id.UserId,
          OLD_PASSWORD: oldpassword,
          NEW_PASSWORD: newpassword
      }
    },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
            "Content-Type": "application/json",  
          },
        }
      );
  
      console.log("Response Data:", response.data);
  
      if (response.data.status === "true") {
        alert("Password updated successfully!");
        navigation.navigate('Home');
     AsyncStorage.getItem('permit');
        
        AsyncStorage.removeItem("permit");
  
       
       
      } else {
        alert(response.data.response );
      }
    } catch (error) {
      console.error("Error updating password:", error);
  
      // Log and show the actual error from the server
      alert(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };
  
  
  return (
    <View style={Styles.main}>
      <View style={Styles.changepasstxt}>
      <Text style={{fontSize:responsiveFontSize(2),color:'#000'}}>ChangePassword</Text>
      </View>
      <View style={{marginTop:responsiveHeight(5)}}> 
      <Animated.Text
          style={[Styles.InputLabel, { transform: [{ translateY: translateY(usernameAnimated) }] }]}
        >
          Old Password
        </Animated.Text>
        <TextInput
          style={Styles.InputStyle}
          value={oldpassword}
          onChangeText={setoldpassword}
          onFocus={() => handleFocus(usernameAnimated)}
          onBlur={() => handleBlur(usernameAnimated)}
          secureTextEntry={!showoldPassword}
        />
         <TouchableOpacity onPress={() => setShowoldPassword(!showoldPassword)} style={Styles.eyeIcon}>
          <Icon name={showoldPassword ? "visibility" : "visibility-off"} size={25} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={Styles.passwordContainer}>
        <Animated.Text
          style={[Styles.InputLabel, { transform: [{ translateY: translateY(passwordAnimated) }] }]}
        >
           New Password
        </Animated.Text>
        <TextInput
          value={newpassword}
          onChangeText={setnewPassword}
          style={Styles.InputStyle}
          secureTextEntry={!showPassword}
          onFocus={() => handleFocus(passwordAnimated)}
          onBlur={() => handleBlur(passwordAnimated)}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={Styles.eyeIcon}>
          <Icon name={showPassword ? "visibility" : "visibility-off"} size={25} color="#000" />
        </TouchableOpacity>
      </View>
      <View>
          <TouchableOpacity style={Styles.button} onPress={HandleSave}>
                  <Text style={Styles.buttonText}>Save</Text>
                </TouchableOpacity>
      </View>
    </View>
  )
}

export default ChangePassword
const Styles = StyleSheet.create({
  main:{
marginTop:responsiveHeight(4)
  },
  changepasstxt:{
    width:responsiveWidth(100),
    backgroundColor:'#e8ebe9',
    marginTop: responsiveHeight(1),
    paddingLeft:responsiveWidth(9),
    height:responsiveHeight(5),
    paddingTop:responsiveHeight(1)
  },
  InputLabel: {
    position: 'absolute',
    left: responsiveWidth(3),
    color: '#000',
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
    backgroundColor: '#0099ff'
  },
  buttonText: {
    fontSize: responsiveFontSize(3),
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
})