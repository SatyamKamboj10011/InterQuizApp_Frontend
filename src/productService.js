// ProductService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/product';

const getProducts = () => axios.get(API_URL);
const createProduct = (product) => axios.post(API_URL, product);
const updateProduct= (product) => axios.put(API_URL, product);
const deleteProduct = (id) => axios.delete(`${API_URL}/${id}`);

export { getProducts, createProduct, updateProduct, deleteProduct };
