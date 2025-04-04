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
import { getAllStudents, deleteStudent } from '../services/studentService';

const StudentList = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [searchTerm, students]);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const response = await getAllStudents();
      setStudents(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to load students. Please try again later.');
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    const filtered = students.filter(student => 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.clubName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
    setCurrentPage(1);
  };

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!studentToDelete) return;

    setLoading(true);
    try {
      await deleteStudent(studentToDelete.id);
      setSuccess('Student deleted successfully');
      loadStudents();
    } catch (error) {
      setError('Failed to delete student. Please try again later.');
      console.error('Error deleting student:', error);
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setStudentToDelete(null);
    }
  };

  const handleEdit = (student) => {
    navigate(`/students/edit/${student.id}`);
  };

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);

  return (
    <Container>
      <Card className="shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center bg-white">
          <h3 className="mb-0">Students</h3>
          <Button 
            variant="primary" 
            onClick={() => navigate('/students/add')}
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
              placeholder="Search students..."
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
                      <th>Email</th>
                      <th>Gender</th>
                      <th>Club</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentStudents.map(student => (
                      <tr key={student.id}>
                        <td>{student.firstName} {student.lastName}</td>
                        <td>{student.email}</td>
                        <td>{student.gender}</td>
                        <td>{student.clubName}</td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEdit(student)}
                          >
                            <i className="bi bi-pencil"></i>
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteClick(student)}
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {currentStudents.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center py-4">
                          No students found
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
          Are you sure you want to delete {studentToDelete?.firstName} {studentToDelete?.lastName}?
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

export default StudentList; 