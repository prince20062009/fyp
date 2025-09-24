# Profile Edit Feature - Testing Instructions

## Overview
We have successfully implemented profile editing functionality for both doctors and patients in the Medi-Hub application. This document provides instructions on how to test the new features.

## Implementation Summary

### Backend Changes
1. Added `updateUserProfile` controller function for patients and admins
2. Added `updateDoctorProfile` controller function for doctors
3. Added new API routes:
   - PUT `/api/v1/user/patient/update` for patient/admin profile updates
   - PUT `/api/v1/user/doctor/update` for doctor profile updates

### Frontend Changes
1. Created a reusable `ProfileEditForm` component
2. Updated `PatientDashboard.jsx` with profile editing capability
3. Updated `DoctorDashboard.jsx` with profile editing capability
4. Added API utility functions for profile updates

## Prerequisites for Testing

1. MongoDB database running
2. Backend server running on port 8000
3. Frontend server running
4. Valid user accounts (both doctor and patient)

## Testing Steps

### 1. Start the Backend Server
Navigate to the backend directory and start the server:
```bash
cd medi-hub-main/backend
npm start
```
or
```bash
cd medi-hub-main/backend
node index.js
```

### 2. Start the Frontend Server
Navigate to the frontend directory and start the development server:
```bash
cd medi-hub-main/frontend
npm run dev
```

### 3. Test Patient Profile Editing
1. Open your browser and navigate to the application
2. Log in as a patient user
3. Navigate to the "Profile" section in the dashboard
4. Click the "Edit Profile" button
5. Modify some fields (e.g., phone number, address)
6. Click "Save Changes"
7. Verify that:
   - The form shows a loading spinner during save
   - Success message appears
   - Updated information is displayed after saving
   - Local storage is updated with new profile data

### 4. Test Doctor Profile Editing
1. Log out of the patient account
2. Log in as a doctor user
3. Navigate to the "Profile" section in the dashboard
4. Click the "Edit Profile" button
5. Modify some fields (e.g., phone number, department)
6. Click "Save Changes"
7. Verify that:
   - The form shows a loading spinner during save
   - Success message appears
   - Updated information is displayed after saving
   - Local storage is updated with new profile data

## Expected API Endpoints

### Patient/Admin Profile Update
- **Method**: PUT
- **URL**: `/api/v1/user/patient/update`
- **Headers**: 
  - Authorization: Bearer [token]
  - Content-Type: application/json
- **Body**:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "age": 30,
    "phone": "1234567890",
    "address": {
      "city": "New York",
      "country": "USA"
    },
    "emergencyContact": {
      "name": "Jane Doe",
      "phone": "0987654321",
      "relationship": "Spouse"
    }
  }
  ```

### Doctor Profile Update
- **Method**: PUT
- **URL**: `/api/v1/user/doctor/update`
- **Headers**: 
  - Authorization: Bearer [token]
  - Content-Type: application/json
- **Body**:
  ```json
  {
    "firstName": "Dr. John",
    "lastName": "Smith",
    "phone": "1234567890",
    "department": "Cardiology",
    "specializations": ["Heart Surgery", "Cardiac Care"],
    "experience": 10
  }
  ```

## Troubleshooting

### If Backend Server Won't Start
1. Check that MongoDB is running
2. Verify environment variables in `.env` file
3. Check for any port conflicts (default is 8000)
4. Ensure all dependencies are installed (`npm install`)

### If Frontend Doesn't Connect to Backend
1. Verify backend is running on port 8000
2. Check API_BASE_URL in `frontend/src/utils/api.js`
3. Ensure CORS is properly configured

### If Profile Updates Don't Persist
1. Check browser console for errors
2. Verify API responses in network tab
3. Ensure user is properly authenticated
4. Check MongoDB records directly

## Validation Rules

### Patient Profile
- First Name: Required, min 2 characters
- Last Name: Required, min 2 characters
- Age: Required, between 1-120
- Phone: Required, exactly 10 digits
- Address: Optional
- Emergency Contact: Optional (patients only)

### Doctor Profile
- First Name: Required, min 3 characters
- Last Name: Required, min 3 characters
- Phone: Required, exactly 10 digits
- Department: Required
- Specializations: Optional
- Experience: Optional (years)

## Security Notes

1. Email field is read-only and cannot be changed
2. Only authenticated users can update their own profiles
3. Password changes are not part of this profile update feature
4. All API requests include authentication tokens

## Files Modified

### Backend
- `backend/src/controllers/user.controller.js`
- `backend/src/controllers/doctor.controller.js`
- `backend/src/routes/user.routes.js`

### Frontend
- `frontend/src/components/ProfileEditForm.jsx`
- `frontend/src/pages/dashboards/PatientDashboard.jsx`
- `frontend/src/pages/dashboards/DoctorDashboard.jsx`
- `frontend/src/utils/api.js`

## Success Criteria

Testing is successful if:
1. Both patient and doctor users can edit their profiles
2. Role-specific fields are displayed correctly
3. Form validation works as expected
4. Profile changes are saved and persisted
5. Error handling works for invalid data
6. Loading states provide good user feedback