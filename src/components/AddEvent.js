import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Card } from 'react-bootstrap';
import { createEvent } from '../services/eventService';

const AddEvent = () => {
  const navigate = useNavigate();
  const [event, setEvent] = useState({
    eventName: '',
    eventDescription: '',
    eventDate: '',
    eventTime: '',
    eventLocation: '',
    clubName: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEvent(event);
      navigate('/events');
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header as="h3">Add New Event</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Event Name</Form.Label>
              <Form.Control
                type="text"
                name="eventName"
                value={event.eventName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Event Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="eventDescription"
                value={event.eventDescription}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Event Date</Form.Label>
              <Form.Control
                type="date"
                name="eventDate"
                value={event.eventDate}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Event Time</Form.Label>
              <Form.Control
                type="time"
                name="eventTime"
                value={event.eventTime}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Event Location</Form.Label>
              <Form.Control
                type="text"
                name="eventLocation"
                value={event.eventLocation}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Club Name</Form.Label>
              <Form.Control
                type="text"
                name="clubName"
                value={event.clubName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Add Event
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddEvent; 