import React, { useEffect, useState } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "./productService";
import { Container, Row, Col, Form, Button, Modal, Card, Table } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrashAlt } from "react-icons/fa";

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ id: "", name: "", price: "", stock: "", comments: "" });
  const [editProduct, setEditProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleCreateProduct = async () => {
    try {
      await createProduct(newProduct);
      setNewProduct({ id: "", name: "", price: "", stock: "", comments: "" });
      fetchProducts();
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const handleUpdateProduct = async () => {
    if (!editProduct) return;
    try {
      await updateProduct(editProduct);
      setEditProduct(null);
      setShowEditModal(false);
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <Container className="mt-5">
      <Card className="shadow-lg p-4 rounded-3 border-0 bg-light">
        <h1 className="text-center mb-4 text-dark fw-bold">🛍️ Product Management</h1>
        
        {/* Retrieve Button */}
        <Row className="mb-4">
          <Col className="text-center">
            <Button variant="info" className="px-4 py-2 fw-bold" onClick={fetchProducts}>
              🔄 Refresh Products
            </Button>
          </Col>
        </Row>

        {/* Create Product Form */}
        <Row className="mb-5">
          <Col md={6} className="mx-auto">
            <Card className="p-4 shadow-sm border-0 rounded-3 bg-white">
              <h3 className="text-center text-primary">➕ Add New Product</h3>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>ID</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter ID"
                    value={newProduct.id}
                    onChange={(e) => setNewProduct({ ...newProduct, id: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Product Name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Price ($)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter Price"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter Stock"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Comments</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Comments"
                    value={newProduct.comments}
                    onChange={(e) => setNewProduct({ ...newProduct, comments: e.target.value })}
                  />
                </Form.Group>
                <Button variant="success" className="w-100 fw-bold" onClick={handleCreateProduct}>
                  <FaPlus /> Add Product
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>

        {/* Product Table */}
        <Row>
          <Col>
            <h4 className="text-center mb-3 text-dark">📋 Product List</h4>
            <Table striped bordered hover responsive="sm" className="shadow">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price ($)</th>
                  <th>Stock</th>
                  <th>Comments</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>${product.price}</td>
                    <td>{product.stock}</td>
                    <td>{product.comments}</td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2 fw-bold"
                        onClick={() => {
                          setEditProduct(product);
                          setShowEditModal(true);
                        }}
                      >
                        <FaEdit /> Edit
                      </Button>
                      <Button variant="danger" size="sm" className="fw-bold" onClick={() => handleDeleteProduct(product.id)}>
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

      {/* Edit Product Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-primary">✏️ Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editProduct && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>ID</Form.Label>
                <Form.Control type="text" value={editProduct.id} readOnly />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Product Name</Form.Label>
                <Form.Control type="text" value={editProduct.name} onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Price ($)</Form.Label>
                <Form.Control type="number" value={editProduct.price} onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Stock</Form.Label>
                <Form.Control type="number" value={editProduct.stock} onChange={(e) => setEditProduct({ ...editProduct, stock: e.target.value })} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Comments</Form.Label>
                <Form.Control type="text" value={editProduct.comments} onChange={(e) => setEditProduct({ ...editProduct, comments: e.target.value })} />
              </Form.Group>
              <Button variant="primary" className="w-100 fw-bold" onClick={handleUpdateProduct}>
                ✅ Save Changes
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default ProductManagement;
