import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Table, 
  Button, 
  Container, 
  Alert, 
  Modal, 
  Form, 
  InputGroup, 
  Pagination,
  Spinner
} from 'react-bootstrap';
import { getAllEvents, deleteEvent } from '../services/eventService';

const EventList = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [searchTerm, events]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const response = await getAllEvents();
      setEvents(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to load events. Please try again later.');
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    const filtered = events.filter(event => 
      event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.eventDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.eventLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.clubName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
    setCurrentPage(1);
  };

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!eventToDelete) return;

    setLoading(true);
    try {
      await deleteEvent(eventToDelete.id);
      setSuccess('Event deleted successfully');
      loadEvents();
    } catch (error) {
      setError('Failed to delete event. Please try again later.');
      console.error('Error deleting event:', error);
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setEventToDelete(null);
    }
  };

  const handleEdit = (event) => {
    navigate(`/events/edit/${event.id}`);
  };

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEvents = filteredEvents.slice(startIndex, endIndex);

  return (
    <Container>
      <Card className="shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center bg-white">
          <h3 className="mb-0">Events</h3>
          <Button 
            variant="primary" 
            onClick={() => navigate('/events/add')}
          >
            <i className="bi bi-plus-lg me-2"></i>
            Add New
          </Button>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <InputGroup className="mb-3">
            <InputGroup.Text>
              <i className="bi bi-search"></i>
            </InputGroup.Text>
            <Form.Control
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button 
                variant="outline-secondary" 
                onClick={() => setSearchTerm('')}
              >
                Clear
              </Button>
            )}
          </InputGroup>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Date</th>
                      <th>Location</th>
                      <th>Club</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentEvents.map(event => (
                      <tr key={event.id}>
                        <td>{event.eventName}</td>
                        <td>{event.eventDescription}</td>
                        <td>{new Date(event.eventDate).toLocaleDateString()}</td>
                        <td>{event.eventLocation}</td>
                        <td>{event.clubName}</td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEdit(event)}
                          >
                            <i className="bi bi-pencil"></i>
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteClick(event)}
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {currentEvents.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          No events found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination>
                    <Pagination.First 
                      onClick={() => setCurrentPage(1)} 
                      disabled={currentPage === 1}
                    />
                    <Pagination.Prev 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                      disabled={currentPage === 1}
                    />
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Pagination.Item
                        key={page}
                        active={page === currentPage}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                      disabled={currentPage === totalPages}
                    />
                    <Pagination.Last 
                      onClick={() => setCurrentPage(totalPages)} 
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete {eventToDelete?.eventName}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={loading}>
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
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default EventList; 