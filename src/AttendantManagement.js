import React, { useEffect, useState } from "react";
import { getAttendants, createAttendant, updateAttendant, deleteAttendant } from "./attendantService";
import { Container, Row, Col, Form, Button, Modal, Card, Table } from "react-bootstrap";
import { FaUserPlus, FaEdit, FaTrashAlt, FaUsers } from "react-icons/fa";

function AttendantManagement() {
  const [attendants, setAttendants] = useState([]);
  const [newAttendant, setNewAttendant] = useState({ id: "", name: "", address: "", mobile_number: "", comments: "" });
  const [editAttendant, setEditAttendant] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchAttendants();
  }, []);

  const fetchAttendants = async () => {
    try {
      const response = await getAttendants();
      setAttendants(response.data);
    } catch (error) {
      console.error("Error fetching attendants:", error);
    }
  };

  const handleCreateAttendant = async () => {
    try {
      await createAttendant(newAttendant);
      setNewAttendant({ id: "", name: "", address: "", mobile_number: "", comments: "" });
      fetchAttendants();
    } catch (error) {
      console.error("Error creating attendant:", error);
    }
  };

  const handleUpdateAttendant = async () => {
    if (!editAttendant) return;
    try {
      await updateAttendant(editAttendant);
      setEditAttendant(null);
      setShowEditModal(false);
      fetchAttendants();
    } catch (error) {
      console.error("Error updating attendant:", error);
    }
  };

  const handleDeleteAttendant = async (id) => {
    try {
      await deleteAttendant(id);
      fetchAttendants();
    } catch (error) {
      console.error("Error deleting attendant:", error);
    }
  };

  return (
    <Container className="mt-5">
      <Card className="shadow-lg p-4 rounded-3 border-0 bg-light">
        <h1 className="text-center mb-4 text-dark fw-bold">
          <FaUsers /> Attendant Management
        </h1>

        {/* Retrieve Button */}
        <Row className="mb-4">
          <Col className="text-center">
            <Button variant="info" className="px-4 py-2 fw-bold" onClick={fetchAttendants}>
              🔄 Refresh Attendants
            </Button>
          </Col>
        </Row>

        {/* Create Attendant Form */}
        <Row className="mb-5">
          <Col md={6} className="mx-auto">
            <Card className="p-4 shadow-sm border-0 rounded-3 bg-white">
              <h3 className="text-center text-primary">➕ Add New Attendant</h3>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>ID</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter ID"
                    value={newAttendant.id}
                    onChange={(e) => setNewAttendant({ ...newAttendant, id: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Name"
                    value={newAttendant.name}
                    onChange={(e) => setNewAttendant({ ...newAttendant, name: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Address"
                    value={newAttendant.address}
                    onChange={(e) => setNewAttendant({ ...newAttendant, address: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Mobile Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Mobile Number"
                    value={newAttendant.mobile_number}
                    onChange={(e) => setNewAttendant({ ...newAttendant, mobile_number: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Comments</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Comments"
                    value={newAttendant.comments}
                    onChange={(e) => setNewAttendant({ ...newAttendant, comments: e.target.value })}
                  />
                </Form.Group>
                <Button variant="success" className="w-100 fw-bold" onClick={handleCreateAttendant}>
                  <FaUserPlus /> Add Attendant
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>

        {/* Attendant Table */}
        <Row>
          <Col>
            <h4 className="text-center mb-3 text-dark">📋 Attendant List</h4>
            <Table striped bordered hover responsive="sm" className="shadow">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Mobile Number</th>
                  <th>Comments</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {attendants.map((attendant) => (
                  <tr key={attendant.id}>
                    <td>{attendant.id}</td>
                    <td>{attendant.name}</td>
                    <td>{attendant.address}</td>
                    <td>{attendant.mobile_number}</td>
                    <td>{attendant.comments}</td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2 fw-bold"
                        onClick={() => {
                          setEditAttendant(attendant);
                          setShowEditModal(true);
                        }}
                      >
                        <FaEdit /> Edit
                      </Button>
                      <Button variant="danger" size="sm" className="fw-bold" onClick={() => handleDeleteAttendant(attendant.id)}>
                        <FaTrashAlt /> Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Card>

      {/* Edit Attendant Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-primary">✏️ Edit Attendant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editAttendant && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>ID</Form.Label>
                <Form.Control type="text" value={editAttendant.id} readOnly />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" value={editAttendant.name} onChange={(e) => setEditAttendant({ ...editAttendant, name: e.target.value })} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control type="text" value={editAttendant.address} onChange={(e) => setEditAttendant({ ...editAttendant, address: e.target.value })} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control type="text" value={editAttendant.mobile_number} onChange={(e) => setEditAttendant({ ...editAttendant, mobile_number: e.target.value })} />
              </Form.Group>
              <Button variant="primary" className="w-100 fw-bold" onClick={handleUpdateAttendant}>
                ✅ Save Changes
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default AttendantManagement;
