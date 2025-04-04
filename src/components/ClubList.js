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
import { getAllClubs, deleteClub } from '../services/clubService';

const ClubList = () => {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clubToDelete, setClubToDelete] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    loadClubs();
  }, []);

  useEffect(() => {
    filterClubs();
  }, [searchTerm, clubs]);

  const loadClubs = async () => {
    setLoading(true);
    try {
      const response = await getAllClubs();
      setClubs(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to load clubs. Please try again later.');
      console.error('Error loading clubs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterClubs = () => {
    const filtered = clubs.filter(club => 
      club.clubName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.clubDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.clubPresident.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.clubEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClubs(filtered);
    setCurrentPage(1);
  };

  const handleDeleteClick = (club) => {
    setClubToDelete(club);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!clubToDelete) return;

    setLoading(true);
    try {
      await deleteClub(clubToDelete.id);
      setSuccess('Club deleted successfully');
      loadClubs();
    } catch (error) {
      setError('Failed to delete club. Please try again later.');
      console.error('Error deleting club:', error);
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setClubToDelete(null);
    }
  };

  const handleEdit = (club) => {
    navigate(`/clubs/edit/${club.id}`);
  };

  const totalPages = Math.ceil(filteredClubs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClubs = filteredClubs.slice(startIndex, endIndex);

  return (
    <Container>
      <Card className="shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center bg-white">
          <h3 className="mb-0">Clubs</h3>
          <Button 
            variant="primary" 
            onClick={() => navigate('/clubs/add')}
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
              placeholder="Search clubs..."
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
                      <th>President</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentClubs.map(club => (
                      <tr key={club.id}>
                        <td>{club.clubName}</td>
                        <td>{club.clubDescription}</td>
                        <td>{club.clubPresident}</td>
                        <td>{club.clubEmail}</td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEdit(club)}
                          >
                            <i className="bi bi-pencil"></i>
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteClick(club)}
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {currentClubs.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center py-4">
                          No clubs found
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
          Are you sure you want to delete {clubToDelete?.clubName}?
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

export default ClubList; 