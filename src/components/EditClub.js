import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Container, Card, Alert, Modal, Spinner } from 'react-bootstrap';
import { getClubById, updateClub } from '../services/clubService';

const EditClub = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState({
    clubName: '',
    clubDescription: '',
    clubPresident: '',
    clubEmail: '',
    meetingTime: '',
    meetingLocation: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadClub();
  }, [id]);

  const loadClub = async () => {
    setLoading(true);
    try {
      const response = await getClubById(id);
      setClub(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to load club data. Please try again later.');
      console.error('Error loading club:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!club.clubName.trim()) {
      errors.clubName = 'Club name is required';
    } else if (club.clubName.length < 2) {
      errors.clubName = 'Club name must be at least 2 characters';
    }

    if (!club.clubDescription.trim()) {
      errors.clubDescription = 'Description is required';
    } else if (club.clubDescription.length < 10) {
      errors.clubDescription = 'Description must be at least 10 characters';
    }

    if (!club.clubPresident.trim()) {
      errors.clubPresident = 'President name is required';
    } else if (club.clubPresident.length < 2) {
      errors.clubPresident = 'President name must be at least 2 characters';
    }

    if (!club.clubEmail.trim()) {
      errors.clubEmail = 'Email is required';
    } else if (!emailRegex.test(club.clubEmail)) {
      errors.clubEmail = 'Please enter a valid email address';
    }

    if (!club.meetingTime.trim()) {
      errors.meetingTime = 'Meeting time is required';
    }

    if (!club.meetingLocation.trim()) {
      errors.meetingLocation = 'Meeting location is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClub(prev => ({
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
      await updateClub(id, club);
      setSuccess('Club updated successfully');
      setTimeout(() => {
        navigate('/clubs');
      }, 2000);
    } catch (error) {
      setError('Failed to update club. Please try again later.');
      console.error('Error updating club:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    setShowCancelModal(false);
    navigate('/clubs');
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header>
          <h3>Edit Club</h3>
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
                <Form.Label>Club Name</Form.Label>
                <Form.Control
                  type="text"
                  name="clubName"
                  value={club.clubName}
                  onChange={handleChange}
                  isInvalid={!!formErrors.clubName}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.clubName}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="clubDescription"
                  value={club.clubDescription}
                  onChange={handleChange}
                  isInvalid={!!formErrors.clubDescription}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.clubDescription}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>President</Form.Label>
                <Form.Control
                  type="text"
                  name="clubPresident"
                  value={club.clubPresident}
                  onChange={handleChange}
                  isInvalid={!!formErrors.clubPresident}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.clubPresident}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="clubEmail"
                  value={club.clubEmail}
                  onChange={handleChange}
                  isInvalid={!!formErrors.clubEmail}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.clubEmail}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Meeting Time</Form.Label>
                <Form.Control
                  type="text"
                  name="meetingTime"
                  value={club.meetingTime}
                  onChange={handleChange}
                  isInvalid={!!formErrors.meetingTime}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.meetingTime}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Meeting Location</Form.Label>
                <Form.Control
                  type="text"
                  name="meetingLocation"
                  value={club.meetingLocation}
                  onChange={handleChange}
                  isInvalid={!!formErrors.meetingLocation}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.meetingLocation}
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
                    'Update Club'
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

export default EditClub; 