import { View, Text, StyleSheet, Image, ScrollView,TextInput, Button, TouchableOpacity } from "react-native";
import React, { useState,useRef,useEffect } from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import AsyncStorage from "@react-native-async-storage/async-storage";
 import axios from "axios";
 import { API_ENDPOINTS } from '../Src/apicall';
 import AntDesign from 'react-native-vector-icons/AntDesign';
 import { useNavigation } from '@react-navigation/native';
 import SignatureScreen from "react-native-signature-canvas";
const Terms = () => {
  const [isSignaturePadActive, setSignaturePadActive] = useState(false);
  const [signature, setSignature] = useState(null);
  const[userdata,setuserdata]=useState(null);
  const[SignatureFileName,setSignatureFileName]=useState(null);
  const[SignatureFileUri,setSignatureFileUri]=useState(null);
  const[SignatureFileType,setSignatureFileType]=useState(null);
   const [subname, setsubname] = useState('');
    const [nric,setnric]= useState('');
   const navigation = useNavigation();
   const signatureRef = useRef();
   useEffect(() => {
    // Use .then() for promise handling
    AsyncStorage.getItem("userInfo")
      .then((storedData) => {
        if (storedData) {
          const data = JSON.parse(storedData);
          console.log(data, "subid");
          setuserdata(data)
        } else {
          console.log("No userInfo found in AsyncStorage");
        }
      })
      .catch((error) => {
        console.error("Error reading value from AsyncStorage", error);
      });
  }, []);
   const handlepress=()=>{
    navigation.navigate('Dashboardpage')
   }
   const getMimeTypeFromBase64 = (base64String) => {
    const mimeTypeMatch = base64String.match(/^data:(image\/[a-zA-Z0-9]+);base64,/);
    if (mimeTypeMatch && mimeTypeMatch[1]) {
      return mimeTypeMatch[1];
    }
    return null;  // Return null if MIME type is not found
  };
  
   const handleSignature = (signature) => {
    console.log('Signature Data22:', signature);
    const mimeType = getMimeTypeFromBase64(signature);  // Extract MIME type
    console.log('MIME Type:', mimeType); 
    const signatureData = {
      fileCopyUri: null,  // You can set this if you have a file copy URI available
       // Calculate size of the Base64 string
      name: `signature_${Date.now()}.png`,  // Example name, or you can use a dynamic name
      type: 'image/png',  // MIME type for PNG images
      uri: signature,  // Base64 string will be passed as URI
    };
    setSignatureFileName(signatureData.name)
    setSignatureFileUri(signatureData.uri)
    setSignatureFileType(signatureData.type)
    console.log(signatureData.name,"mrig");
    
  };
  const handleSave = async () => {
    try {
      // Prepare invoice data
      const invoiceData = {
        INFO: {
          ITEM: "E_SIGN",
          SUB_CONTRACTOR_SYS_ID:  userdata.UserId,
          SUB_CONTRACTOR_NAME:subname,
          SUB_CONTRACTOR_SIGN: SignatureFileName, // File reference
          NRIC_NO: nric,
        }
      };
  
      console.log(invoiceData, "invoiceData");
  
      // Send POST request using Axios
      const response = await axios.post(API_ENDPOINTS.Update_password, invoiceData);
      console.log('Dasboard');
      
       uploadFile();
      //  navigation.navigate('Dashboardpage');
    } catch (error) {
    
      console.error("Error during API call:", error);
      alert("An error occurred while saving. Please try again.");
    }
  };
  const uploadFile = async () => {
 
   
  
    
    try {
      const formData = new FormData();
      // const fileName = getfilename || imageURI.split('/').pop();
      console.log("calling22");
 
  
      formData.append('FILE', {
        uri: SignatureFileUri,
        name: SignatureFileName,
        type: SignatureFileType,
      });
  
      const uploadResponse = await axios.post(API_ENDPOINTS.image_upload, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      console.log("File Upload Response:", uploadResponse.data);
  
      if (uploadResponse.data.status === 'true') {
        alert("Terms uploaded successfully!");
        navigation.navigate('Dashboardpage');
      } else {
       
        alert("Error uploading file.");
      }
    } catch (error) {
      console.log("Error uploading file:", error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    navigation.navigate('Home');
  };
  const handleClear = () => {
    signatureRef.current.clearSignature();
    // setSignatureImage(null);
  };
  const handleSignatureChange = async () => {
    if (signatureRef.current) {
      const signature = await signatureRef.current.readSignature();
      console.log('Signature Updated:', signature);
      // setSignatureImage(signature);
    }
    setSignaturePadActive(false)
  };
  return (
    <ScrollView scrollEnabled={!isSignaturePadActive}>
      <View style={styles.MainContainer}>
      <Image
        source={require("../assets/logo.jpg")}
        style={{
          width: responsiveWidth(38),
          height: responsiveHeight(18),
          marginTop: responsiveHeight(6),
          borderRadius: responsiveWidth(4),
          marginLeft:responsiveWidth(10)
        }}
      />
      <Text style={styles.heading}>9 CRETATION PTE. LTD. </Text>
      <View style={styles.textview}>
        <Text style={styles.txtsty}>18 Boon Lay Way #01-98A/111</Text>
        <Text style={styles.txtsty}>Tradehub 21, Singapore 609966</Text>
        <Text style={styles.txtsty}>Tel: 6295 0922</Text>
        <Text style={styles.txtsty}> Media@9creation.com.sg HDB Reg No: HB-04-4498C</Text>
        <Text style={styles.txtsty}>Co. & GST Reg No: 201305311D</Text>
      </View>
      <View style={styles.undertline}></View>
      <Text style={styles.heading}>SUB-CONTRACTOR AGREEMENT</Text>
      <View style={styles.adressdetails}>
    <View>
      <Text style={styles.addtxtlebel}>Company Name</Text>
      <Text style={styles.addtxtside}>{userdata?.CompanyName}</Text>
    </View>
    <View>
      <Text style={styles.addtxtlebel}>Address</Text>
      <Text style={styles.addtxtside}>{userdata?.Address} {userdata?.PostCode} {userdata?.Country} </Text>
    </View>
    <View>
      <Text  style={styles.addtxtlebel}>UON/ROC No</Text>
      <Text  style={styles.addtxtside}> {userdata?.Uen}</Text>
    </View>
    </View>
    <View>
      <Text style={styles.Listheading}>We are pleased to award you the subcontract works subject to the below term & condition:</Text>
    </View>
    <View style={styles.jobmainView}>
     <View style={styles.jobview}>
      <Text style={styles.lebelHeading}>1. Employment of illegal worker</Text>
      <Text style={styles.lebelvalue}>Sub-contractor shall NOT at any time employ or engage directly or indirectly, in the service of
                            illegal workers at our work sites. In the event your workers are found to be illegal or
                            illegitimate or violated the law of Singapore, you are to agree to identify & save harmless to
                            us from any action, suit, claim, loss, damage cost, liabilities, or whichsoever that may suffer
                            or incur by reason of your failure to observe or comply with such procedures, regulation, or
                            laws</Text>
     </View>
     <View style={styles.jobview}>
     <Text style={styles.lebelHeading}>2. Job Obligation</Text>
     <Text style={styles.lebelvalue}>Use of proper equipment, tools & accessories necessary to carry out & complete the
     above-mentioned works.</Text>
      <Text style={styles.listitem}>• Provide all necessary safety precaution</Text>
      <Text style={styles.listitem}>• Provide HDB licensed hacker.</Text>
      <Text style={styles.listitem}>• Disposal of debris / upload material</Text>
     </View>
     <View style={styles.jobview}>
      <Text style={styles.lebelHeading}>3.Housekeeping</Text>
      <Text style={styles.lebelvalue}>Sub-contractor is to keep the area clean at the end of each working day as well as ensure that
      all debris resulting from the work is to be cleared. i.e., common area/ owner house</Text>
     </View>
     <View style={styles.jobview}>
      <Text style={styles.lebelHeading}>4.Performance Standard</Text>
      <Text style={styles.lebelvalue}>Sub-contractor shall ensure that the workers engaged are legitimate & qualified for the works.
                            You shall diligently & faithfully perform and execute the works complying with and/or exceeding
                            standards set by all relevant authorities, such as Housing & Development Boards, building
                            management, building & construction authority, etc.</Text>
     </View>
     <View style={styles.jobview}>
      <Text style={styles.lebelHeading}>5.Warranty</Text>
      <Text style={styles.lebelvalue}>Sub-Contractor shall provide to 9 Creation Pte Ltd a workmanship warranty (“Warranty”) for a
                            period of 24 months (“Warranty Period”) upon completion of their works base on payment date. In
                            the event of any defects arising from the works during the warrant period, the sub-contractor
                            shall at its own cost, conduct the necessary rectification works.</Text>
     </View>
     <View style={styles.jobview}>
      <Text style={styles.lebelHeading}>6.Payment</Text>
      <Text style={styles.listitem}>1.Submission of invoice 5 days before the payment date.</Text>
      <Text style={styles.listitem}>2.Payment date are of the 1st & 16th of the month</Text>
      <Text style={styles.listitem}>3. Rebate {userdata?.Rebate}</Text>
     </View>
     <Text style={styles.Listheading}>Upon your confirmation & acceptance, this letter shall constitute as a binding contract with 9 Creation
     Pte Ltd.</Text>
    </View>
    <View style={styles.undertline}></View>
    <View>
      
    </View>
    <View>
    <View style={styles.container} >
    <SignatureScreen
        ref={signatureRef}
        onBegin={() => setSignaturePadActive(true)}
        onEnd={handleSignatureChange} 
        onOK={handleSignature} // Captures signature when "Save" is clicked
        onChange={handleSignatureChange} 
        descriptionText="Sign Here"
        clearText="Clear"
        confirmText="Save"
        backgroundColor="#f5f5f5"
        // Custom styling
      />
   
   
      <View style={styles.buttonContainer}>
        {/* <Button title="Clear" onPress={handleSignature} /> */}
         <TouchableOpacity onPress={handleClear}>
                                       <AntDesign name="delete" size={20} color="#ff0000" style={styles.IconDelete} />
                                 </TouchableOpacity>
        
      </View>
      
    </View>
    <Text style={styles.signaturehead}>Contractor acknowledgement signature:</Text>
    </View>
     
    <View style={styles.inputView}>
      <Text style={styles.inputtxt}>Name</Text>
        <TextInput style={styles.input}  value={subname}
            onChangeText={setsubname}/>
    </View>
    <View style={styles.inputView}>
      <Text style={styles.inputtxt}>NRIC No. / FIN No.:</Text>
        <TextInput style={styles.input}  value={nric}
            onChangeText={setnric}/>
    </View>
    <Text style={styles.lasttxt}>(Contractors are to provide a copy of worker’s permit & list of workers that are engaged in the
      work)</Text>
      <View style={{flexDirection:'row',marginLeft:responsiveWidth(5),marginTop:responsiveHeight(3)}}>
        <TouchableOpacity style={styles.btn} onPress={handleCancel}>
          <Text style={styles.btntxt}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnone} onPress={handleSave}>
          <Text style={styles.btntxtone}>submit</Text>
        </TouchableOpacity>
      </View>
      </View>
    </ScrollView>
  )
}

export default Terms
const styles = StyleSheet.create({
  MainContainer: {
    marginVertical: responsiveHeight(1.5),
  },
  heading: {
    marginLeft: responsiveWidth(6),
    marginTop: responsiveHeight(1.5),
    fontSize: responsiveFontSize(2.5),
    fontWeight:'500'
  },
  textview: {
    marginLeft: responsiveWidth(6),
    marginTop:responsiveHeight(.5),
  },
  txtsty:{
 fontSize: responsiveFontSize(2),
    fontWeight:'500'
  }, 
  undertline:{
    borderBottomWidth:1,
    borderColor:'##999999',
    width:responsiveWidth(90),
    marginTop:responsiveHeight(2),
    marginLeft: responsiveWidth(6),
  },
  adressdetails:{
    marginLeft: responsiveWidth(6),
    marginTop:responsiveHeight(0.5),
  },
  addtxtlebel:{
    fontSize:responsiveFontSize(2),
    fontWeight:'500'
  },
  addtxtside:{
    fontSize:responsiveFontSize(1.8),
    fontWeight:'500',
    color:'#0033cc'
  },
  jobmainView:{
    marginLeft: responsiveWidth(4),
    marginTop:responsiveHeight(1),
  },
  Listheading:{
    marginLeft: responsiveWidth(6),
    marginTop:responsiveHeight(1),
    fontSize: responsiveFontSize(2),
    fontWeight:'500'
  },
  lebelHeading:{
fontSize:responsiveFontSize(2),
    fontWeight:'500'
  },
  lebelvalue:{
    paddingLeft:responsiveWidth(5),
    fontSize:responsiveFontSize(1.8),
    fontWeight:'500',
    paddingTop:responsiveHeight(1)
  },
  jobview:{
    marginLeft: responsiveWidth(10),
    marginTop:responsiveHeight(1),
  },
  listitem:{
    paddingLeft:responsiveWidth(12),
    fontSize:responsiveFontSize(1.8),
    fontWeight:'500',
    paddingTop:responsiveHeight(1)
  },
  signaturehead:{
    marginLeft: responsiveWidth(11),
    marginTop:responsiveHeight(1),
    fontSize: responsiveFontSize(2),
    fontWeight:'400'
  },
  input:{
    width:responsiveWidth(90),
    backgroundColor:'#dedede',
    marginLeft: responsiveWidth(4),
    marginTop: responsiveHeight(1),
    borderRadius:responsiveWidth(2),
    paddingLeft:responsiveWidth(2),
    padding:responsiveWidth(2)
  },
  inputView:{
    marginLeft: responsiveWidth(3),
    marginTop:responsiveHeight(1),
  },
  inputtxt:{
    paddingLeft:responsiveWidth(8),
    fontSize:responsiveFontSize(1.8),
    fontWeight:'500',
    paddingTop:responsiveHeight(1)
  },
  lasttxt:{
    paddingLeft:responsiveWidth(7),
    fontSize:responsiveFontSize(1.8),
    fontWeight:'bold',
    paddingTop:responsiveHeight(1.5)
  },
  btn:{
    borderWidth: 1,
    borderColor: '#ccc',
    width:responsiveWidth(30),
    padding: responsiveHeight(1),
    borderRadius: responsiveWidth(3),
    backgroundColor: '#ff5050',
    marginTop: responsiveHeight(1),
    marginLeft: responsiveWidth(10),
  },
  btntxt:{
    fontSize: responsiveFontSize(1.8),
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  btnone:{
    borderWidth: 1,
    borderColor: '#ccc',
    width:responsiveWidth(30),
    padding: responsiveHeight(1),
    borderRadius: responsiveWidth(3),
    backgroundColor: '#4d8f91',
    marginTop: responsiveHeight(1),
    marginLeft: responsiveWidth(10),
  },
  btntxtone:{
    fontSize: responsiveFontSize(1.8),
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  container: {
  
    backgroundColor: '#fff',
    height: responsiveHeight(20),  // Adjust this value as needed
    width: responsiveWidth(90),   // Increase width if necessary
    marginLeft: responsiveWidth(6),
    marginTop:responsiveHeight(2),
    flexDirection:'row',
    borderRadius:responsiveWidth(10)

    // position: "absolute", 
  },
  IconDelete:{
    paddingTop:responsiveHeight(2),
    marginLeft:responsiveWidth(-10)
  },
  // buttonContainer: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-around',
  //   margin: 10,
  // },
  
  signaturePad: `
  .m-signature-pad {
    box-shadow: none;
    border: none;
    
  }
  .m-signature-pad--body {
    border: none;
    width:responsiveWidth(80),
  }
  .m-signature-pad--footer {
    display: none;
  }
`

});  