import { View, Text,StyleSheet, TouchableOpacity,Image } from 'react-native'
import {React,useEffect,useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { responsiveFontSize, responsiveHeight, responsiveScreenWidth, responsiveWidth } from 'react-native-responsive-dimensions';
import { useNavigation } from '@react-navigation/native';

const Header2 = () => {
    const navigation = useNavigation();
    const [name,setFirstname]=useState('')
useEffect(()=>{
  const getLocalData = async ()=>{
    const getData = await AsyncStorage.getItem("userInfo");
    if(getData){
      getFirstName = JSON.parse(getData); // Parse the JSON string into an object
      console.log(getFirstName, "id");
      setFirstname(getFirstName.CompanyName)
      // console.log();
      
    }

  }
  getLocalData()
})
    // const HandlePress= ()=>{
    //     navigation.navigate('AssetDetailsTwo');
    //        }
    const handleprees = ()=>{
navigation.navigate('Profilepage')
    }
  return (
    <View style={{marginTop:responsiveHeight(-1)}}>
        <View style={styles.container}>
          <View style={{flexDirection:'row',marginTop:responsiveHeight(2)}}>
             <TouchableOpacity onPress={() => navigation.goBack()}>
         <MaterialCommunityIcons name="less-than" size={25} color="green" style={styles.iconstyle}/>
         </TouchableOpacity>
         <Text style={styles.headertext}>Welcome {name}</Text>
         </View>
         <TouchableOpacity onPress={handleprees}>
          <View style={styles.boxView}>
          <Image
          source={require("../assets/logo10.jpg")}
          style={{
            width: responsiveWidth(10),
            height: responsiveHeight(5),
            marginTop:responsiveHeight(1.8),
            marginLeft:responsiveWidth(5)
          }}
        />
        
          </View>
          </TouchableOpacity>
          </View>
          <View style={styles.underline}></View>
    </View>
  )
}

export default Header2;
const styles = StyleSheet.create({
  container:{
    flexDirection:'row',
},
boxView:{
  marginLeft:'55%'
  },
text:{
    color:'#fff',fontWeight:'bold',
    textAlign:'center',
    paddingTop:responsiveHeight(1),
    fontSize:responsiveFontSize(2)
},
iconstyle:{
  marginLeft:responsiveWidth(1),
  marginTop:responsiveHeight(1.7)
},
underline:{
  borderBottomWidth:1,
  borderColor:'#ababab',
  width:'auto',
  marginTop:responsiveHeight(2)
},
headertext:{
  marginTop:responsiveHeight(1.8),
  marginLeft:responsiveWidth(1),
  fontWeight:'600',
  fontSize:responsiveFontSize(1.8)
  }
})