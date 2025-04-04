// apiConfig.js
    // const API_URL = "https://dev-ninecreationapi.devxportal.com";
// https://erpapi.9creation.com.sg // Assuming you have .env configured
//  console.log(API_URL,"56")
     const API_URL = "https://erpapi.9creation.com.sg"
export const API_ENDPOINTS = {
   
    subcontractor_task_list: `${API_URL}/api/WebApi/api-get-view-sub-contractor-task-list`, 
    useerAsset:`${API_URL}/api/WebApi/api-get-view-userwise-asset-list`,
    verify_assests:`${API_URL}/api/WebApi/api-post-add-update-asset-verification`,
    current_location:`${API_URL}/api/WebApi/api-post-add-update-asset-verification`,
    current_location_fetch:`${API_URL}/api/WebApi/map/get-locations-details`,
    post_comment:`${API_URL}/api/WebApi/api-post-add-update-asset-verification`,
    file_upload_get:`${API_URL}/api/WebApi/api-get-view-file-upload`,
    // UserProfile_get:`${API_URL}/api/webApi/api-get-view-specific-sub-contractor-mgmt-app`,
    add_invoice_detail :`${API_URL}/api/WebApi/api-post-add-update-purchase-order-info`, 
    drawing_image_upload: `${API_URL}/api/WebApi/api-post-add-update-file-upload`, 
    image_upload: `${API_URL}/api/WebApi/api-post-file-upload`,
    UserProfile_get:`${API_URL}/api/WebApi/api-get-view-specific-sub-contractor-mgmt-app`,
    Update_password:`${API_URL}/api/WebApi/api-post-add-update-sub-contractor`
   
};
