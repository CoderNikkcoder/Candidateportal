// src/pages/ReviewPage.js
import React, { useState } from "react";
import { Container, Card, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ReviewPage({ formData, videoBlob }) {
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));
      if (videoBlob) {
        data.append(
          "video",
          new File([videoBlob], `${formData.firstName}-${formData.lastName}.webm`)
        );
      }

      const res = await axios.post("http://localhost:5000/api/candidates", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setStatus("success");
        setTimeout(() => navigate("/"), 3000);
      } else setStatus("error");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <Container style={{ maxWidth: "600px" }} className="my-4">
      <Card className="p-4">
        <h3 className="mb-3 text-center">Review Application</h3>

        {status === "success" && (
          <Alert variant="success">✅ Submitted successfully!</Alert>
        )}
        {status === "error" && (
          <Alert variant="danger">❌ Submission failed!</Alert>
        )}

        <p><b>Name:</b> {formData.firstName} {formData.lastName}</p>
        <p><b>Position:</b> {formData.positionApplied}</p>
        <p><b>Resume:</b> {formData.resume?.name}</p>

        {videoBlob && (
          <video
            src={URL.createObjectURL(videoBlob)}
            controls
            className="w-100 border rounded my-2"
          />
        )}

        <div className="d-flex gap-2">
          <Button variant="outline-secondary" onClick={() => navigate("/record")}>
            ← Back
          </Button>
          <Button variant="success" onClick={handleSubmit}>
            ✅ Submit
          </Button>
        </div>
      </Card>
    </Container>
  );
}

export default ReviewPage;
