import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Card } from 'react-bootstrap';
import { createClub } from '../services/clubService';

const AddClub = () => {
  const navigate = useNavigate();
  const [club, setClub] = useState({
    clubName: '',
    clubDescription: '',
    clubPresident: '',
    clubEmail: '',
    meetingTime: '',
    meetingLocation: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClub(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createClub(club);
      navigate('/clubs');
    } catch (error) {
      console.error('Error creating club:', error);
    }
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header as="h3">Add New Club</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Club Name</Form.Label>
              <Form.Control
                type="text"
                name="clubName"
                value={club.clubName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Club Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="clubDescription"
                value={club.clubDescription}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Club President</Form.Label>
              <Form.Control
                type="text"
                name="clubPresident"
                value={club.clubPresident}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Club Email</Form.Label>
              <Form.Control
                type="email"
                name="clubEmail"
                value={club.clubEmail}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Meeting Time</Form.Label>
              <Form.Control
                type="text"
                name="meetingTime"
                value={club.meetingTime}
                onChange={handleChange}
                required
                placeholder="e.g., Every Monday 2:00 PM"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Meeting Location</Form.Label>
              <Form.Control
                type="text"
                name="meetingLocation"
                value={club.meetingLocation}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Add Club
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddClub; 