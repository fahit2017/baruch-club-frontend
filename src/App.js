import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Import components
import StudentList from './components/StudentList';
import ClubList from './components/ClubList';
import EventList from './components/EventList';
import Home from './components/Home';
import AddStudent from './components/AddStudent';
import AddClub from './components/AddClub';
import AddEvent from './components/AddEvent';
import EditStudent from './components/EditStudent';
import EditClub from './components/EditClub';
import EditEvent from './components/EditEvent';

// Custom NavLink component to handle active state
const CustomNavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Nav.Link 
      as={Link} 
      to={to} 
      className={isActive ? 'active' : ''}
      style={{
        color: isActive ? '#fff' : 'rgba(255,255,255,.55)',
        fontWeight: isActive ? 'bold' : 'normal'
      }}
    >
      {children}
    </Nav.Link>
  );
};

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar bg="primary" variant="dark" expand="lg" className="shadow-sm">
          <Container>
            <Navbar.Brand as={Link} to="/" className="fw-bold">
              <i className="bi bi-building me-2"></i>
              Baruch College Club
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <CustomNavLink to="/">Home</CustomNavLink>
                <CustomNavLink to="/students">Students</CustomNavLink>
                <CustomNavLink to="/clubs">Clubs</CustomNavLink>
                <CustomNavLink to="/events">Events</CustomNavLink>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <main className="flex-grow-1 py-4">
          <Container>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/students" element={<StudentList />} />
              <Route path="/students/add" element={<AddStudent />} />
              <Route path="/students/edit/:id" element={<EditStudent />} />
              <Route path="/clubs" element={<ClubList />} />
              <Route path="/clubs/add" element={<AddClub />} />
              <Route path="/clubs/edit/:id" element={<EditClub />} />
              <Route path="/events" element={<EventList />} />
              <Route path="/events/add" element={<AddEvent />} />
              <Route path="/events/edit/:id" element={<EditEvent />} />
            </Routes>
          </Container>
        </main>

        <footer className="bg-light py-3 mt-auto">
          <Container>
            <div className="text-center text-muted">
              <small>© {new Date().getFullYear()} Baruch College Club Management System</small>
            </div>
          </Container>
        </footer>
      </div>
    </Router>
  );
}

export default App;
