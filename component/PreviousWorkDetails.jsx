import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Header from '../Src/Header';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const PreviousWorkDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { projectData } = route.params || {};
  const subDetails = projectData.SUB_DETAILS || [];
  useEffect(() => {
    if (projectData) {
      AsyncStorage.setItem('projectData', JSON.stringify(projectData))
    }
  }, [projectData]);

  const HandlePress =(item)=>{
    // console.log(item.SUB_DETAILS,"item");
    // navigation.navigate('PreviousWorkDetails', { projectData: item.SUB_DETAILS });
    navigation.navigate('ViewInvoicepage');
  }


  return (
    <ScrollView>
      <Header />
      <View style={styles.MainContainer}>
        <Text style={styles.heading}>Project Id :{ projectData.PROJECT_NO}</Text>
               <Text style={styles.heading}>Designer : { projectData.INTERIOR_DESIGNER_NAME}</Text>
               <Text style={styles.heading}>{ projectData.CUSTOMER_ADDRESS}</Text>
               
        <View>
        {subDetails.length > 0 ? (
          subDetails.map((subItem, index) => (
            <View key={index} style={styles.boxmain}>
              <View style={{marginBottom:responsiveHeight(2)}}>
              <Text style={styles.txtone}>
                {subItem.WORK_SUB_CATEGORY_VALUE} ({subItem.LOCATION})
              </Text>
              <Text style={styles.texttwo}>Start Date : {subItem.PROJECT_START_DATE}</Text>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.texttwo}>End Date : {subItem.PROJECT_END_DATE}</Text>
                <Text style={styles.textside}>
                  Status : <Text style={styles.sidetxtvalue}>{subItem.STATUS}</Text>
                </Text>
              </View>
              </View>
            </View>
          ))
        ) : (
          <Text>No Sub Details available</Text>
        )}
</View>

{projectData.PURCHASE_ORDER_SYS_ID == null ? (
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: '#007bff' }]} // "Add Invoice" button style
          onPress={HandlePress}
        >
          <Text style={styles.btntxt}>Add Invoice</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: '#4d8f91' }]} // "View Invoice" button style
          onPress={HandlePress}
        >
          <Text style={styles.btntxt}>View Invoice</Text>
        </TouchableOpacity>
      )}
      </View>
    </ScrollView>
  );
};

export default PreviousWorkDetails;

const styles = StyleSheet.create({
  MainContainer: {
    marginVertical: responsiveHeight(2),
  },
  heading: {
    fontWeight: '500',
    marginLeft: responsiveWidth(4),
    fontSize: responsiveFontSize(1.5),
  },
  boxmain: {
    borderWidth: 1,
    height: 'auto',
    width: responsiveWidth(95),
    borderColor: '#c4c4c4',
    borderRadius: responsiveWidth(2),
    marginTop: responsiveHeight(2),
    marginLeft: responsiveWidth(2.4),
    flexDirection:'column',
    gap:5,

  },
  txtone: {
    color: '#4d8f91',
    fontSize: responsiveFontSize(2),
    fontWeight: '700',
    marginLeft: responsiveWidth(2),
    marginTop: responsiveHeight(1),
  },
  texttwo: {
    color: '#000',
    fontSize: responsiveFontSize(1.5),
    marginLeft: responsiveWidth(2),
  },
  textside: {
    color: '#000',
    fontSize: responsiveFontSize(1.5),
    paddingLeft: responsiveWidth(23),
  },
  sidetxtvalue: {
    color: '#009933',
    fontSize: responsiveFontSize(1.5),
  },
  btn: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: responsiveWidth(40),
    padding: responsiveHeight(1),
    borderRadius: responsiveWidth(3),
    backgroundColor: '#4d8f91',
    marginTop: responsiveHeight(1),
    marginLeft: responsiveWidth(2),
    alignSelf: "center",
  },
  btntxt: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});
