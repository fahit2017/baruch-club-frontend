import React from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <div className="bg-primary text-white py-5 mb-4">
        <Container>
          <h1 className="display-4 fw-bold">Welcome to Baruch College Club Management</h1>
          <p className="lead">Manage students, clubs, and events in one place</p>
        </Container>
      </div>

      <Container>
        <Row className="g-4">
          <Col md={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <i className="bi bi-people-fill fs-1 text-primary me-3"></i>
                  <div>
                    <Card.Title className="mb-1">Students</Card.Title>
                    <Card.Text className="text-muted">Manage student information</Card.Text>
                  </div>
                </div>
                <Link to="/students" className="btn btn-outline-primary w-100">
                  View Students
                </Link>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <i className="bi bi-building fs-1 text-primary me-3"></i>
                  <div>
                    <Card.Title className="mb-1">Clubs</Card.Title>
                    <Card.Text className="text-muted">Manage club information</Card.Text>
                  </div>
                </div>
                <Link to="/clubs" className="btn btn-outline-primary w-100">
                  View Clubs
                </Link>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <i className="bi bi-calendar-event fs-1 text-primary me-3"></i>
                  <div>
                    <Card.Title className="mb-1">Events</Card.Title>
                    <Card.Text className="text-muted">Manage event information</Card.Text>
                  </div>
                </div>
                <Link to="/events" className="btn btn-outline-primary w-100">
                  View Events
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home; 