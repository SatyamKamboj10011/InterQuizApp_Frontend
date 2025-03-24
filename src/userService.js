// UserService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/users';

const getUsers = () => axios.get(API_URL);
const createUser = (user) => axios.post(API_URL, user);
const updateUser = (user) => axios.put(API_URL, user);
const deleteUser = (id) => axios.delete(`${API_URL}/${id}`);

export { getUsers, createUser, updateUser, deleteUser };
