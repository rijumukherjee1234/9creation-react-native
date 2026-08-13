import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';
import Header from '../Src/Header';
import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ENDPOINTS } from '../Src/apicall';
import { useNavigation } from '@react-navigation/native';

const Profile = () => {
  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('permit');
        const getData = await AsyncStorage.getItem("userInfo");
        const subid = JSON.parse(getData);

        const response = await axios.get(API_ENDPOINTS.UserProfile_get, {
          headers: { Authorization: `Bearer ${token}` },
          params: { ITEM: 'SPECIFIC', SUB_CONTRACTOR_SYS_ID: subid.UserId },
        });

        if (response.data.status === 'true') {
          
          
          setProfileData(response.data.response[0]);
        } else {
          setError('Failed to load profile data.');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Error loading profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const handleForgot = () => {
    navigation.navigate('ChangePasswordpage');
  };

  const handleLogout = () => {
     AsyncStorage.removeItem("permit");
    navigation.navigate('Home');
  };

  return (
    <ScrollView>
      <Header />
      <View style={styles.headingview}>
        <Text style={styles.headingtxt}>Profile Info</Text>
      </View>
      <View style={styles.fieldContainer}>
        <View style={{ flexDirection: 'row', gap: 20 }}>
          <AntDesign size={20} name='user' style={{ paddingVertical: responsiveHeight(2), paddingLeft: responsiveWidth(4), color: '#000' }} />
          <TextInput style={styles.input22} value={profileData.COMPANY_NAME || ''} editable={false} />
        </View>

        <View style={{ flexDirection: 'row', gap: 20 }}>
          <AntDesign size={20} name='phone' style={{ paddingVertical: responsiveHeight(2), paddingLeft: responsiveWidth(4), color: '#000' }} />
          <TextInput
  style={styles.input}
  value={profileData.PHONE_NO ? profileData.PHONE_NO.toString() : ''}  // Ensuring it is a string
 
  editable={false}
/>

       
        </View>

        <View style={{ flexDirection: 'row', gap: 20 }}>
          <FontAwesome size={20} name='address-card' style={{ paddingVertical: responsiveHeight(2), paddingLeft: responsiveWidth(4), color: '#000' }} />
          <TextInput style={styles.input} value={profileData.ADDRESS || ''} editable={false} placeholder='Address' />
        </View>

        {/* <View style={{ flexDirection: 'row', gap: 20 }}>
          <AntDesign size={20} name='mail' style={{ paddingVertical: responsiveHeight(2), paddingLeft: responsiveWidth(4), color: '#000' }} />
          <TextInput style={styles.input22} value={profileData.EMAIL || ''} editable={false} />
        </View> */}
      </View>
      <View style={{ flexDirection: 'row', gap: 20, alignSelf: 'center' }}>
        <TouchableOpacity style={styles.LogOutbtn} onPress={handleLogout}>
          <Text style={styles.LogOutbtntxt}>Log Out</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.changebtn} onPress={handleForgot}>
          <Text style={styles.changebtntxt}>Change Password</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  headingview: {
    marginLeft: responsiveWidth(5)
  },
  headingtxt: {
    fontSize: responsiveFontSize(3.5),
    marginLeft: responsiveWidth(3),
    marginTop: responsiveHeight(2),
    color: '#000',
  },
  fieldContainer: {
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveHeight(1),
    flexDirection: 'column',
    gap: 20
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#d1d1d1',
    fontSize: responsiveFontSize(2),
    paddingVertical: responsiveHeight(1),
    color: '#000',
    fontWeight: 'bold'
  },
  input22: {
  borderBottomWidth: 1,
    borderColor: '#d1d1d1',
    fontSize: responsiveFontSize(2),
    paddingVertical: responsiveHeight(1),
    color: '#000',
    fontWeight: 'bold'
},
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: responsiveFontSize(2),
  },
  changebtn: {
    borderWidth: responsiveWidth(0.3),
    borderColor: '#fff',
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1.5),
    width: responsiveWidth(45),
    borderRadius: responsiveWidth(3),
    alignSelf: 'center',
    backgroundColor: '#4d8f91'
  },
  changebtntxt: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  LogOutbtn: {
    borderWidth: responsiveWidth(0.3),
    borderColor: '#fff',
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1.5),
    width: responsiveWidth(45),
    borderRadius: responsiveWidth(3),
    alignSelf: 'center',
    backgroundColor: '#ff0000'
  },
  LogOutbtntxt: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  }
});
