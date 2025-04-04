import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { createStudent } from '../services/studentService';

const StudentForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        gender: '',
        clubName: ''
    });

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
            const response = await createStudent(formData);
            alert('Student registered successfully!');
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                gender: '',
                clubName: ''
            });
        } catch (error) {
            console.error('Error registering student:', error);
            alert('Error registering student. Please try again.');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Student Registration
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Gender</InputLabel>
                        <Select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                        >
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Club Name"
                        name="clubName"
                        value={formData.clubName}
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
                        Register
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default StudentForm; 