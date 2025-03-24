import React, { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "./userService";
import { Container, Row, Col, Form, Button, Table, Modal, Card } from "react-bootstrap";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ id: "", name: "", address: "" });
  const [editUser, setEditUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleCreateUser = async () => {
    try {
      await createUser(newUser);
      setNewUser({ id: "", name: "", address: "" });
      fetchUsers();
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleUpdateUser = async () => {
    if (!editUser) return;
    try {
      await updateUser(editUser);
      setEditUser(null);
      setShowEditModal(false);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">🔹 User Management System</h2>

      {/* User Form in a Card */}
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-lg p-4">
            <h4 className="text-center">Add New User</h4>
            <Form>
              <Form.Group className="mb-3" controlId="formId">
                <Form.Label>ID</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter ID"
                  value={newUser.id}
                  onChange={(e) => setNewUser({ ...newUser, id: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter address"
                  value={newUser.address}
                  onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                />
              </Form.Group>
              <Button variant="success" className="w-100" onClick={handleCreateUser}>
                ➕ Add User
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* User Table */}
      <Row className="mt-5">
        <Col>
          <h4 className="text-center mb-3">📋 User List</h4>
          <Table striped bordered hover responsive="sm" className="shadow">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.address}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => {
                        setEditUser(user);
                        setShowEditModal(true);
                      }}
                    >
                      ✏️ Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteUser(user.id)}>
                      ❌ Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editUser && (
            <Form>
              <Form.Group className="mb-3" controlId="editId">
                <Form.Label>ID</Form.Label>
                <Form.Control type="text" value={editUser.id} readOnly />
              </Form.Group>
              <Form.Group className="mb-3" controlId="editName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editUser.name}
                  onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="editAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  value={editUser.address}
                  onChange={(e) => setEditUser({ ...editUser, address: e.target.value })}
                />
              </Form.Group>
              <Button variant="primary" className="w-100" onClick={handleUpdateUser}>
                ✅ Save Changes
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default UserManagement;
