# Candidate Information & Video Submission Portal

A full-stack web application for candidate applications with video recording capability, built as per assignment requirements.

##  Features Implemented

###  Page 1: Candidate Information Form
- **Form Fields:** First Name, Last Name, Position Applied For, Current Position, Experience in Years, Resume Upload
- **Validation:** All fields mandatory, PDF files only (max 5MB), appropriate error messages
- **Navigation:** Next button proceeds to video recording page

### Page 2: Video Recording
- **Instructions Display:** Brief introduction, interest in position, relevant experience, career goals
- **Recording Features:** Camera/microphone access, live video preview, 90-second timer, Start/Stop buttons
- **Validation:** Video duration ≤ 90 seconds, error messages for exceeded limit

### Page 3: Review & Submit
- **Display:** All candidate details (Name, Position, Experience, etc.)
- **Media:** Downloadable resume link, embedded video player for playback
- **Submission:** Final application submission with data storage

## 🛠️ Technical Stack

### Frontend
- **React** with React Router for multi-page navigation
- **Bootstrap** for responsive styling
- **MediaRecorder API** for video capture
- **Axios** for API communication

### Backend
- **Node.js** with **Express** framework
- **Multer** for file upload handling (PDF max 5MB)
- **MongoDB** with **GridFS** for video storage
- **CORS** enabled for cross-origin requests
