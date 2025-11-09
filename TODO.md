# TODO: Fix Video Storage in Database

- [x] Update server/index.js to include video in schema and handle video upload
- [x] Update client/src/app.js to send video file in FormData during submission
- [x] Set up GridFS bucket for video storage in server/index.js
- [x] Update candidate schema to use videoId (ObjectId) instead of video Buffer
- [x] Modify POST /api/candidates route to upload video to GridFS and store file ID
- [x] Test the application to ensure video is stored (server and client running)
