import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Container, Card, Alert, Modal, Spinner } from 'react-bootstrap';
import { getEventById, updateEvent } from '../services/eventService';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState({
    eventName: '',
    eventDescription: '',
    eventDate: '',
    eventTime: '',
    eventLocation: '',
    clubName: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    setLoading(true);
    try {
      const response = await getEventById(id);
      setEvent(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to load event data. Please try again later.');
      console.error('Error loading event:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    const today = new Date();
    const eventDate = new Date(event.eventDate);

    if (!event.eventName.trim()) {
      errors.eventName = 'Event name is required';
    } else if (event.eventName.length < 2) {
      errors.eventName = 'Event name must be at least 2 characters';
    }

    if (!event.eventDescription.trim()) {
      errors.eventDescription = 'Description is required';
    } else if (event.eventDescription.length < 10) {
      errors.eventDescription = 'Description must be at least 10 characters';
    }

    if (!event.eventDate) {
      errors.eventDate = 'Event date is required';
    } else if (eventDate < today) {
      errors.eventDate = 'Event date cannot be in the past';
    }

    if (!event.eventTime) {
      errors.eventTime = 'Event time is required';
    }

    if (!event.eventLocation.trim()) {
      errors.eventLocation = 'Location is required';
    }

    if (!event.clubName.trim()) {
      errors.clubName = 'Club name is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent(prev => ({
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
      await updateEvent(id, event);
      setSuccess('Event updated successfully');
      setTimeout(() => {
        navigate('/events');
      }, 2000);
    } catch (error) {
      setError('Failed to update event. Please try again later.');
      console.error('Error updating event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    setShowCancelModal(false);
    navigate('/events');
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header>
          <h3>Edit Event</h3>
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
                <Form.Label>Event Name</Form.Label>
                <Form.Control
                  type="text"
                  name="eventName"
                  value={event.eventName}
                  onChange={handleChange}
                  isInvalid={!!formErrors.eventName}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.eventName}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="eventDescription"
                  value={event.eventDescription}
                  onChange={handleChange}
                  isInvalid={!!formErrors.eventDescription}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.eventDescription}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  name="eventDate"
                  value={event.eventDate}
                  onChange={handleChange}
                  isInvalid={!!formErrors.eventDate}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.eventDate}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Time</Form.Label>
                <Form.Control
                  type="time"
                  name="eventTime"
                  value={event.eventTime}
                  onChange={handleChange}
                  isInvalid={!!formErrors.eventTime}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.eventTime}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  name="eventLocation"
                  value={event.eventLocation}
                  onChange={handleChange}
                  isInvalid={!!formErrors.eventLocation}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.eventLocation}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Club Name</Form.Label>
                <Form.Control
                  type="text"
                  name="clubName"
                  value={event.clubName}
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
                    'Update Event'
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

export default EditEvent; 