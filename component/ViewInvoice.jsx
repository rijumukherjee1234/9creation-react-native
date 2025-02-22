
import { View, Text, ScrollView,StyleSheet,ActivityIndicator , PermissionsAndroid, Alert, Linking,Platform,TextInput,TouchableOpacity,Animated } from 'react-native'
import React, { useRef,useState,useEffect } from 'react';
 import {
     responsiveFontSize,
     responsiveHeight,
     responsiveWidth,
   } from 'react-native-responsive-dimensions';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  // import  manageExternalStorage  from 'react-native-manage-external-storage';
  import FileViewer from 'react-native-file-viewer';
// //   import * as FileSystem from 'expo-file-system'; 
  import { useNavigation, useRoute } from '@react-navigation/native';
  import RNFetchBlob from 'rn-fetch-blob'
  import messaging from "@react-native-firebase/messaging";
  import { Calendar } from 'react-native-calendars';
  import moment from 'moment';
  // import FileViewer from 'react-native-file-viewer';
   import axios from "axios";
   import RNFS from 'react-native-fs';
  
   import DocumentPicker from 'react-native-document-picker';
   import { request, PERMISSIONS,RESULTS  } from 'react-native-permissions';
//   import Toast from 'react-native-toast-message';
//   // import axios from 'axios';
 import { API_ENDPOINTS } from '../Src/apicall';
import Header2 from '../Src/Header';
import AntDesign from 'react-native-vector-icons/AntDesign';

 //const imageUrl = 'https://dev-ninecreationapi.devxportal.com/public/uploaded_files';
 const imageUrl = 'https://erpapi.9creation.com.sg/public/uploaded_files';


const ViewInvoice = () => {

    const navigation = useNavigation();
    const [age, setAge] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [loading, setLoading] = useState(false); 
    const [projectNumber, setProjectNumber] = useState('');
    const [selectedInfoNewstate, setSelectedInfoNewstate] = useState(null); 
    const [jobDescription, setJobDescription] = useState('');
    const [workdescription,setworkdescription]= useState('');
    const [retrievedDate ,handleDataRetrieval]= useState('');
    const [dob, setDob] = useState('');
    const [apiDob, setApiDob] = useState('');
    const [fileUri, setFileUri] = useState('');
    const [getfilename, setgetFileName] = useState('');
    const [getapifilename, setapigetFileName] = useState('');
    const [getuploaddatetime, setgetuploaddatetime] = useState('');
    const [subContractor, setSubContractor] = useState('');
    const [isFileVisible, setIsFileVisible] = useState(false);
    const [isFileVisiblefile, setIsFileVisiblefile] = useState(false);
    const [isFileVisiblefileupload, setisFileVisiblefileupload] = useState(false);
    const [isFileVisiblefilebutton, setisFileVisiblefilebutton] = useState(false);
    
    const [amountBeforeGST, setAmountBeforeGST] = useState('');
    const [gstAmount, setGstAmount] = useState('');
    const [remarks, setRemarks] = useState('');
    const [totalAmount, setTotalAmount] = useState(''); // Hardcoded total amount, you can make this dynamic
    const [showCalendar, setShowCalendar] = useState(false);
    const [BirthAnimated] = useState(new Animated.Value(0));

    const handleFocus = (animatedValue) => {
        Animated.timing(animatedValue, {
          toValue: 1, // Moves the label up
          duration: 300,
          useNativeDriver: true,
        }).start();
      };
      const handleBlur = (animatedValue) => {
        Animated.timing(animatedValue, {
          toValue: 0, // Moves the label back to its original position
          duration: 300,
          useNativeDriver: true,
        }).start();
      };
      const translateY = (animatedValue) => {
        return animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [-3, -17], // Move label up by 20 units when focused
        });
      };

      const handleDateSelect = (day) => {
        console.warn('Selected Date2:', day); 
        const selectedDate = moment(day.dateString).format('YYYY-MM-DD'); 
        const displayFormattedDate = moment(day.dateString).format('DD-MM-YYYY'); // Format date as YYYY-MM-DD
        setDob(displayFormattedDate); 
        setApiDob(selectedDate);// Update the dob state
        setShowCalendar(false); // Close the calendar
        console.warn('Selected Date:', selectedDate); // Debugging: Logs the selected date
      }
      const toggleCalendar = () => {
        console.log('Toggling calendar visibility');
        setShowCalendar(!showCalendar);
      };
  
      useEffect(() => {
       


        const fetchData = async () => {
          const data = await AsyncStorage.getItem('projectData'); // Fetch stored data
          const sub_name = await AsyncStorage.getItem('userInfo');
          const parsedData = data ? JSON.parse(data) : null; // Parse if data exists
          const subcontractor_name = JSON.parse(sub_name);
          // console.warn(selectedInfoNew,"riju"); // Log data to check structure
          setSelectedInfoNewstate(parsedData); // Save data in state
          console.log(parsedData,"parsedData");
          setProjectNumber(parsedData?.PROJECT_NO)
          setworkdescription(parsedData?.WORK_CATEGORY_VALUE)
          setSubContractor(subcontractor_name.CompanyName)
          try {
            const data = await AsyncStorage.getItem('projectData'); // Fetch stored data
            const selectedInfoNew = data ? JSON.parse(data) : null; // Parse if data exists
      
            // Check if PURCHASEORDER_SYSID exists and is not null
            if (selectedInfoNew?.PURCHASE_ORDER_SYS_ID) {
           
              getSpecificInvoice();
              setIsFileVisible(true)
              setIsFileVisiblefile(true)
              setisFileVisiblefilebutton(true)
              
            } else {
              console.log("PURCHASEORDER_SYSID is null or undefined, skipping getSpecificInvoice.");
            }
          } catch (error) {
            console.error("Error fetching or parsing projectData:", error);
          }
        };
      
        fetchData();
        // requestManageExternalStoragePermission()
      }, []);
   
      const getSpecificInvoice = async () => {
        try {
          const data = await AsyncStorage.getItem('projectData');
          const sub_name = await AsyncStorage.getItem('userInfo');
          if (data) {
            const selectedInfoNew = JSON.parse(data);
            const subcontractor_name = JSON.parse(sub_name);
            console.warn(selectedInfoNew,"riju"); // Log data to check structure
            
            const subDetails = selectedInfoNew.SUB_DETAILS[0];
            console.warn(subDetails.REMARKS,"RIJU");
            
            
            setTotalAmount(subDetails.GRAND_TOTAL ? subDetails.GRAND_TOTAL.toFixed(2) : '0.00');
            setSubContractor(subcontractor_name.CompanyName)
            setworkdescription(selectedInfoNew.WORK_CATEGORY_VALUE)
            setGstAmount(subDetails.TAX_TOTAL ? subDetails.TAX_TOTAL.toFixed(2) : '0.00');
            setAmountBeforeGST(subDetails.UNIT_TOTAL ? subDetails.UNIT_TOTAL.toFixed(2) : '0.00');
           // Fetch and format the date when setting it
      // setDob(moment(subDetails.INVOICE_DATE, 'YYYY-MM-DD').format('DD-MM-YYYY'));
      
      if(subDetails.INVOICE_DATE){
        handleDataRetrieval(subDetails.INVOICE_DATE); 
       
        
        const formattedDisplayDate = moment(subDetails.INVOICE_DATE).format('DD-MM-YYYY'); // Single 'D' and 'M' for no leading zero
       
      const formattedApiDate = moment(subDetails.INVOICE_DATE).format('YYYY-MM-DD');
      console.warn(formattedDisplayDate);
      setDob(formattedDisplayDate); // Set display format
      setApiDob(formattedApiDate);
      }
       
            setRemarks(subDetails.REMARKS);
            setInvoiceNumber(subDetails.INVOICE_NO);
            setProjectNumber(selectedInfoNew.PROJECT_NO);
            setJobDescription(subDetails.INVOICE_DESCRIPTION);
            const formattedDate = moment(subDetails.UPLOADED_DATE_TIME, ['YYYY-MM-DDTHH:mm', 'MM/DD/YYYY, HH:mm:ss A']).format('DD-MM-YYYY hh:mm A');
            setgetuploaddatetime(formattedDate); // Update the state with the formatted date
            setapigetFileName(subDetails.FILE_NAME);
      //       const uploadedDateTime = "12/27/2024, 2:52:49 PM";
      // console.log(formatUploadedDateTime(uploadedDateTime),"kl"); // Should output: "27-12-2024 2:52 PM"
         
          }
        } catch (error) {
          console.error('Error retrieving taskInfo from AsyncStorage:', error);
        }
      };
      const formatUploadedDateTime = (dateTime) => {
        if (typeof dateTime !== 'string') {
          console.error('Invalid date format');
          return 'Invalid date';
        }
      
        // Normalize the string: replace non-breaking space (\u202F) with a regular space and remove comma
        const normalizedDateTime = dateTime.replace(/\u202F/g, ' ').replace(',', '');
      
        // Parse the normalized date string using Date constructor or Date.parse
        const dateObj = new Date(normalizedDateTime);
      
        if (isNaN(dateObj.getTime())) { // Use getTime to check if the date is invalid
          console.error('Invalid date format after normalization');
          return 'Invalid date';
        }
      
        // Extract date components
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = dateObj.getFullYear();
      
        // Extract time components
        let hours = dateObj.getHours();
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
        const period = hours >= 12 ? 'PM' : 'AM';
      
        // Convert hours to 12-hour format
        hours = hours % 12 || 12; // If hours is 0 (midnight), set it to 12
      
        // Return formatted string
        return `${day}-${month}-${year} ${hours}:${minutes} ${period}`;
      };
      const handleAmountChange = (unitTotal, taxTotal) => {
        const unitValue = parseFloat(unitTotal) || 0; // Default to 0 if empty
        const taxValue = parseFloat(taxTotal) || 0; // Default to 0 if empty
        setAmountBeforeGST(unitTotal);
        setGstAmount(taxTotal);
        setTotalAmount((unitValue + taxValue).toFixed(2)); // Calculate total with 2 decimals
      };
      const generateImageUrl = (bannerImage) => {
        if (bannerImage) {
          return `${imageUrl}/${bannerImage}`;
        }
        return 'https://path-to-default-image.com/default-image.jpg'; // Default image URL
      };
      
    //   import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

   





    // import { PermissionsAndroid, Alert, Linking, Platform } from 'react-native';

   

   

    

    // import { Alert, Platform, PermissionsAndroid } from 'react-native';
    // import RNFS from 'react-native-fs';
    // import RNFetchBlob from 'rn-fetch-blob';
    
    const requestStoragePermission = async () => {
      if (Platform.OS === 'android' && Platform.Version < 29) { // Android 10 and below
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
          console.warn('Permission request error:', err);
          return false;
        }
      }
      return true; // Android 11+ doesn't require this permission for downloads
    };
    
    const handleDownload = async () => {
      try {
        const fileUrl = encodeURI(generateImageUrl(getapifilename));
        const fileName = getapifilename;
    
        if (!fileName || !fileUrl) {
          Alert.alert('Error', 'File name or URL is missing.');
          console.error('Download failed: Missing fileName or fileUrl.');
          return;
        }
    
        const tempFileUri = `${RNFS.CachesDirectoryPath}/${fileName}`;
        console.log('Starting download from:', fileUrl);
        console.log('Temp storage path:', tempFileUri);
    
        // Step 1: Download the file to cache directory
        const downloadResumable = RNFS.downloadFile({
          fromUrl: fileUrl,
          toFile: tempFileUri,
        });
    
        const res = await downloadResumable.promise;
        console.log('File downloaded to cache:', tempFileUri);
    
        if (Platform.OS === 'android') {
          if (Platform.Version < 29) {
            console.log("Checking storage permissions for Android 10 and below...");
            const hasPermission = await requestStoragePermission();
            if (!hasPermission) {
              Alert.alert('Permission Denied', 'Storage permission is required to save the file.');
              return;
            }
          }
    
          console.log("Saving file to Downloads folder...");
          const downloadPath = `${RNFS.DownloadDirectoryPath}/${fileName}`;
    
          // Android 10+ (API 29+) can use MediaStore API via RNFetchBlob
          await RNFetchBlob.fs.cp(tempFileUri, downloadPath);
          console.log('File successfully saved to:', downloadPath);
    
          Alert.alert('Success', `Your file has been successfully saved to the Downloads folder.`);
          // sendDownloadNotification(fileName, downloadPath);
        } else {
          Alert.alert('Unsupported', 'Downloading is only supported on Android.');
        }
      } catch (error) {
        console.log('Error saving file:', error);
        Alert.alert('Download Error', 'An error occurred while downloading the file.');
      }
    };
   
    
    
    


      
            // Helper function for MIME type
  const getMimeType = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'application/pdf';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      default:
        return 'application/octet-stream'; // Fallback
    }
  };

const handleDobChange = (date) => {
  setDob(date); // Update dob state with selected date
};
const handleDelete = async () => {
    try {
      // Retrieve purchase order ID from AsyncStorage
      const data = await AsyncStorage.getItem("projectData");
      const selectedInfoNew = JSON.parse(data);
  
     
  
      // Prepare input data for the API call
      const inputData = {
        ITEM: "DELETE_FILE_NAME",
        PURCHASE_ORDER_SYS_ID: selectedInfoNew.PURCHASE_ORDER_SYS_ID,
      };
     
  
      // Make API call using axios
      const response = await axios.post(API_ENDPOINTS.add_invoice_detail, inputData);
      console.warn(response, "inputData");
      // On success, update state and show success alert
    
        // Alert.alert("Success", "Photo Deleted Successfully");
        setIsFileVisible(false); // Hide only the file-specific block
        setIsFileVisiblefile(false)
        setisFileVisiblefilebutton(false)
     
    } catch (error) {
      console.error("Error deleting invoice:", error);
      Alert.alert("Error", "Failed to delete the invoice. Please try again.");
    }
  };
  
  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: "*/*", // Accept all file types
        copyToCacheDirectory: true,  // Optional, to copy to a temporary directory
      });
  
      // Ensure the result contains the proper file details
      const originalFileName = result.name;  // The name of the file picked
      const originalFileUri = result.uri;    // The URI of the file
  
      console.log(result, "originalFileUri");
  
      if (originalFileName) {
        console.warn("Original File Name:", originalFileName);
  
        // Extract the file extension
        const fileExtension = originalFileName.split('.').pop(); // Extract file extension
        const baseFileName = originalFileName.replace(`.${fileExtension}`, ''); // Remove the extension
        const updatedFileName = `${baseFileName}_invoice.${fileExtension}`; // Add "_invoice" to the base name
  
        setgetFileName(updatedFileName);  // Set the updated file name
        setIsFileVisible(true);  // Show the selected file
        setFileUri(originalFileUri);  // Store the URI for uploading
  
        setIsFileVisible(false);
        setIsFileVisiblefile(false);
        setisFileVisiblefileupload(true);
        setisFileVisiblefilebutton(true);
        setIsFileVisiblefile(false);
      }
    } catch (error) {
      console.error("Error picking file:", error);
    }
  };
  
  const submitInvoice = async () => {
    try {
      if(!invoiceNumber || !gstAmount ||!amountBeforeGST || !dob ){
        alert("Plz Fill all required fields")
       
        return
       
      }
      setIsLoading(true); 
      const getData = await AsyncStorage.getItem("userInfo");
      const subid=JSON.parse(getData)
     
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const day = String(currentDate.getDate()).padStart(2, '0');
      const hours = String(currentDate.getHours()).padStart(2, '0');
      const minutes = String(currentDate.getMinutes()).padStart(2, '0');
      
      // Combine the components into the desired format
      const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
  
      // Prepare the invoice object dynamically
      const invoiceData = {
        ITEM: "ADD_UPDATE",
        FILE_NAME: getfilename || getapifilename ,
        INVOICE_DESCRIPTION: jobDescription,
        INVOICE_NO: invoiceNumber,
        INVOICE_DATE: apiDob,
        UNIT_TOTAL: amountBeforeGST,
        TAX_TOTAL: gstAmount,
        SUPPLIER_SYS_ID: subid.UserId,
        SUPPLIER_NAME: subContractor,
        PURCHASE_ORDER_SYS_ID: selectedInfoNewstate?.PURCHASE_ORDER_SYS_ID ||"0",
        GRAND_TOTAL: totalAmount,
        ORDER_STATUS: "Open",
        CREATED_BY: subid.UserId,
        INVOICE_FILE: "",
        REMARKS: remarks,
        PROJECT_NUMBER:invoiceNumber,
        WORK_DESCRIPTION: workdescription,
        PROJECT_SYS_ID: selectedInfoNewstate?.PROJECT_SYS_ID,
        UPLOADED_DATE_TIME: formattedDateTime, // Current date and time
      };
  
    console.log(invoiceData,"invoiceData");
    
     
     
      
      // Axios POST request
      const response = await axios.post(API_ENDPOINTS.add_invoice_detail, invoiceData, {
       
      });
     
     
     
      // Handle response
      if (response.data.status == "true" ) {
       
      alert(response.data.response)
       if(getfilename){
      
        await uploadFile(fileUri); 
        navigation.navigate('Dashboardpage');
       }else{
       
        navigation.navigate('Dashboardpage');
       }
      
     
      } else {
        console.log("Unexpected Response:", response);
        alert("Failed to submit the invoice.");
      }
    } 
    catch (error) {
      console.error("Error submitting invoice:", error);
      alert("An error occurred while submitting the invoice.");
    } finally {
      setIsLoading(false); // Hide loading indicator after completion
    }
  };
  const uploadFile = async (imageURI) => {
  console.log(imageURI,"imageURI");
  
  
    setLoading(true);
    try {
      // Prepare FormData
      const formData = new FormData();
  
      if (imageURI.startsWith('content://')) {
        // Extract file name and MIME type
        const fileName = imageURI.split('/').pop();
        console.log(fileName,"riju");
        
        const fileType = `image/${fileName.split('.').pop()}`;
        console.log(fileType,"riju");
        console.log(imageURI,"imageURI");
        
  
        // Append file to FormData
        formData.append('FILE', {
          uri: imageURI, // Local file URI
          name: getfilename, // File name
          type: fileType, // File MIME type
        });
      } else {
        console.log("Processing non-local image URI");
  
        // Fetch blob for non-local URIs
        const response = await fetch(imageURI);
        const blob = await response.blob();
        const fileName = 'uploaded-image.jpg';
        const fileType = blob.type || 'image/jpeg';
  
        // Create a File object
        const file = new File([blob], fileName, { type: fileType });
        formData.append('FILE', file);
      }
  
      // console.log("FormData content:",formData);
      // formData._parts.forEach(([key, value]) => {
      //   console.log(`${key}:`, value);
      //   console.log("FormData parts:", formData._parts);
  
      // });
  
      // Send to the server
      const uploadResponse = await axios.post(API_ENDPOINTS.image_upload, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      // Handle the response
      if (uploadResponse.data.status === 'true') {
       console.log("riju");
       
        return uploadResponse.data.response;
       
      } else {
        console.error('Image upload failed:', uploadResponse.data.response);
        throw new Error(uploadResponse.data.response);
      }
    } catch (error) {
      console.error('Error uploading image:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return (
    <ScrollView>

      <Header2/>
      <View  style={styles.MainContainer}>
      <Text style={styles.heading}>Project Id : {selectedInfoNewstate?.PROJECT_NO}</Text>
      <Text style={styles.heading}>Designer : {selectedInfoNewstate?.INTERIOR_DESIGNER_NAME}</Text>
      <Text style={styles.heading}>{selectedInfoNewstate?.CUSTOMER_ADDRESS}</Text>

       <View style={styles.inputBox}>
       <View>
          <Text style={styles.inputtxtinvoice}>Invoice Number <Text style={{color:'red'}}>*</Text></Text>
          <TextInput
            style={styles.input}
            value={invoiceNumber}
          
            onChangeText={setInvoiceNumber}
          />
        </View>
        <View>
          <Text style={styles.inputtxt}>Project Number</Text>
          <TextInput
            style={styles.input}
            value={projectNumber}
            editable={false} 
            onChangeText={setProjectNumber}
          />
        </View>
        <Text style={styles.workstyl}>Work Description : {workdescription}</Text>

        <View>
          <Text style={styles.inputtxtjob}>Job Description</Text>
          <TextInput
            style={styles.input}
            value={jobDescription}
            onChangeText={setJobDescription}
          />
        </View>
        <View style={styles.inputview}>
          <Animated.Text
            style={[styles.Inputtxt, { transform: [{ translateY: BirthAnimated }] }]}
          >
           Invoice Date<Text style={{color:'red',fontSize:responsiveFontSize(1.5)}}>*</Text>
          </Animated.Text>
          <TouchableOpacity onPress={toggleCalendar}>
  <TextInput
    style={styles.Input}
    value={dob}
    editable={false}
    onFocus={handleFocus}
    onBlur={handleBlur}
   
  />
</TouchableOpacity>

        </View>
           Display Calendar
           {showCalendar && (
         <Calendar
         onDayPress={handleDateSelect}
         markedDates={{ [dob]: { selected: true } }} // Mark the selected date
       />
        )}
       </View>
       <View>
          <Text style={styles.inputtxt}>Sub Contractor</Text>
          <TextInput
            style={styles.input}
            value={subContractor}
            onChangeText={setSubContractor}
           
          />
        </View>
        <View>
          <Text style={styles.inputtxt}>Amount Before GST<Text style={{color:'red'}}>*</Text></Text>
      <View style={{flexDirection:'row'}}>
           <View style={styles.s$}><Text style={{fontSize:responsiveFontSize(2),fontWeight:'bold',paddingTop:responsiveHeight(0.2),paddingLeft:responsiveWidth(1)}}>S$</Text></View>
          <TextInput
  style={styles.inputAmount}
  value={amountBeforeGST !== undefined && amountBeforeGST !== null ? `${amountBeforeGST}`.toString() : ''}
  onChangeText={(value) => handleAmountChange(value, gstAmount)}
   keyboardType="numeric"
   
/>
</View>

        </View>
        <View >
          <Text style={styles.inputtxt}>GST Amount<Text style={{color:'red'}}>*</Text></Text>
          <View style={{flexDirection:'row'}}>
          <View style={styles.s$}><Text style={{fontSize:responsiveFontSize(2),fontWeight:'bold',paddingTop:responsiveHeight(0.2),paddingLeft:responsiveWidth(1)}}>S$</Text></View>
          <TextInput
  style={styles.inputAmount}
  value={gstAmount !== undefined && gstAmount !== null ? `${gstAmount}`.toString() : ''}
  onChangeText={(value) => handleAmountChange(amountBeforeGST, value)}
   keyboardType="numeric"
/>
</View>
         
        </View>
        <View>
          <Text style={styles.inputtxt}>Remarks</Text>
         
          {remarks !== undefined && remarks !== null && (
  <TextInput
    style={styles.input}
    value={remarks.toString()}
    onChangeText={setRemarks}
  />
)}
        </View>
        <View style={{ flexDirection: 'row' }}>
        <Text style={styles.textoneTotal}>Total Amount</Text>
        <Text style={styles.sidetxt}>S$ {totalAmount}</Text>
      </View>
      <TouchableOpacity style={styles.btn} onPress={handleFilePick}>
        <Text style={styles.btntxt}>Upload Invoice</Text>
      </TouchableOpacity>
      {isFileVisiblefile && (
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.textone}>File Name : {getapifilename}</Text>
      </View>
      )}
        {isFileVisiblefileupload && (
      <View style={{ flexDirection: 'row' }}>
        
        <Text style={styles.textone}>File Name : {getfilename}</Text>
      
      </View>
      )}
      <View style={{ flexDirection: 'row' }}> 
        {isFileVisible && (
       <TouchableOpacity onPress={() => handleDownload()}>
                           <AntDesign name="download" size={20} color="#4d8f91" style={styles.Icon} />
                         </TouchableOpacity>
        )}
        {isFileVisible && (
                         <TouchableOpacity onPress={() => handleDelete()}>
      <AntDesign name="delete" size={20} color="#ff0000" style={styles.IconDelete} />
</TouchableOpacity>
          )}
          </View>
          {isFileVisible && (
      <Text style={styles.textone}>Upload Date and Time :{getuploaddatetime} </Text>
            )} 
              {isFileVisiblefilebutton && (
                <View style={{ flexDirection: 'row' }}>
       <TouchableOpacity style={styles.submitbtn} onPress={submitInvoice}>
       
       
       {isLoading ? (
         <ActivityIndicator size="small" color="#fff" /> // Show loading spinner while submitting
       ) : (
         <Text style={styles.submitbtntxt}>Submit</Text> // Show Submit button when not loading
       )}
     </TouchableOpacity>
     </View>
            )}
      </View>
    </ScrollView>
  )
}

export default ViewInvoice
const styles = StyleSheet.create({
    MainContainer: {
      marginTop:responsiveHeight(1)
    },
      heading: {
        color: '#000',
        marginLeft: responsiveWidth(4),
        fontSize: responsiveFontSize(1.5),
        },
      
        inputtxtinvoice:{
          color: '#000',
          marginLeft: responsiveWidth(4),
          fontSize: responsiveFontSize(1.5),
          marginTop:responsiveHeight(1)
        },
        inputtxt:{
          color: '#000',
          marginLeft: responsiveWidth(4),
          fontSize: responsiveFontSize(1.5),
        },
        inputtxtjob:{
          color: '#000',
          marginLeft: responsiveWidth(4),
          fontSize: responsiveFontSize(1.5),
        },
        input:{
          width:responsiveWidth(90),
          backgroundColor:'#dedede',
          marginLeft: responsiveWidth(4),
          marginTop: responsiveHeight(1),
          borderRadius:responsiveWidth(2),
          paddingLeft:responsiveWidth(2),
          color:'#000',
          fontWeight:'bold'
        },
        inputAmount:{
          width:responsiveWidth(82),
          backgroundColor:'#dedede',
          marginLeft: responsiveWidth(-1),
          marginTop: responsiveHeight(1),
          borderRadius:responsiveWidth(2),
          paddingLeft:responsiveWidth(2),
          color:'#000',
          
        },
        s$:{
          width:responsiveWidth(10),
          backgroundColor:'#dedede',
          marginTop: responsiveHeight(1),
          borderRadius:responsiveWidth(2),
          padding:responsiveWidth(2),
          color:'#000',
          marginLeft:responsiveWidth(4),
          fontWeight:'bold',
        },
        amaount:{
          width:responsiveWidth(10),
          backgroundColor:'#dedede',
          marginTop: responsiveHeight(1),
          borderRadius:responsiveWidth(2),
          borderWidth:1,
          borderColor:'#000'
        },
        workstyl:{
          color: '#000',
          marginLeft: responsiveWidth(4),
          marginTop: responsiveHeight(1),
          fontSize: responsiveFontSize(1.5),
        },
        textone:{
          color: '#000',
          marginLeft: responsiveWidth(4),
          marginTop: responsiveHeight(1),
          fontSize: responsiveFontSize(1.5),
          width:responsiveWidth(90)
        },
        textoneTotal:{
          color: '#000',
          marginLeft: responsiveWidth(4),
          marginTop: responsiveHeight(1),
          fontSize: responsiveFontSize(1.5),
        },
        sidetxt:{
          color: '#000',
          marginLeft: responsiveWidth(4),
          marginTop: responsiveHeight(1),
          fontSize: responsiveFontSize(1.5),
          paddingLeft:responsiveWidth(30),
            width:responsiveWidth(60)
        },
      
        btn:{
          borderWidth: 1,
          borderColor: '#ccc',
          width: responsiveWidth(40),
          padding: responsiveHeight(1),
          borderRadius: responsiveWidth(3),
          backgroundColor: '#4d8f91',
          marginTop: responsiveHeight(1),
          marginLeft: responsiveWidth(2),
        },
        btntxt:{
          fontSize: responsiveFontSize(1.5),
          fontWeight: 'bold',
          color: '#fff',
          textAlign: 'center',

        },
        submitbtn:{
          borderWidth: 1,
          borderColor: '#ccc',
          width:responsiveWidth(60),
          padding: responsiveHeight(1),
          borderRadius: responsiveWidth(3),
          backgroundColor: '#4d8f91',
          marginTop: responsiveHeight(1),
          marginLeft: responsiveWidth(3),
        },
        submitbtntxt:{
          fontSize: responsiveFontSize(1.8),
          fontWeight: 'bold',
          color: '#fff',
          textAlign: 'center',
        },
        Icon:{
          paddingTop:responsiveHeight(2),
          marginLeft:responsiveWidth(10)
        },
        IconDelete:{
          paddingTop:responsiveHeight(2),
          marginLeft:responsiveWidth(70)
        },
  
        Inputtxt: {
          fontSize: responsiveFontSize(1.5),
          paddingLeft:responsiveWidth(4),
          color:'#000',
           paddingTop:responsiveHeight(1.5)
        },
        Input: {
          fontSize: responsiveFontSize(1.5),
          fontWeight:'600',
        height:'auto',
          width:responsiveWidth(90),
          backgroundColor:'#dedede',
          marginLeft: responsiveWidth(4),
          marginTop: responsiveHeight(1),
          borderRadius:responsiveWidth(2),
          paddingLeft:responsiveWidth(2),
        }
  
  })