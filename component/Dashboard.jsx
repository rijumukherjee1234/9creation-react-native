import { View, Text, Image, StyleSheet, TouchableOpacity,RefreshControl, ScrollView } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Header2 from '../Src/Header';
import { API_ENDPOINTS } from '../Src/apicall';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AssetDetails = () => {
  // const usernameAnimated = useRef(new Animated.Value(0)).current;
  const [getAllTaskList, setgetAllTaskList] = useState(null);
  const [compoundCode, setCompoundCode] = useState('');
  const navigation = useNavigation();
  const [comment, setComment] = useState(''); // State for the comment
  const [assignTask, setassignTask] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mergedProjects, setMergedProjects] = useState([]);
  const [isDataVisible, setIsDataVisible] = useState(false); // State for toggle visibility
      const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAllGetData();
  }, []);
  const fetchAllGetData = async () => {
    setLoading(true);

    try {
      const getData = await AsyncStorage.getItem('userInfo');
      const subid = JSON.parse(getData);
      const token = await AsyncStorage.getItem('permit');
      if (!token) {
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const response = await axios.get(API_ENDPOINTS.subcontractor_task_list, {
        headers: { Authorization: `Bearer ${token}` },
        params: { ITEM: 'SPECIFIC', SUB_CONTRACTOR_SYS_ID: subid.UserId },
      });
      setassignTask(response.data);
      const tasks = response.data;

      // Apply the merge logic to the tasks
      const merged = mergeProjects(tasks);

      setMergedProjects(merged); // Save the merged data to state
    } catch (err) {
      console.error('Error fetching assets:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    console.log("Refreshing started...");
    setRefreshing(true); 
    await fetchAllGetData(); // Call API and let it handle stopping refresh
    console.log("Refreshing should now stop.");
};

  const mergeProjects = (projects) => {
    const merged = {};

    // Filter projects with INVOICE_STATUS as "Pending" and merge them based on PROJECT_NO
    projects
      .filter((project) => project.INVOICE_STATUS === 'Pending')
      .forEach((project) => {
        const projectNo = project.PROJECT_NO;

        if (!merged[projectNo]) {
          // If projectNo is not in merged, add project and initialize SUB_DETAILS array
          merged[projectNo] = { ...project };
          merged[projectNo].SUB_DETAILS = [];
        }

        // Push sub-details of the project to its SUB_DETAILS array
        merged[projectNo].SUB_DETAILS.push(...project.SUB_DETAILS);
      });

    // Convert merged object back to array
    return Object.values(merged);
  };

  const as = (item) => {
    // Filter the specific project
    const selectedProject = assignTask.find(
      (project) => project.PROJECT_NO === item.PROJECT_NO
    );

    if (selectedProject) {
      // Navigate to the next screen with filtered data
      navigation.navigate('VerifiedAssetPage', { projectData: selectedProject });
    } else {
      console.log('No project found with the given PROJECT_NO');
    }
  };

  const handlepressTwo = (item) => {
    // Filter the selected project
    const selectedProject = assignTask.filter(
      (project) => project.PROJECT_NO === item.PROJECT_NO
    );

    console.log('Filtered Project:', selectedProject);

    // If a project is found, update the state
    if (selectedProject) {
      // Navigate to the next screen and pass the selected project
      navigation.navigate('NewVefifiedAssetpage', { projectData: selectedProject });
    } else {
      console.log('No project found with the given PROJECT_NO');
    }
  };

  const handlepressTwoBox = () => {
    navigation.navigate('AssetDetailstwopage');
  };

  const toggleDataVisibility = () => {
    setIsDataVisible(!isDataVisible); // Toggle visibility when clicking "Task Assigned"
  };

  return (
    <ScrollView refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
      <Header2 />
      <View style={styles.Maincounter}>
        <View style={{ flexDirection: 'row', gap: 20, alignSelf: 'center', marginTop: responsiveHeight(-2) }}>
          <TouchableOpacity onPress={toggleDataVisibility}>
            <View style={styles.box1}>
              <Image
                source={require('../assets/homeIcon1.png')}
                style={{
                  width: responsiveWidth(17),
                  height: responsiveHeight(9),
                  alignSelf: 'center',
                  marginTop: responsiveHeight(2.5),
                  borderRadius: responsiveWidth(4),
                }}
              />
              <Text style={styles.txtstyl}>Task Assigned</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handlepressTwoBox}>
            <View style={styles.box2}>
              <Image
                source={require('../assets/homeIcon2.png')}
                style={{
                  width: responsiveWidth(17),
                  height: responsiveHeight(9),
                  alignSelf: 'center',
                  marginTop: responsiveHeight(2.5),
                  borderRadius: responsiveWidth(4),
                }}
              />
              <Text style={styles.txtstyl}>Previous Work Done</Text>
            </View>
          </TouchableOpacity>
        </View>

        {isDataVisible && mergedProjects.length > 0 ? (
          mergedProjects.map((item, index) => (
            <TouchableOpacity onPress={() => handlepressTwo(item)} key={index}>
              <View style={styles.viewmain}>
                <View style={styles.lebelView}>
                  <Text style={styles.lebelHeadingtxtmain}>Project Id : {item.PROJECT_NO || 'N/A'}</Text>
                  <Text style={styles.lebelgtxt}>Status :</Text>
                  <Text style={styles.lebelgtxtside}>{item.PROJECT_STATUS || 'N/A'}</Text>
                </View>
                <View>
                  <View style={styles.lebelView}>
                    <MaterialCommunityIcons name="account" color="#4d8f91" size={20} style={styles.Icon} />
                    <Text style={styles.lebelHeadingtxt}>Designer : {item.INTERIOR_DESIGNER_NAME || 'N/A'}</Text>
                  </View>
                  <View style={styles.lebelView}>
                    <FontAwesome name="calendar" size={20} color="#03031c" style={styles.Icon} />
                    <Text style={styles.lebelHeadingtxt}>Start Date :{item.PROJECT_START_DATE || 'N/A'}</Text>
                  </View>
                  <View style={styles.lebelView}>
                    <Ionicons name="location-sharp" size={20} color="red" style={styles.Icon} />
                    <Text style={styles.lebelHeadingtxtaddress}>{item.CUSTOMER_ADDRESS || 'N/A'}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : isDataVisible ? (
          <Text style={styles.noDataText}>No data found</Text>
        ) : null}
      </View>
    </ScrollView>
  );
};

export default AssetDetails;

const styles = StyleSheet.create({
  Maincounter: {
    marginVertical: responsiveHeight(2),
  },
  viewmain: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#a6a6a6',
    alignSelf: 'center',
    borderRadius: responsiveWidth(1.5),
    padding: responsiveWidth(1),
    height: 'auto',
    width: responsiveWidth(95),
    marginTop: responsiveHeight(1),
    paddingLeft: responsiveWidth(3),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  heading: {
    color: '#000',
    fontWeight: 'bold',
    marginLeft: responsiveWidth(5),
    marginTop: responsiveHeight(4),
    fontSize: responsiveFontSize(2),
  },
  lebelView: {
    paddingTop: responsiveHeight(0.2),
    flexDirection: 'row',
    gap: 3,
  },
  lebelHeadingtxt: {
    fontSize: responsiveFontSize(1.5),
    paddingLeft: responsiveWidth(2),
    color: '#000',
  },
  lebelHeadingtxtaddress: {
    fontSize: responsiveFontSize(1.5),
    paddingLeft: responsiveWidth(1),
    width: responsiveWidth(70),
    color: '#000',
  },
  lebelHeadingtxtmain: {
    fontSize: responsiveFontSize(1.5),
    paddingLeft: responsiveWidth(2),
    color:'#000'
  },
  lebelgtxt: {
    fontSize: responsiveFontSize(1.5),
    paddingLeft: responsiveWidth(15),
    color:'#000'
  },
  box1:{
    borderWidth:1,
    height:responsiveHeight(22),
    width:responsiveWidth(45),
    borderColor:'#c4c4c4',
    alignSelf: 'center',
    borderRadius:responsiveWidth(3),
    marginTop: responsiveHeight(2.5),
  },
  box2:{
    borderWidth:1,
    height:responsiveHeight(22),
    width:responsiveWidth(45),
    borderColor:'#c4c4c4',
    alignSelf: 'center',
    borderRadius:responsiveWidth(3),
    marginTop: responsiveHeight(2.5),
  },
  txtstyl:{
    textAlign:'center',
    color:'#4d8f91',
    paddingTop:responsiveHeight(1),
    fontSize:responsiveFontSize(1.7)
  },
  lebelgtxtside: {
    fontSize: responsiveFontSize(1.5),
    color: '#ff0000',
    width: responsiveWidth(30),
  },
  button: {
    borderWidth: responsiveWidth(0.3),
    borderColor: '#fff',
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1.5),
    width: responsiveWidth(90),
    borderRadius: responsiveWidth(3),
    alignSelf: 'center',
    backgroundColor: '#0066cc',
  },
  buttonText: {
    fontSize: responsiveFontSize(2),
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  noDataText: {
    textAlign: 'center',
    color: '#ff0000',
    fontSize: responsiveFontSize(2),
    marginTop: responsiveHeight(2),
  },
});
