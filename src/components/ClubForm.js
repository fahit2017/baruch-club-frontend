import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { createClub, getClubById, updateClub } from '../services/clubService';
import { useNavigate, useParams } from 'react-router-dom';

const ClubForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        clubName: '',
        clubDescription: '',
        clubEmail: ''
    });

    useEffect(() => {
        if (id) {
            const fetchClub = async () => {
                try {
                    const response = await getClubById(id);
                    setFormData(response.data);
                } catch (error) {
                    console.error('Error fetching club:', error);
                    alert('Error loading club details. Please try again.');
                }
            };
            fetchClub();
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
                await updateClub(id, formData);
                alert('Club updated successfully!');
            } else {
                await createClub(formData);
                alert('Club created successfully!');
            }
            navigate('/clubs');
        } catch (error) {
            console.error('Error saving club:', error);
            alert('Error saving club. Please try again.');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {id ? 'Update Club' : 'Create Club'}
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
                        label="Description"
                        name="clubDescription"
                        value={formData.clubDescription}
                        onChange={handleChange}
                        multiline
                        rows={4}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Club Email"
                        name="clubEmail"
                        type="email"
                        value={formData.clubEmail}
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

export default ClubForm; 