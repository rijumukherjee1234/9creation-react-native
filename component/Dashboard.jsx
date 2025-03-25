import { View, Text,StyleSheet, Image,TouchableOpacity } from 'react-native'
import React from 'react'
import {
    responsiveFontSize,
    responsiveHeight,
    responsiveWidth,
  } from 'react-native-responsive-dimensions'

import Header2 from '../Src/Header2';
import { useNavigation } from '@react-navigation/native';

const Dashboard = () => {

    const navigation = useNavigation();

    const handlepressone = () => {
        navigation.navigate('AssetDetailspage');
       // router.navigate("/NewDash");
     };
     const handlepressTwo = () => {
      navigation.navigate('AssetDetailstwopage');
     // router.navigate("/NewDash");
   };
     
  return (
    <View>
 <Header2/>
      
      <View style={{flexDirection:'row',gap:20,alignSelf:'center'}}>
<TouchableOpacity onPress={handlepressone}>
      <View style={styles.box1}>
       <Image
       source={require('../assets/homeIcon1.png')}
       style={{
        width: responsiveWidth(17),
        height: responsiveHeight(8),
        alignSelf: "center",
        marginTop: responsiveHeight(2.5),
        borderRadius: responsiveWidth(4),
      }}
       />
       <Text style={styles.txtstyl}>Task Assigned</Text>
      </View>
      </TouchableOpacity>

<TouchableOpacity onPress={handlepressTwo}>
      <View style={styles.box2}>
       <Image
       source={require('../assets/homeIcon2.png')}
       style={{
        width: responsiveWidth(17),
        height: responsiveHeight(8),
        alignSelf: "center",
        marginTop: responsiveHeight(2.5),
        borderRadius: responsiveWidth(4),
      }}
       />
       <Text style={styles.txtstyl}>Previous Work Done</Text>
      </View>
      </TouchableOpacity>
      </View>
    </View>
  )
}

export default Dashboard;
const styles = StyleSheet.create({
    MainContainer: {
      marginVertical: responsiveHeight(1.5),
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
        marginTop: responsiveHeight(4),
      },
      buttonText: {
        fontSize: responsiveFontSize(2.5),
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
      },
      box1:{
        borderWidth:1,
        height:responsiveHeight(20),
        width:responsiveWidth(45),
        borderColor:'#c4c4c4',
        alignSelf: 'center',
        borderRadius:responsiveWidth(3),
        marginTop: responsiveHeight(2.5),
      },
      box2:{
        borderWidth:1,
        height:responsiveHeight(20),
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
      }
      
})