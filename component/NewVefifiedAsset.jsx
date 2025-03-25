import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, ScrollView, Alert, Platform } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ENDPOINTS } from '../Src/apicall';
import Header from '../Src/Header';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob'
import RNFS from 'react-native-fs';
import AntDesign from 'react-native-vector-icons/AntDesign';
// import * as FileSystem from 'expo-file-system';  // Import expo-file-system for downloading files
// import * as DocumentPicker from "expo-document-picker";
 const imageUrl = 'https://dev-ninecreationapi.devxportal.com/public/uploaded_files';
//  const imageUrl = 'https://erpapi.9creation.com.sg/public/uploaded_files';


const VerifiedAsset = () => {
  const route = useRoute();
  const { projectData } = route.params;
  const [image_store, setImageStore] = useState([]);
   const [getfilename, setgetFileName] = useState('');
  const [loading, setLoading] = useState(false);
   const [fileUri, setFileUri] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    if (projectData && projectData.length > 0) {
      getFileName();
    }
  }, [projectData]);

  const getFileName = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('permit');
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await axios.get(API_ENDPOINTS.file_upload_get, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          ITEM: 'SPECIFIC',
          REFERENCE_SYS_ID: projectData[0].PROJECT_SYS_ID,
          UPLOAD_FOR: '3D Drawing',
          MODULE: 'PROJECT_MANAGMENT',
        },
      });
      setImageStore(response.data.response);
    } catch (err) {
      console.error('Error fetching assets:', err.message);
    } finally {
      setLoading(false);
    }
  };
  // Function to handle API call

const handleDelete = async (photo) => {
  try {
    // Retrieve purchase order ID from AsyncStorage
  

   

    // Prepare input data for the API call
    const inputData = {
      ITEM: "DELETE",
      FILE_SYS_ID: photo.FILE_SYS_ID,
      REFERENCE_SYS_ID: projectData[0].PROJECT_SYS_ID,
    };
    console.log(inputData,"inputData");
    
   

    // Make API call using axios
    const response = await axios.post(API_ENDPOINTS.drawing_image_upload, inputData);
    console.warn(response, "inputData");
    getFileName();
   
   
  } catch (error) {
    console.error("Error deleting invoice:", error);
    Alert.alert("Error", "Failed to delete the invoice. Please try again.");
  }
};
// Updated prepareJsonPayload function
const prepareJsonPayload = async (updatedFileName) => {
  const getData = await AsyncStorage.getItem("userInfo");

  if (!getData) {
    console.error("No user data found in AsyncStorage");
    return null; // Return null if no data is found
  }

  const subid = JSON.parse(getData);
  console.warn(subid.UserId);

  return {
    ITEM: "ADD_UPDATE_DRAWING",
    CREATED_BY: "1",
    DETAILS: [
      {
        FILE_SYS_ID: "0",
        REFERENCE_SYS_ID: projectData[0].PROJECT_SYS_ID,
        UPLOAD_FOR: "3D Drawing",
        FILE_NAME: updatedFileName,
        MODULE: "PROJECT_MANAGMENT",
      },
    ],
  };
};

// Function to handle API call
const uploadDrawingDetails = async (payload) => {
  try {
    const response = await axios.post(API_ENDPOINTS.drawing_image_upload, payload);

    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("API Call Error:", error.message);
    throw error; // Re-throw to handle it in the calling function
  }
};

// Main function to handle file pick and upload
const handleFilePick = async () => {
  try {
    const result = await DocumentPicker.pickSingle({
      type: "*/*", // Accept all file types
      copyToCacheDirectory: true,  // Optional, to copy to a temporary directory
    });

  
  

    const originalFileName = result.name;
    console.warn("Original File Name:", originalFileName);
    const originalFileUri = result.uri;

    const fileExtension = originalFileName.split('.').pop();
    const baseFileName = originalFileName.replace(`.${fileExtension}`, '');
    const updatedFileName = `${baseFileName}_3dDrawing.${fileExtension}`;

    setgetFileName(updatedFileName); // Updating state for debugging
    setFileUri(originalFileUri); // Updating state for debugging

    console.log("Updated File Name:", updatedFileName);
    console.log("Original File URI:", originalFileUri);

    // Await the payload preparation to ensure it's fully created before using it
    const jsonPayload = await prepareJsonPayload(updatedFileName);

    if (!jsonPayload) {
      alert("Failed to prepare the payload.");
      return;
    }

    console.log("Prepared JSON Payload:", jsonPayload);

    // Upload the drawing details
    const uploadResponse = await uploadDrawingDetails(jsonPayload);

    if (uploadResponse.status === "true") {
      await uploadFile(originalFileUri,updatedFileName);
      alert("File uploaded successfully!");
    } else {
      console.error("API uploadDrawingDetails failed:", uploadResponse.response);
      alert("3D drawing upload failed.");
    }
  } catch (error) {
    console.error("Error in handleFilePick:", error.message);
    alert("Error picking or uploading file.");
  }
};


const uploadFile = async (imageURI,filename) => {
  console.log("Uploading file with URI:", imageURI);

  setLoading(true);
  try {
    const formData = new FormData();
    // const fileName = getfilename || imageURI.split('/').pop();
    const fileType = `image/${filename.split('.').pop()}`;

    formData.append('FILE', {
      uri: imageURI,
      name: filename,
      type: fileType,
    });

    const uploadResponse = await axios.post(API_ENDPOINTS.image_upload, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    console.log("File Upload Response:", uploadResponse.data);

    if (uploadResponse.data.status === 'true') {
      alert("File uploaded successfully!");
      setgetFileName(''); // Clear the file name
      getFileName();
      return uploadResponse.data.response;
    } else {
      console.error("Image upload failed:", uploadResponse.data.response);
      alert("Error uploading file.");
    }
  } catch (error) {
    console.error("Error uploading file:", error.message);
  } finally {
    setLoading(false);
  }
};

  const generateImageUrl = (bannerImage) => {
    if (bannerImage) {
      return `${imageUrl}/${bannerImage}`;
    }
    return 'https://path-to-default-image.com/default-image.jpg'; // Default image URL
  };

  // Handle the download of the file
  const handleDownload = async (photo) => {
     console.log(photo.FILE_NAME,"photo");
     
     const fileUrl = encodeURI(generateImageUrl(photo.FILE_NAME)); // Ensure URL is encoded
     const fileName = photo.FILE_NAME;
    console.log(fileUrl,fileUrl,"riju");
    
   
     try {
       console.log('Downloading file from:', fileUrl);
   
       // Step 1: Download the file to the cache directory
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
          
                Alert.alert('Download Complete', 'Your file has been successfully saved to the Downloads folder.');

             
              } else {
                Alert.alert('Unsupported', 'Downloading is only supported on Android.');
              }
     } catch (error) {
       console.log('Error saving file:', error);
       Alert.alert('Error', 'Failed to save the file.');
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
  const handlepres =(item)=>{
    // console.log(item.SUB_DETAILS,"item");
    navigation.navigate('PreviousWorkDetailspage', { projectData: item });
    // navigation.navigate('PreviousWorkDetails');
  }

  return (
    <ScrollView>
     <Header /> 
      <View style={styles.MainContainer}>
        <Text style={styles.heading}>Project Id :{ projectData[0].PROJECT_NO}</Text>
        <Text style={styles.heading}>Designer : { projectData[0].INTERIOR_DESIGNER_NAME}</Text>
        <Text style={styles.heading}>{ projectData[0].CUSTOMER_ADDRESS}</Text>

        <Text style={styles.TaskHeading}>Task</Text>

        {loading ? (
  <ActivityIndicator size="large" color="#0000ff" />
) : (
  projectData.map((item, index) => (
    <TouchableOpacity key={index} onPress={() => handlepres(item)}>
      
        {item.INVOICE_STATUS === "Pending" && (
          <View style={styles.deatilsone}>
          <>
            <View style={{  marginLeft: responsiveWidth(2),padding:responsiveWidth(3) }}>
              <Text style={styles.txtone}>
                {item.WORK_CATEGORY_VALUE} ({item.TYPE})
              </Text>
              <Text style={styles.texttwo}>Start Date : {item.PROJECT_START_DATE}</Text>
              <Text style={styles.texttwo}>Status : {item.INVOICE_STATUS}</Text>
            </View>
            {item.WORK_CATEGORY_VALUE === 'Preliminaries Works' && (
              <TouchableOpacity style={styles.btn} onPress={handleFilePick}>
                <Text style={styles.btntxt}>Upload 3D Drawing</Text>
              </TouchableOpacity>
            )}
            {/* Content for Completed status */}
            {item.WORK_CATEGORY_VALUE === 'Preliminaries Works' &&
              (Array.isArray(image_store) && image_store.length > 0 ? (
                image_store.map((photo, index) => (
                  <View key={index} style={styles.photoContainer}>
                    <TouchableOpacity onPress={() => handleDownload(photo)}>
                      <AntDesign name="download" size={20} color="#4d8f91" style={styles.Icon} />
                    </TouchableOpacity>
                    <Image
                      source={{ uri: generateImageUrl(photo.FILE_NAME) }}
                      style={styles.image}
                    />
                  <TouchableOpacity onPress={() => handleDelete(photo)}>
                                      <AntDesign name="delete" size={20} color="red" style={styles.Icon} />
                                      </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text></Text>
              ))}
            
           
          </>
          </View>
        )}
     
    </TouchableOpacity>
  ))
)}







      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    marginVertical: responsiveHeight(2),
  },
  heading: {
    marginLeft: responsiveWidth(4),
    fontSize: responsiveFontSize(1.8),
  },
  TaskHeading: {
    color: '#4d8f91',
    marginLeft: responsiveWidth(4),
    marginTop: responsiveHeight(2),
    fontSize: responsiveFontSize(2),
  },
  deatilsone: {
    borderWidth: 1,
    height: 'auto',
    width: responsiveWidth(90),
    borderColor: '#c4c4c4',
    borderRadius: responsiveWidth(3),
    marginTop: responsiveHeight(1),
    marginLeft: responsiveWidth(4),
  },
  txtone: {
    color: '#4d8f91',
    fontSize: responsiveFontSize(2.3),
    fontWeight: '700',
  },
  texttwo: {
    color: '#000',
    fontSize: responsiveFontSize(1.5),
  },
  btn: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: responsiveWidth(40),
    padding: responsiveHeight(1),
    borderRadius: responsiveWidth(3),
    backgroundColor: '#4d8f91',
    marginTop: responsiveHeight(2),
    marginLeft: responsiveWidth(2),
  },
  btntxt: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  photoContainer: {
    marginTop: responsiveHeight(2),
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft:responsiveWidth(3)
  },
  image: {
    width: responsiveWidth(60),
    height: responsiveHeight(18),
    borderRadius: responsiveWidth(4),
    marginTop: responsiveHeight(2),
  },
  Icon: {
  marginTop:responsiveHeight(20)
  },
});

export default VerifiedAsset;
