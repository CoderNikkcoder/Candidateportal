
import React, { useState } from "react";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function CandidateForm({ formData, setFormData }) {
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf" && file.size <= 5 * 1024 * 1024) {
      setFormData((prev) => ({ ...prev, resume: file }));
      setErrors((prev) => ({ ...prev, resume: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        resume: "Please upload a valid PDF (max 5MB)",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.positionApplied.trim())
      newErrors.positionApplied = "Position is required";
    if (!formData.resume) newErrors.resume = "Resume is required";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
    } else {
      navigate("/record");
    }
  };

  return (
    <Container style={{ maxWidth: "600px" }} className="my-4">
      <Card className="p-4">
        <h3 className="mb-3 text-center">Candidate Information</h3>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>First Name *</Form.Label>
            <Form.Control
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              isInvalid={!!errors.firstName}
            />
            <Form.Control.Feedback type="invalid">
              {errors.firstName}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Last Name *</Form.Label>
            <Form.Control
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              isInvalid={!!errors.lastName}
            />
            <Form.Control.Feedback type="invalid">
              {errors.lastName}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Position Applied For *</Form.Label>
            <Form.Control
              type="text"
              value={formData.positionApplied}
              onChange={(e) => handleInputChange("positionApplied", e.target.value)}
              isInvalid={!!errors.positionApplied}
            />
            <Form.Control.Feedback type="invalid">
              {errors.positionApplied}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Current Position</Form.Label>
            <Form.Control
              type="text"
              value={formData.currentPosition}
              onChange={(e) => handleInputChange("currentPosition", e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Experience (Years)</Form.Label>
            <Form.Control
              type="number"
              value={formData.experience}
              onChange={(e) => handleInputChange("experience", e.target.value)}
              min="0"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Upload Resume *</Form.Label>
            <Form.Control
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              isInvalid={!!errors.resume}
            />
            <Form.Control.Feedback type="invalid">
              {errors.resume}
            </Form.Control.Feedback>
            {formData.resume && (
              <Form.Text className="text-success">
                 {formData.resume.name}
              </Form.Text>
            )}
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100">
            Next →
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default CandidateForm;
