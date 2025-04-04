import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Container, Card, Alert, Modal, Spinner } from 'react-bootstrap';
import { getStudentById, updateStudent } from '../services/studentService';

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    clubName: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadStudent();
  }, [id]);

  const loadStudent = async () => {
    setLoading(true);
    try {
      const response = await getStudentById(id);
      setStudent(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to load student data. Please try again later.');
      console.error('Error loading student:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!student.firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (student.firstName.length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }

    if (!student.lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (student.lastName.length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }

    if (!student.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(student.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!student.gender) {
      errors.gender = 'Gender is required';
    }

    if (!student.clubName.trim()) {
      errors.clubName = 'Club name is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await updateStudent(id, student);
      setSuccess('Student updated successfully');
      setTimeout(() => {
        navigate('/students');
      }, 2000);
    } catch (error) {
      setError('Failed to update student. Please try again later.');
      console.error('Error updating student:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    setShowCancelModal(false);
    navigate('/students');
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header>
          <h3>Edit Student</h3>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={student.firstName}
                  onChange={handleChange}
                  isInvalid={!!formErrors.firstName}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.firstName}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={student.lastName}
                  onChange={handleChange}
                  isInvalid={!!formErrors.lastName}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.lastName}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={student.email}
                  onChange={handleChange}
                  isInvalid={!!formErrors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Gender</Form.Label>
                <Form.Select
                  name="gender"
                  value={student.gender}
                  onChange={handleChange}
                  isInvalid={!!formErrors.gender}
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {formErrors.gender}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Club Name</Form.Label>
                <Form.Control
                  type="text"
                  name="clubName"
                  value={student.clubName}
                  onChange={handleChange}
                  isInvalid={!!formErrors.clubName}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.clubName}
                </Form.Control.Feedback>
              </Form.Group>

              <div className="d-flex justify-content-between">
                <Button variant="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Updating...
                    </>
                  ) : (
                    'Update Student'
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Card.Body>
      </Card>

      {/* Cancel Confirmation Modal */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Cancel</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to cancel? Any unsaved changes will be lost.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            Continue Editing
          </Button>
          <Button variant="danger" onClick={confirmCancel}>
            Cancel Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default EditStudent; 