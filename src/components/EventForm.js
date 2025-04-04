import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { createEvent, getEventById, updateEvent } from '../services/eventService';
import { useNavigate, useParams } from 'react-router-dom';

const EventForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        clubName: '',
        eventTitle: '',
        eventTheme: '',
        eventDescription: '',
        contactEmail: ''
    });

    useEffect(() => {
        if (id) {
            const fetchEvent = async () => {
                try {
                    const response = await getEventById(id);
                    setFormData(response.data);
                } catch (error) {
                    console.error('Error fetching event:', error);
                    alert('Error loading event details. Please try again.');
                }
            };
            fetchEvent();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await updateEvent(id, formData);
                alert('Event updated successfully!');
            } else {
                await createEvent(formData);
                alert('Event created successfully!');
            }
            navigate('/events');
        } catch (error) {
            console.error('Error saving event:', error);
            alert('Error saving event. Please try again.');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {id ? 'Update Event' : 'Create Event'}
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Club Name"
                        name="clubName"
                        value={formData.clubName}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Event Title"
                        name="eventTitle"
                        value={formData.eventTitle}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Event Theme"
                        name="eventTheme"
                        value={formData.eventTheme}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Event Description"
                        name="eventDescription"
                        value={formData.eventDescription}
                        onChange={handleChange}
                        multiline
                        rows={4}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Contact Email"
                        name="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 3 }}
                    >
                        {id ? 'Update' : 'Create'}
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default EventForm; 